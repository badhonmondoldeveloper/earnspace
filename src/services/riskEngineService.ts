import { prisma } from '@/lib/prisma';

export class RiskEngineService {
  /**
   * Logs a risk event and calculates user fraud score
   */
  static async logRiskEvent(userId: string | null, eventType: string, score: number, metadata: Record<string, any> = {}) {
    let riskLevel = 'low';
    if (score >= 80) riskLevel = 'critical';
    else if (score >= 50) riskLevel = 'high';
    else if (score >= 25) riskLevel = 'medium';

    const riskEvent = await prisma.riskEvent.create({
      data: {
        userId,
        eventType,
        riskScore: score,
        riskLevel,
        metadata: JSON.stringify(metadata),
      },
    });

    return riskEvent;
  }
}

