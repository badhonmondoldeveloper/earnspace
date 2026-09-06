'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';
import { FEELING_ACTIVITIES } from '@/config/media';

interface FeelingActivityPickerProps {
  value?: { emoji: string; label: string } | null;
  onChange: (feeling: { emoji: string; label: string } | null) => void;
}

export default function FeelingActivityPicker({ value, onChange }: FeelingActivityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (value) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
        <span>{value.emoji}</span>
        <span>Feeling {value.label}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-1 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        title="Add feeling / activity"
      >
        <Smile className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">Feeling/Activity</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-3">
          <div className="text-xs font-bold text-slate-300 mb-2 px-1">How are you feeling?</div>
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
            {FEELING_ACTIVITIES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange({ emoji: item.emoji, label: item.label });
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs text-left transition-colors"
              >
                <span>{item.emoji}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
