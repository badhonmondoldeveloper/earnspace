'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface StoryViewerModalProps {
  stories: any[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewerModal({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
}: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const activeStory = stories[currentIndex];
    if (activeStory?.id) {
      // Register story view
      fetch(`/api/v1/stories/${activeStory.id}/view`, { method: 'POST' }).catch(() => {});
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, stories]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-sm sm:max-w-md h-[90vh] max-h-[700px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Progress Bar Container */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          {stories.map((s, idx) => (
            <div key={s.id || idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Top Header Bar */}
        <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-indigo-400 overflow-hidden flex items-center justify-center text-white font-bold text-xs">
              {currentStory.user?.profile?.avatar ? (
                <img src={currentStory.user.profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                currentStory.user?.username?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-white drop-shadow">
                {currentStory.user?.profile?.fullName || currentStory.user?.username}
              </p>
              <p className="text-[10px] text-slate-300 drop-shadow">
                {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Media or Text Content */}
        <div className="relative flex-1 flex items-center justify-center bg-slate-950 overflow-hidden">
          {currentStory.mediaUrl ? (
            <img src={currentStory.mediaUrl} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 flex items-center justify-center text-white text-lg font-bold text-center leading-relaxed">
              {currentStory.content || currentStory.textOverlay}
            </div>
          )}

          {/* Navigation Tap Overlay Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur transition z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur transition z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Story Footer Bar */}
        <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>{currentStory._count?.views || currentStory.viewsCount || 1} views</span>
          </div>
          <span className="text-[10px] text-slate-400">Expires in 24 hours</span>
        </div>
      </div>
    </div>
  );
}
