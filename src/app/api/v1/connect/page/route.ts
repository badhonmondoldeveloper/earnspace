import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/connect/page
 * Headless API endpoint to fetch creator website blocks, layout, and metadata
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateApiRequest(req, 'read:page');
    let targetUserId = auth.userId;

    // Fallback: If no API key provided, allow ?username= query param for public read
    if (!auth.authenticated) {
      const url = new URL(req.url);
      const username = url.searchParams.get('username');
      if (username) {
        const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
        if (user) {
          targetUserId = user.id;
        } else {
          return NextResponse.json({ success: false, error: 'Creator username not found' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
      }
    }

    const page = await prisma.page.findFirst({
      where: { userId: targetUserId },
      include: {
        blocks: { orderBy: { position: 'asc' } },
        settings: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { username: true, profile: { select: { fullName: true, bio: true, avatar: true, cover: true, socialLinks: true } } },
    });

    return NextResponse.json({
      success: true,
      data: {
        creator: {
          username: user?.username,
          fullName: user?.profile?.fullName,
          bio: user?.profile?.bio,
          avatar: user?.profile?.avatar,
          cover: user?.profile?.cover,
          socialLinks: user?.profile?.socialLinks ? JSON.parse(user.profile.socialLinks as string) : {},
        },
        page: page
          ? {
              id: page.id,
              title: page.title,
              slug: page.slug,
              theme: page.settings?.theme || 'modern',
              seoTitle: page.settings?.seoTitle || page.title,
              seoDescription: page.settings?.seoDescription || page.description,
              blocks: page.blocks,
              updatedAt: page.updatedAt,
            }
          : null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
