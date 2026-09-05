import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reel = await prisma.reel.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
      },
    });

    if (!reel) {
      return errorResponse('Reel not found', 404);
    }
    return successResponse(reel);
  } catch (error) {
    console.error('Get reel error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const reel = await prisma.reel.findUnique({ where: { id: params.id } });
    if (!reel) {
      return errorResponse('Reel not found', 404);
    }
    if (reel.userId !== session.userId) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.reel.delete({ where: { id: params.id } });
    await prisma.profile.update({
      where: { userId: session.userId },
      data: { reelsCount: { decrement: 1 } },
    });

    return successResponse({ id: params.id }, 'Reel deleted successfully');
  } catch (error) {
    console.error('Delete reel error:', error);
    return errorResponse('Internal server error', 500);
  }
}

