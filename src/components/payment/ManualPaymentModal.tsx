'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Plus,
  Zap,
} from 'lucide-react';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ManualPaymentModal({ isOpen, onClose, onSuccess }: ManualPaymentModalProps) {
  const [provider, setProvider] = useState<'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY'>('BKASH');
  const [amount, setAmount] = useState('500');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Recent submissions
  const [submissions, setSubmissions] = useState<any[]>([]);

  const officialNumbers: Record<string, { phone: string; type: string; bg: string; text: string; border: string }> = {
    BKASH: {
      phone: '01700000000',
      type: 'Personal / Send Money',
      bg: 'bg-pink-500/10 dark:bg-pink-950/40',
      text: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-500/30',
    },
    NAGAD: {
      phone: '01800000000',
      type: 'Personal / Send Money',
      bg: 'bg-orange-500/10 dark:bg-orange-950/40',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/30',
    },
    ROCKET: {
      phone: '01900000000',
      type: 'Personal / Send Money',
      bg: 'bg-purple-500/10 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/30',
    },
    UPAY: {
      phone: '01600000000',
      type: 'Personal / Send Money',
      bg: 'bg-blue-500/10 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
    },
  };

  useEffect(() => {
    if (isOpen) {
      fetchMySubmissions();
    }
  }, [isOpen]);

  const fetchMySubmissions = async () => {
    try {
      const res = await fetch('/api/v1/payments/my-submissions');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSubmissions(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !senderNumber || !transactionId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/v1/payments/manual-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          amount: parseFloat(amount),
          senderNumber,
          transactionId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({
          type: 'success',
          text: json.message || 'Deposit request submitted! Admin will verify your Transaction ID shortly.',
        });
        setSenderNumber('');
        setTransactionId('');
        fetchMySubmissions();
        if (onSuccess) onSuccess();
      } else {
        setMessage({
          type: 'error',
          text: json.message || 'Failed to submit payment verification.',
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'Network error submitting payment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentProviderConfig = officialNumbers[provider];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Add Money / Deposit (bKash & MFS)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send Money & submit your Transaction ID for manual verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* STEP 1: SELECT PROVIDER */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Step 1: Choose MFS Payment Provider
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'BKASH', label: 'bKash', color: 'pink' },
              { id: 'NAGAD', label: 'Nagad', color: 'orange' },
              { id: 'ROCKET', label: 'Rocket', color: 'purple' },
              { id: 'UPAY', label: 'Upay', color: 'blue' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id as any)}
                className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  provider === p.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: OFFICIAL NUMBER INSTRUCTIONS */}
        <div className={`p-4 rounded-2xl border ${currentProviderConfig.bg} ${currentProviderConfig.border} space-y-2`}>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">EarnSpace Official {provider} Number:</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 font-mono">
              {currentProviderConfig.type}
            </span>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-lg font-black font-mono tracking-wider text-slate-900 dark:text-white">
              {currentProviderConfig.phone}
            </div>
            <button
              onClick={() => copyNumber(currentProviderConfig.phone)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNumber ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            📌 Open your <strong>{provider}</strong> app, select Send Money, and send <strong>৳{amount || '0'} BDT</strong> to the number above.
          </p>
        </div>

        {/* STEP 3: INPUT SUBMISSION FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Step 2: Enter Transaction Details
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Deposit Amount (BDT ৳)</label>
              <input
                type="number"
                required
                min="50"
                placeholder="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Your Sender Mobile Number</label>
              <input
                type="text"
                required
                placeholder="01712345678"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Transaction ID (TrxID)</label>
            <input
              type="text"
              required
              placeholder="e.g. 9B7A21X0P"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !transactionId || !senderNumber}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Verification...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Submit for Admin Verification
              </>
            )}
          </button>
        </form>

        {/* SUBMISSION HISTORY STATUS TRACKER */}
        {submissions.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Recent Verification Status ({submissions.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{sub.provider}</span>
                      <span className="font-mono text-[10px] text-slate-400">{sub.transactionId}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ৳{sub.amount} BDT • {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    {sub.status === 'VERIFIED' || sub.status === 'AVAILABLE' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Credited
                      </span>
                    ) : sub.status === 'REJECTED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" /> Pending Admin Review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualPaymentModal;
