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

    const page = await prisma.page.findFirst({
      where: { userId: session.userId },
      include: {
        blocks: { orderBy: { position: 'asc' } },
        settings: true,
      },
    });

    if (!page) {
      // Auto-create page if missing
      const newPage = await prisma.page.create({
        data: {
          userId: session.userId,
          slug: session.username,
          title: `${session.username}'s Space`,
          blocks: {
            create: [
              {
                type: 'hero',
                position: 0,
                contentJson: JSON.stringify({ title: `Welcome to my Space`, subtitle: 'Custom Digital Space' }),
              },
            ],
          },
          settings: { create: { theme: 'modern' } },
        },
        include: {
          blocks: { orderBy: { position: 'asc' } },
          settings: true,
        },
      });
      return successResponse(newPage);
    }

    return successResponse(page);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

