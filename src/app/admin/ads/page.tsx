'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, BarChart3, Layers, Settings, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function UltraProAdminAdsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/ads/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Nav Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">EarnSpace Admin Control</div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" /> Ultra-Pro Ads Control Center
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/revenue/providers" className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg hover:border-slate-700 transition">
              Ad Providers
            </Link>
            <Link href="/admin/ads/placements" className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-lg hover:border-slate-700 transition">
              Placements
            </Link>
            <Link href="/admin/ads/campaigns" className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition">
              Direct Campaigns
            </Link>
          </div>
        </div>

        {/* Revenue Cards */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading admin revenue metrics...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">Total Gross Estimated Revenue</div>
              <div className="text-2xl font-black text-white mt-2">
                ${data?.revenueBreakdown?.grossEstimated || '0.00'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">Platform Net Revenue</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                ${data?.revenueBreakdown?.platformNet || '0.00'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">Creator Revenue Liabilities</div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                ${data?.revenueBreakdown?.creatorLiabilities || '0.00'}
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">Verified Cleared Revenue</div>
              <div className="text-2xl font-black text-cyan-400 mt-2">
                ${data?.revenueBreakdown?.verified || '0.00'}
              </div>
            </div>
          </div>
        )}

        {/* Admin Navigation Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/revenue/providers" className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 group transition">
            <div className="flex items-center justify-between font-bold text-white group-hover:text-amber-400">
              <span className="flex items-center gap-2"><Settings className="w-4 h-4 text-emerald-400" /> Manage Ad Providers</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400">Configure Google AdSense, Adsterra, direct fallback chains, and secret isolation.</p>
          </Link>

          <Link href="/admin/ads/placements" className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 group transition">
            <div className="flex items-center justify-between font-bold text-white group-hover:text-amber-400">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-amber-400" /> Placement Rules & Slots</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400">Set ad frequency caps, cooldown periods, device rules, and content restrictions.</p>
          </Link>

          <Link href="/admin/ads/campaigns" className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 group transition">
            <div className="flex items-center justify-between font-bold text-white group-hover:text-amber-400">
              <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-purple-400" /> Direct Advertiser Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400">Review, approve, pause, or reject direct advertiser campaign creatives and budget pacing.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

