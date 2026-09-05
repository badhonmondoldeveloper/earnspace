import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q || q.trim().length === 0) {
      return successResponse({ users: [], posts: [], blogs: [] });
    }

    const searchTerm = q.trim();

    const [users, posts, blogs] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchTerm } },
            { profile: { fullName: { contains: searchTerm } } },
          ],
        },
        take: 5,
        select: {
          id: true,
          username: true,
          profile: { select: { fullName: true, avatar: true, bio: true } },
        },
      }),
      prisma.post.findMany({
        where: {
          content: { contains: searchTerm },
          status: 'published',
        },
        take: 5,
        include: {
          user: {
            select: {
              username: true,
              profile: { select: { fullName: true, avatar: true } },
            },
          },
        },
      }),
      prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { content: { contains: searchTerm } },
          ],
          status: 'published',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          user: {
            select: {
              username: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      }),
    ]);

    return successResponse({ users, posts, blogs });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

