'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Heart, MessageSquare, Video, Film, Plus } from 'lucide-react';
import Link from 'next/link';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'videos' | 'reels'>('all');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        }
      });

    fetchFeed('all');
  }, []);

  const fetchFeed = (filter: string) => {
    setLoading(true);
    if (filter === 'videos') {
      fetch('/api/v1/videos')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.items) {
            setPosts(data.data.items.map((v: any) => ({ ...v, isVideo: true })));
          }
        })
        .finally(() => setLoading(false));
    } else if (filter === 'reels') {
      fetch('/api/v1/reels')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.items) {
            setPosts(data.data.items.map((r: any) => ({ ...r, isReel: true })));
          }
        })
        .finally(() => setLoading(false));
    } else {
      fetch(`/api/v1/posts?filter=${filter}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.items) {
            setPosts(data.data.items);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleReaction = async (postId: string) => {
    try {
      const res = await fetch(`/api/v1/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          posts.map((p) => {
            if (p.id === postId) {
              const currentCount = p._count?.reactions || 0;
              const isReacted = data.data.reacted;
              return {
                ...p,
                userReaction: isReacted ? 'like' : null,
                _count: {
                  ...p._count,
                  reactions: isReacted ? currentCount + 1 : Math.max(0, currentCount - 1),
                },
              };
            }
            return p;
          })
        );
      }
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      {/* Creator Studio & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 text-white shadow-lg">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🚀</span> Creator Hub & Feed
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Build your audience, post videos & reels, and view your creator analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/creator"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
          >
            📊 Creator Studio
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Real Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Followers</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.followersCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Following</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.followingCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Videos</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.videosCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Reels</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.reelsCount || 0}</p>
        </div>
      </div>

      {/* Quick Trigger Bar */}
      <div
        onClick={() => setIsCreateModalOpen(true)}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 cursor-pointer hover:border-indigo-500 transition group"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
          {user?.profile?.avatar ? (
            <img src={user.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.username?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <div className="flex-1 text-xs text-slate-400 font-medium group-hover:text-slate-200">
          What&apos;s on your mind? Create a post, video, or reel...
        </div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-400 transition">
            <Video className="w-4 h-4" />
          </span>
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-400 transition">
            <Film className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Multi-Tab Feed Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => { setFeedFilter('all'); fetchFeed('all'); }}
          className={`pb-2 px-3 transition border-b-2 whitespace-nowrap ${
            feedFilter === 'all' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => { setFeedFilter('following'); fetchFeed('following'); }}
          className={`pb-2 px-3 transition border-b-2 whitespace-nowrap ${
            feedFilter === 'following' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => { setFeedFilter('videos'); fetchFeed('videos'); }}
          className={`pb-2 px-3 transition border-b-2 whitespace-nowrap flex items-center gap-1 ${
            feedFilter === 'videos' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Videos</span>
        </button>
        <button
          onClick={() => { setFeedFilter('reels'); fetchFeed('reels'); }}
          className={`pb-2 px-3 transition border-b-2 whitespace-nowrap flex items-center gap-1 ${
            feedFilter === 'reels' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Reels / Shorts</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 font-medium">No activity in this feed yet.</p>
            <p className="text-[11px] text-slate-400">Be the first to publish or follow active creators.</p>
          </div>
        ) : (
          posts.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {item.user?.profile?.avatar ? (
                      <img src={item.user.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      item.user?.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <a href={`/@${item.user?.username}`} className="text-xs font-bold text-slate-900 dark:text-white hover:underline">
                      {item.user?.profile?.fullName || item.user?.username}
                    </a>
                    <span className="text-[10px] text-slate-400 block">@{item.user?.username} • {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {item.isVideo && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    Video
                  </span>
                )}
                {item.isReel && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-purple-950 text-purple-400 border border-purple-800">
                    Reel
                  </span>
                )}
              </div>

              {/* Video Player or Post Content */}
              {item.isVideo ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <Link href={`/video/${item.id}`} className="block aspect-video bg-black rounded-xl overflow-hidden relative group">
                    <video src={item.videoUrl} poster={item.thumbnailUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center text-xl shadow-lg">
                        ▶
                      </div>
                    </div>
                  </Link>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              ) : item.isReel ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-200">{item.caption}</p>
                  <Link href="/reels" className="block max-w-xs aspect-[9/16] mx-auto bg-black rounded-xl overflow-hidden relative group">
                    <video src={item.videoUrl} poster={item.thumbnailUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center text-lg shadow-lg">
                        ▶
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{item.content}</p>
              )}

              {/* Engagement Controls */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <button
                  onClick={() => handleReaction(item.id)}
                  className={`flex items-center gap-1.5 transition ${
                    item.userReaction ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${item.userReaction ? 'fill-current' : ''}`} />
                  <span>{item._count?.reactions || item.likesCount || 0}</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{item._count?.comments || item.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <UniversalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchFeed(feedFilter)}
      />
    </div>
  );
}
