'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { CreateModalHeader } from './CreateModalHeader';
import PrivacySelector from './PrivacySelector';
import FeelingActivityPicker from './FeelingActivityPicker';
import HashtagInput from './HashtagInput';
import MentionInput from './MentionInput';
import MediaPreview from './MediaPreview';
import UploadProgress from './UploadProgress';
import DraftDiscardModal from './DraftDiscardModal';
import { uploadMedia } from '@/services/mediaUploadService';

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
}

export function PostCreateModal({ isOpen, onClose, onSuccess, user: initialUser }: PostCreateModalProps) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [feeling, setFeeling] = useState<{ emoji: string; label: string } | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (!user) {
      fetch('/api/v1/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) setUser(data.data);
        })
        .catch(() => {});
    }
  }, [user]);

  if (!isOpen) return null;

  const hasUnsavedChanges = content.trim().length > 0 || mediaUrls.length > 0 || hashtags.length > 0;

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && !isSubmitting) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const uploadedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadMedia(file, 'post-image', (p) => {
          const overall = Math.round(((i + p / 100) / files.length) * 100);
          setUploadProgress(overall);
        });
        uploadedList.push(res.url);
      }
      setMediaUrls((prev) => [...prev, ...uploadedList]);
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMentionSelect = (username: string) => {
    setContent((prev) => `${prev} @${username} `);
  };

  const handlePublish = async () => {
    if (!content.trim() && mediaUrls.length === 0) {
      setSubmitError('Please write something or attach photos');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let finalContent = content.trim();
    if (feeling) {
      finalContent += ` — feeling ${feeling.emoji} ${feeling.label}`;
    }
    if (hashtags.length > 0) {
      const tagStr = hashtags.map((t) => `#${t}`).join(' ');
      finalContent += `\n\n${tagStr}`;
    }

    try {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: finalContent,
          type: mediaUrls.length > 0 ? 'image' : 'text',
          visibility: privacy,
          mediaUrls,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContent('');
        setMediaUrls([]);
        setHashtags([]);
        setFeeling(null);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setSubmitError(data.error?.message || data.message || 'Failed to create post');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstName = user?.profile?.fullName
    ? user.profile.fullName.split(' ')[0]
    : user?.username || 'there';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <CreateModalHeader
            title="Create Post"
            user={user}
            privacy={privacy}
            onPrivacyChange={setPrivacy}
            onClose={handleCloseAttempt}
          />

          {/* Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${firstName}?`}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none min-h-[100px]"
            />

            {/* Selected Feeling Badge */}
            {feeling && (
              <div className="pt-1">
                <FeelingActivityPicker value={feeling} onChange={setFeeling} />
              </div>
            )}

            {/* Media Previews */}
            <MediaPreview mediaUrls={mediaUrls} onRemove={handleRemoveMedia} />

            {/* Upload Progress */}
            {isUploading && (
              <UploadProgress progress={uploadProgress} statusText="Uploading media files..." error={uploadError} />
            )}

            {/* Hashtags Input */}
            <div className="pt-2 border-t border-slate-800/80">
              <HashtagInput tags={hashtags} onChange={setHashtags} />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {submitError}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="border-t border-slate-800 p-4 bg-slate-900/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="cursor-pointer p-2 hover:bg-slate-800 text-emerald-400 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium">
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading || isSubmitting}
                  />
                </label>

                <FeelingActivityPicker value={null} onChange={setFeeling} />
                <MentionInput onSelectMention={handleMentionSelect} />
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || isUploading || (!content.trim() && mediaUrls.length === 0)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Publish
                  </>
                )}
              </button>
            </div>
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
