'use client';

import React, { useState } from 'react';
import { X, Film, Upload, Music, Send } from 'lucide-react';

interface ReelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReelCreateModal({ isOpen, onClose, onSuccess }: ReelCreateModalProps) {
  const [caption, setCaption] = useState('');
  const [audioTitle, setAudioTitle] = useState('Original Audio');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'reel');
    const response = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Reel video upload failed');
    return result.data.url as string;
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    setLoading(true);
    setError(null);

    try {
      const uploadedVideoUrl = await uploadFile(videoFile);

      const res = await fetch('/api/v1/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          videoUrl: uploadedVideoUrl,
          audioTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish reel');

      setCaption('');
      setVideoFile(null);
      setVideoPreview(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Create Facebook Reel</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateReel} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Vertical Video 9:16 Preview Container */}
          <div className="relative w-full aspect-[9/16] max-h-72 mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl flex flex-col justify-center items-center">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 text-xs flex flex-col items-center gap-2 p-4 text-center">
                <Upload className="w-8 h-8 text-indigo-400" />
                <span>Upload a 9:16 vertical MP4 video for your Reel</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Select Reel Video (9:16 MP4) *</label>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleVideoChange}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audio / Song Title</span>
            </label>
            <input
              type="text"
              value={audioTitle}
              onChange={(e) => setAudioTitle(e.target.value)}
              placeholder="Original Audio"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Reel Caption & Hashtags</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your Reel, add #hashtags..."
              className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !videoFile}
            className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing Reel...' : 'Publish Reel'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
