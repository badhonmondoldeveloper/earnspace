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
      return errorResponse('Invalid login parameters', 400);
    }

    const { emailOrUsername, password } = validation.data;
    const queryTerm = emailOrUsername.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: queryTerm }, { username: queryTerm }],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    if (user.status !== 'active') {
      return errorResponse('Account is suspended or inactive', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
    return errorResponse('Internal server error', 500);
  }
}

