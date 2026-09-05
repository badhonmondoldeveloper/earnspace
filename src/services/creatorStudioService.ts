import { prisma } from '@/lib/prisma';

export async function getCreatorAnalytics(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  const [postsCount, videosCount, reelsCount, blogsCount] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.video.count({ where: { userId } }),
    prisma.reel.count({ where: { userId } }),
    prisma.blog.count({ where: { userId } }),
  ]);

  const [videoViews, reelViews, blogViews] = await Promise.all([
    prisma.video.aggregate({
      where: { userId },
      _sum: { viewsCount: true, likesCount: true },
    }),
    prisma.reel.aggregate({
      where: { userId },
      _sum: { viewsCount: true, likesCount: true },
    }),
    prisma.blog.aggregate({
      where: { userId },
      _sum: { viewsCount: true },
    }),
  ]);

  const totalViews =
    (videoViews._sum.viewsCount || 0) +
    (reelViews._sum.viewsCount || 0) +
    (blogViews._sum.viewsCount || 0);
  const totalLikes =
    (videoViews._sum.likesCount || 0) + (reelViews._sum.likesCount || 0);

  const topVideos = await prisma.video.findMany({
    where: { userId },
    orderBy: { viewsCount: 'desc' },
    take: 5,
    select: { id: true, title: true, viewsCount: true, likesCount: true, createdAt: true },
  });

  const topReels = await prisma.reel.findMany({
    where: { userId },
    orderBy: { viewsCount: 'desc' },
    take: 5,
    select: { id: true, caption: true, viewsCount: true, likesCount: true, createdAt: true },
  });

  return {
    followersCount: profile?.followersCount || 0,
    followingCount: profile?.followingCount || 0,
    postsCount,
    videosCount,
    reelsCount,
    blogsCount,
    totalViews,
    totalLikes,
    topVideos,
    topReels,
  };
}
