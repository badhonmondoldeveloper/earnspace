import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId: session.userId },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        members: {
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
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return successResponse(conversations);
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
    const { recipientId, content } = body;

    if (!recipientId || !content) {
      return errorResponse('Recipient and message content required', 400);
    }
    if (recipientId === session.userId) {
      return errorResponse('You cannot message yourself', 400);
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, settings: { select: { messagePermission: true, whoCanMessageMe: true } } },
    });
    if (!recipient) return errorResponse('Recipient not found', 404);

    const messagePermission = recipient.settings?.messagePermission || recipient.settings?.whoCanMessageMe || 'everyone';
    if (messagePermission === 'nobody') return errorResponse('This user does not accept messages', 403);
    if (messagePermission === 'followers') {
      const follows = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: session.userId, followingId: recipientId } },
      });
      if (!follows) return errorResponse('Follow this user before sending a message', 403);
    }

    // Find or create direct conversation between two users
    let conversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: session.userId } } },
          { members: { some: { userId: recipientId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [{ userId: session.userId }, { userId: recipientId }],
          },
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.userId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // Notify recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        senderId: session.userId,
        type: 'message',
        title: 'New Private Message',
        body: `Sent you a message: "${content.substring(0, 40)}..."`,
        link: `/messages/${conversation.id}`,
      },
    });

    return successResponse(message, 'Message sent', 201);
  } catch (error) {
    console.error('Send message error:', error);
    return errorResponse('Internal server error', 500);
  }
}

