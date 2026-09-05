import { prisma } from '@/lib/prisma';

export function extractHashtags(text: string): string[] {
  if (!text) return [];
  // Match English and Bangla hashtag alphanumeric strings
  const matches = text.match(/#([a-zA-Z0-9_\u0980-\u09FF]+)/g);
  if (!matches) return [];
  const tags = matches.map((m) => m.replace(/^#/, '').toLowerCase());
  return Array.from(new Set(tags));
}

export function extractMentions(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/(?:^|\s)@([a-zA-Z0-9_]{3,30})/g);
  if (!matches) return [];
  const usernames = matches.map((m) => m.trim().replace(/^@/, '').toLowerCase());
  return Array.from(new Set(usernames));
}

export async function processHashtagsAndMentions(
  targetType: 'post' | 'video' | 'reel',
  targetId: string,
  content: string,
  authorId: string
) {
  const hashtags = extractHashtags(content);
  const mentions = extractMentions(content);

  // Process Hashtags
  for (const tag of hashtags) {
    const hashtag = await prisma.hashtag.upsert({
      where: { name: tag },
      create: {
        name: tag,
        postsCount: targetType === 'post' ? 1 : 0,
        videosCount: targetType === 'video' ? 1 : 0,
        reelsCount: targetType === 'reel' ? 1 : 0,
      },
      update: {
        postsCount: targetType === 'post' ? { increment: 1 } : undefined,
        videosCount: targetType === 'video' ? { increment: 1 } : undefined,
        reelsCount: targetType === 'reel' ? { increment: 1 } : undefined,
      },
    });

    if (targetType === 'post') {
      await prisma.postHashtag.upsert({
        where: { postId_hashtagId: { postId: targetId, hashtagId: hashtag.id } },
        create: { postId: targetId, hashtagId: hashtag.id },
        update: {},
      });
    } else if (targetType === 'video') {
      await prisma.videoHashtag.upsert({
        where: { videoId_hashtagId: { videoId: targetId, hashtagId: hashtag.id } },
        create: { videoId: targetId, hashtagId: hashtag.id },
        update: {},
      });
    } else if (targetType === 'reel') {
      await prisma.reelHashtag.upsert({
        where: { reelId_hashtagId: { reelId: targetId, hashtagId: hashtag.id } },
        create: { reelId: targetId, hashtagId: hashtag.id },
        update: {},
      });
    }
  }

  // Process Mentions
  for (const username of mentions) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (user && user.id !== authorId) {
      await prisma.mention.create({
        data: {
          userId: user.id,
          targetType,
          targetId,
          postId: targetType === 'post' ? targetId : undefined,
        },
      });

      // Send Notification to mentioned user
      await prisma.notification.create({
        data: {
          userId: user.id,
          senderId: authorId,
          type: 'mention',
          title: 'You were mentioned',
          body: `You were mentioned in a ${targetType}.`,
          link: targetType === 'post' ? `/dashboard#post-${targetId}` : targetType === 'video' ? `/video/${targetId}` : `/reels`,
        },
      });
    }
  }
}

