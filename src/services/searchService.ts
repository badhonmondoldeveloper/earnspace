import { prisma } from '@/lib/prisma';

export class SearchService {
  static async globalSearch(query: string, type: string = 'all') {
    const term = query.trim();
    if (!term) return { users: [], posts: [], videos: [], reels: [], blogs: [], hashtags: [] };

    const results: any = {};

    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: term, mode: 'insensitive' } },
            { profile: { fullName: { contains: term, mode: 'insensitive' } } },
          ],
        },
        take: 10,
        select: {
          id: true,
          username: true,
          profile: { select: { fullName: true, avatar: true, bio: true, category: true } },
        },
      });
    }

    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: { content: { contains: term, mode: 'insensitive' } },
        take: 10,
        include: {
          user: { select: { username: true, profile: { select: { fullName: true, avatar: true } } } },
        },
      });
    }

    if (type === 'all' || type === 'videos') {
      results.videos = await prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 10,
        include: {
          user: { select: { username: true, profile: { select: { fullName: true } } } },
        },
      });
    }

    if (type === 'all' || type === 'reels') {
      results.reels = await prisma.reel.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { caption: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 10,
        include: {
          user: { select: { username: true } },
        },
      });
    }

    if (type === 'all' || type === 'hashtags') {
      results.hashtags = await prisma.hashtag.findMany({
        where: { name: { contains: term.replace('#', ''), mode: 'insensitive' } },
        take: 10,
      });
    }

    return results;
  }
}
