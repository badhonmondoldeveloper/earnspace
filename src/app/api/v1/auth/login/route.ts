import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setSessionCookie, generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { loginSchema } from '@/validations/auth.schema';
import { RateLimitService } from '@/services/rateLimitService';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = RateLimitService.check(`auth:login:${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return errorResponse('Too many login attempts. Please wait a minute before trying again.', 429);
    }

    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Email/username and password are required', 400);
    }

    const { emailOrUsername, password } = validation.data;
    const queryTerm = emailOrUsername.toLowerCase().trim();

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: queryTerm }, { username: queryTerm }],
      },
      include: {
        profile: true,
        wallet: true,
      },
    });

    // Auto-create initial admin user if logging in with badhonmondoldeveloper@gmail.com
    if (!user && (queryTerm === 'badhonmondoldeveloper@gmail.com' || queryTerm === 'badhondev')) {
      const { hashPassword } = await import('@/lib/auth');
      const passwordHash = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          username: 'badhondev',
          email: 'badhonmondoldeveloper@gmail.com',
          passwordHash,
          status: 'active',
          accountType: 'CREATOR',
          profile: {
            create: {
              fullName: 'Badhon Mondol',
              bio: 'Creator & Founder of EarnSpace',
            },
          },
          settings: {
            create: {
              notificationEmail: true,
              notificationPush: true,
            },
          },
          wallet: {
            create: {
              availableBalance: 100.0,
              currency: 'USD',
            },
          },
        },
        include: {
          profile: true,
          wallet: true,
        },
      });
    }

    if (!user) {
      return errorResponse('Email or password is incorrect', 401);
    }

    if (user.status !== 'active') {
      return errorResponse('Your account is suspended or inactive. Please contact support.', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Email or password is incorrect', 401);
    }

    // Update last login timestamp safely
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (err) {
      console.warn('Could not update lastLoginAt:', err);
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    const token = generateToken(tokenPayload);
    setSessionCookie(token);

    return successResponse(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
      'Login successful'
    );
  } catch (error: any) {
    console.error('Login Error:', error);
    return errorResponse('Something went wrong during login. Please try again.', 500);
  }
}
