import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { successResponse, errorResponse } from '@/lib/response';
import { AdProviderManager } from '@/lib/adProviders/adProviderManager';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slotName = searchParams.get('slot') || 'feed';

    const placement = await AdProviderManager.getPlacementWithFallback({ slotName });
    return successResponse(placement);
  } catch (error) {
    console.error('Fetch ad placement error:', error);
    return errorResponse('Internal server error', 500);
  }
}

