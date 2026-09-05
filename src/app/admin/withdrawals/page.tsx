'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    fetch('/api/v1/admin/withdrawals')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    const reason = prompt(`Enter reason for ${action}ing withdrawal request:`);
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Withdrawal ${action}ed successfully`);
        fetchRequests();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-500" />
          <span>Withdrawal Review & Approval Hub</span>
        </h1>
        <p className="text-xs text-slate-400">Review pending creator withdrawal requests, verify payout accounts, and execute transactional settlements</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Requests Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading withdrawal requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No withdrawal requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Destination Method</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Requested At</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-850">
                    <td className="py-3 font-bold text-white">@{r.user?.username}</td>
                    <td className="py-3 font-extrabold text-emerald-400">${r.amount.toFixed(2)}</td>
                    <td className="py-3 text-slate-300">
                      <span className="font-semibold uppercase">{r.withdrawalMethod?.provider}</span> ({r.withdrawalMethod?.accountIdentifier})
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-400'
                            : r.status === 'rejected'
                            ? 'bg-rose-950 text-rose-400'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="py-3 text-right space-x-2">
                      {r.status === 'requested' || r.status === 'under_review' ? (
                        <>
                          <button
                            onClick={() => handleAction(r.id, 'approve')}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                          >
                            Approve & Pay
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'reject')}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 transition"
                          >
                            Reject & Reverse
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Finalized</span>
                      )}
                    </td>
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

