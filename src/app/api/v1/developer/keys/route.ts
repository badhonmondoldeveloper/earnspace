import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApiKeyService } from '@/services/apiKeyService';

/**
 * GET /api/v1/developer/keys
 * List creator's API keys
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await ApiKeyService.listUserKeys(session.userId);
    return NextResponse.json({ success: true, data: keys });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/v1/developer/keys
 * Create a new API Key for developer integrations
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, scopes, environment } = body;

    const newKey = await ApiKeyService.createKey({
      userId: session.userId,
      name: name || 'Custom Integration Key',
      scopes: Array.isArray(scopes) && scopes.length ? scopes : ['read:page', 'read:products', 'write:leads'],
      environment: environment === 'test' ? 'test' : 'live',
    });

    return NextResponse.json({
      success: true,
      data: newKey,
      message: 'API Key generated successfully. Save this key now; it will not be shown again!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
