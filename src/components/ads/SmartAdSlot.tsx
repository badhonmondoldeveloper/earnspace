'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface SmartAdSlotProps {
  slotName: string;
  creatorId?: string;
  contentId?: string;
  contentType?: string;
  className?: string;
}

interface AdData {
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

export function SmartAdSlot({
  slotName,
  creatorId,
  contentId,
  contentType,
  className = '',
}: SmartAdSlotProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchAd() {
      try {
        const queryParams = new URLSearchParams({
          slotName,
          ...(creatorId ? { creatorId } : {}),
          ...(contentId ? { contentId } : {}),
          ...(contentType ? { contentType } : {}),
        });

        const res = await fetch(`/api/v1/ads/request?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch ad');
        const json = await res.json();
        if (isMounted && json.data) {
          setAd(json.data);
          // Trigger impression tracking
          fetch('/api/v1/ads/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              adId: json.data.adId,
              providerKey: json.data.providerKey,
              eventType: 'impression',
              placementSlot: slotName,
              contentId,
              contentType,
              creatorId,
              estimatedRevenue: json.data.isHouseAd ? 0 : 0.05,
            }),
          }).catch(() => {});
        }
      } catch (err) {
        console.error('SmartAdSlot error:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAd();
    return () => {
      isMounted = false;
    };
  }, [slotName, creatorId, contentId, contentType]);

  const handleAdClick = () => {
    if (!ad) return;
    fetch('/api/v1/ads/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: ad.adId,
        providerKey: ad.providerKey,
        eventType: 'click',
        placementSlot: slotName,
        contentId,
        contentType,
        creatorId,
        estimatedRevenue: ad.isHouseAd ? 0 : 0.10,
      }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className={`w-full min-h-[100px] bg-slate-900/40 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-500 text-xs ${className}`}>
        <span>Loading Advertisement...</span>
      </div>
    );
  }

  if (error || !ad) return null;

  // External Ad Code (AdSense / Native script)
  if (ad.adUnitCode) {
    return (
      <div className={`my-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Sponsored</span>
          <span>EarnSpace Ads</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: ad.adUnitCode }} />
      </div>
    );
  }

  // Direct / House Banner Ad Card
  return (
    <div className={`my-4 p-4 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/60 rounded-xl shadow-lg relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-3 h-3" />
          {ad.isHouseAd ? 'EarnSpace Partner' : 'Sponsored Content'}
        </span>
        <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400 border border-slate-700">Ad</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {ad.mediaUrl && (
          <img
            src={ad.mediaUrl}
            alt={ad.title || 'Sponsored'}
            className="w-full sm:w-28 h-20 object-cover rounded-lg border border-slate-700/50"
          />
        )}
        <div className="flex-1 text-left">
          {ad.title && <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{ad.title}</h4>}
          {ad.description && <p className="text-xs text-slate-300 mt-1 line-clamp-2">{ad.description}</p>}
        </div>
        {ad.destinationUrl && (
          <a
            href={ad.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shrink-0 shadow-md"
          >
            <span>{ad.ctaText || 'Learn More'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
