import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const hashtags = await prisma.hashtag.findMany({
      orderBy: [
        { postsCount: 'desc' },
        { videosCount: 'desc' },
        { reelsCount: 'desc' },
      ],
      take: 10,
    });
    return successResponse(hashtags);
  } catch (error) {
    console.error('Fetch trending hashtags error:', error);
    return errorResponse('Internal server error', 500);
  }
}
