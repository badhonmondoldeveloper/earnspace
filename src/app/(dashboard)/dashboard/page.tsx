'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Send, Heart, MessageSquare, Share2, Bookmark, Image as ImageIcon, Globe, Lock, Users } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

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
    fetch(`/api/v1/posts?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items) {
          setPosts(data.data.items);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setPosting(true);
    try {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: postContent, visibility }),
      });
      const data = await res.json();
      if (data.success) {
        setPostContent('');
        setPosts([data.data, ...posts]);
      }
    } catch (error) {
      console.error('Post creation error:', error);
    } finally {
      setPosting(false);
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
      {/* Overview Real Stats (Section 36 Requirement: Real data only, 0 for new accounts) */}
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
          <span className="text-xs text-slate-500 font-medium">Posts</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.postsCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Articles</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.profile?.blogsCount || 0}</p>
        </div>
      </div>

      {/* Post Composer Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share your thoughts, updates, or ideas with your Space..."
            className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none"
          />

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <select
                value={visibility}
                onChange={(e: any) => setVisibility(e.target.value)}
                className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="public">Public</option>
                <option value="followers">Followers Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={posting || !postContent.trim()}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{posting ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => { setFeedFilter('all'); fetchFeed('all'); }}
          className={`pb-2 transition border-b-2 ${
            feedFilter === 'all' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => { setFeedFilter('following'); fetchFeed('following'); }}
          className={`pb-2 transition border-b-2 ${
            feedFilter === 'following' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Following
        </button>
      </div>

      {/* Social Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 font-medium">No posts in your feed yet.</p>
            <p className="text-[11px] text-slate-400">Be the first to post or follow creators to populate your timeline.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                    {post.user?.profile?.avatar ? (
                      <img src={post.user.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      post.user?.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <a href={`/@${post.user?.username}`} className="text-xs font-bold text-slate-900 dark:text-white hover:underline">
                      {post.user?.profile?.fullName || post.user?.username}
                    </a>
                    <span className="text-[10px] text-slate-400 block">@{post.user?.username} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

              {/* Engagement Buttons */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <button
                  onClick={() => handleReaction(post.id)}
                  className={`flex items-center gap-1.5 transition ${
                    post.userReaction ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.userReaction ? 'fill-current' : ''}`} />
                  <span>{post._count?.reactions || 0}</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post._count?.comments || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

