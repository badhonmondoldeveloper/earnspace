import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/connect/stats
 * Secure API endpoint to fetch creator traffic and revenue stats
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateApiRequest(req, 'read:stats');
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: auth.userId },
      select: { availableBalance: true, pendingBalance: true, lifetimeEarned: true },
    });

    const page = await prisma.page.findFirst({
      where: { userId: auth.userId },
      select: { slug: true, title: true },
    });

    const productsCount = await prisma.product.count({
      where: { sellerId: auth.userId, status: 'active' },
    });

    return NextResponse.json({
      success: true,
      data: {
        pageSlug: page?.slug || '',
        pageTitle: page?.title || '',
        activeProducts: productsCount,
        financials: {
          availableBalanceBDT: wallet?.availableBalance || 0,
          pendingBalanceBDT: wallet?.pendingBalance || 0,
          lifetimeEarnedBDT: wallet?.lifetimeEarned || 0,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
