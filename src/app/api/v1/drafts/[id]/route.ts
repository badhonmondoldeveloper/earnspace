import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { deleteDraft } from '@/services/draftService';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    await deleteDraft(params.id, session.userId);
    return successResponse({ id: params.id }, 'Draft deleted successfully');
  } catch (error) {
    console.error('Delete draft error:', error);
    return errorResponse('Internal server error', 500);
  }
}
