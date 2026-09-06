'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
    let trxId = '';
    if (action === 'approve') {
      trxId = prompt('Enter bKash/Nagad Transaction ID (TrxID) for this payout:') || '';
    }
    const reason = prompt(`Enter admin audit note for ${action}ing withdrawal request:`) || 'Processed by admin';

    try {
      const res = await fetch('/api/v1/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action, reason, adminNote: trxId ? `TrxID: ${trxId}` : reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Withdrawal ${action}ed successfully! ${trxId ? `TrxID: ${trxId}` : ''}`);
        fetchRequests();
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          <span>bKash & Nagad Payout Execution Desk</span>
        </h1>
        <p className="text-xs text-slate-400">Review pending creator withdrawal requests, verify payout accounts, and submit Transaction IDs (TrxID)</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Requests Table */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading withdrawal requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No withdrawal requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Amount (৳ BDT)</th>
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
                    <td className="py-3 font-black text-emerald-400">৳{r.amount.toLocaleString()} BDT</td>
                    <td className="py-3 text-slate-300">
                      <span className="font-bold uppercase text-indigo-300">{r.withdrawalMethod?.provider}</span> ({r.withdrawalMethod?.accountIdentifier})
                      {r.adminNote && <span className="text-[10px] text-slate-400 block">{r.adminNote}</span>}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'paid' || r.status === 'processed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : r.status === 'rejected'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
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
                            className="px-3 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-sm"
                          >
                            Approve & Enter TrxID
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'reject')}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 transition"
                          >
                            Reject
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
