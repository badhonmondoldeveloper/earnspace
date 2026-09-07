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
  Search,
  Eye,
  FileText,
  Smartphone,
} from 'lucide-react';

export default function AdminFinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
            <span>Admin Finance & Reconciliation Command Center</span>
          </h1>
          <p className="text-xs text-slate-400">Multi-user wallet management, manual transaction review queue, fraud alerts & wallet freeze controls</p>
        </div>

        <button onClick={fetchFinanceData} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto border border-slate-700">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh System</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Cards */}
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
          <span className="text-[10px] font-bold text-amber-400 uppercase">Total Pending Holds</span>
          <div className="text-2xl font-black text-amber-400">৳{metrics.totalPendingBalance.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Unsettled or risk review holds</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase">Manual Review Queue</span>
          <div className="text-2xl font-black text-indigo-400">{reviewQueue.length}</div>
          <p className="text-[10px] text-slate-500">Transactions requiring admin sign-off</p>
        </div>
      </div>

      {/* 1. MANUAL REVIEW QUEUE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>High Risk / Manual Review Transaction Queue ({reviewQueue.length})</span>
          </h2>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">Fraud Inspection Required</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {reviewQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">No transactions currently pending manual review. Clean!</td>
                </tr>
              ) : (
                reviewQueue.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">@{tx.user?.username || tx.userId}</td>
                    <td className="py-3 px-4 font-bold text-indigo-400">{tx.provider}</td>
                    <td className="py-3 px-4 font-mono">{tx.transactionId}</td>
                    <td className="py-3 px-4 font-bold text-white">৳{tx.amount}</td>
                    <td className="py-3 px-4 font-bold text-rose-400">{tx.riskScore} / 100</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full">{tx.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleFreeze(tx.userId, false)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg shadow-sm"
                      >
                        Inspect & Action
                      </button>
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
          <span>Ingested Transaction Feed ({recentTransactions.length})</span>
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
                <th className="py-3 px-4 text-right">Wallet Freeze Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {recentTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{new Date(tx.createdAt).toLocaleTimeString()}</td>
                  <td className="py-3 px-4 font-bold text-white">@{tx.user?.username || tx.userId.substring(0, 8)}</td>
                  <td className="py-3 px-4 font-bold text-indigo-400">{tx.provider}</td>
                  <td className="py-3 px-4 font-mono">{tx.transactionId}</td>
                  <td className="py-3 px-4 font-bold text-white">৳{tx.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleFreeze(tx.userId, false)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg border border-slate-700 flex items-center gap-1 ml-auto"
                    >
                      <Lock className="w-3 h-3 text-rose-400" />
                      <span>Freeze User Wallet</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
