'use client';

import React, { useEffect, useRef, useState } from 'react';
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

/**
 * ScriptAdContainer dynamically parses and appends <script> and <meta> tags
 * to ensure injected ad network code snippets (e.g. AdSense, Adsterra, Ezoic) execute properly on React client render.
 */
function ScriptAdContainer({ codeSnippet }: { codeSnippet: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !codeSnippet) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous

    // Parse HTML string into DOM nodes
    const parser = new DOMParser();
    const doc = parser.parseFromString(codeSnippet, 'text/html');

    // Append non-script elements
    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeName !== 'SCRIPT') {
        container.appendChild(node.cloneNode(true));
      }
    });

    // Execute scripts dynamically
    const scripts = doc.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      container.appendChild(newScript);
    });
  }, [codeSnippet]);

  return <div ref={containerRef} className="w-full overflow-hidden" />;
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
          // Impression tracking
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
        estimatedRevenue: ad.isHouseAd ? 0 : 0.1,
      }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className={`w-full min-h-[90px] bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse flex items-center justify-center text-slate-500 text-xs ${className}`}>
        <span>Loading Sponsored Ad...</span>
      </div>
    );
  }

  if (error || !ad) return null;

  // Render Ad Code Snippet (AdSense / Adsterra / Custom HTML or JS Script Tags)
  if (ad.adUnitCode) {
    return (
      <div className={`my-4 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-md ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Sponsored
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400 border border-slate-700">
            {ad.providerKey.toUpperCase()}
          </span>
        </div>
        <ScriptAdContainer codeSnippet={ad.adUnitCode} />
      </div>
    );
  }

  // Render Facebook-style Native Sponsored Card
  return (
    <div className={`my-4 p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          {ad.isHouseAd ? 'EarnSpace Partner' : 'Sponsored Content'}
        </span>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[9px]">
          Sponsored
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {ad.mediaUrl && (
          <img
            src={ad.mediaUrl}
            alt={ad.title || 'Sponsored'}
            className="w-full sm:w-28 h-20 object-cover rounded-xl border border-slate-800 shrink-0"
          />
        )}
        <div className="flex-1 text-left space-y-1">
          {ad.title && <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{ad.title}</h4>}
          {ad.description && <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{ad.description}</p>}
        </div>
        {ad.destinationUrl && (
          <a
            href={ad.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-lg shadow-indigo-500/20"
          >
            <span>{ad.ctaText || 'Learn More'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
