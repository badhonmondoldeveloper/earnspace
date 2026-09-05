import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { tag: string } }) {
  try {
    const rawTag = params.tag.replace(/^#/, '').toLowerCase();
    const hashtag = await prisma.hashtag.findUnique({
      where: { name: rawTag },
      include: {
        posts: {
          take: 20,
          include: {
            post: {
              include: {
                user: { select: { username: true, profile: { select: { fullName: true, avatar: true } } } },
                media: true,
                _count: { select: { comments: true, reactions: true } },
              },
            },
          },
        },
        videos: {
          take: 12,
          include: {
            video: {
              include: {
                user: { select: { username: true, profile: { select: { fullName: true, avatar: true } } } },
              },
            },
          },
        },
        reels: {
          take: 12,
          include: {
            reel: {
              include: {
                user: { select: { username: true, profile: { select: { fullName: true, avatar: true } } } },
              },
            },
          },
        },
      },
    });

    if (!hashtag) {
      return errorResponse('Hashtag not found', 404);
    }

    return successResponse({
      id: hashtag.id,
      name: hashtag.name,
      postsCount: hashtag.postsCount,
      videosCount: hashtag.videosCount,
      reelsCount: hashtag.reelsCount,
      posts: hashtag.posts.map((p) => p.post),
      videos: hashtag.videos.map((v) => v.video),
      reels: hashtag.reels.map((r) => r.reel),
    });
  } catch (error) {
    console.error('Fetch hashtag detail error:', error);
    return errorResponse('Internal server error', 500);
  }
}

