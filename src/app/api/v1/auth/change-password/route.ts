import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, comparePassword, hashPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorResponse('Current password, new password, and confirmation are required', 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse('New password and confirmation do not match', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse('New password must be at least 8 characters long', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Current password is incorrect', 400);
    }

    const newPasswordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return successResponse(null, 'Password updated successfully');
  } catch (error: any) {
    console.error('Password change error:', error);
    return errorResponse('Failed to update password', 500);
  }
}

