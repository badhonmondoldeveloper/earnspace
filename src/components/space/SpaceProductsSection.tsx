'use client';

import React from 'react';
import { ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';

interface SpaceProductsSectionProps {
  username: string;
}

export function SpaceProductsSection({ username }: SpaceProductsSectionProps) {
  const services = [
    {
      title: '1-on-1 Creator Strategy Session',
      description: 'Personalized 60-minute consultation on content growth, branding, and monetization.',
      price: '$49',
      features: ['60 Min Video Call', 'Custom Growth Roadmap', 'Monetization Audit'],
    },
    {
      title: 'Sponsored Content Post / Reel',
      description: 'Dedicated promotional reel or post shared across @' + username + "'s space and social channels.",
      price: '$120',
      features: ['Permanent Space Post', 'Social Cross-posting', 'Performance Analytics'],
    },
    {
      title: 'Digital Product / E-Book Bundle',
      description: 'Exclusive masterclass guide on building a profitable creator business on EarnSpace.',
      price: '$19',
      features: ['Instant PDF Download', 'Template Resources', 'Lifetime Access'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Services & Digital Products</h2>
          <p className="text-xs text-slate-400">Offered directly by @{username}</p>
        </div>
        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-bold">
          Verified Creator Store
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </span>
                <span className="text-lg font-extrabold text-white">{srv.price}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{srv.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {srv.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(`Order request sent to @${username}!`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Order Service ({srv.price})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

