import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { MembershipService } from '@/services/membershipService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { creatorId, tierId } = body;

    if (!creatorId || !tierId) {
      return errorResponse('creatorId and tierId are required', 400);
    }

    const subscription = await MembershipService.subscribeToTier(
      session.userId,
      creatorId,
      tierId
    );

    return successResponse(subscription, 'Subscribed to creator membership successfully');
  } catch (error: any) {
    console.error('POST /api/v1/memberships/subscribe error:', error);
    return errorResponse(error.message || 'Failed to subscribe to creator membership', 400);
  }
}
