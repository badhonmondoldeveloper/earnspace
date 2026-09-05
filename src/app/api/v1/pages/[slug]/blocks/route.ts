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
    const { blocks } = body; // Array of block objects

    if (!Array.isArray(blocks)) {
      return errorResponse('Invalid blocks array', 400);
    }

    // Replace existing page blocks in transaction
    await prisma.$transaction(async (tx) => {
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
    });

    const updatedBlocks = await prisma.pageBlock.findMany({
      where: { pageId: page.id },
      orderBy: { position: 'asc' },
    });

    return successResponse(updatedBlocks, 'Website blocks saved');
  } catch (error) {
    console.error('Blocks save error:', error);
    return errorResponse('Internal server error', 500);
  }
}

