'use client';

import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Type, Upload, Check } from 'lucide-react';

interface StoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const GRADIENT_PRESETS = [
  { id: 'indigo', name: 'Indigo Night', class: 'from-indigo-950 via-slate-900 to-purple-950 text-white' },
  { id: 'sunset', name: 'Sunset Gold', class: 'from-amber-600 via-rose-600 to-purple-800 text-white' },
  { id: 'neon', name: 'Neon Cyber', class: 'from-cyan-900 via-blue-950 to-indigo-900 text-cyan-200' },
  { id: 'rose', name: 'Rose Velvet', class: 'from-rose-900 via-purple-950 to-slate-900 text-rose-100' },
  { id: 'emerald', name: 'Emerald Forest', class: 'from-emerald-950 via-slate-900 to-teal-950 text-emerald-200' },
  { id: 'purple', name: 'Royal Purple', class: 'from-purple-950 via-indigo-900 to-slate-950 text-purple-200' },
];

export function StoryCreateModal({ isOpen, onClose, onSuccess }: StoryCreateModalProps) {
  const [storyType, setStoryType] = useState<'text' | 'media'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'story-image');
    const response = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Media upload failed');
    return result.data.url as string;
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let uploadedMediaUrl = '';
      if (storyType === 'media') {
        if (!mediaFile) throw new Error('Please select a photo or video for your story');
        uploadedMediaUrl = await uploadFile(mediaFile);
      } else {
        if (!textContent.trim()) throw new Error('Please write some text for your story');
      }

      const res = await fetch('/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: storyType,
          content: storyType === 'text' ? textContent : textContent,
          mediaUrl: uploadedMediaUrl,
          textOverlay: storyType === 'media' ? textContent : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create story');

      setTextContent('');
      setMediaFile(null);
      setMediaPreview(null);
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
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Create Facebook Story</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Mode Toggle */}
        <div className="flex border-b border-slate-800 p-2 bg-slate-950/40 gap-2">
          <button
            onClick={() => setStoryType('text')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              storyType === 'text'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Create Text Story</span>
          </button>

          <button
            onClick={() => setStoryType('media')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              storyType === 'media'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Create Photo/Media Story</span>
          </button>
        </div>

        {/* Form Body & Preview Container */}
        <form onSubmit={handleCreateStory} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Story Live Preview Container */}
          <div className="relative w-full aspect-[9/16] max-h-72 mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-center items-center p-6 text-center">
            {storyType === 'text' ? (
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient.class} p-6 flex items-center justify-center text-center font-bold text-lg leading-relaxed`}>
                {textContent || 'Start typing your story...'}
              </div>
            ) : (
              <>
                {mediaPreview ? (
                  <img src={mediaPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-indigo-400" />
                    <span>Upload a photo or video to preview</span>
                  </div>
                )}

                {textContent && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur p-2.5 rounded-xl text-white text-xs font-medium text-center drop-shadow">
                    {textContent}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Text Story Gradient Preset Selectors */}
          {storyType === 'text' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Choose Background Gradient</label>
              <div className="grid grid-cols-6 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedGradient(preset)}
                    className={`h-8 rounded-xl bg-gradient-to-br ${preset.class} relative border ${
                      selectedGradient.id === preset.id ? 'ring-2 ring-indigo-400 border-white' : 'border-transparent'
                    }`}
                  >
                    {selectedGradient.id === preset.id && (
                      <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Controls */}
          {storyType === 'media' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Select Image/Video File</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">
              {storyType === 'text' ? 'Story Text *' : 'Caption Overlay (Optional)'}
            </label>
            <textarea
              rows={3}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={storyType === 'text' ? 'Type your story message...' : 'Add a caption overlay...'}
              required={storyType === 'text'}
              className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Publishing Story...' : 'Share to Story (24 Hours)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
