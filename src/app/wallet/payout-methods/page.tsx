'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function PayoutMethodsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [provider, setProvider] = useState('bkash');
  const [identifier, setIdentifier] = useState('');
  const [accountName, setAccountName] = useState('');
  const [binanceType, setBinanceType] = useState('uid');
  const [binanceNetwork, setBinanceNetwork] = useState('TRC20');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/wallet/payout-methods');
      const json = await res.json();
      if (res.ok) {
        setMethods(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/v1/wallet/payout-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          accountIdentifier: identifier,
          accountName,
          metadata: provider === 'binance' ? { type: binanceType, network: binanceNetwork } : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add payout method');

      setMsg('Payout method added successfully!');
      setIdentifier('');
      setAccountName('');
      fetchMethods();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>💳</span> Payout Method Manager
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Add and manage your bKash, Nagad, Rocket, Upay, Bank Account, or Binance payout details.
            </p>
          </div>
          <Link
            href="/wallet"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            ← Back to Wallet
          </Link>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-sm">
            {msg}
          </div>
        )}

        {/* Add Payout Method Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Add New Payout Method
          </h2>

          <form onSubmit={handleAddMethod} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Payment Provider *</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value="bkash">bKash (Mobile Wallet)</option>
                  <option value="nagad">Nagad (Mobile Wallet)</option>
                  <option value="rocket">Rocket (Mobile Wallet)</option>
                  <option value="upay">Upay (Mobile Wallet)</option>
                  <option value="bank">Bank Transfer (Bangladesh)</option>
                  <option value="binance">Binance (UID / Crypto Wallet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Badhon Mondol"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            {/* Provider-Specific Fields */}
            {provider === 'binance' ? (
              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-white">
                    <input
                      type="radio"
                      name="binanceType"
                      value="uid"
                      checked={binanceType === 'uid'}
                      onChange={() => setBinanceType('uid')}
                    />
                    Binance Pay / UID
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white">
                    <input
                      type="radio"
                      name="binanceType"
                      value="wallet"
                      checked={binanceType === 'wallet'}
                      onChange={() => setBinanceType('wallet')}
                    />
                    Blockchain Wallet Address
                  </label>
                </div>

                {binanceType === 'uid' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Binance UID *</label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 123456789"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Network *</label>
                      <select
                        value={binanceNetwork}
                        onChange={(e) => setBinanceNetwork(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                      >
                        <option value="TRC20">TRC20 (Tron)</option>
                        <option value="BEP20">BEP20 (BNB Chain)</option>
                        <option value="ERC20">ERC20 (Ethereum)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Wallet Address *</label>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="TRC20 / EVM address..."
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {provider === 'bank' ? 'Bank Account Number *' : 'Mobile Wallet Number (e.g. 01XXXXXXXXX) *'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={provider === 'bank' ? 'Account Number' : '01712345678'}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving || !identifier}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 shadow-md shadow-indigo-600/30"
            >
              {saving ? 'Saving...' : 'Save Payout Method'}
            </button>
          </form>
        </div>

        {/* Existing Payout Methods List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Saved Payout Destinations
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-500">Loading payout methods...</div>
            ) : methods.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No payout methods added yet.</div>
            ) : (
              methods.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm uppercase">{m.provider}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {m.verificationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Account: {m.accountIdentifierMasked}
                    </p>
                    {m.accountName && (
                      <p className="text-[11px] text-slate-500">Name: {m.accountName}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

