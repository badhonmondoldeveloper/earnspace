import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { getVideoById } from '@/services/videoService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const video = await getVideoById(params.id);
    if (!video) {
      return errorResponse('Video not found', 404);
    }
    return successResponse(video);
  } catch (error) {
    console.error('Get video error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const video = await prisma.video.findUnique({ where: { id: params.id } });
    if (!video) {
      return errorResponse('Video not found', 404);
    }
    if (video.userId !== session.userId) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.video.delete({ where: { id: params.id } });
    await prisma.profile.update({
      where: { userId: session.userId },
      data: { videosCount: { decrement: 1 } },
    });

    return successResponse({ id: params.id }, 'Video deleted successfully');
  } catch (error) {
    console.error('Delete video error:', error);
    return errorResponse('Internal server error', 500);
  }
}

