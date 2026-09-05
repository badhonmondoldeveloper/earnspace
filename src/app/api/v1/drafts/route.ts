import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { saveDraft, getUserDrafts } from '@/services/draftService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }
    const drafts = await getUserDrafts(session.userId);
    return successResponse(drafts);
  } catch (error) {
    console.error('Fetch drafts error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { type, title, content, mediaJson, metadataJson } = await req.json();
    if (!type) {
      return errorResponse('Draft type is required', 400);
    }

    const draft = await saveDraft({
      userId: session.userId,
      type,
      title,
      content,
      mediaJson: typeof mediaJson === 'string' ? mediaJson : JSON.stringify(mediaJson || []),
      metadataJson: typeof metadataJson === 'string' ? metadataJson : JSON.stringify(metadataJson || {}),
    });

    return successResponse(draft, 'Draft saved successfully', 201);
  } catch (error) {
    console.error('Save draft error:', error);
    return errorResponse('Internal server error', 500);
  }
}
