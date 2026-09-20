import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApiKeyService } from '@/services/apiKeyService';

/**
 * DELETE /api/v1/developer/keys/[id]
 * Revoke an API Key
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await ApiKeyService.revokeKey(session.userId, id);

    return NextResponse.json({
      success: true,
      message: 'API Key revoked successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
