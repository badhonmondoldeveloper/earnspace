import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/response';
import { TemplateService } from '@/services/templateService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doWhat, goal, style } = body;

    const recommended = TemplateService.getRecommendedTemplates({ doWhat, goal, style });
    return successResponse(recommended, 'Recommended templates generated successfully');
  } catch (error: any) {
    console.error('POST /api/v1/templates/recommended error:', error);
    return errorResponse('Failed to calculate template recommendations', 500);
  }
}
