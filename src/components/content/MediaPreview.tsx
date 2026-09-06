'use client';

import React from 'react';
import { X, Play } from 'lucide-react';

interface MediaPreviewProps {
  mediaUrls: string[];
  onRemove: (index: number) => void;
  isVideo?: boolean;
}

export default function MediaPreview({ mediaUrls, onRemove, isVideo = false }: MediaPreviewProps) {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  if (isVideo) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-64">
        <video src={mediaUrls[0]} controls className="w-full h-full object-contain" />
        <button
          type="button"
          onClick={() => onRemove(0)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const count = mediaUrls.length;

  if (count === 1) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-80 group">
        <img src={mediaUrls[0]} alt="Upload preview" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onRemove(0)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors opacity-90 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {mediaUrls.map((url, idx) => (
          <div key={idx} className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden group">
            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (count === 3 || count === 4) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {mediaUrls.map((url, idx) => (
          <div key={idx} className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden group">
            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // 5+ items
  const displayItems = mediaUrls.slice(0, 4);
  const remainingCount = mediaUrls.length - 4;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
      {displayItems.map((url, idx) => {
        const isLast = idx === 3;
        return (
          <div key={idx} className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden group">
            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            {isLast && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xl font-bold">
                +{remainingCount}
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

