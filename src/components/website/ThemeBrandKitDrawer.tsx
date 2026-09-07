'use client';

import React from 'react';
import { Palette, Check, X, Sliders, Type, Image as ImageIcon } from 'lucide-react';

interface ThemeBrandKitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const THEME_PRESETS = [
  { id: 'modern', name: 'Modern Dark', bg: 'bg-slate-950', accent: 'border-indigo-500 text-indigo-400' },
  { id: 'minimal', name: 'Minimal White', bg: 'bg-white text-slate-900', accent: 'border-slate-900 text-slate-900' },
  { id: 'cyber', name: 'Neon Cyber', bg: 'bg-black text-cyan-400', accent: 'border-cyan-500 text-cyan-400' },
  { id: 'creator', name: 'Creator Pro', bg: 'bg-slate-900 text-pink-400', accent: 'border-pink-500 text-pink-400' },
  { id: 'elegant', name: 'Luxury Gold', bg: 'bg-zinc-950 text-amber-400', accent: 'border-amber-500 text-amber-400' },
  { id: 'sunset', name: 'Sunset Warm', bg: 'bg-stone-950 text-rose-400', accent: 'border-rose-500 text-rose-400' },
  { id: 'glass', name: 'Glassmorphism', bg: 'bg-indigo-950/80 text-white', accent: 'border-cyan-400 text-cyan-300' },
  { id: 'nature', name: 'Nature Green', bg: 'bg-emerald-950 text-emerald-400', accent: 'border-emerald-500 text-emerald-400' },
];

export function ThemeBrandKitDrawer({ isOpen, onClose, selectedTheme, onSelectTheme }: ThemeBrandKitDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      <div className="space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" /> Theme & Brand Kit
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Global Theme Presets
          </div>

          <div className="grid grid-cols-2 gap-2">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                  selectedTheme === t.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{t.name}</span>
                {selectedTheme === t.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
      >
        Save Theme Settings
      </button>
    </div>
  );
}

export default ThemeBrandKitDrawer;
