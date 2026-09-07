import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { WalletCoreService } from '@/services/walletCoreService';

export async function GET(req: NextRequest) {
  try {
    const totalWallets = await prisma.wallet.count();
    const frozenWallets = await prisma.wallet.count({ where: { isFrozen: true } });
    
    const balances = await prisma.wallet.aggregate({
      _sum: {
        availableBalance: true,
        pendingBalance: true,
        lifetimeEarned: true,
      },
    });

    const reviewQueue = await prisma.paymentTransaction.findMany({
      where: { status: 'REVIEW' },
      include: {
        user: { select: { username: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const recentTransactions = await prisma.paymentTransaction.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true } },
      },
    });

    return successResponse({
      metrics: {
        totalWallets,
        frozenWallets,
        totalAvailableBalance: balances._sum.availableBalance || 0.0,
        totalPendingBalance: balances._sum.pendingBalance || 0.0,
        totalLifetimeEarned: balances._sum.lifetimeEarned || 0.0,
      },
      reviewQueue,
      recentTransactions,
    }, 'Admin finance overview retrieved');
  } catch (error: any) {
    console.error('GET /api/v1/admin/finance/overview error:', error);
    return errorResponse(error.message || 'Failed to fetch finance overview', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, isFrozen } = body;

    if (action === 'TOGGLE_FREEZE' && userId !== undefined) {
      const updated = await WalletCoreService.setWalletFreeze(userId, Boolean(isFrozen));
      return successResponse(updated, `Wallet ${isFrozen ? 'frozen' : 'unfrozen'} successfully`);
    }

    return errorResponse('Invalid admin finance action', 400);
  } catch (error: any) {
    console.error('POST /api/v1/admin/finance/overview error:', error);
    return errorResponse(error.message || 'Action failed', 500);
  }
}
