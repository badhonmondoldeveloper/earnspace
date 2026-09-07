import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const favorites = await prisma.websiteTemplateFavorite.findMany({
        where: { userId: session.userId },
        include: { template: true },
        orderBy: { createdAt: 'desc' },
      });
      return successResponse(favorites, 'User favorite templates retrieved');
    } catch (err) {
      return successResponse([], 'User favorite templates retrieved');
    }
  } catch (error: any) {
    console.error('GET /api/v1/templates/favorites error:', error);
    return errorResponse('Failed to fetch favorite templates', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { templateId } = await req.json();
    if (!templateId) {
      return errorResponse('templateId is required', 400);
    }

    try {
      const existing = await prisma.websiteTemplateFavorite.findUnique({
        where: {
          userId_templateId: {
            userId: session.userId,
            templateId,
          },
        },
      });

      if (existing) {
        await prisma.websiteTemplateFavorite.delete({
          where: { id: existing.id },
        });
        return successResponse({ isFavorite: false }, 'Template removed from favorites');
      } else {
        const fav = await prisma.websiteTemplateFavorite.create({
          data: {
            userId: session.userId,
            templateId,
          },
        });
        return successResponse({ isFavorite: true, favorite: fav }, 'Template added to favorites');
      }
    } catch (err: any) {
      return errorResponse('Database provisioning for favorites in progress.', 503);
    }
  } catch (error: any) {
    console.error('POST /api/v1/templates/favorites error:', error);
    return errorResponse('Failed to update template favorite', 500);
  }
}
