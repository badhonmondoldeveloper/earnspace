import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/response';
import { WithdrawalService } from '@/services/withdrawalService';
import { AdminAuditService } from '@/services/adminAuditService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'withdrawals.view')) {
      return errorResponse('Permission denied', 403);
    }

    const requests = await prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { username: true, email: true } },
        withdrawalMethod: true,
      },
    });

    return successResponse(requests);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession || !hasAdminPermission(adminSession.role, 'withdrawals.approve')) {
      return errorResponse('Permission denied', 403);
    }

    const body = await req.json();
    const { requestId, action, reason } = body; // action: approve or reject

    if (!requestId || !action) {
      return errorResponse('Request ID and action required', 400);
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (action === 'approve') {
      const updated = await prisma.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: 'paid',
          reviewedAt: new Date(),
          processedAt: new Date(),
          adminNote: reason || 'Approved by admin',
        },
      });

      await AdminAuditService.logAction({
        adminUserId: adminSession.adminId,
        action: 'withdrawal.approve',
        targetType: 'withdrawal_request',
        targetId: requestId,
        reason: reason || 'Approved payout',
        ipAddress: ip,
      });

      return successResponse(updated, 'Withdrawal request approved & marked as paid');
    }

    if (action === 'reject') {
      const res = await WithdrawalService.rejectWithdrawal(requestId, reason || 'Rejected by admin review');
      if (!res.success) {
        return errorResponse(res.message || 'Rejection failed', 400);
      }

      await AdminAuditService.logAction({
        adminUserId: adminSession.adminId,
        action: 'withdrawal.reject',
        targetType: 'withdrawal_request',
        targetId: requestId,
        reason: reason || 'Rejected payout request',
        ipAddress: ip,
      });

      return successResponse(null, 'Withdrawal request rejected and funds reversed to wallet');
    }

    return errorResponse('Invalid action', 400);
  } catch (error: any) {
    return errorResponse('Internal server error', 500);
  }
}

