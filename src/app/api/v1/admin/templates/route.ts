import { NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';
import { TEMPLATE_REGISTRY } from '@/lib/templates/templateRegistry';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    const session = await getSession();
    if (!admin && session?.role !== 'Super Admin') {
      return errorResponse('Forbidden: Admin permissions required', 403);
    }

    try {
      const dbTemplates = await prisma.websiteTemplate.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return successResponse(dbTemplates, 'Admin templates list retrieved');
    } catch (err) {
      return successResponse(TEMPLATE_REGISTRY, 'Admin templates list retrieved');
    }
  } catch (error: any) {
    console.error('GET /api/v1/admin/templates error:', error);
    return errorResponse('Failed to fetch admin templates', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    const session = await getSession();
    if (!admin && session?.role !== 'Super Admin') {
      return errorResponse('Forbidden: Admin permissions required', 403);
    }

    const body = await req.json();
    const { name, slug, description, category, subcategory, style, isPro, isFeatured, previewImage, blocks } = body;

    if (!name || !slug) {
      return errorResponse('Name and Slug are required', 400);
    }

    const template = await prisma.websiteTemplate.create({
      data: {
        name,
        slug,
        description,
        category: category || 'Creators',
        subcategory,
        style: style || 'Modern',
        isPro: Boolean(isPro),
        isFeatured: Boolean(isFeatured),
        previewImage,
        schemaJson: JSON.stringify(blocks || []),
      },
    });

    return successResponse(template, 'Website template created successfully by Admin', 201);
  } catch (error: any) {
    console.error('POST /api/v1/admin/templates error:', error);
    return errorResponse(error.message || 'Failed to create template', 500);
  }
}
