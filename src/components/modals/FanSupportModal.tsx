'use client';

import React, { useState } from 'react';

interface FanSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  onSuccess?: () => void;
}

export function FanSupportModal({
  isOpen,
  onClose,
  creatorId,
  creatorName,
  creatorAvatar,
  onSuccess,
}: FanSupportModalProps) {
  const [amount, setAmount] = useState('5');
  const [method, setMethod] = useState('bkash');
  const [mfsNumber, setMfsNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const quickAmounts = ['2', '5', '10', '25', '50'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid tip amount.');
      }

      if (method !== 'wallet') {
        if (!/^01[3-9]\d{8,9}$/.test(mfsNumber.trim())) {
          throw new Error('Please enter a valid 11-digit Bangladeshi mobile number.');
        }
      }

      const res = await fetch('/api/v1/fan-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId,
          amount: parsedAmount,
          message: message ? `${message} (Paid via ${method.toUpperCase()} - ${mfsNumber})` : `Paid via ${method.toUpperCase()} (${mfsNumber})`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to send fan support tip.');
      }

      setFeedback({
        type: 'success',
        text: `🎉 Thank you! ৳${parsedAmount} tip sent successfully to ${creatorName}!`,
      });

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                creatorName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                Support {creatorName} <span className="text-pink-400">💖</span>
              </h3>
              <p className="text-xs text-slate-400">Send a Bangladeshi MFS or Wallet Tip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Amounts */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Tip Amount (৳)</label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    amount === amt
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-transparent shadow-md shadow-pink-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Or enter custom amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
              <input
                type="number"
                step="0.5"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white text-sm font-bold focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bkash', label: 'bKash', color: 'from-pink-600 to-pink-700' },
                { id: 'nagad', label: 'Nagad', color: 'from-orange-600 to-red-600' },
                { id: 'rocket', label: 'Rocket', color: 'from-purple-600 to-indigo-600' },
                { id: 'wallet', label: 'Wallet', color: 'from-emerald-600 to-teal-600' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    method === m.id
                      ? `bg-gradient-to-r ${m.color} text-white border-transparent shadow-md`
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method !== 'wallet' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Your {method.toUpperCase()} Number (11 digits) *
              </label>
              <input
                type="text"
                value={mfsNumber}
                onChange={(e) => setMfsNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-mono focus:border-pink-500 outline-none"
              />
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Encouraging Message (Optional)</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Keep up the great work! Love your content..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:border-pink-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white hover:opacity-95 transition disabled:opacity-50 shadow-lg shadow-rose-600/30"
          >
            {loading ? 'Processing Tip...' : `Send ৳${amount} Tip Now 💖`}
          </button>
        </form>
      </div>
    </div>
  );
}
