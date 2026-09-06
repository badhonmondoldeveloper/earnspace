'use client';

import React from 'react';
import { Image as ImageIcon, Video, Film, Type, BookOpen, Sparkles } from 'lucide-react';

interface SpaceCreatorComposerProps {
  user: any;
  onOpenCreate: (type?: 'post' | 'story' | 'video' | 'reel') => void;
}

export function SpaceCreatorComposer({ user, onOpenCreate }: SpaceCreatorComposerProps) {
  const profile = user?.profile || {};
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : user?.username || 'Creator';
  const avatarUrl = profile.avatar || '/default-avatar.png';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={firstName}
          className="w-10 h-10 rounded-full object-cover border border-slate-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=6366f1&color=fff`;
          }}
        />
        <button
          onClick={() => onOpenCreate('post')}
          className="flex-1 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left px-4 py-2.5 rounded-full text-xs text-slate-400 font-medium transition-all"
        >
          Publish new content on your space, {firstName}...
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onOpenCreate('post')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition-colors"
        >
          <ImageIcon className="w-4 h-4" /> Photo
        </button>
        <button
          onClick={() => onOpenCreate('reel')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <Film className="w-4 h-4" /> Reel
        </button>
        <button
          onClick={() => onOpenCreate('video')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-blue-400 hover:bg-slate-800 transition-colors"
        >
          <Video className="w-4 h-4" /> Watch
        </button>
        <button
          onClick={() => onOpenCreate('story')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-purple-400 hover:bg-slate-800 transition-colors"
        >
          <Type className="w-4 h-4" /> Story
        </button>
      </div>
    </div>
  );
}

