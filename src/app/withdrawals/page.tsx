'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CreditCard, Plus, ArrowRight, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function WithdrawalsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New method state
  const [provider, setProvider] = useState('bkash');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [accountName, setAccountName] = useState('');
  const [addingMethod, setAddingMethod] = useState(false);

  // New request state
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [amount, setAmount] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/v1/withdrawals')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
          if (resData.data.methods?.length > 0) {
            setSelectedMethodId(resData.data.methods[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountIdentifier.trim()) return;

    setAddingMethod(true);
    setError('');
    try {
      const res = await fetch('/api/v1/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_method', provider, accountIdentifier, accountName }),
      });
      const resData = await res.json();
      if (resData.success) {
        setAccountIdentifier('');
        setAccountName('');
        fetchData();
      } else {
        setError(resData.message || 'Failed to add method');
      }
    } catch (e) {
    } finally {
      setAddingMethod(false);
    }
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethodId || !amount) return;

    setRequesting(true);
    setMsg('');
    setError('');
    try {
      const res = await fetch('/api/v1/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalMethodId: selectedMethodId, amount }),
      });
      const resData = await res.json();
      if (resData.success) {
        setMsg('Withdrawal requested successfully! Reserved funds are under review.');
        setAmount('');
        fetchData();
      } else {
        setError(resData.message || 'Withdrawal failed');
      }
    } catch (e) {
    } finally {
      setRequesting(false);
    }
  };

  const methods = data?.methods || [];
  const requests = data?.requests || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-500" />
            <span>Withdrawals & Settlement Hub</span>
          </h1>
          <p className="text-xs text-slate-500">Configure payout destinations (bKash, Nagad, Bank) and request withdrawals</p>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Request Withdrawal Form */}
          <form onSubmit={handleRequestWithdrawal} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Request Payout</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Select Payout Destination</label>
              {methods.length === 0 ? (
                <p className="text-xs text-slate-400">No payout method added yet. Add one below.</p>
              ) : (
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {methods.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.provider.toUpperCase()} — {m.accountIdentifier} ({m.accountName || 'Primary'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Withdrawal Amount ($ USD)</label>
              <input
                type="number"
                min="10"
                max="5000"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum $10.00"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={requesting || methods.length === 0 || !amount}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{requesting ? 'Processing...' : 'Submit Withdrawal Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Add Payout Method */}
          <form onSubmit={handleAddMethod} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Payout Destination</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="bkash">bKash (Mobile Wallet)</option>
                <option value="nagad">Nagad (Mobile Wallet)</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Account / Phone / IBAN</label>
              <input
                type="text"
                required
                value={accountIdentifier}
                onChange={(e) => setAccountIdentifier(e.target.value)}
                placeholder="e.g. 01700000000 or Bank AC Number"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Account Name (Optional)</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account Holder Name"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={addingMethod || !accountIdentifier.trim()}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-100 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Payout Destination</span>
            </button>
          </form>
        </div>

        {/* Withdrawal History Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Withdrawal History</h3>

          {requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No withdrawal requests submitted yet.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((req: any) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ${req.amount.toFixed(2)} via {req.withdrawalMethod?.provider?.toUpperCase()} ({req.withdrawalMethod?.accountIdentifier})
                    </span>
                    <span className="text-[10px] text-slate-400 block">{new Date(req.createdAt).toLocaleString()}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      req.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {req.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

