'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  MessageSquare,
  Video,
  Film,
  Plus,
  Globe,
  MoreHorizontal,
  Share2,
  Smile,
  Image as ImageIcon,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'videos' | 'reels'>('all');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        } else if (data.success === false) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      });

    fetchStories();

    if (new URLSearchParams(window.location.search).get('action') === 'create') {
      setIsCreateModalOpen(true);
    }

    fetchFeed('all');
  }, []);

  const fetchStories = () => {
    fetch('/api/v1/stories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setStories(data.data);
        }
      })
      .catch(() => {});
  };

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
    <div className="space-y-4">
      {/* 1. Facebook Stories Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
        {/* Create Story Card */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="w-28 sm:w-32 h-44 sm:h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition"
        >
          <div className="h-3/4 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
            {user?.profile?.avatar ? (
              <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition" />
            ) : (
              <div className="w-full h-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xl">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 text-white flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="h-1/4 pt-4 text-center">
            <span className="text-[10px] font-bold text-slate-900 dark:text-white block">Create Story</span>
          </div>
        </div>

        {/* Creator Stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="w-28 sm:w-32 h-44 sm:h-48 rounded-2xl bg-slate-900 border border-slate-800 shrink-0 overflow-hidden relative group cursor-pointer shadow-sm hover:scale-[1.02] transition"
          >
            {story.mediaUrl ? (
              <img src={story.mediaUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-3 flex items-center justify-center text-white text-[11px] font-semibold text-center">
                {story.content}
              </div>
            )}
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-400 overflow-hidden shadow-md">
              {story.user?.profile?.avatar ? (
                <img src={story.user.profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full text-white font-bold text-xs flex items-center justify-center">
                  {story.user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-white font-bold text-[10px] drop-shadow-md truncate">
              {story.user?.profile?.fullName || story.user?.username}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Facebook "What's on your mind?" Composer Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500 overflow-hidden">
            {user?.profile?.avatar ? (
              <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.username?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition truncate"
          >
            What&apos;s on your mind, {user?.profile?.fullName || user?.username || 'Creator'}?
          </button>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Composer Action Pills */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold px-1">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-rose-500"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Live Video</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-emerald-500"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo/Video</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-amber-500"
          >
            <Smile className="w-4 h-4" />
            <span className="hidden sm:inline">Feeling/Activity</span>
          </button>
        </div>
      </div>

      {/* 3. Feed Filter Selector Tabs */}
      <div className="flex items-center justify-around bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm">
        <button
          onClick={() => { setFeedFilter('all'); fetchFeed('all'); }}
          className={`flex-1 py-2 rounded-xl transition ${
            feedFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => { setFeedFilter('following'); fetchFeed('following'); }}
          className={`flex-1 py-2 rounded-xl transition ${
            feedFilter === 'following' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => { setFeedFilter('videos'); fetchFeed('videos'); }}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${
            feedFilter === 'videos' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Videos</span>
        </button>
        <button
          onClick={() => { setFeedFilter('reels'); fetchFeed('reels'); }}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${
            feedFilter === 'reels' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Reels</span>
        </button>
      </div>

      {/* 4. Facebook Feed Post Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading feed posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 font-medium">No activity in this feed yet.</p>
            <p className="text-[11px] text-slate-400">Be the first creator to post or follow active members.</p>
          </div>
        ) : (
          posts.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3 p-4">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/@${item.user?.username}`} className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-indigo-500">
                    {item.user?.profile?.avatar ? (
                      <img src={item.user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      item.user?.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </Link>
                  <div>
                    <Link href={`/@${item.user?.username}`} className="text-xs font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1">
                      <span>{item.user?.profile?.fullName || item.user?.username}</span>
                      {item.user?.profile?.isVerified && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </Link>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>@{item.user?.username}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <Globe className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <button className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Body Content */}
              {item.content && (
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap px-1">
                  {item.content}
                </p>
              )}

              {/* Media Container (Photo, Video, Reel) */}
              {item.media && item.media.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <img src={item.media[0].url} alt="" className="w-full max-h-96 object-cover" />
                </div>
              )}

              {item.isVideo && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
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
              )}

              {item.isReel && (
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
              )}

              {/* Reaction & Comments Counter Row */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                    👍
                  </span>
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">
                    ❤️
                  </span>
                  <span className="ml-1 font-medium">{item._count?.reactions || item.likesCount || 0}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{item._count?.comments || item.commentsCount || 0} comments</span>
                  <span>{item._count?.shares || 0} shares</span>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Facebook Action Buttons (Like, Comment, Share) */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                <button
                  onClick={() => handleReaction(item.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                    item.userReaction ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${item.userReaction ? 'fill-current' : ''}`} />
                  <span>Like</span>
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comment</span>
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
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
