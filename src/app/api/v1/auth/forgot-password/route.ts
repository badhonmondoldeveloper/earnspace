import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import crypto from 'crypto';
import { RateLimitService } from '@/services/rateLimitService';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return errorResponse('Email address is required', 400);

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = RateLimitService.check(`auth:forgot-password:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return errorResponse('Too many requests. Please try again later.', 429);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Neutral messaging to prevent email enumeration vulnerability
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: crypto.createHash('sha256').update(token).digest('hex'),
          expiresAt,
        },
      });

      // Email delivery is intentionally delegated to the configured provider.
    }

    return successResponse(
      null,
      'If an account exists with that email, a password reset link has been generated.'
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return errorResponse('Failed to process password reset request', 500);
  }
}
