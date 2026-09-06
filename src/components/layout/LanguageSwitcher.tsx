'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
      <button
        onClick={() => setLanguage('EN')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
          language === 'EN'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('BN')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
          language === 'BN'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
