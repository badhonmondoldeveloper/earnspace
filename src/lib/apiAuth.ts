import { NextRequest } from 'next/server';
import { ApiKeyService } from '@/services/apiKeyService';

export async function authenticateApiRequest(req: NextRequest, requiredScope?: string) {
  // Check Authorization header: "Bearer es_live_..."
  const authHeader = req.headers.get('authorization') || '';
  let rawKey = '';

  if (authHeader.startsWith('Bearer ')) {
    rawKey = authHeader.replace('Bearer ', '').trim();
  } else {
    // Fallback check X-API-Key header
    rawKey = req.headers.get('x-api-key') || req.headers.get('x-earnspace-key') || '';
  }

  // Also allow key in query parameter for quick testing: ?api_key=es_live_...
  if (!rawKey) {
    const url = new URL(req.url);
    rawKey = url.searchParams.get('api_key') || '';
  }

  if (!rawKey) {
    return {
      authenticated: false,
      error: 'Missing API Key. Provide key in Authorization header (Bearer es_live_...), X-API-Key header, or ?api_key= query parameter.',
    };
  }

  const result = await ApiKeyService.validateApiKey(rawKey, requiredScope);
  if (!result.valid) {
    return { authenticated: false, error: result.error };
  }

  return {
    authenticated: true,
    userId: result.userId!,
    user: result.user!,
    keyId: result.keyId,
    environment: result.environment,
    scopes: result.scopes,
  };
}
