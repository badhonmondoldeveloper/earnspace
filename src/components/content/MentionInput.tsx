'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AtSign, User as UserIcon } from 'lucide-react';

interface MentionInputProps {
  onSelectMention: (username: string) => void;
}

export default function MentionInput({ onSelectMention }: MentionInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const cleaned = query.replace(/^@/, '');
      fetch(`/api/v1/creators?q=${encodeURIComponent(cleaned)}&limit=4`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data?.items)) {
            setResults(data.data.items);
            setIsOpen(true);
          }
        })
        .catch(() => {});
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

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
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1">
        <AtSign className="w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mention user..."
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-28"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 bottom-full mb-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                onSelectMention(user.username);
                setQuery('');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.profile?.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff`;
                }}
              />
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">{user.profile?.fullName || user.username}</div>
                <div className="text-[10px] text-slate-400 truncate">@{user.username}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

