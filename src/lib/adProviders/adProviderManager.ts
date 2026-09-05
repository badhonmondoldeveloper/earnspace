import { AdProviderInterface, AdPlacementRequest, AdPlacementResponse } from './adProviderInterface';
import { GoogleAdSenseProvider } from './googleAdSenseProvider';
import { AdsterraProvider } from './adsterraProvider';
import { DirectAdvertiserProvider } from './directAdvertiserProvider';

export class AdProviderManager {
  private static providers: Map<string, AdProviderInterface> = new Map([
    ['google_adsense', new GoogleAdSenseProvider()],
    ['adsterra', new AdsterraProvider()],
    ['direct', new DirectAdvertiserProvider()],
  ]);

  static async getPlacementWithFallback(request: AdPlacementRequest): Promise<AdPlacementResponse> {
    const chain = ['google_adsense', 'adsterra', 'direct'];

    for (const key of chain) {
      const provider = this.providers.get(key);
      if (provider) {
        try {
          const health = await provider.healthCheck();
          if (health !== 'offline') {
            const placement = await provider.getPlacement(request);
            if (placement) {
              return placement;
            }
          }
        } catch (err) {
          console.error(`AdProvider ${key} failed, attempting fallback...`, err);
        }
      }
    }

    // Default Fallback response (Guarantees system never crashes)
    return {
      providerKey: 'fallback',
      providerName: 'EarnSpace Native Promotion',
      slotName: request.slotName,
      format: 'native',
      title: 'Become an EarnSpace Verified Creator',
      destinationUrl: '/creator/monetization',
      ctaText: 'Learn More',
      isFallback: true,
    };
  }
}
