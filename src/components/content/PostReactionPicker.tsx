'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

interface PostReactionPickerProps {
  postId: string;
  userReaction?: string | null;
  onReactionChange: (postId: string, reactionType: string) => void;
}

export const REACTIONS = [
  { type: 'like', label: 'Like', icon: '👍', color: 'text-indigo-600 dark:text-indigo-400' },
  { type: 'love', label: 'Love', icon: '❤️', color: 'text-rose-500' },
  { type: 'haha', label: 'Haha', icon: '😂', color: 'text-amber-500' },
  { type: 'wow', label: 'Wow', icon: '😮', color: 'text-amber-400' },
  { type: 'sad', label: 'Sad', icon: '😢', color: 'text-amber-500' },
  { type: 'angry', label: 'Angry', icon: '😡', color: 'text-orange-600' },
];

export function PostReactionPicker({
  postId,
  userReaction,
  onReactionChange,
}: PostReactionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const currentReaction = REACTIONS.find((r) => r.type === userReaction);

  const handleSelectReaction = (reactionType: string) => {
    setShowPicker(false);
    onReactionChange(postId, reactionType);
  };

  return (
    <div
      className="relative flex-1"
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      {/* Floating Reaction Bar */}
      {showPicker && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl p-1.5 flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              onClick={() => handleSelectReaction(r.type)}
              title={r.label}
              className="w-9 h-9 rounded-full hover:scale-125 transition-transform duration-150 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{r.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Reaction Trigger Button */}
      <button
        onClick={() => handleSelectReaction(userReaction ? 'like' : 'like')}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-xs ${
          currentReaction ? currentReaction.color : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {currentReaction ? (
          <span className="text-base">{currentReaction.icon}</span>
        ) : (
          <ThumbsUp className="w-4 h-4" />
        )}
        <span>{currentReaction ? currentReaction.label : 'Like'}</span>
      </button>
    </div>
  );
}

