import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { recordReelView } from '@/services/reelService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const duration = body.duration || 0;

    await recordReelView(params.id, session?.userId, duration);
    return successResponse({ recorded: true });
  } catch (error) {
    console.error('Record reel view error:', error);
    return errorResponse('Internal server error', 500);
  }
}

