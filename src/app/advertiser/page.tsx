'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Megaphone, Plus, BarChart, ShieldCheck } from 'lucide-react';

export default function AdvertiserPage() {
  const [companyName, setCompanyName] = useState('');
  const [adName, setAdName] = useState('');
  const [budget, setBudget] = useState('100');
  const [placement, setPlacement] = useState('feed');
  const [msg, setMsg] = useState('');

  const handleSubmitAd = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Ad campaign submitted for admin review! Verification is in progress.');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-brand-500" />
            <span>Advertiser Portal</span>
          </h1>
          <p className="text-xs text-slate-500">Launch platform advertising campaigns across feeds, blogs, and creator spaces</p>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmitAd} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Platform Ad Campaign</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Company / Brand Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Tech"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Ad Campaign Title</label>
            <input
              type="text"
              required
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              placeholder="Campaign Title"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Budget ($ USD)</label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Placement Target</label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="feed">Social Feed Placement</option>
                <option value="blog">Blog Portal Banner</option>
                <option value="explore">Explore Discovery Grid</option>
                <option value="sidebar">Sidebar Sponsored Placement</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20"
          >
            Submit Ad for Review
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

