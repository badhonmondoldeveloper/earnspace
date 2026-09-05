import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { FinancialLedgerService } from '@/services/financialLedgerService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const wallet = await FinancialLedgerService.getOrCreateWallet(session.userId);

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse({
      wallet,
      transactions,
    });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

