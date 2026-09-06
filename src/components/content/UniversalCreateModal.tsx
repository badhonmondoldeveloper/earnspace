'use client';

import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Video, Film, Type, X, FileText } from 'lucide-react';
import { StoryCreateModal } from './StoryCreateModal';
import { PostCreateModal } from './PostCreateModal';
import { ReelCreateModal } from './ReelCreateModal';
import { VideoCreateModal } from './VideoCreateModal';

interface UniversalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
  initialType?: 'post' | 'story' | 'video' | 'reel';
}

export default function UniversalCreateModal({
  isOpen,
  onClose,
  onSuccess,
  user,
  initialType = 'post',
}: UniversalCreateModalProps) {
  const [activeModal, setActiveModal] = useState<'hub' | 'post' | 'story' | 'video' | 'reel'>(
    initialType === 'story' ? 'story' : 'hub'
  );

  if (!isOpen) return null;

  if (activeModal === 'story') {
    return (
      <StoryCreateModal
        isOpen={true}
        onClose={() => {
          setActiveModal('hub');
          onClose();
        }}
        onSuccess={onSuccess}
      />
    );
  }

  if (activeModal === 'post') {
    return (
      <PostCreateModal
        isOpen={true}
        onClose={() => {
          setActiveModal('hub');
          onClose();
        }}
        onSuccess={onSuccess}
        user={user}
      />
    );
  }

  if (activeModal === 'reel') {
    return (
      <ReelCreateModal
        isOpen={true}
        onClose={() => {
          setActiveModal('hub');
          onClose();
        }}
        onSuccess={onSuccess}
      />
    );
  }

  if (activeModal === 'video') {
    return (
      <VideoCreateModal
        isOpen={true}
        onClose={() => {
          setActiveModal('hub');
          onClose();
        }}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Create on EarnSpace</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">Choose what type of content you want to create:</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveModal('story')}
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-800/60 hover:border-indigo-500 transition text-left space-y-2 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/80 text-white flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Create Story</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">24h text/photo story</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('post')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition text-left space-y-2 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/80 text-white flex items-center justify-center font-bold shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Create Post</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Photo & text post</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('reel')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition text-left space-y-2 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/80 text-white flex items-center justify-center font-bold shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Create Reel</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">9:16 vertical video</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('video')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition text-left space-y-2 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600/80 text-white flex items-center justify-center font-bold shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Publish Video</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Long-form video</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
