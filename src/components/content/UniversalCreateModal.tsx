'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    initialType === 'story' ? 'story' : initialType === 'reel' ? 'reel' : initialType === 'video' ? 'video' : 'hub'
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
        user={user}
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
        user={user}
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
        user={user}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Create on EarnSpace</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">Choose what type of content you want to publish:</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveModal('post')}
            className="flex flex-col items-center justify-center p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Post</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Photos & updates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('story')}
            className="flex flex-col items-center justify-center p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Type className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Story</span>
            <span className="text-[10px] text-slate-400 mt-0.5">24h text/media</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('reel')}
            className="flex flex-col items-center justify-center p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Reel</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Short 9:16 video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('video')}
            className="flex flex-col items-center justify-center p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Video</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Long-form video</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <Link
            href="/dashboard/blog"
            onClick={onClose}
            className="flex items-center justify-between p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Write Blog Article</div>
                <div className="text-[10px] text-slate-400">SEO article editor</div>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
