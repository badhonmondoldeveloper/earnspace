'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Target, ArrowUpRight, CheckCircle2, DollarSign } from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedMsg, setJoinedMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/campaigns')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCampaigns(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (campaignId: string) => {
    try {
      const res = await fetch('/api/v1/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinedMsg('Successfully joined campaign! Check your active deliverables.');
        setTimeout(() => setJoinedMsg(''), 3500);
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-500" />
            <span>Creator Campaign Marketplace</span>
          </h1>
          <p className="text-xs text-slate-500">Browse verified partner campaigns, complete deliverables, and earn creator rewards</p>
        </div>

        {joinedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{joinedMsg}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 p-8 text-center text-xs text-slate-400">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No active campaigns available right now. Check back soon for new brand partnerships!
            </div>
          ) : (
            campaigns.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">{c.campaignType} Campaign</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.name}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    +${c.rewardAmount.toFixed(2)} Reward
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Budget Cap: ${c.budget.toFixed(2)}</span>
                  <button
                    onClick={() => handleJoin(c.id)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition flex items-center gap-1"
                  >
                    <span>Join Campaign</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

