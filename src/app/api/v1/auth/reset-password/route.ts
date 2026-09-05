import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import crypto from 'crypto';
import { RateLimitService } from '@/services/rateLimitService';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return errorResponse('Token and new password are required', 400);
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = RateLimitService.check(`auth:reset-password:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return errorResponse('Too many requests. Please try again later.', 429);
    }

    if (newPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400);
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: crypto.createHash('sha256').update(token).digest('hex') },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return errorResponse('Invalid or expired password reset token', 400);
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetRecord.userId },
      }),
      prisma.userSession.deleteMany({
        where: { userId: resetRecord.userId },
      }),
    ]);

    return successResponse(null, 'Password updated successfully. You can now log in.');
  } catch (error: any) {
    console.error('Reset password error:', error);
    return errorResponse('Failed to reset password', 500);
  }
}
