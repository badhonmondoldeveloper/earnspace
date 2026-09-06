'use client';

import React, { useState } from 'react';
import { Heart, DollarSign, X, Check, Sparkles } from 'lucide-react';

interface SpaceTippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  creatorId: string;
}

export function SpaceTippingModal({ isOpen, onClose, username, creatorId }: SpaceTippingModalProps) {
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendTip = async () => {
    const tipVal = customAmount ? parseFloat(customAmount) : amount;
    if (!tipVal || tipVal <= 0) {
      setErrorMsg('Please select or enter a valid tip amount');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/v1/fan-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId,
          amount: tipVal,
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Thank you! You successfully sent \$${tipVal.toFixed(2)} fan support to @${username}.`);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 2000);
      } else {
        setErrorMsg(data.error?.message || data.message || 'Tipping failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-sm font-bold text-white">Support @{username}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Send direct fan support to support @{username}&apos;s creator content on EarnSpace.
        </p>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[2, 5, 10, 20, 50, 100].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => {
                setAmount(val);
                setCustomAmount('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                amount === val && !customAmount
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-rose-500/50'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Custom Amount ($USD)</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="e.g. 15"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Supporter Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keep up the great content!"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {errorMsg && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> {successMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleSendTip}
          disabled={isSubmitting}
          className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Heart className="w-4 h-4 fill-white" /> Send Support (${customAmount || amount})
            </>
          )}
        </button>
      </div>
    </div>
  );
}

