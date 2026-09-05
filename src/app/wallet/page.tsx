'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, History, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/wallet')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const wallet = data?.wallet || { availableBalance: 0, pendingBalance: 0, lifetimeEarned: 0, lifetimeWithdrawn: 0 };
  const transactions = data?.transactions || [];
  const minThreshold = 10000;
  const isEligibleForWithdrawal = wallet.availableBalance >= minThreshold;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              <WalletIcon className="w-6 h-6 text-indigo-400" />
              <span>Creator Wallet Ledger & Balances</span>
            </h1>
            <p className="text-xs text-slate-400">Append-only financial ledger log with ৳10,000 threshold requirement</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wallet/payout-methods"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
            >
              💳 Payout Methods
            </Link>
            <Link
              href="/withdrawals"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </Link>
          </div>
        </div>

        {/* ৳10,000 Minimum Payout Threshold Progress Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🇧🇩</span> Minimum Withdrawal Threshold: ৳10,000
              </h3>
              <p className="text-xs text-slate-300">
                {isEligibleForWithdrawal
                  ? 'Congratulations! You have reached the minimum payout threshold and can request withdrawal.'
                  : `Your current available balance is ৳${wallet.availableBalance.toLocaleString()}. You need ৳${(minThreshold - wallet.availableBalance).toLocaleString()} more to reach eligibility.`}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                isEligibleForWithdrawal
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {isEligibleForWithdrawal ? 'Eligible for Payout' : 'Below Threshold'}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.floor((wallet.availableBalance / minThreshold) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-400">Available Balance</span>
            <p className="text-3xl font-extrabold text-indigo-400">৳{wallet.availableBalance.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-400">Pending Settlement</span>
            <p className="text-2xl font-bold text-amber-400">৳{wallet.pendingBalance.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-400">Lifetime Earned</span>
            <p className="text-2xl font-bold text-white">৳{wallet.lifetimeEarned.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-400">Lifetime Withdrawn</span>
            <p className="text-2xl font-bold text-white">৳{wallet.lifetimeWithdrawn.toLocaleString()}</p>
          </div>
        </div>

        {/* Ledger Transaction History */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Append-Only Financial Ledger Log</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Strict Idempotency Protected</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading ledger transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No transactions recorded in ledger yet.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => {
                const isCredit = ['earning', 'referral', 'bonus', 'refund', 'fan_support'].includes(tx.type);
                return (
                  <div key={tx.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCredit ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(tx.createdAt).toLocaleString()} • Idempotency: {tx.idempotencyKey.substring(0, 18)}...</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-extrabold text-sm block ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}৳{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Balance: ৳{tx.balanceAfter.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
