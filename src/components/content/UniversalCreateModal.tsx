'use client';

import React, { useState, useEffect } from 'react';

interface UniversalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UniversalCreateModal({ isOpen, onClose, onSuccess }: UniversalCreateModalProps) {
  const [activeTab, setActiveTab] = useState<'post' | 'video' | 'reel' | 'drafts'>('post');

  // Post form state
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');

  // Video form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumb, setVideoThumb] = useState('');
  const [videoCategory, setVideoCategory] = useState('Tech & Science');

  // Reel form state
  const [reelCaption, setReelCaption] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelAudioTitle, setReelAudioTitle] = useState('Original Audio');

  // Drafts state
  const [drafts, setDrafts] = useState<any[]>([]);

  // Feedback & Loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'drafts') {
      fetchDrafts();
    }
  }, [isOpen, activeTab]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/v1/drafts');
      const data = await res.json();
      if (res.ok) {
        setDrafts(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          type: postImageUrl ? 'image' : 'text',
          mediaUrls: postImageUrl ? [postImageUrl] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post');
      
      setSuccessMsg('Post created successfully!');
      setPostContent('');
      setPostImageUrl('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDesc,
          videoUrl,
          thumbnailUrl: videoThumb,
          category: videoCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish video');

      setSuccessMsg('Video published successfully!');
      setVideoTitle('');
      setVideoDesc('');
      setVideoUrl('');
      setVideoThumb('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: reelCaption,
          videoUrl: reelVideoUrl,
          audioTitle: reelAudioTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish reel');

      setSuccessMsg('Reel published successfully!');
      setReelCaption('');
      setReelVideoUrl('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      let draftData: any = {};
      if (activeTab === 'post') {
        draftData = { type: 'post', content: postContent, mediaJson: JSON.stringify(postImageUrl ? [postImageUrl] : []) };
      } else if (activeTab === 'video') {
        draftData = { type: 'video', title: videoTitle, content: videoDesc, metadataJson: JSON.stringify({ videoUrl, videoThumb, videoCategory }) };
      } else if (activeTab === 'reel') {
        draftData = { type: 'reel', content: reelCaption, metadataJson: JSON.stringify({ reelVideoUrl, reelAudioTitle }) };
      }

      const res = await fetch('/api/v1/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData),
      });
      if (res.ok) {
        setSuccessMsg('Draft saved successfully!');
        setTimeout(() => setSuccessMsg(null), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✨</span> Create Content
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-2xl font-semibold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-4">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
              activeTab === 'post'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📝 Post
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
              activeTab === 'video'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎬 Video
          </button>
          <button
            onClick={() => setActiveTab('reel')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
              activeTab === 'reel'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Reel / Short
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
              activeTab === 'drafts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📂 Drafts
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm">
              {successMsg}
            </div>
          )}

          {/* TAB 1: POST */}
          {activeTab === 'post' && (
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind? Use #hashtags or @mentions..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading || !postContent}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  💾 Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: VIDEO */}
          {activeTab === 'video' && (
            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Video Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter a title for your video"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Video URL (MP4 / WebM) *</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={videoThumb}
                    onChange={(e) => setVideoThumb(e.target.value)}
                    placeholder="https://example.com/thumb.jpg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    <option value="Tech & Science">Tech & Science</option>
                    <option value="Education">Education</option>
                    <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Describe your video, add #hashtags and @mentions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading || !videoTitle}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  💾 Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
                >
                  {loading ? 'Publishing...' : 'Publish Video'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REEL */}
          {activeTab === 'reel' && (
            <form onSubmit={handleCreateReel} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Reel Video URL (9:16 Vertical) *</label>
                <input
                  type="url"
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="https://example.com/reel.mp4"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audio / Music Title</label>
                <input
                  type="text"
                  value={reelAudioTitle}
                  onChange={(e) => setReelAudioTitle(e.target.value)}
                  placeholder="Original Audio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Caption</label>
                <textarea
                  rows={3}
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  placeholder="Add a reel caption with #hashtags..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading || !reelVideoUrl}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  💾 Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
                >
                  {loading ? 'Publishing...' : 'Publish Reel'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DRAFTS */}
          {activeTab === 'drafts' && (
            <div className="space-y-3">
              {drafts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No saved drafts found.
                </div>
              ) : (
                drafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                          {d.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1 font-medium line-clamp-1">
                        {d.title || d.content || 'Untitled Draft'}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await fetch(`/api/v1/drafts/${d.id}`, { method: 'DELETE' });
                        fetchDrafts();
                      }}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 hover:bg-red-950 border border-red-900 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
