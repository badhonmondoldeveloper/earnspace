'use client';

import React from 'react';
import { Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';

interface UploadProgressProps {
  progress: number; // 0 - 100
  statusText?: string;
  error?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export default function UploadProgress({
  progress,
  statusText = 'Uploading...',
  error,
  onRetry,
  onCancel,
}: UploadProgressProps) {
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-bold text-red-400">Upload Failed</div>
          <div className="text-xs text-red-300/80 mt-0.5">{error}</div>
          <div className="flex items-center gap-3 mt-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Upload
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{statusText}</span>
        </div>
        <span className="font-bold text-indigo-400">{progress}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {onCancel && progress < 100 && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            Cancel Upload
          </button>
        </div>
      )}
    </div>
  );
}

