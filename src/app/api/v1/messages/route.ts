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

