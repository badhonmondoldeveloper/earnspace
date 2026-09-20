import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/connect/products
 * Fetch creator's digital store products for external integrations
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateApiRequest(req, 'read:products');
    let targetUserId = auth.userId;

    if (!auth.authenticated) {
      const url = new URL(req.url);
      const username = url.searchParams.get('username');
      if (username) {
        const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
        if (user) targetUserId = user.id;
        else return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
      } else {
        return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
      }
    }

    const products = await prisma.product.findMany({
      where: { sellerId: targetUserId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        fileUrl: true,
        salesCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        buyLink: `https://earnspace-chi.vercel.app/products/${p.id}`,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
