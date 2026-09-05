import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { WithdrawalService } from '@/services/withdrawalService';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'withdrawals.view')) {
      return errorResponse('Permission denied', 403);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const requests = await prisma.withdrawalRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true, email: true, profile: { select: { fullName: true } } } },
        withdrawalMethod: true,
      },
    });

    return successResponse(requests);
  } catch (error) {
    console.error('Admin payouts error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return errorResponse('Unauthorized admin access', 401);
    }
    if (!hasAdminPermission(adminSession.role, 'withdrawals.approve')) {
      return errorResponse('Permission denied', 403);
    }

    const { requestId, action, adminNote, rejectionReason } = await req.json();
    if (!requestId || !action) {
      return errorResponse('Request ID and action are required', 400);
    }

    if (action === 'approve') {
      const result = await WithdrawalService.approveWithdrawal(requestId, adminSession.adminId, adminNote);
      return successResponse(result, 'Withdrawal approved successfully');
    } else if (action === 'reject') {
      const result = await WithdrawalService.rejectWithdrawal(requestId, rejectionReason || 'Rejected by admin');
      return successResponse(result, 'Withdrawal rejected & funds restored');
    } else if (action === 'paid') {
      const result = await WithdrawalService.markAsPaid(requestId, adminSession.adminId, adminNote);
      return successResponse(result, 'Withdrawal marked as paid');
    }

    return errorResponse('Invalid action', 400);
  } catch (error: any) {
    console.error('Admin payout update error:', error);
    return errorResponse(error.message || 'Internal server error', 400);
  }
}
