'use client';

import React, { useState } from 'react';
import { X, Globe, Users, Lock, Image as ImageIcon, Smile, Tag, MapPin, Send, Trash2 } from 'lucide-react';

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

const FEELINGS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Excited', emoji: '🚀' },
  { label: 'Creative', emoji: '🎨' },
  { label: 'Blessed', emoji: '😇' },
  { label: 'Watching', emoji: '📺' },
  { label: 'Listening', emoji: '🎧' },
  { label: 'Traveling', emoji: '✈️' },
];

export function PostCreateModal({ isOpen, onClose, onSuccess, user }: PostCreateModalProps) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [selectedFeeling, setSelectedFeeling] = useState<any | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'post-image');
    const response = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Media upload failed');
    return result.data.url as string;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (const file of mediaFiles) {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      }

      let finalContent = content;
      if (selectedFeeling) {
        finalContent += ` — feeling ${selectedFeeling.emoji} ${selectedFeeling.label}`;
      }

      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: finalContent,
          type: uploadedUrls.length > 0 ? 'image' : 'text',
          visibility,
          mediaUrls: uploadedUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish post');

      setContent('');
      setMediaFiles([]);
      setMediaPreviews([]);
      setSelectedFeeling(null);
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
          <h2 className="text-base font-bold text-white">Create Facebook Post</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* User Header & Privacy Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-indigo-500">
              {user?.profile?.avatar ? (
                <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.username?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{user?.profile?.fullName || user?.username || 'Creator'}</span>
                {selectedFeeling && (
                  <span className="text-slate-400 font-normal">is feeling {selectedFeeling.emoji} {selectedFeeling.label}</span>
                )}
              </p>

              {/* Privacy Selector Dropdown */}
              <div className="flex items-center gap-1 mt-1">
                <select
                  value={visibility}
                  onChange={(e: any) => setVisibility(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg px-2 py-0.5 outline-none"
                >
                  <option value="public">🌍 Public</option>
                  <option value="followers">👥 Followers</option>
                  <option value="private">🔒 Only Me</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rich Post Content Area */}
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.profile?.fullName || user?.username || 'Creator'}? Use #hashtags or @mentions...`}
            required={mediaFiles.length === 0}
            className="w-full p-3 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
          />

          {/* Media Previews Grid */}
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden p-2 bg-slate-950 border border-slate-800">
              {mediaPreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Feeling Picker Popup */}
          {showFeelingPicker && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">How are you feeling?</span>
              <div className="flex flex-wrap gap-1.5">
                {FEELINGS.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => {
                      setSelectedFeeling(f);
                      setShowFeelingPicker(false);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1 transition"
                  >
                    <span>{f.emoji}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Post Action Pills Bar */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Add to your post</span>
            <div className="flex items-center gap-1">
              <label className="p-2 rounded-full hover:bg-slate-800 text-emerald-400 cursor-pointer transition" title="Add Photo/Video">
                <ImageIcon className="w-5 h-5" />
                <input type="file" multiple accept="image/*,video/*" onChange={handleMediaAdd} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                className="p-2 rounded-full hover:bg-slate-800 text-amber-400 transition"
                title="Add Feeling/Activity"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (!content.trim() && mediaFiles.length === 0)}
            className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing Post...' : 'Post to Timeline'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
