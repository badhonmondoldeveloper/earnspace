'use client';

import { useState, useEffect } from 'react';
import { Film, Plus, Clock } from 'lucide-react';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [textOverlay, setTextOverlay] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch('/api/v1/stories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStories(data.data || []);
        }
      });
  }, []);

  const handlePostStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textOverlay.trim() && !mediaUrl.trim()) return;

    setPosting(true);
    try {
      const res = await fetch('/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textOverlay, mediaUrl, type: mediaUrl ? 'image' : 'text' }),
      });
      const data = await res.json();
      if (data.success) {
        setTextOverlay('');
        setMediaUrl('');
        setStories([data.data, ...stories]);
      }
    } catch (e) {
      console.error('Story post error:', e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-brand-500" />
          <span>EarnSpace Stories</span>
        </h1>
        <p className="text-xs text-slate-500">24-hour expiring moments and updates</p>
      </div>

      {/* Post Story Form */}
      <form onSubmit={handlePostStory} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white">Post 24h Story</h3>
        <input
          type="text"
          value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)}
          placeholder="Story text overlay..."
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        />
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Optional image URL..."
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        />
        <button
          type="submit"
          disabled={posting}
          className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition disabled:opacity-50"
        >
          {posting ? 'Posting...' : 'Share Story'}
        </button>
      </form>

      {/* Active Stories Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stories.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No active stories right now.
          </div>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-600 to-sky-500 p-4 flex flex-col justify-between text-white shadow-md">
              {story.mediaUrl && <img src={story.mediaUrl} alt="Story" className="absolute inset-0 w-full h-full object-cover" />}
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-[10px]">
                  {story.user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-[10px] font-bold">@{story.user?.username}</span>
              </div>
              <p className="relative z-10 text-xs font-semibold text-center drop-shadow">{story.textOverlay}</p>
              <div className="relative z-10 flex items-center gap-1 text-[9px] text-white/80">
                <Clock className="w-3 h-3" />
                <span>Expires in 24h</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

