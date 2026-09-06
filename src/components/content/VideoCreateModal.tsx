'use client';

import React, { useState } from 'react';
import { X, Video, Upload, Image as ImageIcon, Send } from 'lucide-react';

interface VideoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function VideoCreateModal({ isOpen, onClose, onSuccess }: VideoCreateModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech & Science');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
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

  const uploadFile = async (file: File, purpose: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    const response = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'File upload failed');
    return result.data.url as string;
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const uploadedVideoUrl = await uploadFile(videoFile, 'video');
      const uploadedThumbUrl = thumbFile ? await uploadFile(thumbFile, 'thumbnail') : undefined;

      const res = await fetch('/api/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          videoUrl: uploadedVideoUrl,
          thumbnailUrl: uploadedThumbUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish video');

      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbFile(null);
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Publish Watch Video</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateVideo} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* 16:9 Video Preview */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl flex flex-col justify-center items-center">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 text-xs flex flex-col items-center gap-2 p-4 text-center">
                <Upload className="w-8 h-8 text-indigo-400" />
                <span>Upload a 16:9 widescreen video file (MP4 / WebM)</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Video Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive video title..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Select Video File *</label>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoChange}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Custom Cover Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
            >
              <option value="Tech & Science">Tech & Science</option>
              <option value="Education">Education</option>
              <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business & Finance">Business & Finance</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Video Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video, list links, add #hashtags..."
              className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !videoFile || !title.trim()}
            className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing Video...' : 'Publish Watch Video'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
