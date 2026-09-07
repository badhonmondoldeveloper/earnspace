'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Wallet,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Plus,
  Minus,
  Smartphone,
  Copy,
  DollarSign,
} from 'lucide-react';

export default function AdminFinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Manual Adjustment State
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjUserId, setAdjUserId] = useState('');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjNote, setAdjNote] = useState('');
  const [adjType, setAdjType] = useState<'credit' | 'debit'>('credit');
  const [submittingAdj, setSubmittingAdj] = useState(false);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/finance/overview');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleApprovePayment = async (txId: string, defaultAmount: number, username: string) => {
    if (!confirm(`Approve payment and credit ৳${defaultAmount} BDT to user @${username}?`)) {
      return;
    }

    setProcessingId(txId);
    setActionMessage('');

    try {
      const res = await fetch('/api/v1/admin/finance/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE',
          transactionId: txId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMessage(`✅ ${json.message}`);
        fetchFinanceData();
      } else {
        alert(json.message || 'Failed to approve payment');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error approving payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayment = async (txId: string, username: string) => {
    const reason = prompt(`Enter rejection reason for @${username}'s submission (optional):`, 'TrxID mismatch or invalid amount');
    if (reason === null) return; // User cancelled prompt

    setProcessingId(txId);
    setActionMessage('');

    try {
      const res = await fetch('/api/v1/admin/finance/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          transactionId: txId,
          rejectionReason: reason,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMessage(`❌ ${json.message}`);
        fetchFinanceData();
      } else {
        alert(json.message || 'Failed to reject payment');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error rejecting payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleManualAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjUserId || !adjAmount) return;

    setSubmittingAdj(true);
    const finalAmount = adjType === 'credit' ? Math.abs(parseFloat(adjAmount)) : -Math.abs(parseFloat(adjAmount));

    try {
      const res = await fetch('/api/v1/admin/finance/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MANUAL_ADJUSTMENT',
          userId: adjUserId,
          amount: finalAmount,
          note: adjNote || 'Admin manual balance adjustment',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMessage(`✅ ${json.message}`);
        setShowAdjModal(false);
        setAdjUserId('');
        setAdjAmount('');
        setAdjNote('');
        fetchFinanceData();
      } else {
        alert(json.message || 'Failed to adjust balance');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to process adjustment');
    } finally {
      setSubmittingAdj(false);
    }
  };

  const handleToggleFreeze = async (userId: string, currentFreezeStatus: boolean) => {
    const newStatus = !currentFreezeStatus;
    if (!confirm(`Are you sure you want to ${newStatus ? 'FREEZE' : 'UNFREEZE'} wallet for user ${userId}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/finance/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_FREEZE',
          userId,
          isFrozen: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMessage(`Wallet ${newStatus ? 'frozen' : 'unfrozen'} successfully`);
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const metrics = data?.metrics || {
    totalWallets: 0,
    frozenWallets: 0,
    totalAvailableBalance: 0,
    totalPendingBalance: 0,
    totalLifetimeEarned: 0,
  };
  const reviewQueue = data?.reviewQueue || [];
  const recentTransactions = data?.recentTransactions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
            <span>Admin Finance & Manual Payment Verification Desk</span>
          </h1>
          <p className="text-xs text-slate-400">
            Review bKash/Nagad/Rocket manual deposits, approve & credit user wallets, and manage balance adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdjModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Direct Balance Adjustment (+ / -)</span>
          </button>
          <button
            onClick={fetchFinanceData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total User Wallets</span>
          <div className="text-2xl font-black text-white">{metrics.totalWallets}</div>
          <p className="text-[10px] text-slate-500">{metrics.frozenWallets} Frozen / Restricted</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Total System Available</span>
          <div className="text-2xl font-black text-emerald-400">৳{metrics.totalAvailableBalance.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Spendable / withdrawable user funds</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase">Pending Verification Queue</span>
          <div className="text-2xl font-black text-amber-400">{reviewQueue.length}</div>
          <p className="text-[10px] text-slate-500">Awaiting Admin manual sign-off</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase">Total Lifetime Earned</span>
          <div className="text-2xl font-black text-indigo-400">৳{metrics.totalLifetimeEarned.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Cumulative platform gross volume</p>
        </div>
      </div>

      {/* 1. MANUAL DEPOSIT & VERIFICATION QUEUE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Manual Payment Verification Queue ({reviewQueue.length})</span>
          </h2>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">
            Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Sender Phone</th>
                <th className="py-3 px-4">Transaction ID (TrxID)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {reviewQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    🎉 No deposit transactions currently pending manual review. All clear!
                  </td>
                </tr>
              ) : (
                reviewQueue.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">@{tx.user?.username || tx.userId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.provider === 'BKASH'
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : tx.provider === 'NAGAD'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {tx.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{tx.senderNumber || 'N/A'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300 select-all">{tx.transactionId}</td>
                    <td className="py-3 px-4 font-black text-emerald-400 text-sm">৳{tx.amount}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={processingId === tx.id}
                          onClick={() => handleApprovePayment(tx.id, tx.amount, tx.user?.username || 'user')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Credit ৳{tx.amount}
                        </button>
                        <button
                          disabled={processingId === tx.id}
                          onClick={() => handleRejectPayment(tx.id, tx.user?.username || 'user')}
                          className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-700 flex items-center gap-1 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. RECENT DETECTED TRANSACTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-400" />
          <span>Payment History Log ({recentTransactions.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Wallet Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {recentTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">@{tx.user?.username || tx.userId.substring(0, 8)}</td>
                  <td className="py-3 px-4 font-bold text-indigo-400">{tx.provider}</td>
                  <td className="py-3 px-4 font-mono">{tx.transactionId}</td>
                  <td className="py-3 px-4 font-bold text-white">৳{tx.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'VERIFIED' || tx.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleFreeze(tx.userId, false)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg border border-slate-700 flex items-center gap-1 ml-auto"
                    >
                      <Lock className="w-3 h-3 text-rose-400" />
                      <span>Freeze Wallet</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIRECT BALANCE ADJUSTMENT MODAL */}
      {showAdjModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-400" /> Admin Direct Balance Adjustment
              </h3>
              <button
                onClick={() => setShowAdjModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualAdjustmentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1">User ID or Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user_id or badhon"
                  value={adjUserId}
                  onChange={(e) => setAdjUserId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjType('credit')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      adjType === 'credit'
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Credit (+ BDT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjType('debit')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      adjType === 'debit'
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Minus className="w-4 h-4" /> Debit (- BDT)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Amount (BDT ৳)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Note / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Manual bKash cash-in verification / support credit"
                  value={adjNote}
                  onChange={(e) => setAdjNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAdj}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {submittingAdj ? 'Processing Balance Change...' : 'Apply Balance Change'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
