'use client';

import React, { useState } from 'react';
import { Type, Image as ImageIcon, Send, Sparkles, Check } from 'lucide-react';
import { CreateModalHeader } from './CreateModalHeader';
import MediaUploader from './MediaUploader';
import UploadProgress from './UploadProgress';
import DraftDiscardModal from './DraftDiscardModal';
import { STORY_PRESETS, StoryPreset } from '@/config/media';
import { uploadMedia } from '@/services/mediaUploadService';

interface StoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

export function StoryCreateModal({ isOpen, onClose, onSuccess, user }: StoryCreateModalProps) {
  const [mode, setMode] = useState<'text' | 'media'>('text');
  const [text, setText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<StoryPreset>(STORY_PRESETS[0]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  if (!isOpen) return null;

  const hasUnsavedChanges = text.trim().length > 0 || !!mediaUrl;

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && !isSubmitting) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const res = await uploadMedia(file, 'story-image', (p) => setUploadProgress(p));
      setMediaUrl(res.url);
      setMode('media');
    } catch (err: any) {
      setUploadError(err.message || 'Story upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (mode === 'text' && !text.trim()) {
      setSubmitError('Please write some text for your story');
      return;
    }
    if (mode === 'media' && !mediaUrl) {
      setSubmitError('Please select a photo or video for your story');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          mediaUrl: mode === 'media' ? mediaUrl : null,
          textOverlay: mode === 'text' ? text.trim() : text.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setText('');
        setMediaUrl(null);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setSubmitError(data.error?.message || data.message || 'Failed to share story');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          <CreateModalHeader title="Create Story" user={user} onClose={handleCloseAttempt} />

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-800 p-2 bg-slate-950/50">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'text'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-4 h-4" /> Text Story
            </button>
            <button
              type="button"
              onClick={() => setMode('media')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'media'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Media Story
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {mode === 'text' ? (
              <div className="space-y-4">
                {/* Visual Canvas */}
                <div
                  className={`w-full aspect-[4/5] max-h-72 rounded-2xl p-6 bg-gradient-to-br ${selectedPreset.gradient} flex items-center justify-center text-center shadow-inner relative overflow-hidden`}
                >
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing your story..."
                    className={`w-full bg-transparent ${selectedPreset.textColor} text-xl font-bold placeholder-white/60 text-center focus:outline-none resize-none leading-relaxed`}
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] bg-black/40 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    24h story
                  </div>
                </div>

                {/* Preset Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">Background Gradient</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {STORY_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${preset.gradient} shrink-0 flex items-center justify-center transition-transform ${
                          selectedPreset.id === preset.id ? 'ring-2 ring-indigo-400 scale-110' : 'hover:scale-105'
                        }`}
                        title={preset.name}
                      >
                        {selectedPreset.id === preset.id && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mediaUrl ? (
                  <div className="relative aspect-[4/5] max-h-72 rounded-2xl overflow-hidden bg-black border border-slate-800">
                    <img src={mediaUrl} alt="Story Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setMediaUrl(null)}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                    >
                      Change Media
                    </button>
                  </div>
                ) : (
                  <MediaUploader
                    purpose="story-image"
                    onFilesSelected={handleFileSelect}
                    label="Upload Photo or Video Story"
                    sublabel="Disappears automatically after 24 hours"
                  />
                )}

                {isUploading && (
                  <UploadProgress progress={uploadProgress} statusText="Uploading story media..." error={uploadError} />
                )}

                {mediaUrl && (
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add an optional caption..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            )}

            {submitError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {submitError}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 p-4 bg-slate-900/90 flex justify-end">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || isUploading || (mode === 'text' && !text.trim()) || (mode === 'media' && !mediaUrl)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Sharing Story...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Share to Story
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <DraftDiscardModal
        isOpen={showDiscardModal}
        onConfirmDiscard={() => {
          setShowDiscardModal(false);
          onClose();
        }}
        onContinueEditing={() => setShowDiscardModal(false)}
      />
    </>
  );
}
