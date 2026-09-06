'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Users, Lock, ChevronDown } from 'lucide-react';

interface PrivacySelectorProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

const PRIVACY_OPTIONS = [
  { id: 'public', label: 'Public', icon: Globe, description: 'Anyone on EarnSpace' },
  { id: 'followers', label: 'Followers', icon: Users, description: 'Your followers on EarnSpace' },
  { id: 'only_me', label: 'Only Me', icon: Lock, description: 'Only you can see this' },
];

export default function PrivacySelector({ value, onChange, size = 'md' }: PrivacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = PRIVACY_OPTIONS.find((opt) => opt.id === value) || PRIVACY_OPTIONS[0];
  const Icon = selectedOption.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg font-medium transition-colors ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
        }`}
      >
        <Icon className={size === 'sm' ? 'w-3 h-3 text-indigo-400' : 'w-4 h-4 text-indigo-400'} />
        <span>{selectedOption.label}</span>
        <ChevronDown className={size === 'sm' ? 'w-3 h-3 text-slate-400' : 'w-4 h-4 text-slate-400'} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          {PRIVACY_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-slate-800/80 transition-colors ${
                  isSelected ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-300'
                }`}
              >
                <OptionIcon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-semibold">{option.label}</div>
                  <div className="text-[10px] text-slate-400">{option.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
