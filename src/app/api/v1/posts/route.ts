import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { postCreateSchema } from '@/validations/post.schema';
import { sanitizeContent } from '@/lib/sanitizer';
import { processHashtagsAndMentions } from '@/lib/hashtagMentionExtractor';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // all, following, popular
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');

    const session = await getSession();
    let whereClause: any = { status: 'published', visibility: 'public' };

    if (filter === 'following' && session) {
      const followingUsers = await prisma.follow.findMany({
        where: { followerId: session.userId },
        select: { followingId: true },
      });
      const followingIds = followingUsers.map((f) => f.followingId);
      whereClause = {
        userId: { in: [...followingIds, session.userId] },
        status: 'published',
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: { fullName: true, avatar: true },
            },
          },
        },
        media: true,
        reactions: true,
        _count: {
          select: { comments: true, reactions: true, saves: true, shares: true },
        },
      },
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id || null;
    }

    // Attach reaction state for current user
    const postsWithUserData = posts.map((post) => {
      const userReaction = session
        ? post.reactions.find((r) => r.userId === session.userId)?.type
        : null;
      return {
        ...post,
        userReaction,
      };
    });

    return successResponse({
      items: postsWithUserData,
      nextCursor,
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
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
    const validation = postCreateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.errors.map(e => ({ message: e.message })));
    }

    const { content, type, visibility, mediaUrls } = validation.data;
    const sanitizedText = sanitizeContent(content);

    const post = await prisma.post.create({
      data: {
        userId: session.userId,
        content: sanitizedText,
        type,
        visibility,
        status: 'published',
        media: mediaUrls && mediaUrls.length > 0 ? {
          create: mediaUrls.map((url) => ({ url, type: 'image' })),
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { fullName: true, avatar: true } },
          },
        },
        media: true,
        _count: { select: { comments: true, reactions: true, saves: true } },
      },
    });

    // Update profile posts count
    await prisma.profile.update({
      where: { userId: session.userId },
      data: { postsCount: { increment: 1 } },
    });

    // Process hashtags & mentions asynchronously
    processHashtagsAndMentions('post', post.id, sanitizedText, session.userId).catch((err) =>
      console.error('Error processing hashtags/mentions:', err)
    );

    return successResponse(post, 'Post created successfully', 201);
  } catch (error) {
    console.error('Create post error:', error);
    return errorResponse('Internal server error', 500);
  }
}

