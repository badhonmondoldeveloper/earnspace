import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const earnings = await prisma.creatorEarning.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        revenueEvent: { select: { eventType: true, externalReference: true, grossAmount: true } },
        rule: { select: { userSharePercent: true, platformSharePercent: true, ruleVersion: true } },
      },
    });

    const summary = earnings.reduce(
      (acc, e) => {
        acc.totalGross += e.grossAmount;
        acc.totalFees += e.fees;
        acc.totalUserShare += e.userShare;
        acc.totalPlatformShare += e.platformShare;
        if (e.status === 'pending') acc.pendingShare += e.userShare;
        if (e.status === 'approved') acc.approvedShare += e.userShare;
        if (e.status === 'reversed') acc.reversedShare += e.userShare;
        return acc;
      },
      {
        totalGross: 0,
        totalFees: 0,
        totalUserShare: 0,
        totalPlatformShare: 0,
        pendingShare: 0,
        approvedShare: 0,
        reversedShare: 0,
      }
    );

    return successResponse({
      summary,
      items: earnings,
    });
  } catch (error) {
    console.error('Fetch creator earnings error:', error);
    return errorResponse('Internal server error', 500);
  }
}
