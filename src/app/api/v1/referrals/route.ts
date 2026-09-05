import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { ReferralService } from '@/services/referralService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const referral = await ReferralService.getOrCreateReferralCode(session.userId);

    const referralEvents = await prisma.referralEvent.findMany({
      where: { parent: { userId: session.userId } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse({
      referralCode: referral.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${referral.referralCode}`,
      totalReferrals: referral.totalReferrals,
      events: referralEvents,
    });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

