import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { recordVideoView } from '@/services/videoService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const duration = body.duration || 0;

    await recordVideoView(params.id, session?.userId, duration);
    return successResponse({ recorded: true });
  } catch (error) {
    console.error('Record video view error:', error);
    return errorResponse('Internal server error', 500);
  }
}

