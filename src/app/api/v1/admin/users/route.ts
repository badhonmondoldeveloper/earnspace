import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';
import { AdminUserService } from '@/services/adminUserService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'users.view')) {
      return errorResponse('Permission denied', 403);
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const status = searchParams.get('status');

    const where: any = {};
    if (q) {
      where.OR = [
        { username: { contains: q.toLowerCase() } },
        { email: { contains: q.toLowerCase() } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        profile: true,
        wallet: true,
        _count: { select: { posts: true, blogs: true, followers: true } },
      },
    });

    return successResponse(users);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'users.edit')) {
      return errorResponse('Permission denied', 403);
    }

    const body = await req.json();
    const { userId, action, status, isFrozen, reason } = body;

    if (!userId || !reason) {
      return errorResponse('User ID and audit reason required', 400);
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (action === 'update_status') {
      const updatedUser = await AdminUserService.updateUserStatus(
        adminSession.adminId,
        userId,
        status,
        reason,
        ip
      );
      return successResponse(updatedUser, `User status changed to ${status}`);
    }

    if (action === 'freeze_wallet') {
      const updatedWallet = await AdminUserService.setWalletFreezeState(
        adminSession.adminId,
        userId,
        isFrozen,
        reason,
        ip
      );
      return successResponse(updatedWallet, `User wallet ${isFrozen ? 'frozen' : 'unfrozen'}`);
    }

    return errorResponse('Invalid action', 400);
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

