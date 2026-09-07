'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle2, TrendingUp, HelpCircle, ShieldAlert } from 'lucide-react';

export default function EarningsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/earnings')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const items = data?.items || [];
  const metrics = data?.metrics || { pendingTotal: 0, approvedTotal: 0, totalEarningsCount: 0 };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <span>Creator Earnings & Revenue</span>
          </h1>
          <p className="text-xs text-slate-500">Transparent creator revenue splits, pending verification, and settled earnings</p>
        </div>
        <a
          href="/wallet"
          className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 w-fit"
        >
          <span>⚡ Request bKash/Nagad Payout</span>
        </a>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Available Settled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">${metrics.approvedTotal.toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">${metrics.pendingTotal.toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Revenue Events</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.totalEarningsCount}</p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <HelpCircle className="w-4 h-4 text-brand-500" />
          <span>Transparent Earning Policy</span>
        </div>
        <p className="leading-relaxed">
          Pending earnings undergo verification (7-day standard pending window) before settling into your available wallet balance. Artificial or invalid activities are automatically audited and filtered.
        </p>
      </div>

      {/* Itemized Earnings History Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Earnings History</h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading earnings history...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No earning records yet. Participate in campaigns or publish blogs to start earning.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Gross Event</th>
                  <th className="pb-3 font-semibold">User Share (50%)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Pending Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-slate-600 dark:text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">${item.grossAmount.toFixed(2)}</td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">+${item.userShare.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(item.pendingUntil).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

