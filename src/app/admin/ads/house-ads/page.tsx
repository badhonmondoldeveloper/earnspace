'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone, Plus, Link2, ExternalLink, ShieldCheck, Sparkles, CheckCircle2,
  Trash2, Eye, Sliders, ArrowRight
} from 'lucide-react';

export default function AdminHouseAdsPage() {
  const [houseAds, setHouseAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [ctaText, setCtaText] = useState('Learn More');
  const [placement, setPlacement] = useState('all');
  const [priority, setPriority] = useState('1');

  useEffect(() => {
    fetchHouseAds();
  }, []);

  const fetchHouseAds = async () => {
    try {
      const res = await fetch('/api/v1/admin/ads/house-ads');
      const json = await res.json();
      if (json.data) setHouseAds(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destinationUrl) return;

    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/v1/admin/ads/house-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          mediaUrl,
          destinationUrl,
          ctaText,
          placement,
          priority: parseInt(priority) || 1,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg('🎉 House Ad / SmartLink created and published live site-wide!');
        setTitle('');
        setDescription('');
        setMediaUrl('');
        setDestinationUrl('');
        setCtaText('Learn More');
        fetchHouseAds();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setMsg(`Error: ${json.error || 'Failed to publish ad'}`);
      }
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const applyTemplate = (templateType: 'adsterra' | 'cpa' | 'promo') => {
    if (templateType === 'adsterra') {
      setTitle('Exclusive Offer & High Yield Deal');
      setDescription('Click below to unlock exclusive bonus rewards & high CPM sponsor offers.');
      setDestinationUrl('https://www.highratedcpmgate.com/example_smartlink');
      setCtaText('Claim Bonus Now');
      setPlacement('all');
    } else if (templateType === 'cpa') {
      setTitle('Special Partner Promotion');
      setDescription('Verified partner offer. Complete quick registration to start earning.');
      setDestinationUrl('https://smartlink.example.com/offer');
      setCtaText('Get Started');
      setPlacement('PERSONAL_SPACE_CONTENT');
    } else if (templateType === 'promo') {
      setTitle('Join the EarnSpace Creator Program');
      setDescription('Build your custom Facebook profile website & start earning ad revenue share!');
      setDestinationUrl('/register');
      setCtaText('Register Today');
      setPlacement('PERSONAL_SPACE_HEADER');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">EarnSpace Admin Control</div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-indigo-400" /> House Ads & SmartLink Manager
            </h1>
            <p className="text-xs text-slate-400">
              Create manual ads & high-CPM SmartLinks to serve across all personal websites, feeds, and header banners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/ads" className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-xl hover:border-slate-700 transition text-slate-300">
              Control Center
            </Link>
            <Link href="/admin/ads/campaigns" className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20">
              Advertiser Campaigns
            </Link>
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: MANUAL AD CREATOR FORM (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCreateAd} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" />
                  <span>Create & Publish Manual Ad / SmartLink</span>
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  Instant Live
                </span>
              </div>

              {/* Template Shortcuts */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">Quick Preset Templates:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('adsterra')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    ⚡ Adsterra SmartLink
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('cpa')}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    🎯 CPA SmartLink
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('promo')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    📢 Platform Promo
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300">Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Exclusive High Yield Deal"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description copy..."
                    className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Destination / SmartLink URL *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://www.highratedcpmgate.com/..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Media Banner Image URL</label>
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">CTA Button Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="Claim Bonus Now"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Target Placement</label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="all">All Placements (Site-wide)</option>
                      <option value="PERSONAL_SPACE_HEADER">Personal Space Header Banner</option>
                      <option value="PERSONAL_SPACE_CONTENT">Feed Content Stream</option>
                      <option value="PERSONAL_SPACE_SIDEBAR">Sidebar Sponsored Box</option>
                      <option value="feed">Social Feed Stream</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Priority (1 = Highest)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{saving ? 'Publishing Live...' : 'Publish House Ad / SmartLink Live'}</span>
              </button>
            </form>
          </div>

          {/* RIGHT: PUBLISHED HOUSE ADS TABLE (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center justify-between">
                <span>Active Published House Ads ({houseAds.length})</span>
                <span className="text-xs text-emerald-400 font-bold">Live Status</span>
              </h3>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading house ads...</div>
              ) : houseAds.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-2">
                  <Megaphone className="w-8 h-8 mx-auto text-indigo-400" />
                  <p className="font-bold text-white">No custom house ads published yet.</p>
                  <p>Use the form on the left to create and publish manual ads or SmartLinks.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {houseAds.map((ad) => (
                    <div key={ad.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">{ad.title}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {ad.placement.toUpperCase()}
                        </span>
                      </div>

                      {ad.description && <p className="text-[11px] text-slate-400 line-clamp-2">{ad.description}</p>}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                        <a
                          href={ad.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[180px]"
                        >
                          <Link2 className="w-3 h-3" />
                          <span className="truncate">{ad.destinationUrl}</span>
                        </a>
                        <span className="text-slate-500 font-bold">Priority #{ad.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
