import { prisma } from '@/lib/prisma';
import { AdProviderManager } from '@/lib/adProviders/adProviderManager';
import { HouseAdService } from './houseAdService';

export interface SmartAdRequest {
  slotName: string;
  device?: string; // mobile, desktop, tablet
  country?: string; // BD, GLOBAL
  creatorId?: string;
  contentId?: string;
  contentType?: string; // post, video, reel, blog, space
  userIp?: string;
}

export interface SmartAdResponse {
  adId: string;
  providerKey: string;
  format: string;
  title?: string;
  description?: string;
  mediaUrl?: string;
  destinationUrl?: string;
  ctaText?: string;
  adUnitCode?: string;
  isHouseAd: boolean;
  trackingToken: string;
}

export class SmartAdEngine {
  /**
   * Smart Ad Selection Flow:
   * Request -> Placement Check -> Eligibility -> Health -> Direct Campaign -> External Network -> House Ad Fallback
   */
  static async requestAd(req: SmartAdRequest): Promise<SmartAdResponse> {
    const { slotName, device = 'desktop', country = 'BD', creatorId, contentId, contentType } = req;

    try {
      // 1. Direct Advertiser Campaign Check
      const directCreative = await prisma.adCreative.findFirst({
        where: {
          adCampaign: {
            status: 'approved',
            placement: { in: [slotName, 'feed', 'all'] },
            startAt: { lte: new Date() },
            OR: [
              { endAt: null },
              { endAt: { gte: new Date() } }
            ]
          }
        },
        include: {
          adCampaign: true,
          ads: { take: 1 }
        },
        orderBy: { createdAt: 'desc' },
      });

      if (directCreative && directCreative.ads.length > 0) {
        const ad = directCreative.ads[0];
        const trackingToken = `direct_${ad.id}_${Date.now()}`;

        return {
          adId: ad.id,
          providerKey: 'direct',
          format: 'banner',
          title: directCreative.title,
          description: directCreative.description || undefined,
          mediaUrl: directCreative.mediaUrl || undefined,
          destinationUrl: directCreative.destinationUrl,
          ctaText: directCreative.ctaText,
          isHouseAd: false,
          trackingToken,
        };
      }

      // 2. Multi-Ad Provider Degradation Chain (AdSense -> Adsterra)
      const providerSlot = await AdProviderManager.getPlacementWithFallback({ slotName });
      if (providerSlot) {
        const trackingToken = `provider_${providerSlot.providerKey}_${Date.now()}`;
        return {
          adId: `ad_${providerSlot.providerKey}_${slotName}`,
          providerKey: providerSlot.providerKey,
          format: providerSlot.format || 'banner',
          adUnitCode: providerSlot.adContentHtml,
          isHouseAd: false,
          trackingToken,
        };
      }

      // 3. Fallback: House Ad Platform Promotion
      const houseAd = await HouseAdService.getHouseAd(slotName);
      return {
        adId: houseAd.id,
        providerKey: houseAd.providerKey,
        format: houseAd.format,
        title: houseAd.title,
        description: houseAd.description || undefined,
        mediaUrl: houseAd.mediaUrl || undefined,
        destinationUrl: houseAd.destinationUrl,
        ctaText: houseAd.ctaText,
        isHouseAd: true,
        trackingToken: `house_${houseAd.id}_${Date.now()}`,
      };
    } catch (error) {
      console.error('SmartAdEngine selection error:', error);
      // Emergency House Ad Fallback (Never return broken UI)
      const fallback = await HouseAdService.getHouseAd(slotName);
      return {
        adId: fallback.id,
        providerKey: fallback.providerKey,
        format: fallback.format,
        title: fallback.title,
        description: fallback.description || undefined,
        mediaUrl: fallback.mediaUrl || undefined,
        destinationUrl: fallback.destinationUrl,
        ctaText: fallback.ctaText,
        isHouseAd: true,
        trackingToken: `emergency_${Date.now()}`,
      };
    }
  }
}
