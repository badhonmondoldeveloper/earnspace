import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { SmartAdEngine } from '@/services/smartAdEngine';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slotName = searchParams.get('slotName') || 'SOCIAL_FEED_MID';
    const device = searchParams.get('device') || 'desktop';
    const country = searchParams.get('country') || 'BD';
    const creatorId = searchParams.get('creatorId') || undefined;
    const contentId = searchParams.get('contentId') || undefined;
    const contentType = searchParams.get('contentType') || undefined;

    const ad = await SmartAdEngine.requestAd({
      slotName,
      device,
      country,
      creatorId,
      contentId,
      contentType,
    });

    return successResponse(ad);
  } catch (error: any) {
    console.error('Ad request API error:', error);
    return errorResponse(error.message || 'Failed to serve advertisement', 500);
  }
}
