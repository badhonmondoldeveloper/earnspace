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

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
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

    const unreadCount = await prisma.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return successResponse({
      items: notifications,
      unreadCount,
    });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    await prisma.notification.updateMany({
      where: { userId: session.userId, isRead: false },
      data: { isRead: true },
    });

    return successResponse(null, 'All notifications marked as read');
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

