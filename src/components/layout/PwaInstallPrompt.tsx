'use client';

import React, { useEffect, useState } from 'react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
          🚀
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">Install EarnSpace App</h4>
          <p className="text-[11px] text-slate-400 truncate">Fast mobile experience & offline access</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="w-7 h-7 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
