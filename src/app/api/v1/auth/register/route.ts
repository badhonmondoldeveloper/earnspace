import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie, createUserSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { registerSchema } from '@/validations/auth.schema';
import { RateLimitService } from '@/services/rateLimitService';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = RateLimitService.check(`auth:register:${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return errorResponse('Too many registration attempts. Please try again later.', 429);
    }

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return errorResponse('Validation failed', 400, errors);
    }

    const { fullName, username, email, password } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check existing email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return errorResponse('An account with this email address already exists', 400, [{ field: 'email', message: 'Email taken' }]);
      }
      return errorResponse('This username is already taken', 400, [{ field: 'username', message: 'Username taken' }]);
    }

    const passwordHash = await hashPassword(password);

    // Create User, Profile, UserSetting, Wallet & Page transactionally
    const newUser = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          username: normalizedUsername,
          email: normalizedEmail,
          passwordHash,
          status: 'active',
          accountType: 'PERSONAL',
          profile: {
            create: {
              fullName,
              bio: `Welcome to my EarnSpace!`,
            },
          },
          settings: {
            create: {
              theme: 'system',
              notificationEmail: true,
              notificationPush: true,
            },
          },
          wallet: {
            create: {
              currency: 'USD',
              availableBalance: 0.0,
              pendingBalance: 0.0,
            },
          },
          pages: {
            create: {
              slug: normalizedUsername,
              title: `${fullName}'s Space`,
              description: `Welcome to ${fullName}'s official EarnSpace digital presence`,
              blocks: {
                create: [
                  {
                    type: 'hero',
                    position: 0,
                    contentJson: JSON.stringify({
                      title: `Hi, I'm ${fullName}`,
                      subtitle: 'Creator, Thinker, EarnSpace Member',
                      ctaText: 'Follow My Space',
                      ctaUrl: `/@${normalizedUsername}`,
                    }),
                  },
                  {
                    type: 'text',
                    position: 1,
                    contentJson: JSON.stringify({
                      title: 'About Me',
                      body: 'Welcome to my digital space! I share updates, posts, and articles on EarnSpace.',
                    }),
                  },
                ],
              },
              settings: {
                create: {
                  theme: 'modern',
                },
              },
            },
          },
        },
        include: {
          profile: true,
          wallet: true,
        },
      });
    });

    const tokenPayload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    const token = await createUserSession(tokenPayload, {
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });
    setSessionCookie(token);

    return successResponse(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile,
      },
      'Account created successfully',
      201
    );
  } catch (error: any) {
    console.error('Registration Error:', error);
    return errorResponse(error?.message || 'Failed to complete registration. Please try again.', 500);
  }
}
