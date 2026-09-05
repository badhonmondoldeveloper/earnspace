'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

export default function CreatorStudioPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/creator/analytics');
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span>🎨</span> Creator Studio & Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your content, monitor audience engagement, and track monetization milestones.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start md:self-auto transition"
          >
            <span>✨</span> Create Content
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Views
                </span>
                <p className="text-3xl font-extrabold text-indigo-400">
                  {analytics?.totalViews?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500">Across videos, reels & blogs</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Followers
                </span>
                <p className="text-3xl font-extrabold text-emerald-400">
                  {analytics?.followersCount?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500">Active audience</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Likes
                </span>
                <p className="text-3xl font-extrabold text-pink-400">
                  {analytics?.totalLikes?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500">Engagement score</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Published Items
                </span>
                <p className="text-3xl font-extrabold text-amber-400">
                  {(analytics?.videosCount || 0) + (analytics?.reelsCount || 0) + (analytics?.postsCount || 0)}
                </p>
                <p className="text-xs text-slate-500">
                  {analytics?.videosCount} Videos • {analytics?.reelsCount} Reels • {analytics?.postsCount} Posts
                </p>
              </div>
            </div>

            {/* Creator Fund Progress Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    🇧🇩 Bangladesh Creator Partner Program Status
                  </h3>
                  <p className="text-sm text-slate-300">
                    Reach 1,000 total views and 100 followers to apply for ad-revenue sharing.
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-900/60 text-indigo-300 border border-indigo-700 self-start sm:self-auto">
                  {analytics?.totalViews >= 1000 && analytics?.followersCount >= 100
                    ? 'Eligible to Apply'
                    : 'In Progress'}
                </span>
              </div>
              
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.floor(((analytics?.totalViews || 0) / 1000) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Content Breakdown Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Videos */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>🎬 Top Videos</span>
                  <span className="text-xs text-slate-400 font-normal">By Views</span>
                </h3>
                <div className="space-y-3">
                  {!analytics?.topVideos?.length ? (
                    <p className="text-sm text-slate-500 py-4">No video performance data yet.</p>
                  ) : (
                    analytics.topVideos.map((v: any) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80"
                      >
                        <span className="text-sm font-medium text-white truncate max-w-[200px]">
                          {v.title}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>👁️ {v.viewsCount}</span>
                          <span>❤️ {v.likesCount}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Reels */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>⚡ Top Reels</span>
                  <span className="text-xs text-slate-400 font-normal">By Views</span>
                </h3>
                <div className="space-y-3">
                  {!analytics?.topReels?.length ? (
                    <p className="text-sm text-slate-500 py-4">No reel performance data yet.</p>
                  ) : (
                    analytics.topReels.map((r: any) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80"
                      >
                        <span className="text-sm font-medium text-white truncate max-w-[200px]">
                          {r.caption || 'Untitled Reel'}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>👁️ {r.viewsCount}</span>
                          <span>❤️ {r.likesCount}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <UniversalCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnalytics}
      />

      <Footer />
    </div>
  );
}
