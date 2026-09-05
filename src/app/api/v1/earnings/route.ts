import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
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
      take: 50,
      include: {
        revenueEvent: {
          select: { eventType: true, externalReference: true },
        },
      },
    });

    const pendingTotal = earnings
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + e.userShare, 0);

    const approvedTotal = earnings
      .filter((e) => e.status === 'approved')
      .reduce((sum, e) => sum + e.userShare, 0);

    return successResponse({
      items: earnings,
      metrics: {
        pendingTotal: Math.round(pendingTotal * 100) / 100,
        approvedTotal: Math.round(approvedTotal * 100) / 100,
        totalEarningsCount: earnings.length,
      },
    });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

