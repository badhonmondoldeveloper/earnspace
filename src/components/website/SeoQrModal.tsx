'use client';

import React, { useState } from 'react';
import { Globe, QrCode, Download, Share2, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface SeoQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  initialSeoTitle?: string;
  initialSeoDesc?: string;
  onSaveSeo: (seoTitle: string, seoDesc: string) => void;
}

export function SeoQrModal({
  isOpen,
  onClose,
  websiteUrl,
  initialSeoTitle = '',
  initialSeoDesc = '',
  onSaveSeo,
}: SeoQrModalProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'qr'>('seo');
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDesc, setSeoDesc] = useState(initialSeoDesc);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSeo(seoTitle, seoDesc);
    onClose();
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(websiteUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" /> SEO & QR Code Tools
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'seo' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            SEO Meta Tags
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            QR Code Generator
          </button>
        </div>

        {activeTab === 'seo' ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">SEO Title</label>
              <input
                type="text"
                placeholder="e.g. Badhon Mondol — Official Creator Space"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Meta Description</label>
              <textarea
                rows={3}
                placeholder="e.g. Explore my portfolio, latest YouTube uploads, Lightroom presets, and contact for sponsorships."
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Save SEO Settings
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg border border-slate-200">
              <img src={qrImageUrl} alt="Website QR Code" className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center justify-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
              <span className="font-mono text-slate-300 truncate">{websiteUrl}</span>
              <button
                onClick={copyUrl}
                className="px-2.5 py-1 bg-indigo-600 text-white font-bold rounded-lg shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <a
              href={qrImageUrl}
              download="website-qr.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <Download className="w-4 h-4" /> Download High-Res QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeoQrModal;
