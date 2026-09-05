'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function CreatorEarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/creator/earnings');
      const json = await res.json();
      if (res.ok) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span>📈</span> Creator Earnings & Traceability Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Transparent, itemized audit record of every earning, revenue split, and settlement status.
            </p>
          </div>
          <Link
            href="/wallet"
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
          >
            💳 Go to Wallet
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Gross Revenue Generated
                </span>
                <p className="text-3xl font-extrabold text-white">
                  ৳{(data?.summary?.totalGross || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Before provider fees</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Net Creator Share
                </span>
                <p className="text-3xl font-extrabold text-indigo-400">
                  ৳{(data?.summary?.totalUserShare || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Your total eligible share</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Settlements
                </span>
                <p className="text-3xl font-extrabold text-amber-400">
                  ৳{(data?.summary?.pendingShare || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">In settlement hold period</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Approved & Available
                </span>
                <p className="text-3xl font-extrabold text-emerald-400">
                  ৳{(data?.summary?.approvedShare || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Ready in wallet</p>
              </div>
            </div>

            {/* Traceable Earnings Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Itemized Traceable Earnings Log
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Event Ref</th>
                      <th className="p-3">Gross</th>
                      <th className="p-3">Fees</th>
                      <th className="p-3">Split Rule</th>
                      <th className="p-3">Creator Share</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data?.items?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          No earnings recorded yet.
                        </td>
                      </tr>
                    ) : (
                      data?.items?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-950/50 transition">
                          <td className="p-3 font-medium text-white">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">
                            {item.revenueEvent?.externalReference || item.id.slice(0, 8)}
                          </td>
                          <td className="p-3">৳{item.grossAmount}</td>
                          <td className="p-3 text-slate-400">৳{item.fees}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px]">
                              {item.rule?.userSharePercent}% / {item.rule?.platformSharePercent}% (v{item.ruleVersion})
                            </span>
                          </td>
                          <td className="p-3 font-bold text-indigo-400">৳{item.userShare}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                item.status === 'approved'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : item.status === 'pending'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
