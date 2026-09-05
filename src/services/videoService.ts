import { prisma } from '@/lib/prisma';
import { processHashtagsAndMentions } from '@/lib/hashtagMentionExtractor';

export async function createVideo(data: {
  userId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  category?: string;
  visibility?: string;
}) {
  const video = await prisma.video.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration || 0,
      category: data.category || 'General',
      visibility: data.visibility || 'public',
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

  // Increment profile video count
  await prisma.profile.update({
    where: { userId: data.userId },
    data: { videosCount: { increment: 1 } },
  });

  if (data.description) {
    processHashtagsAndMentions('video', video.id, data.description, data.userId).catch((err) =>
      console.error('Video hashtag error:', err)
    );
  }

  return video;
}

export async function getVideos(options: {
  category?: string;
  userId?: string;
  cursor?: string;
  limit?: number;
}) {
  const limit = options.limit || 12;
  const where: any = { status: 'published', visibility: 'public' };
  if (options.category && options.category !== 'all') {
    where.category = options.category;
  }
  if (options.userId) {
    where.userId = options.userId;
  }

  const items = await prisma.video.findMany({
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

export async function getVideoById(id: string) {
  return prisma.video.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profile: { select: { fullName: true, avatar: true, bio: true, followersCount: true } },
        },
      },
    },
  });
}

export async function recordVideoView(videoId: string, viewerId?: string, duration: number = 0) {
  await prisma.videoView.create({
    data: { videoId, viewerId: viewerId || null, duration },
  });
  await prisma.video.update({
    where: { id: videoId },
    data: { viewsCount: { increment: 1 } },
  });
}

