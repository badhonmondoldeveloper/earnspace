'use client';

import React, { useState } from 'react';
import { Film, Music, Send, Sparkles, AlertCircle } from 'lucide-react';
import { CreateModalHeader } from './CreateModalHeader';
import MediaUploader from './MediaUploader';
import UploadProgress from './UploadProgress';
import HashtagInput from './HashtagInput';
import DraftDiscardModal from './DraftDiscardModal';
import { uploadMedia } from '@/services/mediaUploadService';

interface ReelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

export function ReelCreateModal({ isOpen, onClose, onSuccess, user }: ReelCreateModalProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [audioTitle, setAudioTitle] = useState('Original Audio');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [aspectWarning, setAspectWarning] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  if (!isOpen) return null;

  const hasUnsavedChanges = !!videoUrl || caption.trim().length > 0;

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

    // Client aspect ratio check for warning
    const videoElem = document.createElement('video');
    videoElem.src = URL.createObjectURL(file);
    videoElem.onloadedmetadata = () => {
      if (videoElem.videoWidth > videoElem.videoHeight) {
        setAspectWarning('Landscape video detected. 9:16 vertical video recommended for Reels.');
      } else {
        setAspectWarning(null);
      }
      URL.revokeObjectURL(videoElem.src);
    };

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const res = await uploadMedia(file, 'reel', (p) => setUploadProgress(p));
      setVideoUrl(res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Reel upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!videoUrl) {
      setSubmitError('Please select a video for your Reel');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let finalCaption = caption.trim();
    if (hashtags.length > 0) {
      const tagStr = hashtags.map((t) => `#${t}`).join(' ');
      finalCaption += finalCaption ? `\n\n${tagStr}` : tagStr;
    }

    try {
      const res = await fetch('/api/v1/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          caption: finalCaption,
          audioTitle: audioTitle.trim() || 'Original Audio',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVideoUrl(null);
        setCaption('');
        setHashtags([]);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setSubmitError(data.error?.message || data.message || 'Failed to publish Reel');
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
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          <CreateModalHeader title="Create Reel" user={user} onClose={handleCloseAttempt} />

          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {videoUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 9:16 Vertical Video Preview */}
                <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-slate-800 max-h-72 mx-auto">
                  <video src={videoUrl} controls className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setVideoUrl(null)}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white text-[10px] font-bold rounded-full hover:bg-red-600 transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption for your Reel..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-24"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-indigo-400" /> Audio Title
                    </label>
                    <input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      placeholder="Original Audio"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <HashtagInput tags={hashtags} onChange={setHashtags} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <MediaUploader
                  accept="video/*"
                  purpose="reel"
                  onFilesSelected={handleFileSelect}
                  label="Select Reel Video"
                  sublabel="Vertical 9:16 video up to 90 seconds (MP4, WebM)"
                />

                {isUploading && (
                  <UploadProgress progress={uploadProgress} statusText="Uploading Reel video..." error={uploadError} />
                )}
              </div>
            )}

            {aspectWarning && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aspectWarning}</span>
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
              disabled={isSubmitting || isUploading || !videoUrl}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Publishing Reel...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Share Reel
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
