import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { commentCreateSchema } from '@/validations/post.schema';
import { sanitizeContent } from '@/lib/sanitizer';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id;
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: { select: { fullName: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    return successResponse(comments);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const postId = params.id;
    const body = await req.json();
    const validation = commentCreateSchema.safeParse({ ...body, postId });

    if (!validation.success) {
      return errorResponse('Validation failed', 400);
    }

    const { content, parentId } = validation.data;
    const sanitized = sanitizeContent(content);

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: session.userId,
        content: sanitized,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
        post: { select: { userId: true } },
      },
    });

    // Notify post owner
    if (comment.post.userId !== session.userId) {
      await prisma.notification.create({
        data: {
          userId: comment.post.userId,
          senderId: session.userId,
          type: 'comment',
          title: 'New Comment',
          body: `Commented on your post`,
          link: `/dashboard?post=${postId}`,
        },
      });
    }

    return successResponse(comment, 'Comment added', 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

