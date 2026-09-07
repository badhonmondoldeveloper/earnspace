import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/response';
import { TemplateService } from '@/services/templateService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const search = searchParams.get('search') || undefined;
    const style = searchParams.get('style') || undefined;
    const isPro = searchParams.get('isPro') ? searchParams.get('isPro') === 'true' : undefined;
    const isFeatured = searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 30;

    const templates = await TemplateService.getTemplates({
      category,
      subcategory,
      search,
      style,
      isPro,
      isFeatured,
      limit,
    });

    return successResponse(templates, 'Templates retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/templates error:', error);
    return errorResponse(error.message || 'Failed to fetch templates', 500);
  }
}
