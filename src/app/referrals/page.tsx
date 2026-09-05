'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Share2, Copy, Check, Users, Gift, ShieldAlert } from 'lucide-react';

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

  const handleCopy = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-brand-500" />
            <span>Referral Program</span>
          </h1>
          <p className="text-xs text-slate-500">Invite creators and friends to EarnSpace and earn referral rewards</p>
        </div>

        {/* Invite Link Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-xl space-y-4">
          <h2 className="text-xl font-bold">Your Unique Referral Link</h2>
          <p className="text-xs text-white/80 max-w-md">
            Share your invite link with your audience. Earn rewards when qualified creators register and build their space.
          </p>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-2 rounded-2xl max-w-xl">
            <input
              type="text"
              readOnly
              value={data?.referralLink || 'Loading link...'}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-transparent text-white placeholder-white/50 focus:outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-white text-brand-600 hover:bg-slate-100 transition shrink-0 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs text-slate-500 font-semibold">Unique Referral Code</span>
            <p className="text-2xl font-mono font-bold text-brand-500">{data?.referralCode || '...'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs text-slate-500 font-semibold">Total Verified Referrals</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{data?.totalReferrals || 0}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

