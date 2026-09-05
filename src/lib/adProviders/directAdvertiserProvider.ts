import { AdProviderInterface, AdPlacementRequest, AdPlacementResponse } from './adProviderInterface';
import { prisma } from '@/lib/prisma';

export class DirectAdvertiserProvider implements AdProviderInterface {
  providerKey = 'direct';
  name = 'EarnSpace Direct Ads';

  async initialize(config: Record<string, any>): Promise<void> {}

  validateConfig(config: Record<string, any>): boolean {
    return true;
  }

  async getPlacement(request: AdPlacementRequest): Promise<AdPlacementResponse | null> {
    const directCampaign = await prisma.adCampaign.findFirst({
      where: { status: 'approved', placement: request.slotName },
      include: { creatives: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!directCampaign || directCampaign.creatives.length === 0) {
      return null;
    }

    const creative = directCampaign.creatives[0];

    return {
      providerKey: this.providerKey,
      providerName: this.name,
      slotName: request.slotName,
      format: 'native',
      title: creative.title,
      destinationUrl: creative.destinationUrl,
      mediaUrl: creative.mediaUrl || undefined,
      ctaText: creative.ctaText,
      adId: creative.id,
      isFallback: false,
    };
  }

  async reportEvent(eventId: string, eventType: 'impression' | 'click'): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<'healthy' | 'degraded' | 'offline'> {
    return 'healthy';
  }
}
