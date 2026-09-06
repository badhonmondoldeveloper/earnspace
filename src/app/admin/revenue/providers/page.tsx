'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Code, Power, Trash2, Edit3, Plus, ShieldCheck, Sparkles, Check, X } from 'lucide-react';

export default function AdminRevenueProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [providerKey, setProviderKey] = useState('');
  const [priority, setPriority] = useState('1');
  const [adCodeSnippet, setAdCodeSnippet] = useState('');
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['SOCIAL_FEED_MID', 'SIDEBAR_BANNER']);
  const [msg, setMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editProviderKey, setEditProviderKey] = useState('');
  const [editPriority, setEditPriority] = useState('1');
  const [editAdCodeSnippet, setEditAdCodeSnippet] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const availablePlacements = [
    { id: 'SOCIAL_FEED_TOP', label: 'Feed Top Sponsored' },
    { id: 'SOCIAL_FEED_MID', label: 'Feed Main Feed Sponsored' },
    { id: 'STORY_AD', label: 'Story Rail Ad' },
    { id: 'SIDEBAR_BANNER', label: 'Right Sidebar Sponsored' },
    { id: 'VIDEO_PRE_ROLL', label: 'Watch Video Pre-roll' },
    { id: 'REELS_FEED', label: 'Reels Vertical Interstitial' },
    { id: 'BLOG_INLINE', label: 'Article Inline Banner' },
    { id: 'PERSONAL_SPACE_SIDEBAR', label: 'Personal Website Banner' },
    { id: 'all', label: 'All Placements (Universal)' },
  ];

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
          providerKey: providerKey.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          priority: parseInt(priority),
          adCodeSnippet: adCodeSnippet.trim() || null,
          placementsJson: JSON.stringify(selectedPlacements),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to create provider');

      setMsg('Ad Provider added successfully!');
      setName('');
      setProviderKey('');
      setAdCodeSnippet('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleToggleStatus = async (provider: any) => {
    const newStatus = provider.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad provider?')) return;
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (p: any) => {
    setEditingProvider(p);
    setEditName(p.name);
    setEditProviderKey(p.providerKey);
    setEditPriority(p.priority?.toString() || '1');
    setEditAdCodeSnippet(p.adCodeSnippet || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${editingProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          providerKey: editProviderKey,
          priority: parseInt(editPriority),
          adCodeSnippet: editAdCodeSnippet.trim() || null,
        }),
      });
      if (res.ok) {
        setEditingProvider(null);
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const togglePlacementChoice = (id: string) => {
    if (selectedPlacements.includes(id)) {
      setSelectedPlacements(selectedPlacements.filter((p) => p !== id));
    } else {
      setSelectedPlacements([...selectedPlacements, id]);
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
              <Code className="w-7 h-7 text-indigo-400" />
              <span>Ad Provider & Network Code Snippet Control Center</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Add external ad networks (Google AdSense, Adsterra, Meta Audience Network, Ezoic, Meta tags) via HTML/JS code snippets. Toggle status On/Off and set priority order.
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
          <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-sm flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Provider Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Add New Ad Provider / Network
          </h2>

          <form onSubmit={handleCreateProvider} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adsterra Native Banner"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Key (Unique) *</label>
                <input
                  type="text"
                  value={providerKey}
                  onChange={(e) => setProviderKey(e.target.value)}
                  placeholder="e.g. adsterra_banner"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Priority (1 = Highest)</label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  min={1}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Code Snippet Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>HTML / JavaScript / Meta Tag Snippet Code</span>
                <span className="text-[10px] text-slate-500 font-mono">Accepts &lt;script&gt;, &lt;meta&gt;, &lt;div&gt; ad unit codes</span>
              </label>
              <textarea
                value={adCodeSnippet}
                onChange={(e) => setAdCodeSnippet(e.target.value)}
                placeholder="Paste code snippet from Google AdSense, Adsterra, Media.net, Ezoic, or custom ad tags..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Placement Selectors */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Target Placements</label>
              <div className="flex flex-wrap gap-2">
                {availablePlacements.map((plc) => {
                  const isChecked = selectedPlacements.includes(plc.id);
                  return (
                    <button
                      key={plc.id}
                      type="button"
                      onClick={() => togglePlacementChoice(plc.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Ad Provider
              </button>
            </div>
          </form>
        </div>

        {/* Existing Providers Table */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Active Provider Fallback Chain
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading ad providers...</div>
            ) : providers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No ad providers configured yet.</div>
            ) : (
              providers.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        key: {p.providerKey}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Priority #{p.priority}
                      </span>
                    </div>

                    {p.adCodeSnippet && (
                      <div className="text-[11px] text-indigo-400/80 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800/80 max-w-md truncate">
                        {p.adCodeSnippet}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        p.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{p.status === 'active' ? 'ON (Active)' : 'OFF (Paused)'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                      title="Edit Provider"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteProvider(p.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete Provider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Ad Provider</h3>
              <button onClick={() => setEditingProvider(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                <input
                  type="number"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Code Snippet (HTML / JS Script)</label>
                <textarea
                  value={editAdCodeSnippet}
                  onChange={(e) => setEditAdCodeSnippet(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
