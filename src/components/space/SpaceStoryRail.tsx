'use client';

import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface SpaceStoryRailProps {
  stories: any[];
  isOwnProfile: boolean;
  onOpenCreateStory: () => void;
  onSelectStory: (index: number) => void;
}

export function SpaceStoryRail({
  stories,
  isOwnProfile,
  onOpenCreateStory,
  onSelectStory,
}: SpaceStoryRailProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active 24h Stories</h3>
        </div>
        {isOwnProfile && (
          <button
            onClick={onOpenCreateStory}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Story
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
        {isOwnProfile && (
          <button
            onClick={onOpenCreateStory}
            className="w-24 h-36 rounded-2xl border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/5 flex flex-col items-center justify-center p-2 text-center shrink-0 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white">Create Story</span>
          </button>
        )}

        {stories.map((story, idx) => (
          <button
            key={story.id || idx}
            onClick={() => onSelectStory(idx)}
            className="w-24 h-36 rounded-2xl relative overflow-hidden bg-slate-950 border border-slate-800 shrink-0 group shadow-lg transition-transform hover:scale-105"
          >
            {story.mediaUrl ? (
              <img src={story.mediaUrl} alt="Story" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-800 p-2 flex items-center justify-center text-center text-[10px] font-bold text-white">
                {story.textOverlay || 'Text Story'}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white truncate text-left">
              {story.type === 'text' ? 'Text Story' : 'Media Story'}
            </span>
          </button>
        ))}

        {stories.length === 0 && !isOwnProfile && (
          <div className="text-xs text-slate-500 italic py-4 text-center w-full">
            No active stories right now.
          </div>
        )}
      </div>
    </div>
  );
}

