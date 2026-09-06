import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const page = await prisma.page.findFirst({
      where: { userId: session.userId, slug: params.slug },
    });

    if (!page) {
      return errorResponse('Page not found or permission denied', 404);
    }

    const body = await req.json();
    const { blocks, settings, title, description } = body;

    // Update page title/description if provided
    if (title !== undefined || description !== undefined) {
      await prisma.page.update({
        where: { id: page.id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
        },
      });
    }

    // Replace existing page blocks & update settings in transaction
    await prisma.$transaction(async (tx) => {
      if (Array.isArray(blocks)) {
        await tx.pageBlock.deleteMany({
          where: { pageId: page.id },
        });

        if (blocks.length > 0) {
          await tx.pageBlock.createMany({
            data: blocks.map((b: any, index: number) => ({
              pageId: page.id,
              type: b.type,
              position: index,
              contentJson: typeof b.contentJson === 'string' ? b.contentJson : JSON.stringify(b.contentJson || {}),
              visibility: b.visibility !== undefined ? b.visibility : true,
            })),
          });
        }
      }

      if (settings && typeof settings === 'object') {
        await tx.pageSetting.upsert({
          where: { pageId: page.id },
          create: {
            pageId: page.id,
            theme: settings.theme || 'modern',
            typography: settings.typography || 'sans',
            colorsJson: JSON.stringify(settings.colors || {}),
            layout: settings.layout || 'single-column',
            customSettingsJson: JSON.stringify(settings.custom || {}),
          },
          update: {
            theme: settings.theme || 'modern',
            typography: settings.typography || 'sans',
            colorsJson: JSON.stringify(settings.colors || {}),
            layout: settings.layout || 'single-column',
            customSettingsJson: JSON.stringify(settings.custom || {}),
          },
        });
      }
    });

    const updatedPage = await prisma.page.findUnique({
      where: { id: page.id },
      include: {
        blocks: { orderBy: { position: 'asc' } },
        settings: true,
      },
    });

    return successResponse(updatedPage, 'Website blocks & settings saved successfully');
  } catch (error) {
    console.error('Blocks save error:', error);
    return errorResponse('Internal server error', 500);
  }
}

