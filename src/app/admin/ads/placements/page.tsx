'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminAdPlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/ads/placements')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setPlacements(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/ads" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Ads Control Center
            </Link>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-400" /> Placement Management UI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure frequency rules, target slots, format enums, and provider eligibility.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading placement slots...</div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800">
              {placements.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-900/80 transition">
                  <div>
                    <div className="text-sm font-mono font-bold text-white">{p.slotName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Provider: <span className="text-amber-400 font-semibold">{p.provider?.name || 'Generic'}</span> • Format: {p.format} • Frequency: Every {p.frequency} items
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    {p.status}
                  </span>
                </div>
              ))}
              {placements.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">No placement slots configured yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
