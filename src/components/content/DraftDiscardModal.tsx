'use client';

import React from 'react';
import { AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';

interface DraftDiscardModalProps {
  isOpen: boolean;
  onConfirmDiscard: () => void;
  onContinueEditing: () => void;
}

export default function DraftDiscardModal({
  isOpen,
  onConfirmDiscard,
  onContinueEditing,
}: DraftDiscardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden p-6 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">Discard draft?</h3>
          <p className="text-xs text-slate-400">
            If you leave now, your current post details will be lost.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onConfirmDiscard}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Discard
          </button>
          <button
            type="button"
            onClick={onContinueEditing}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}

