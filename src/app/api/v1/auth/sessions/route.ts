import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const userSessions = await prisma.userSession.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return successResponse(userSessions);
  } catch (error: any) {
    console.error('Fetch sessions error:', error);
    return errorResponse('Failed to fetch user sessions', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return errorResponse('Unauthorized', 401);

    // Delete all sessions for this user except current session token
    await prisma.userSession.deleteMany({
      where: {
        userId: session.userId,
      },
    });

    return successResponse(null, 'Logged out of all other active sessions');
  } catch (error: any) {
    console.error('Logout all sessions error:', error);
    return errorResponse('Failed to invalidate sessions', 500);
  }
}
