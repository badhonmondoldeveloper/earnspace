'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function PublicMonetizationEducationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Legitimate & Transparent Creator Monetization
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Build your brand, publish original content, engage your audience, and earn through multiple verified platform revenue streams.
          </p>
          <div className="pt-2">
            <Link
              href="/creator/monetization"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 inline-block"
            >
              🚀 Join Creator Partner Program
            </Link>
          </div>
        </div>

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Revenue Streams</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never rely on one ad network. Earn through Ad Revenue, Sponsored Campaigns, Affiliate Conversions, Fan Tips, and Subscriptions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-2xl">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">Traceable Earnings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every earning stores its gross revenue, provider fee, net split, and rule version. No unexplained numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center text-2xl">
              🇧🇩
            </div>
            <h3 className="text-lg font-bold text-white">Bangladeshi Payouts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Withdraw earnings directly to bKash, Nagad, Rocket, Bank Transfer, or Binance once reaching ৳10,000 threshold.
            </p>
          </div>
        </div>

        {/* Lifecycle Flow Section */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">The Creator Earning Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold text-lg">1</span>
              <p className="font-bold text-white">Create & Publish</p>
              <p className="text-[11px] text-slate-400">Share videos, reels & posts</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold text-lg">2</span>
              <p className="font-bold text-white">Build Audience</p>
              <p className="text-[11px] text-slate-400">Gain followers & watch hours</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold text-lg">3</span>
              <p className="font-bold text-white">Apply & Earn</p>
              <p className="text-[11px] text-slate-400">Join partner programs</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold text-lg">4</span>
              <p className="font-bold text-white">Withdraw ৳10,000</p>
              <p className="text-[11px] text-slate-400">Payout via bKash/Nagad/Bank</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

