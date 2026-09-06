import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const activeProviders = await prisma.adProvider.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        providerKey: true,
        providerType: true,
        headCodeSnippet: true,
      },
    });

    const headTags = activeProviders
      .filter((p) => p.headCodeSnippet && p.headCodeSnippet.trim().length > 0)
      .map((p) => ({
        id: p.id,
        providerKey: p.providerKey,
        providerType: p.providerType,
        snippet: p.headCodeSnippet,
      }));

    if (headTags.length === 0) {
      headTags.push({
        id: 'default_adsense',
        providerKey: 'google_adsense',
        providerType: 'google_adsense',
        snippet: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9249570729862532" crossorigin="anonymous"></script>\n<meta name="google-adsense-account" content="ca-pub-9249570729862532">',
      });
    }

    const response = successResponse(headTags);
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=120');
    return response;
  } catch (error: any) {
    console.error('Head tags API error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

