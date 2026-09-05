'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function AdminRevenueProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [providerKey, setProviderKey] = useState('');
  const [priority, setPriority] = useState('1');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/revenue/providers');
      const json = await res.json();
      if (res.ok) {
        setProviders(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          providerKey,
          priority: parseInt(priority),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create provider');

      setMsg('Revenue provider added successfully!');
      setName('');
      setProviderKey('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>🔌</span> Admin Ad & Revenue Providers Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage multi-ad provider adapters, placement priorities, fallback chains, and health status.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            ← Back to Admin
          </Link>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-sm">
            {msg}
          </div>
        )}

        {/* Add Provider Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Add New Ad / Revenue Provider
          </h2>

          <form onSubmit={handleCreateProvider} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Provider Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Google AdSense"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Provider Key (Unique) *</label>
              <input
                type="text"
                value={providerKey}
                onChange={(e) => setProviderKey(e.target.value)}
                placeholder="google_adsense"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fallback Priority Order</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                min={1}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30"
              >
                Create Revenue Provider
              </button>
            </div>
          </form>
        </div>

        {/* Existing Providers List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Active Provider Fallback Chain
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-500">Loading providers...</div>
            ) : providers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No providers configured yet.</div>
            ) : (
              providers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                        key: {p.providerKey}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {p.healthStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Priority: #{p.priority} • Credentials: [PROTECTED & SECURED]
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-300">
                    {p.status}
                  </span>
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

