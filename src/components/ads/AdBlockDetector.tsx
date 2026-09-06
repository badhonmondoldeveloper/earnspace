'use client';

import React, { useEffect, useState } from 'react';

export function AdBlockDetector() {
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detect if third party ad script / domain is blocked
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbygoogle ad-unit ad-zone sponsor-box GoogleAd';
    testAd.style.position = 'absolute';
    testAd.style.top = '-9999px';
    testAd.style.left = '-9999px';
    testAd.style.height = '1px';
    testAd.style.width = '1px';
    document.body.appendChild(testAd);

    const timer = setTimeout(() => {
      if (
        testAd.offsetHeight === 0 ||
        testAd.clientWidth === 0 ||
        window.getComputedStyle(testAd).display === 'none' ||
        window.getComputedStyle(testAd).visibility === 'hidden'
      ) {
        setIsAdBlockDetected(true);
      }
      testAd.remove();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (testAd.parentNode) testAd.remove();
    };
  }, []);

  if (!isAdBlockDetected || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-lg flex items-center justify-center shrink-0">
          🛡️
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            Ad Blocker Detected
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </h4>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            EarnSpace creators earn revenue through sponsored ads. Please consider disabling your ad blocker to support Bangladeshi content creators!
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              I Disabled It (Refresh)
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
