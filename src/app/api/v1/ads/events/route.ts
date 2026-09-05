import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { AdRiskEngine } from '@/services/adRiskEngine';
import { AdRevenueAttributionService } from '@/services/adRevenueAttributionService';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      adId,
      providerKey = 'direct',
      eventType = 'impression',
      placementSlot = 'feed',
      contentId,
      contentType,
      creatorId,
      estimatedRevenue = 0.05,
    } = body;

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || undefined;

    // 1. Evaluate Risk & Fraud Score
    const fraudResult = await AdRiskEngine.evaluateEvent({
      eventType,
      ipAddress,
      userAgent,
      adId,
      providerKey,
    });

    if (fraudResult.isBlocked) {
      return errorResponse(`Ad event rejected due to risk policy: ${fraudResult.reason}`, 403);
    }

    const idempotencyKey = `evt_${adId}_${eventType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 2. Log Ad Event if adId belongs to Direct Campaign
    if (adId && !adId.startsWith('ad_') && !adId.startsWith('house_')) {
      try {
        await prisma.adEvent.create({
          data: {
            adId,
            eventType,
            ipAddress,
            idempotencyKey,
          },
        });
      } catch (err) {
        console.warn('AdEvent logging ignored/duplicate:', err);
      }
    }

    // 3. Record estimated revenue attribution if valid impression/click with estimated revenue
    if (estimatedRevenue > 0) {
      await AdRevenueAttributionService.recordEstimatedRevenue({
        eventId: idempotencyKey,
        providerKey,
        placementSlot,
        contentId,
        contentType,
        creatorId,
        estimatedRevenue: eventType === 'click' ? estimatedRevenue * 2 : estimatedRevenue,
      });
    }

    return successResponse({
      status: 'recorded',
      eventType,
      riskLevel: fraudResult.riskLevel,
    });
  } catch (error: any) {
    console.error('Ad event API error:', error);
    return errorResponse(error.message || 'Failed to record ad event', 500);
  }
}
