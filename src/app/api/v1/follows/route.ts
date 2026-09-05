import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return errorResponse('Target user ID required', 400);
    }

    if (targetUserId === session.userId) {
      return errorResponse('You cannot follow yourself', 400);
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.$transaction([
        prisma.follow.delete({ where: { id: existingFollow.id } }),
        prisma.profile.update({
          where: { userId: session.userId },
          data: { followingCount: { decrement: 1 } },
        }),
        prisma.profile.update({
          where: { userId: targetUserId },
          data: { followersCount: { decrement: 1 } },
        }),
      ]);

      return successResponse({ isFollowing: false }, 'Unfollowed user');
    }

    // Follow
    await prisma.$transaction([
      prisma.follow.create({
        data: {
          followerId: session.userId,
          followingId: targetUserId,
        },
      }),
      prisma.profile.update({
        where: { userId: session.userId },
        data: { followingCount: { increment: 1 } },
      }),
      prisma.profile.update({
        where: { userId: targetUserId },
        data: { followersCount: { increment: 1 } },
      }),
      prisma.notification.create({
        data: {
          userId: targetUserId,
          senderId: session.userId,
          type: 'follow',
          title: 'New Follower',
          body: `Started following you`,
          link: `/@${session.username}`,
        },
      }),
    ]);

    return successResponse({ isFollowing: true }, 'Followed user');
  } catch (error) {
    console.error('Follow error:', error);
    return errorResponse('Internal server error', 500);
  }
}

