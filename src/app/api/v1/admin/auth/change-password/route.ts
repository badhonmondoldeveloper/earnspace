import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/adminAuth';
import { comparePassword, hashPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { AdminAuditService } from '@/services/adminAuditService';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Admin authentication required', 401);
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

    const admin = await prisma.adminUser.findUnique({
      where: { id: adminSession.adminId },
    });

    if (!admin) {
      return errorResponse('Admin user not found', 404);
    }

    const isMatch = await comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return errorResponse('Current password is incorrect', 400);
    }

    const newPasswordHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newPasswordHash },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await AdminAuditService.logAction({
      adminUserId: admin.id,
      action: 'admin.password_change',
      targetType: 'admin_user',
      targetId: admin.id,
      reason: 'Admin changed account password',
      ipAddress: ip,
    });

    return successResponse(null, 'Admin password updated successfully');
  } catch (error: any) {
    console.error('Admin password change error:', error);
    return errorResponse('Failed to update admin password', 500);
  }
}

