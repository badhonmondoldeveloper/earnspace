import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { requestWithdrawal, getMinimumPayoutThreshold } from '@/services/payoutService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const minThreshold = await getMinimumPayoutThreshold();
    const methods = await prisma.withdrawalMethod.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    const requests = await prisma.withdrawalRequest.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        withdrawalMethod: { select: { provider: true, accountIdentifier: true } },
      },
    });

    return successResponse({ minThreshold, methods, requests });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { withdrawalMethodId, amount } = body;

    if (!withdrawalMethodId || !amount) {
      return errorResponse('Withdrawal method and amount required', 400);
    }

    const parsedAmount = parseFloat(amount);
    const minThreshold = await getMinimumPayoutThreshold();

    if (parsedAmount < minThreshold) {
      return errorResponse(`Minimum withdrawal threshold is ৳${minThreshold.toLocaleString()}`, 400);
    }

    const idempotencyKey = `wd_${session.userId}_${Date.now()}`;
    const result = await requestWithdrawal({
      userId: session.userId,
      withdrawalMethodId,
      amount: parsedAmount,
      idempotencyKey,
    });

    return successResponse(result.request, 'Withdrawal requested successfully', 201);
  } catch (error: any) {
    console.error('Withdrawal API error:', error);
    return errorResponse(error.message || 'Internal server error', 400);
  }
}
