'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function ReelsFeedPage() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/reels');
      const data = await res.json();
      if (res.ok) {
        setReels(data.data?.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReelView = (reelId: string) => {
    fetch(`/api/v1/reels/${reelId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration: 5 }),
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-0 md:p-4 overflow-hidden">
        {loading ? (
          <div className="w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center text-slate-600">
            Loading Reels...
          </div>
        ) : reels.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No Reels uploaded yet.
          </div>
        ) : (
          <div className="w-full max-w-md h-[calc(100vh-5rem)] bg-black md:rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Active Reel */}
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                src={reels[activeIndex]?.videoUrl}
                poster={reels[activeIndex]?.thumbnailUrl}
                controls
                autoPlay
                loop
                onPlay={() => handleReelView(reels[activeIndex]?.id)}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

              {/* Creator & Caption Overlay */}
              <div className="absolute bottom-6 left-4 right-16 space-y-3 z-10">
                <Link
                  href={`/@${reels[activeIndex]?.user?.username}`}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden">
                    {reels[activeIndex]?.user?.profile?.avatar ? (
                      <img
                        src={reels[activeIndex]?.user?.profile?.avatar}
                        alt={reels[activeIndex]?.user?.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-indigo-400">
                        {reels[activeIndex]?.user?.username?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                      @{reels[activeIndex]?.user?.username}
                    </span>
                  </div>
                  <button className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg">
                    Follow
                  </button>
                </Link>

                <p className="text-sm text-slate-100 font-medium line-clamp-2 leading-relaxed">
                  {reels[activeIndex]?.caption}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>🎵</span>
                  <span className="truncate">{reels[activeIndex]?.audioTitle || 'Original Audio'}</span>
                </div>
              </div>

              {/* Right Side Action Buttons */}
              <div className="absolute right-4 bottom-8 flex flex-col items-center gap-6 z-10">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700/50 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    ❤️
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {reels[activeIndex]?.likesCount || 0}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700/50 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    💬
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {reels[activeIndex]?.commentsCount || 0}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700/50 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    🚀
                  </div>
                  <span className="text-xs font-semibold text-white">Share</span>
                </button>
              </div>

              {/* Up / Down Navigation Controls */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                  className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700 flex items-center justify-center text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  disabled={activeIndex === reels.length - 1}
                  onClick={() => setActiveIndex((prev) => Math.min(reels.length - 1, prev + 1))}
                  className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700 flex items-center justify-center text-white disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
