import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const rawUsername = params.username.replace(/^@/, '').toLowerCase();
    const session = await getSession();

    const user = await prisma.user.findUnique({
      where: { username: rawUsername },
      include: {
        profile: true,
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { media: true, reactions: true, comments: true },
        },
        blogs: {
          where: { status: 'published' },
          take: 5,
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return errorResponse('User profile not found', 404);
    }

    let isFollowing = false;
    if (session) {
      const followRecord = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!followRecord;
    }

    const { passwordHash, email, ...safeUser } = user;

    return successResponse({
      ...safeUser,
      isFollowing,
      isOwnProfile: session?.userId === user.id,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}

