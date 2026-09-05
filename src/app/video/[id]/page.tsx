'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewRecorded = useRef(false);

  useEffect(() => {
    fetchVideo();
    fetchRelated();
  }, [params.id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/videos/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Video not found');
      setVideo(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await fetch('/api/v1/videos?limit=6');
      const data = await res.json();
      if (res.ok) {
        setRelatedVideos((data.data?.items || []).filter((v: any) => v.id !== params.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !viewRecorded.current && videoRef.current.currentTime > 3) {
      viewRecorded.current = true;
      fetch(`/api/v1/videos/${params.id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: Math.floor(videoRef.current.currentTime) }),
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video & Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="aspect-video bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center text-slate-600">
              Loading Video...
            </div>
          ) : error ? (
            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : (
            <>
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  autoPlay
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Stats */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {video.title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-sm text-slate-400 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                      {video.category}
                    </span>
                    <span>👁️ {video.viewsCount.toLocaleString()} views</span>
                    <span>•</span>
                    <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Author Profile Bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <Link
                  href={`/@${video.user.username}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-indigo-500/30">
                    {video.user.profile?.avatar ? (
                      <img
                        src={video.user.profile.avatar}
                        alt={video.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-indigo-400">
                        {video.user.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition">
                      {video.user.profile?.fullName || video.user.username}
                    </h3>
                    <p className="text-xs text-slate-400">
                      @{video.user.username} • {video.user.profile?.followersCount || 0} followers
                    </p>
                  </div>
                </Link>

                <button className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
                  Follow
                </button>
              </div>

              {/* Video Description */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {video.description || 'No description provided.'}
              </div>
            </>
          )}
        </div>

        {/* Sidebar: Related Videos */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            Related Videos
          </h2>
          <div className="space-y-4">
            {relatedVideos.map((v) => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className="flex gap-3 group p-2 rounded-xl hover:bg-slate-900 transition border border-transparent hover:border-slate-800"
              >
                <div className="w-32 aspect-video bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-800">
                  {v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 font-medium">
                      Video
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition line-clamp-2 leading-snug">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {v.user.profile?.fullName || v.user.username}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {v.viewsCount} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
