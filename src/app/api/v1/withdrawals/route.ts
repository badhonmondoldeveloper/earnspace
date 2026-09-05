import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { WithdrawalService } from '@/services/withdrawalService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

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

    return successResponse({ methods, requests });
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
    const { action } = body;

    // 1. Add withdrawal method destination (bKash, Nagad, Bank, etc.)
    if (action === 'add_method') {
      const { provider, accountIdentifier, accountName } = body;
      if (!provider || !accountIdentifier) {
        return errorResponse('Provider and account number required', 400);
      }

      const method = await prisma.withdrawalMethod.create({
        data: {
          userId: session.userId,
          provider: provider.toLowerCase(),
          accountIdentifier,
          accountName,
        },
      });

      return successResponse(method, 'Withdrawal destination saved', 201);
    }

    // 2. Request a payout withdrawal
    const { withdrawalMethodId, amount } = body;
    if (!withdrawalMethodId || !amount) {
      return errorResponse('Withdrawal method and amount required', 400);
    }

    const idempotencyKey = `wd_${session.userId}_${Date.now()}`;
    const result = await WithdrawalService.requestWithdrawal({
      userId: session.userId,
      withdrawalMethodId,
      amount: parseFloat(amount),
      idempotencyKey,
    });

    if (!result.success) {
      return errorResponse(result.message || 'Withdrawal request failed', 400);
    }

    return successResponse(result.withdrawalRequest, 'Withdrawal requested successfully', 201);
  } catch (error) {
    console.error('Withdrawal API error:', error);
    return errorResponse('Internal server error', 500);
  }
}

