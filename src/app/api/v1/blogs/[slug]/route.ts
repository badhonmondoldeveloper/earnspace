import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true, bio: true } },
          },
        },
      },
    });

    if (!blog) {
      return errorResponse('Article not found', 404);
    }

    // Increment blog views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { viewsCount: { increment: 1 } },
    });

    return successResponse(blog);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

