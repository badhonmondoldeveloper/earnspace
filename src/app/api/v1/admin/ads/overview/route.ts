import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession } from '@/lib/adminAuth';
import { AdAnalyticsService } from '@/services/adAnalyticsService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const metrics = await AdAnalyticsService.getOverviewMetrics({});

    return successResponse({
      metrics,
      revenueBreakdown: {
        grossEstimated: metrics.totalEstimatedRevenue,
        verified: metrics.totalVerifiedRevenue,
        platformNet: metrics.totalPlatformShare,
        creatorLiabilities: metrics.totalCreatorShare,
      },
    });
  } catch (error: any) {
    console.error('Admin ads overview error:', error);
    return errorResponse('Internal server error', 500);
  }
}
