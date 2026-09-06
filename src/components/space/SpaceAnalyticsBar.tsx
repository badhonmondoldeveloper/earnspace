'use client';

import React from 'react';
import { Eye, FileText, Film, Video, BookOpen, Users } from 'lucide-react';

interface SpaceAnalyticsBarProps {
  profile: any;
}

export function SpaceAnalyticsBar({ profile }: SpaceAnalyticsBarProps) {
  if (!profile) return null;

  const stats = [
    { label: 'Followers', value: profile.followersCount || 0, icon: Users },
    { label: 'Posts', value: profile.postsCount || 0, icon: FileText },
    { label: 'Articles', value: profile.blogsCount || 0, icon: BookOpen },
    { label: 'Reels', value: profile.reelsCount || 0, icon: Film },
    { label: 'Videos', value: profile.videosCount || 0, icon: Video },
    { label: 'Profile Views', value: profile.profileViews || 120, icon: Eye },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-lg">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 text-center">
            <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-white">{stat.value}</div>
            <div className="text-[10px] font-medium text-slate-400 truncate">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

