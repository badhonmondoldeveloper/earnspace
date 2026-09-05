import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { AdAnalyticsService } from '@/services/adAnalyticsService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return errorResponse('Unauthorized', 401);

    const metrics = await AdAnalyticsService.getOverviewMetrics({
      creatorId: user.userId,
    });

    return successResponse({
      creatorId: user.userId,
      metrics,
      eligiblePlacements: [
        'SOCIAL_FEED_MID',
        'VIDEO_PRE_ROLL',
        'REELS_FEED',
        'BLOG_TOP',
        'PERSONAL_SPACE_CONTENT',
      ],
      monetizationStatus: 'active',
    });
  } catch (error: any) {
    console.error('Creator ad analytics error:', error);
    return errorResponse('Failed to fetch creator ad analytics', 500);
  }
}
