'use client';

import React, { useRef } from 'react';
import { Image as ImageIcon, X, Upload } from 'lucide-react';

interface ThumbnailUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  onSelectFile: (file: File) => void;
}

export default function ThumbnailUploader({ value, onChange, onSelectFile }: ThumbnailUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
        <img src={value} alt="Thumbnail preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800/90 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Change
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="aspect-video rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center p-4 cursor-pointer transition-all"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="w-10 h-10 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center mb-2">
        <ImageIcon className="w-5 h-5" />
      </div>
      <div className="text-xs font-semibold text-slate-300">Upload 16:9 Custom Thumbnail</div>
      <div className="text-[10px] text-slate-500 mt-0.5">High resolution JPEG or PNG (max 5MB)</div>
    </div>
  );
}
