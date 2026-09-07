import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/response';
import { TEMPLATE_CATEGORIES } from '@/lib/templates/templateRegistry';

export async function GET(req: NextRequest) {
  try {
    return successResponse(TEMPLATE_CATEGORIES, 'Template categories retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/templates/categories error:', error);
    return errorResponse('Failed to fetch template categories', 500);
  }
}
