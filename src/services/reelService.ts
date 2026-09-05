import { prisma } from '@/lib/prisma';
import { processHashtagsAndMentions } from '@/lib/hashtagMentionExtractor';

export async function createReel(data: {
  userId: string;
  caption?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  audioTitle?: string;
  duration?: number;
}) {
  const reel = await prisma.reel.create({
    data: {
      userId: data.userId,
      caption: data.caption,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      audioTitle: data.audioTitle || 'Original Audio',
      duration: data.duration || 0,
      visibility: 'public',
      status: 'published',
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

  // Increment profile reels count
  await prisma.profile.update({
    where: { userId: data.userId },
    data: { reelsCount: { increment: 1 } },
  });

  if (data.caption) {
    processHashtagsAndMentions('reel', reel.id, data.caption, data.userId).catch((err) =>
      console.error('Reel hashtag error:', err)
    );
  }

  return reel;
}

export async function getReelsFeed(options: { cursor?: string; limit?: number; userId?: string }) {
  const limit = options.limit || 10;
  const where: any = { status: 'published', visibility: 'public' };
  if (options.userId) {
    where.userId = options.userId;
  }

  const items = await prisma.reel.findMany({
    where,
    take: limit + 1,
    cursor: options.cursor ? { id: options.cursor } : undefined,
    orderBy: { createdAt: 'desc' },
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

  let nextCursor: string | null = null;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id || null;
  }

  return { items, nextCursor };
}

export async function recordReelView(reelId: string, viewerId?: string, duration: number = 0) {
  await prisma.reelView.create({
    data: { reelId, viewerId: viewerId || null, duration },
  });
  await prisma.reel.update({
    where: { id: reelId },
    data: { viewsCount: { increment: 1 } },
  });
}

