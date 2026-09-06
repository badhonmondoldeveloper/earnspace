'use client';

import React, { useState } from 'react';
import { Video, Image as ImageIcon, DollarSign, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CreateModalHeader } from './CreateModalHeader';
import MediaUploader from './MediaUploader';
import ThumbnailUploader from './ThumbnailUploader';
import UploadProgress from './UploadProgress';
import PrivacySelector from './PrivacySelector';
import DraftDiscardModal from './DraftDiscardModal';
import { VIDEO_CATEGORIES } from '@/config/media';
import { uploadMedia } from '@/services/mediaUploadService';

interface VideoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

export function VideoCreateModal({ isOpen, onClose, onSuccess, user }: VideoCreateModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(VIDEO_CATEGORIES[0]);
  const [privacy, setPrivacy] = useState('public');

  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);

  const [isThumbUploading, setIsThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [thumbError, setThumbError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  if (!isOpen) return null;

  const hasUnsavedChanges = !!videoUrl || title.trim().length > 0;

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && !isSubmitting) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleVideoSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    setIsVideoUploading(true);
    setVideoProgress(10);
    setVideoUploadError(null);

    try {
      const res = await uploadMedia(file, 'video', (p) => setVideoProgress(p));
      setVideoUrl(res.url);
    } catch (err: any) {
      setVideoUploadError(err.message || 'Video upload failed');
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleThumbnailSelect = async (file: File) => {
    setIsThumbUploading(true);
    setThumbProgress(10);
    setThumbError(null);

    try {
      const res = await uploadMedia(file, 'thumbnail', (p) => setThumbProgress(p));
      setThumbnailUrl(res.url);
    } catch (err: any) {
      setThumbError(err.message || 'Thumbnail upload failed');
    } finally {
      setIsThumbUploading(false);
    }
  };

  const isMonetizationEligible = user?.accountType === 'CREATOR' || user?.accountType === 'BUSINESS';

  const handlePublish = async () => {
    if (!videoUrl) {
      setSubmitError('Please select a video file');
      return;
    }
    if (!title.trim()) {
      setSubmitError('Please enter a video title');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          thumbnailUrl,
          title: title.trim(),
          description: description.trim(),
          category,
          visibility: privacy,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVideoUrl(null);
        setThumbnailUrl(null);
        setTitle('');
        setDescription('');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setSubmitError(data.error?.message || data.message || 'Failed to publish video');
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
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          <CreateModalHeader title="Publish Long-Form Video" user={user} onClose={handleCloseAttempt} />

          {/* Stepper Header */}
          <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-semibold bg-slate-950/50">
            <button
              onClick={() => setStep(1)}
              className={`py-2.5 px-3 text-center border-b-2 transition-colors ${
                step === 1 ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              1. Video & Info
            </button>
            <button
              onClick={() => setStep(2)}
              className={`py-2.5 px-3 text-center border-b-2 transition-colors ${
                step === 2 ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              2. Thumbnail
            </button>
            <button
              onClick={() => setStep(3)}
              className={`py-2.5 px-3 text-center border-b-2 transition-colors ${
                step === 3 ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              3. Settings
            </button>
            <button
              onClick={() => setStep(4)}
              className={`py-2.5 px-3 text-center border-b-2 transition-colors ${
                step === 4 ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              4. Monetization
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {step === 1 && (
              <div className="space-y-4">
                {videoUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setVideoUrl(null)}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white text-xs font-semibold rounded-full hover:bg-red-600 transition-colors"
                    >
                      Change Video
                    </button>
                  </div>
                ) : (
                  <MediaUploader
                    accept="video/*"
                    purpose="video"
                    onFilesSelected={handleVideoSelect}
                    label="Upload Long-Form Video"
                    sublabel="Widescreen MP4, WebM (max 100MB)"
                  />
                )}

                {isVideoUploading && (
                  <UploadProgress progress={videoProgress} statusText="Uploading video file..." error={videoUploadError} />
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Video Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging video title..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell viewers what your video is about..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-20"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="text-xs font-semibold text-slate-300 block">Custom 16:9 Cover Thumbnail</label>
                <ThumbnailUploader
                  value={thumbnailUrl}
                  onChange={setThumbnailUrl}
                  onSelectFile={handleThumbnailSelect}
                />
                {isThumbUploading && (
                  <UploadProgress progress={thumbProgress} statusText="Uploading thumbnail..." error={thumbError} />
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {VIDEO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Audience Visibility</label>
                  <PrivacySelector value={privacy} onChange={setPrivacy} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">EarnSpace Monetization Status</h4>
                  </div>
                  {isMonetizationEligible ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Monetization Active — This video is eligible for ad revenue sharing on EarnSpace.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Standard Account — Upgrade to Creator status in Settings to enable video monetization.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {submitError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {submitError}
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="border-t border-slate-800 p-4 bg-slate-900/90 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || isVideoUploading || !videoUrl || !title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Publishing Video...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Publish Video
                  </>
                )}
              </button>
            )}
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
