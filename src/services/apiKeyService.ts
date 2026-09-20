import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export interface CreateApiKeyInput {
  userId: string;
  name: string;
  scopes?: string[];
  environment?: 'live' | 'test';
}

export class ApiKeyService {
  /**
   * Generate a new API Key (e.g. es_live_9a8b7c6d...)
   * Returns the unhashed raw key once for display to user.
   */
  static async createKey(input: CreateApiKeyInput) {
    const { userId, name, scopes = ['read:page', 'read:products', 'write:leads'], environment = 'live' } = input;
    
    // Generate secure random string
    const randomHex = crypto.randomBytes(24).toString('hex');
    const prefix = `es_${environment}_`;
    const rawKey = `${prefix}${randomHex}`;
    
    // Key prefix for display e.g. es_live_9a8b...
    const displayPrefix = rawKey.substring(0, 12);

    // Hash raw key for database storage
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKeyRecord = await prisma.apiKey.create({
      data: {
        userId,
        name: name.trim() || 'Default API Key',
        keyPrefix: displayPrefix,
        hashedKey,
        scopes: scopes.join(','),
        environment,
      },
    });

    return {
      id: apiKeyRecord.id,
      name: apiKeyRecord.name,
      keyPrefix: apiKeyRecord.keyPrefix,
      rawKey, // returned ONLY once on creation
      scopes: apiKeyRecord.scopes.split(','),
      environment: apiKeyRecord.environment,
      createdAt: apiKeyRecord.createdAt,
    };
  }

  /**
   * Validate API key from HTTP request (Bearer token or X-API-Key header)
   */
  static async validateApiKey(rawKey: string, requiredScope?: string) {
    if (!rawKey || !rawKey.startsWith('es_')) {
      return { valid: false, error: 'Invalid API key format' };
    }

    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    let apiKey = null;
    try {
      apiKey = await prisma.apiKey.findUnique({
        where: { hashedKey },
        include: { user: { select: { id: true, username: true, email: true, status: true } } },
      });
    } catch (dbErr) {
      return { valid: false, error: 'API key not found' };
    }

    if (!apiKey) {
      return { valid: false, error: 'API key not found' };
    }

    if (apiKey.isRevoked) {
      return { valid: false, error: 'API key has been revoked' };
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    if (apiKey.user.status !== 'active') {
      return { valid: false, error: 'Associated user account is suspended or inactive' };
    }

    const keyScopes = apiKey.scopes.split(',');
    if (requiredScope && !keyScopes.includes(requiredScope) && !keyScopes.includes('*')) {
      return { valid: false, error: `API key lacks required permission scope: ${requiredScope}` };
    }

    // Update lastUsedAt asynchronously
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});

    return {
      valid: true,
      userId: apiKey.userId,
      user: apiKey.user,
      keyId: apiKey.id,
      environment: apiKey.environment,
      scopes: keyScopes,
    };
  }

  /**
   * List all API keys for a given creator
   */
  static async listUserKeys(userId: string) {
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map((k) => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.keyPrefix,
      scopes: k.scopes.split(','),
      environment: k.environment,
      isRevoked: k.isRevoked,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));
  }

  /**
   * Revoke an API key
   */
  static async revokeKey(userId: string, keyId: string) {
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!key) {
      throw new Error('API key not found');
    }

    return prisma.apiKey.update({
      where: { id: keyId },
      data: { isRevoked: true },
    });
  }
}
