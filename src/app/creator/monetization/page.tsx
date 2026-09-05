'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function CreatorMonetizationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMonetization();
  }, []);

  const fetchMonetization = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/creator/monetization');
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

  const handleApply = async (programId: string) => {
    try {
      setApplyingId(programId);
      const res = await fetch('/api/v1/creator/monetization/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId }),
      });
      const json = await res.json();
      if (res.ok) {
        setMsg('Application submitted successfully for review!');
        fetchMonetization();
      } else {
        setMsg(`Application error: ${json.error}`);
      }
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setApplyingId(null);
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
              <span>💰</span> Creator Monetization Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Apply for revenue programs, track program eligibility, and manage your earning streams.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/creator/earnings"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
            >
              📈 Detailed Earnings
            </Link>
            <Link
              href="/wallet"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
            >
              💳 Wallet & Payouts
            </Link>
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-sm">
            {msg}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Programs
                </span>
                <p className="text-3xl font-extrabold text-indigo-400">
                  {data?.totalEnrolled || 0}
                </p>
                <p className="text-xs text-slate-500">Currently generating revenue</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Applications Pending
                </span>
                <p className="text-3xl font-extrabold text-amber-400">
                  {data?.totalApplications || 0}
                </p>
                <p className="text-xs text-slate-500">Under admin review</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Payout Threshold
                </span>
                <p className="text-3xl font-extrabold text-emerald-400">
                  ৳10,000
                </p>
                <p className="text-xs text-slate-500">Minimum balance requirement</p>
              </div>
            </div>

            {/* Programs List */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
                Monetization Programs & Opportunities
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data?.programs?.map((prog: any) => (
                  <div
                    key={prog.id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-white">{prog.name}</h3>
                        <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                          {prog.revenueSharePercent}% Creator Share
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

                      {/* Eligibility Status Box */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <span className="font-semibold text-slate-400 block">Eligibility Status:</span>
                        {prog.eligibility?.isEligible ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            ✓ Eligible to Join
                          </span>
                        ) : (
                          <div className="space-y-1 text-amber-400">
                            <span className="font-semibold">Requirements Remaining:</span>
                            <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                              {prog.eligibility?.missingRequirements?.map((r: string, idx: number) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Pending Period: {prog.pendingDays} days
                      </span>

                      {prog.isEnrolled ? (
                        <span className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active Member
                        </span>
                      ) : prog.applicationStatus === 'pending' ? (
                        <span className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                          Application Pending
                        </span>
                      ) : (
                        <button
                          disabled={!prog.eligibility?.isEligible || applyingId === prog.id}
                          onClick={() => handleApply(prog.id)}
                          className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 shadow-md shadow-indigo-600/30"
                        >
                          {applyingId === prog.id ? 'Applying...' : 'Apply Now'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

