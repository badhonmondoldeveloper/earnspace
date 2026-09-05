import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { getCreatorAnalytics } from '@/services/creatorStudioService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const analytics = await getCreatorAnalytics(session.userId);
    return successResponse(analytics);
  } catch (error) {
    console.error('Creator analytics error:', error);
    return errorResponse('Internal server error', 500);
  }
}
