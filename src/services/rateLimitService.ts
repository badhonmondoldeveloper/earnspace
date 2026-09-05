interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export class RateLimitService {
  /**
   * Checks whether an action for a key exceeds the specified rate limit
   * @param key Unique key (e.g. `auth:login:127.0.0.1` or `post:create:user_123`)
   * @param limit Maximum allowed attempts within window
   * @param windowMs Time window in milliseconds
   */
  static check(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || record.resetAt <= now) {
      const resetAt = now + windowMs;
      rateLimitStore.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    record.count += 1;
    return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
  }
}

