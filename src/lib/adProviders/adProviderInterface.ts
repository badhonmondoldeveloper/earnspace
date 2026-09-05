export interface AdPlacementRequest {
  slotName: string; // feed, video, reels, blog, website, sidebar, explore
  userCountry?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

export interface AdPlacementResponse {
  providerKey: string;
  providerName: string;
  slotName: string;
  format: string; // banner, native, video_instream, interstitial
  adContentHtml?: string;
  destinationUrl?: string;
  mediaUrl?: string;
  title?: string;
  ctaText?: string;
  adId?: string;
  isFallback: boolean;
}

export interface AdProviderInterface {
  providerKey: string;
  name: string;
  initialize(config: Record<string, any>): Promise<void>;
  validateConfig(config: Record<string, any>): boolean;
  getPlacement(request: AdPlacementRequest): Promise<AdPlacementResponse | null>;
  reportEvent(eventId: string, eventType: 'impression' | 'click'): Promise<boolean>;
  healthCheck(): Promise<'healthy' | 'degraded' | 'offline'>;
}

