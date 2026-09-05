'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, History, CreditCard } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <WalletIcon className="w-6 h-6 text-brand-500" />
              <span>Wallet Ledger & Balances</span>
            </h1>
            <p className="text-xs text-slate-500">Immutable ledger transaction log and real-time wallet balances</p>
          </div>

          <Link
            href="/withdrawals"
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 flex items-center gap-1.5 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </Link>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-sky-500 text-white shadow-lg space-y-2">
            <span className="text-xs font-medium text-white/80">Available Balance</span>
            <p className="text-3xl font-extrabold">${wallet.availableBalance.toFixed(2)}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-500">Pending Settlement</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">${wallet.pendingBalance.toFixed(2)}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-500">Lifetime Earned</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">${wallet.lifetimeEarned.toFixed(2)}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-500">Lifetime Withdrawn</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">${wallet.lifetimeWithdrawn.toFixed(2)}</p>
          </div>
        </div>

        {/* Ledger Transaction History */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-brand-500" />
              <span>Append-Only Ledger Log</span>
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
                const isCredit = ['earning', 'referral', 'bonus', 'refund'].includes(tx.type);
                return (
                  <div key={tx.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCredit ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(tx.createdAt).toLocaleString()} • Idempotency: {tx.idempotencyKey.substring(0, 18)}...</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-extrabold text-sm block ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Balance: ${tx.balanceAfter.toFixed(2)}</span>
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

