import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const postId = params.id;
    const body = await req.json();
    const type = body.type || 'like';

    const existingReaction = await prisma.postReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.userId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Toggle off reaction
        await prisma.postReaction.delete({
          where: { id: existingReaction.id },
        });
        return successResponse({ reacted: false }, 'Reaction removed');
      } else {
        // Update reaction type
        await prisma.postReaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return successResponse({ reacted: true, type }, 'Reaction updated');
      }
    }

    // Create reaction & trigger notification
    const reaction = await prisma.postReaction.create({
      data: {
        postId,
        userId: session.userId,
        type,
      },
      include: {
        post: { select: { userId: true } },
      },
    });

    if (reaction.post.userId !== session.userId) {
      await prisma.notification.create({
        data: {
          userId: reaction.post.userId,
          senderId: session.userId,
          type: 'like',
          title: 'New Reaction',
          body: `Someone reacted to your post`,
          link: `/dashboard?post=${postId}`,
        },
      });
    }

    return successResponse({ reacted: true, type }, 'Reaction added');
  } catch (error) {
    console.error('Reaction error:', error);
    return errorResponse('Internal server error', 500);
  }
}

