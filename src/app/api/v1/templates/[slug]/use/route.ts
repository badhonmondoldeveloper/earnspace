import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { TemplateService } from '@/services/templateService';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { slug } = params;
    if (!slug) {
      return errorResponse('Template slug is required', 400);
    }

    const updatedPage = await TemplateService.applyTemplateToUserPage(session.userId, slug);
    return successResponse(updatedPage, `Template "${slug}" applied successfully!`, 200);
  } catch (error: any) {
    console.error(`POST /api/v1/templates/${params.slug}/use error:`, error);
    return errorResponse(error.message || 'Failed to apply template', 500);
  }
}
