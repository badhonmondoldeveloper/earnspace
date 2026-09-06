'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, MessageSquare, Share2, Heart, ExternalLink } from 'lucide-react';
import { PostReactionPicker, REACTIONS } from '@/components/content/PostReactionPicker';
import { FanSupportModal } from '@/components/modals/FanSupportModal';

interface PostAuthor {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

interface PostMedia {
  id: string;
  url: string;
  type: string;
}

interface PostData {
  id: string;
  userId: string;
  content: string;
  type?: string;
  createdAt: string;
  user: PostAuthor;
  media?: PostMedia[];
  reactionsCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  userReaction?: string | null;
}

interface FacebookPostCardProps {
  post: PostData;
  onReaction?: (postId: string, reactionType: string) => void;
}

export function FacebookPostCard({ post, onReaction }: FacebookPostCardProps) {
  const [userReaction, setUserReaction] = useState<string | null>(post.userReaction || null);
  const [reactionsCount, setReactionsCount] = useState<number>(post.reactionsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount || 0);
  const [sharesCount, setSharesCount] = useState<number>(post.sharesCount || 0);

  // Tip Modal State
  const [showTipModal, setShowTipModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const authorName = post.user?.fullName || post.user?.username || 'EarnSpace User';
  const authorAvatar = post.user?.avatar;

  const handleReactionChange = async (postId: string, reactionType: string) => {
    const isRemoving = userReaction === reactionType;
    const nextReaction = isRemoving ? null : reactionType;
    
    setUserReaction(nextReaction);
    setReactionsCount((prev) => (isRemoving ? Math.max(0, prev - 1) : userReaction ? prev : prev + 1));

    try {
      const res = await fetch(`/api/v1/posts/${postId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reactionType }),
      });
      if (onReaction) onReaction(postId, reactionType);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/v1/posts/${post.id}/comments`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setComments(json.data);
      }
    } catch (err) {
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await fetch(`/api/v1/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newCommentText.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setComments((prev) => [json.data, ...prev]);
        setCommentsCount((prev) => prev + 1);
        setNewCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/@${post.user.username}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setSharesCount((prev) => prev + 1);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const activeReactionObj = REACTIONS.find((r) => r.type === userReaction);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg hover:shadow-xl transition-shadow">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <Link href={`/@${post.user.username}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center border-2 border-indigo-500 overflow-hidden shrink-0 shadow-sm">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              authorName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
              {authorName}
              <span className="text-[10px] text-indigo-400 font-mono">@{post.user.username}</span>
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span>🌐 Public</span>
            </div>
          </div>
        </Link>

        {/* Tip Button */}
        <button
          onClick={() => setShowTipModal(true)}
          className="px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold transition flex items-center gap-1 shadow-sm"
        >
          <span>💖 Tip</span>
        </button>
      </div>

      {/* 2. Text Content */}
      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* 3. Media Gallery */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-96">
          <img
            src={post.media[0].url}
            alt="Post content"
            className="w-full h-full object-cover max-h-96"
          />
        </div>
      )}

      {/* 4. Stats Counter Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        <div className="flex items-center gap-1 font-medium">
          <span className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">👍</span>
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">❤️</span>
          </span>
          <span className="ml-1 font-semibold">{reactionsCount}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button onClick={toggleComments} className="hover:underline">
            {commentsCount} Comments
          </button>
          <span>•</span>
          <button onClick={handleShare} className="hover:underline">
            {sharesCount} Shares
          </button>
        </div>
      </div>

      {/* 5. Action Buttons Bar */}
      <div className="grid grid-cols-3 gap-1 border-t border-slate-100 dark:border-slate-800 pt-2">
        <PostReactionPicker
          postId={post.id}
          userReaction={userReaction}
          onReactionChange={handleReactionChange}
        />

        <button
          onClick={toggleComments}
          className="flex items-center justify-center gap-2 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-xs"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedShare ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* 6. Comments Section */}
      {showComments && (
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-150">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition"
            >
              Post
            </button>
          </form>

          {loadingComments ? (
            <div className="text-center text-xs text-slate-500 py-2">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-2">Be the first to comment!</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{c.user?.fullName || c.user?.username || 'User'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fan Tip Modal */}
      <FanSupportModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        creatorId={post.userId}
        creatorName={authorName}
        creatorAvatar={authorAvatar}
      />
    </div>
  );
}
