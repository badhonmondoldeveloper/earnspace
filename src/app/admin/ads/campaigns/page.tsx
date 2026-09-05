'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Check, X, Pause } from 'lucide-react';

export default function AdminAdCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = () => {
    fetch('/api/v1/admin/ads/campaigns')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setCampaigns(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleUpdateStatus = async (campaignId: string, status: string) => {
    try {
      const res = await fetch('/api/v1/admin/ads/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, status }),
      });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/ads" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Ads Control Center
            </Link>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-purple-400" /> Direct Advertiser Campaigns
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review campaign creatives, approve budgets, and monitor advertiser campaigns.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading campaigns...</div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {campaigns.map((c) => (
              <div key={c.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{c.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.advertiser?.companyName || 'Direct Advertiser'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Placement: <span className="text-amber-400 font-semibold">{c.placement}</span> • Budget: ${c.budget} (${c.dailyBudget}/day) • Status: <span className="font-bold text-emerald-400">{c.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {c.status === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'paused')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                  )}
                  {c.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold text-xs rounded-lg flex items-center gap-1 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                </div>
              </div>
            ))}

            {campaigns.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">No direct advertiser campaigns submitted yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
