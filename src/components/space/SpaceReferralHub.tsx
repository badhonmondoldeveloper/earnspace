'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Sparkles, Gift, Users, X } from 'lucide-react';

interface SpaceReferralHubProps {
  referralCode: string;
  username: string;
}

export function SpaceReferralHub({ referralCode, username }: SpaceReferralHubProps) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const refUrl = `https://earnspace-chi.vercel.app/register?ref=${referralCode || username}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(refUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">EarnSpace Growth & Referral Hub</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
            Active Referral Rewards
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Invite friends, creators, and followers to EarnSpace using @{username}&apos;s official referral link below.
        </p>

        {/* Link Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-indigo-300 truncate w-full sm:w-auto px-2">
            {refUrl}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Referral Link'}</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Referral Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center space-y-1">
            <div className="text-xs font-extrabold text-white">Instant Credit</div>
            <div className="text-[10px] text-slate-400">Bonus on successful signup</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center space-y-1">
            <div className="text-xs font-extrabold text-white">Lifetime Share</div>
            <div className="text-[10px] text-slate-400">Ad revenue commissions</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center space-y-1">
            <div className="text-xs font-extrabold text-white">Verified Badge</div>
            <div className="text-[10px] text-slate-400">Faster creator approval</div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Referral QR Code</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
              <img src={qrApiUrl} alt="Referral QR Code" className="w-48 h-48" />
            </div>

            <p className="text-xs text-slate-400">Scan this QR code using mobile camera to open referral link</p>
          </div>
        </div>
      )}
    </>
  );
}

