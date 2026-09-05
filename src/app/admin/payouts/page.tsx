'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function AdminPayoutsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('requested');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchPayouts(filterStatus);
  }, [filterStatus]);

  const fetchPayouts = async (status: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/payouts?status=${status}`);
      const json = await res.json();
      if (res.ok) {
        setRequests(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approve' | 'reject' | 'paid') => {
    try {
      setActionMsg(null);
      const res = await fetch('/api/v1/admin/payouts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          adminNote: `Action ${action} executed by Admin`,
          rejectionReason: action === 'reject' ? 'Failed verification review' : undefined,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setActionMsg(`Payout ${action} recorded successfully!`);
        fetchPayouts(filterStatus);
      } else {
        setActionMsg(`Error: ${json.error}`);
      }
    } catch (err: any) {
      setActionMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>💳</span> Admin Payout Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review, approve, process, or reject creator withdrawal payouts.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            ← Back to Admin
          </Link>
        </div>

        {actionMsg && (
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-sm">
            {actionMsg}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-3 border-b border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
          {['requested', 'under_review', 'approved', 'processing', 'paid', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl uppercase tracking-wider transition ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Withdrawal Requests ({filterStatus.toUpperCase()})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Destination Account</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Requested At</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">
                      Loading withdrawal requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">
                      No withdrawal requests found for this status.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/50 transition">
                      <td className="p-3 font-medium text-white">
                        {r.user?.profile?.fullName || r.user?.username}
                        <span className="block text-[10px] text-slate-400">@{r.user?.username}</span>
                      </td>
                      <td className="p-3 uppercase font-bold text-indigo-400">
                        {r.withdrawalMethod?.provider}
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        {r.withdrawalMethod?.accountIdentifier}
                      </td>
                      <td className="p-3 font-bold text-emerald-400 text-sm">
                        ৳{r.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(r.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-950 text-amber-400 border border-amber-800">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {r.status === 'requested' && (
                            <>
                              <button
                                onClick={() => handleAction(r.id, 'approve')}
                                className="px-3 py-1 text-[11px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(r.id, 'reject')}
                                className="px-3 py-1 text-[11px] font-bold rounded bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {r.status === 'approved' && (
                            <button
                              onClick={() => handleAction(r.id, 'paid')}
                              className="px-3 py-1 text-[11px] font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800 hover:bg-indigo-900 transition"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
