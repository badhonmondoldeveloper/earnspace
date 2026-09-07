'use client';

import React from 'react';
import { ExternalLink, Sparkles, Play, Mail, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface PageBlockItem {
  id?: string;
  type: string; // hero, links, video, services, contact, portfolio
  contentJson?: string;
  content?: any;
}

interface TemplateBlockRendererProps {
  blocks: PageBlockItem[];
  theme?: string;
}

export function TemplateBlockRenderer({ blocks, theme = 'modern' }: TemplateBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-6 w-full mb-8 animate-in fade-in duration-300">
      {blocks.map((block, idx) => {
        let content: any = {};
        try {
          content = typeof block.contentJson === 'string'
            ? JSON.parse(block.contentJson)
            : block.content || {};
        } catch {
          content = block.content || {};
        }

        switch (block.type) {
          case 'hero':
            return (
              <div
                key={block.id || idx}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-slate-800 p-8 sm:p-10 text-white shadow-2xl"
              >
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Space Hero</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    {content.title || 'Welcome to My Official Space'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    {content.subtitle || 'Explore my latest digital work, media releases, and services.'}
                  </p>

                  {content.ctaText && (
                    <a
                      href={content.ctaUrl || '#content'}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                    >
                      <span>{content.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );

          case 'links':
            const links = content.links || [];
            return (
              <div
                key={block.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {content.title || 'Quick Connect Links'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-between border border-slate-200 dark:border-slate-700/60 shadow-xs group"
                    >
                      <span className="truncate">{link.title || link.name || 'External Link'}</span>
                      <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            );

          case 'video':
            return (
              <div
                key={block.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm"
              >
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-500" />
                  <span>{content.title || 'Featured Media Masterclass'}</span>
                </h3>
                {content.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{content.description}</p>
                )}
                {content.videoUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <iframe
                      src={content.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={content.title || 'Video Player'}
                    />
                  </div>
                )}
              </div>
            );

          case 'services':
            const items = content.items || [];
            return (
              <div
                key={block.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {content.title || 'Featured Products & Services'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((srv: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{srv.name || srv.title}</h4>
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{srv.price}</span>
                        </div>
                        {srv.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{srv.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => alert(`Book / Purchase ${srv.name || srv.title}`)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition"
                      >
                        Book Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'contact':
            return (
              <div
                key={block.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm"
              >
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {content.title || 'Work & Sponsorship Inquiries'}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {content.email && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span>{content.email}</span>
                    </div>
                  )}
                  {content.location && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span>{content.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
