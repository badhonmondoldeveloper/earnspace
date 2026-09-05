import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { createReel, getReelsFeed } from '@/services/reelService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await getReelsFeed({ cursor, limit, userId });
    return successResponse(result);
  } catch (error) {
    console.error('Fetch reels error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { caption, videoUrl, thumbnailUrl, audioTitle, duration } = body;

    if (!videoUrl) {
      return errorResponse('Video URL is required', 400);
    }

    const reel = await createReel({
      userId: session.userId,
      caption,
      videoUrl,
      thumbnailUrl,
      audioTitle,
      duration,
    });

    return successResponse(reel, 'Reel published successfully', 201);
  } catch (error) {
    console.error('Create reel error:', error);
    return errorResponse('Internal server error', 500);
  }
}
