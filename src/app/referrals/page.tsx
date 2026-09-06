'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Share2, Copy, Check, Users, Gift, Sparkles, MessageCircle, Facebook, Send } from 'lucide-react';

export default function ReferralsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/v1/referrals')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const referralLink = data?.referralLink || (typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${data?.referralCode || ''}` : '');

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = encodeURIComponent(`Join EarnSpace — Bangladesh's premier creator social platform & website builder! Register using my link: ${referralLink}`);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <Share2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Referral & Affiliate Rewards Program</span>
          </h1>
          <p className="text-xs text-slate-500">Invite new Bangladeshi content creators to EarnSpace and earn automatic referral bonuses</p>
        </div>

        {/* Invite Link Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-800/40 shadow-xl space-y-5">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              🇧🇩 Creator Invite Program
            </span>
            <h2 className="text-xl font-extrabold text-white">Your Unique Creator Referral Link</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Share your invite link on Facebook, WhatsApp, or Messenger. Earn referral bonuses directly credited to your creator wallet when friends sign up!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl max-w-2xl">
            <input
              type="text"
              readOnly
              value={referralLink || 'Loading referral link...'}
              className="w-full sm:flex-1 px-3 py-2 text-xs rounded-xl bg-transparent text-indigo-300 focus:outline-none font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* One-Click Social Share Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs text-slate-400 font-semibold">Share directly to:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Facebook</span>
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(referralLink)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Messenger</span>
            </a>
          </div>
        </div>

        {/* Referral Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Referral Code</span>
            <p className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{data?.referralCode || '...'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Total Referred Members</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{data?.totalReferrals || 0}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Qualified Rewards</span>
            <p className="text-2xl font-extrabold text-emerald-500">৳{((data?.totalReferrals || 0) * 100).toLocaleString()}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
