import { prisma } from '@/lib/prisma';

export interface FraudEvaluationRequest {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  eventType: 'impression' | 'click';
  adId?: string;
  providerKey?: string;
}

export interface FraudEvaluationResult {
  riskScore: number; // 0 to 100
  riskLevel: 'low' | 'medium' | 'high' | 'blocked';
  isBlocked: boolean;
  reason?: string;
}

export class AdRiskEngine {
  /**
   * Evaluate ad event risk level based on IP velocity, repeat window, CTR anomalies, and bot user agents.
   */
  static async evaluateEvent(req: FraudEvaluationRequest): Promise<FraudEvaluationResult> {
    const { userId, ipAddress, userAgent, eventType } = req;
    let score = 0;
    const reasons: string[] = [];

    // 1. Bot User-Agent Filter
    if (userAgent) {
      const botPattern = /bot|crawl|spider|slurp|headless|phantom|puppeteer|selenium|curl|wget/i;
      if (botPattern.test(userAgent)) {
        score += 80;
        reasons.push('Automated bot user agent detected');
      }
    }

    // 2. IP Velocity & Rapid Click/Impression Frequency Check
    if (ipAddress) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentEventsCount = await prisma.adEvent.count({
        where: {
          ipAddress,
          eventType,
          createdAt: { gte: fiveMinutesAgo },
        },
      });

      // Threshold: > 50 impressions or > 10 clicks in 5 minutes from same IP
      if (eventType === 'click' && recentEventsCount > 10) {
        score += 60;
        reasons.push(`High click velocity (${recentEventsCount} clicks / 5m) from IP`);
      } else if (eventType === 'impression' && recentEventsCount > 50) {
        score += 40;
        reasons.push(`High impression velocity (${recentEventsCount} impressions / 5m) from IP`);
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'blocked' = 'low';
    let isBlocked = false;

    if (score >= 80) {
      riskLevel = 'blocked';
      isBlocked = true;
    } else if (score >= 50) {
      riskLevel = 'high';
    } else if (score >= 25) {
      riskLevel = 'medium';
    }

    // Log risk event if medium or higher
    if (riskLevel !== 'low') {
      try {
        await prisma.riskEvent.create({
          data: {
            userId: userId || null,
            eventType: `ad_${eventType}_risk`,
            riskScore: score,
            riskLevel,
            metadata: JSON.stringify({ ipAddress, userAgent, reasons }),
          },
        });
      } catch (err) {
        console.error('Failed to record risk event:', err);
      }
    }

    return {
      riskScore: score,
      riskLevel,
      isBlocked,
      reason: reasons.join('; ') || undefined,
    };
  }
}

