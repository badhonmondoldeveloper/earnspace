'use client';

import React from 'react';
import { X } from 'lucide-react';
import PrivacySelector from './PrivacySelector';

interface CreateModalHeaderProps {
  title: string;
  user?: {
    username?: string;
    profile?: {
      fullName?: string;
      avatar?: string;
    };
  };
  privacy?: string;
  onPrivacyChange?: (privacy: string) => void;
  onClose: () => void;
}

export function CreateModalHeader({
  title,
  user,
  privacy,
  onPrivacyChange,
  onClose,
}: CreateModalHeaderProps) {
  const displayName = user?.profile?.fullName || user?.username || 'Creator';
  const avatarUrl = user?.profile?.avatar || '/default-avatar.png';

  return (
    <div className="flex items-center justify-between border-b border-slate-800 p-4">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border border-slate-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
          }}
        />
        <div>
          <h2 className="text-base font-bold text-white leading-tight">{title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-medium text-slate-400">{displayName}</span>
            {privacy && onPrivacyChange && (
              <PrivacySelector value={privacy} onChange={onPrivacyChange} size="sm" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
