'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, BarChart3, TrendingUp, ShieldCheck, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';

export default function CreatorAdAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/creator/monetization/ads')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/creator/monetization" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Monetization Hub
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" /> Creator Ad Performance & Placements
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Transparent breakdown of ad impressions, RPM, eCPM, and verified earnings on your videos, posts & space.
            </p>
          </div>
        </div>

        {/* Metrics Overview */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading ad analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Estimated Gross Ad Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">
                  ${data?.metrics?.totalEstimatedRevenue || '0.00'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Pending verification cycle</div>
              </div>

              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Creator Verified Share (70%)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-400 mt-2">
                  ${data?.metrics?.totalCreatorShare || '0.00'}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for monthly payout
                </div>
              </div>

              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Ad Impression Events</span>
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-2">
                  {data?.metrics?.totalEvents || 0}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Total verified impressions</div>
              </div>

              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Estimated RPM (Per 1k Views)</span>
                  <DollarSign className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-purple-400 mt-2">
                  ${data?.metrics?.estimatedRPM || '0.00'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Average eCPM rate</div>
              </div>
            </div>

            {/* Placements */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Eligible Ad Placement Slots
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data?.eligiblePlacements?.map((slot: string) => (
                  <div key={slot} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">{slot}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

