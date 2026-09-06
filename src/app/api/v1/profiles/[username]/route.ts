import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { RESERVED_USERNAMES } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const rawUsername = params.username.replace(/^@/, '').toLowerCase();
    if (RESERVED_USERNAMES.includes(rawUsername)) {
      return errorResponse('User profile not found', 404);
    }
    const session = await getSession();

    const user = await prisma.user.findUnique({
      where: { username: rawUsername },
      include: {
        profile: { select: { fullName: true, bio: true, avatar: true, cover: true, location: true, website: true, category: true, socialLinks: true, followersCount: true, followingCount: true, postsCount: true, blogsCount: true, videosCount: true, reelsCount: true } },
        settings: { select: { profileVisibility: true } },
        referral: { select: { referralCode: true } },
      },
    });

    if (!user) {
      return errorResponse('User profile not found', 404);
    }

    const isOwnProfile = session?.userId === user.id;
    if (user.settings?.profileVisibility === 'private' && !isOwnProfile) {
      return errorResponse('This profile is private', 403);
    }

    const [posts, blogs, stories] = await Promise.all([
      prisma.post.findMany({
        where: isOwnProfile ? { userId: user.id } : { userId: user.id, status: 'published', visibility: 'public' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { media: true, _count: { select: { reactions: true, comments: true } } },
      }),
      prisma.blog.findMany({
        where: { userId: user.id, status: 'published' },
        take: 10,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, content: true, publishedAt: true, coverImage: true, category: true, tags: true },
      }),
      prisma.story.findMany({
        where: { userId: user.id, expiresAt: { gt: new Date() } },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    let isFollowing = false;
    if (session) {
      const followRecord = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!followRecord;
    }

    const response = successResponse({
      id: user.id,
      username: user.username,
      accountType: user.accountType,
      isEmailVerified: user.isEmailVerified,
      profile: user.profile,
      referralCode: user.referral?.referralCode || user.username,
      posts,
      blogs,
      stories,
      isFollowing,
      isOwnProfile,
    });
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return errorResponse('Something went wrong. Please try again.', 500);
  }
}
