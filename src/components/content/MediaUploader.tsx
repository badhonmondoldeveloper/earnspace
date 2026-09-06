'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Film } from 'lucide-react';
import { MEDIA_CONFIG } from '@/config/media';

interface MediaUploaderProps {
  accept?: string;
  multiple?: boolean;
  purpose: 'avatar' | 'cover' | 'post-image' | 'story-image' | 'thumbnail' | 'video' | 'reel';
  onFilesSelected: (files: File[]) => void;
  label?: string;
  sublabel?: string;
}

export default function MediaUploader({
  accept = 'image/*,video/*',
  multiple = false,
  purpose,
  onFilesSelected,
  label = 'Drag and drop media files here',
  sublabel,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const policy = MEDIA_CONFIG.policies[purpose];
  const maxMb = policy ? (policy.maxBytes / (1024 * 1024)).toFixed(0) : '10';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArr);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      onFilesSelected(filesArr);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
        <UploadCloud className="w-6 h-6" />
      </div>

      <div className="text-sm font-semibold text-slate-200">{label}</div>
      <div className="text-xs text-slate-400 mt-1">
        {sublabel || `Supported files up to ${maxMb}MB`}
      </div>
    </div>
  );
}
