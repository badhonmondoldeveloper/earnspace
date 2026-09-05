import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        settings: true,
      },
    });

    if (!user) {
      return errorResponse('User not found', 444);
    }

    const { passwordHash, ...userData } = user;
    return successResponse(userData, 'User profile fetched');
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

