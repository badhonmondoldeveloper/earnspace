'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Film,
  Video,
  BookOpen,
  Briefcase,
  Share2,
  User,
  ShoppingBag,
} from 'lucide-react';

export type SpaceTab =
  | 'overview'
  | 'posts'
  | 'blogs'
  | 'photos'
  | 'reels'
  | 'videos'
  | 'portfolio'
  | 'products'
  | 'referrals'
  | 'about';

interface SpaceTabNavProps {
  activeTab: SpaceTab;
  onChangeTab: (tab: SpaceTab) => void;
  counts?: {
    posts?: number;
    blogs?: number;
    photos?: number;
    reels?: number;
    videos?: number;
  };
}

export function SpaceTabNav({ activeTab, onChangeTab, counts }: SpaceTabNavProps) {
  const tabs: { id: SpaceTab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'posts', label: 'Posts', icon: FileText, count: counts?.posts },
    { id: 'blogs', label: 'Articles', icon: BookOpen, count: counts?.blogs },
    { id: 'reels', label: 'Reels', icon: Film, count: counts?.reels },
    { id: 'videos', label: 'Watch Videos', icon: Video, count: counts?.videos },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'products', label: 'Services', icon: ShoppingBag },
    { id: 'referrals', label: 'Referral Hub', icon: Share2 },
    { id: 'about', label: 'About', icon: User },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-14 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 py-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] text-slate-300 rounded-full font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

