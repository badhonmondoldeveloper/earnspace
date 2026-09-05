'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPlans(data.data.plans || []);
          setCurrentSub(data.data.currentSubscription);
        }
      });
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true);
    setMsg('');
    try {
      const res = await fetch('/api/v1/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Subscribed to ${data.data.plan?.name || 'new'} plan successfully!`);
        setCurrentSub(data.data);
      }
    } catch (e) {
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Flexible Plans For Every Creator</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Start for free, unlock pro creator tools, or grow your business presence on EarnSpace.
        </p>
      </div>

      {msg && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center">
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          let features: string[] = [];
          try {
            features = JSON.parse(plan.featuresJson || '[]');
          } catch (e) {}

          const isCurrent = currentSub?.planId === plan.id;
          const isPro = plan.name === 'Creator Pro';

          return (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl border flex flex-col justify-between space-y-6 transition relative ${
                isPro
                  ? 'bg-slate-900 text-white border-brand-500 shadow-xl shadow-brand-500/10'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className={`text-xs ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${plan.price.toFixed(0)}</span>
                  <span className={`text-xs ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>/{plan.billingInterval}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-200/50 dark:border-slate-800 text-xs">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing || isCurrent}
                className={`w-full py-3 text-xs font-bold rounded-xl transition ${
                  isCurrent
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                    : isPro
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-100'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

