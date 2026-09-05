import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    // Fetch active unexpired stories
    const activeStories = await prisma.story.findMany({
      where: {
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
        views: { select: { viewerId: true } },
      },
    });

    return successResponse(activeStories);
  } catch (error) {
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
    const { mediaUrl, type, textOverlay } = body;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours exact expiration

    const story = await prisma.story.create({
      data: {
        userId: session.userId,
        mediaUrl,
        type: type || 'text',
        textOverlay,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
      },
    });

    return successResponse(story, 'Story posted successfully', 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

