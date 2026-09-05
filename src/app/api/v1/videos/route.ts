import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { createVideo, getVideos } from '@/services/videoService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '12');

    const result = await getVideos({ category, userId, cursor, limit });
    return successResponse(result);
  } catch (error) {
    console.error('Fetch videos error:', error);
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
    const { title, description, videoUrl, thumbnailUrl, duration, category, visibility } = body;

    if (!title || !videoUrl) {
      return errorResponse('Title and video URL are required', 400);
    }

    const video = await createVideo({
      userId: session.userId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      category,
      visibility,
    });

    return successResponse(video, 'Video published successfully', 201);
  } catch (error) {
    console.error('Create video error:', error);
    return errorResponse('Internal server error', 500);
  }
}
