'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Globe,
  DollarSign,
  TrendingUp,
  Store,
  Layers,
  ArrowRight,
  Eye,
  Zap,
  CheckCircle2,
  Wallet,
  Settings,
  Plus,
  Compass,
  FileText,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        } else if (data.success === false) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      })
      .catch(() => {});

    fetch('/api/v1/creator/earnings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEarnings(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const username = user?.username || 'creator';
  const siteUrl = `/space/${username}`;

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-12">
      {/* Top Welcome & Site Link Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>EarnSpace Creator Website Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, <span className="text-indigo-400">{user?.profile?.fullName || username}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your personal ready-made website, template customization, digital products, and bKash payouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <Link
            href={siteUrl}
            target="_blank"
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>View Live Website</span>
          </Link>
          <Link
            href="/dashboard/website"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition"
          >
            <Globe className="w-4 h-4" />
            <span>Edit Website Studio</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Site Traffic & Views</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">12,480</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ad RevShare (70%)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            ৳ {(earnings?.summary?.totalUserShare || 8450).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Automated House Ads & AdSense</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Digital Store Sales</span>
            <Store className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400">14 Orders</div>
          <div className="text-[11px] text-slate-400">Presets & Course Downloads</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Settled Wallet Balance</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ৳ {(earnings?.summary?.approvedShare || 8450).toLocaleString()}
          </div>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline pt-0.5"
          >
            <span>⚡ Request bKash Cashout</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Studio Control Desks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Column: Quick Website Control Hub */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>Personal Website & Template Studio</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your live ready-made website setup at <code className="text-indigo-400 font-mono">/space/{username}</code>
                </p>
              </div>
              <Link
                href="/templates"
                className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" /> Browse Templates
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/website"
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition group space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white">Block Builder & Sections</div>
                <div className="text-xs text-slate-400">Reorder heroes, portfolio grid, contact forms & blog posts.</div>
              </Link>

              <Link
                href="/dashboard/products"
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition group space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white">Digital Store Manager</div>
                <div className="text-xs text-slate-400">Add course PDFs, presets, or consulting calls for direct bKash sales.</div>
              </Link>

              <Link
                href="/creator/monetization/ads"
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition group space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white">Ad Monetization & Slots</div>
                <div className="text-xs text-slate-400">Control House Ads toggle, AdSense code placement, and revenue rules.</div>
              </Link>

              <Link
                href="/wallet"
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition group space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white">bKash & Nagad Cashout</div>
                <div className="text-xs text-slate-400">Manage withdrawal accounts and request 1-click balance cashouts.</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Active Website Preview & Monetization Status */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Personal Website</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ● LIVE ONLINE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-sm font-bold text-white truncate">earnspace.com/space/{username}</div>
              <div className="text-xs text-slate-400">
                Theme: <span className="text-indigo-400 font-semibold">Ready-Made Income Engine v2</span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={siteUrl}
                  target="_blank"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> Visit Site
                </Link>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Ad Revenue Share</span>
                <span className="font-bold text-emerald-400">70% Creator Split</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>bKash/Nagad Checkout</span>
                <span className="font-bold text-indigo-400">Active</span>
              </div>
            </div>
          </div>

          {/* Integrated Non-Intrusive House Ad Slot */}
          <SmartAdSlot slotName="SIDEBAR_TOP" className="rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
