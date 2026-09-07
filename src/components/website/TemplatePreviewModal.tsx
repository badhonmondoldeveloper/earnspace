'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  Sparkles,
  Check,
  Globe,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { TemplateDefinition } from '@/lib/templates/templateRegistry';

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (slug: string) => void;
}

export function TemplatePreviewModal({ template, isOpen, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'portfolio' | 'services' | 'contact'>('home');

  if (!isOpen || !template) return null;

  const viewportWidths = {
    desktop: 'w-full max-w-5xl',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[375px] max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Preview Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xs shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">{template.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {template.category} • {template.style}
              </span>
              {template.isPro && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">{template.description}</p>
          </div>
        </div>

        {/* Viewport Switcher Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUseTemplate(template.slug)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            Use This Template <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Simulated Canvas Frame */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-slate-950">
        <div
          className={`${viewportWidths[viewport]} transition-all duration-300 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 min-h-[600px] overflow-hidden flex flex-col`}
        >
          {/* Simulated Browser Header Navigation Bar */}
          <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between text-xs">
            <div className="font-black text-sm tracking-tight flex items-center gap-1.5 text-white">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px]">
                🚀
              </div>
              <span>{template.name} Demo</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
              {['Home', 'About', 'Portfolio', 'Services', 'Contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as any)}
                  className={`hover:text-white transition-colors ${
                    activeTab === tab.toLowerCase() ? 'text-indigo-400 font-bold underline underline-offset-4' : ''
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="hidden sm:block text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Interactive Demo
            </div>
          </div>

          {/* Render Pre-configured Blocks */}
          <div className="p-6 space-y-8 flex-1">
            {template.blocks.map((b, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 relative group"
              >
                {b.type === 'hero' && (
                  <div className="text-center py-8 space-y-4 max-w-2xl mx-auto">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                      {template.subcategory || template.category}
                    </span>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {b.content?.title || 'Welcome to My Space'}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {b.content?.subtitle || 'Digital Creator & Entrepreneur'}
                    </p>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30">
                      {b.content?.ctaText || 'Explore Work'}
                    </button>
                  </div>
                )}

                {b.type === 'links' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {b.content?.title || 'Featured Links'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {b.content?.links?.map((link: any, i: number) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-indigo-500 text-xs font-bold text-slate-200 flex items-center justify-between transition-colors"
                        >
                          <span>{link.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {b.type === 'services' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {b.content?.title || 'Services & Offerings'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {b.content?.items?.map((item: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-white">{item.name}</span>
                            <span className="text-emerald-400 font-mono">{item.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {b.type === 'contact' && (
                  <div className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-xl border border-indigo-500/30 text-center space-y-2">
                    <h4 className="text-sm font-bold text-white">{b.content?.title || 'Get In Touch'}</h4>
                    <p className="text-xs text-indigo-300">{b.content?.email || 'contact@domain.com'}</p>
                    {b.content?.location && (
                      <p className="text-[11px] text-slate-400">{b.content.location}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePreviewModal;
