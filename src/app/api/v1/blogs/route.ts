import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { blogCreateSchema } from '@/validations/blog.schema';
import { sanitizeContent } from '@/lib/sanitizer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { status: 'published' };
    if (category && category !== 'All') {
      where.category = category;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
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

    return successResponse(blogs);
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
    const validation = blogCreateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400);
    }

    const { title, coverImage, content, excerpt, category, tags, seoTitle, seoDescription, status } = validation.data;
    const sanitizedHtml = sanitizeContent(content);

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'article';
    
    let slug = baseSlug;
    let count = 1;
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const blog = await prisma.blog.create({
      data: {
        userId: session.userId,
        title,
        slug,
        coverImage,
        content: sanitizedHtml,
        excerpt: excerpt || title,
        category,
        tags: JSON.stringify(tags || []),
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        status,
        publishedAt: status === 'published' ? new Date() : null,
      },
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

    // Increment user's blog count
    await prisma.profile.update({
      where: { userId: session.userId },
      data: { blogsCount: { increment: 1 } },
    });

    return successResponse(blog, 'Article published successfully', 201);
  } catch (error) {
    console.error('Blog creation error:', error);
    return errorResponse('Internal server error', 500);
  }
}

