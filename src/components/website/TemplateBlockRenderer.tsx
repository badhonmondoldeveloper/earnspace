'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  Play,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Star,
  ShoppingBag,
  Zap,
  Send,
  Check,
  Globe,
} from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

interface PageBlockItem {
  id?: string;
  type: string; // hero, links, video, services, contact, portfolio, gallery, testimonials, pricing, store, newsletter, ad_banner
  contentJson?: string;
  content?: any;
}

interface TemplateBlockRendererProps {
  blocks: PageBlockItem[];
  theme?: string;
  creatorId?: string;
}

export function TemplateBlockRenderer({ blocks, theme = 'modern', creatorId }: TemplateBlockRendererProps) {
  const [submittedLead, setSubmittedLead] = useState<string | null>(null);
  const [leadFormData, setLeadFormData] = useState({ name: '', email: '', message: '' });
  const [sendingLead, setSendingLead] = useState(false);

  if (!blocks || blocks.length === 0) return null;

  const handleLeadSubmit = async (e: React.FormEvent, blockId?: string) => {
    e.preventDefault();
    if (!leadFormData.email || !leadFormData.message) return;

    try {
      setSendingLead(true);
      const res = await fetch('/api/v1/connect/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadFormData.name,
          email: leadFormData.email,
          message: leadFormData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedLead(blockId || 'default');
        setLeadFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingLead(false);
    }
  };

  return (
    <div className="space-y-8 w-full mb-8 animate-in fade-in duration-300">
      {blocks.map((block, idx) => {
        let content: any = {};
        try {
          content = typeof block.contentJson === 'string'
            ? JSON.parse(block.contentJson)
            : block.content || {};
        } catch {
          content = block.content || {};
        }

        const blockKey = block.id || `block-${idx}`;

        switch (block.type) {
          case 'hero':
            return (
              <div
                key={blockKey}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800/80 p-8 sm:p-12 text-white shadow-2xl"
              >
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{content.badge || 'Official Space Hero'}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    {content.title || 'Welcome to My Official Digital Space'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                    {content.subtitle || 'Explore my latest projects, digital releases, and professional services.'}
                  </p>

                  {content.ctaText && (
                    <div className="pt-2">
                      <a
                        href={content.ctaUrl || '#content'}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold transition shadow-xl shadow-indigo-600/30"
                      >
                        <span>{content.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );

          case 'links':
            const links = content.links || [];
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>{content.title || 'Quick Links & Social Hub'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-slate-950/70 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-between border border-slate-800 shadow-sm group"
                    >
                      <span className="truncate">{link.title || link.name || 'External Link'}</span>
                      <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            );

          case 'services':
            const items = content.items || [];
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{content.title || 'Services & Consultations'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((srv: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{srv.name || srv.title}</h4>
                          <span className="text-xs font-black text-emerald-400">{srv.price}</span>
                        </div>
                        {srv.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>
                        )}
                      </div>
                      <a
                        href={srv.url || '#contact'}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center block shadow-md shadow-indigo-600/20 transition"
                      >
                        Book Service
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'video':
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-rose-500" />
                  <span>{content.title || 'Featured Media Masterclass'}</span>
                </h3>
                {content.description && (
                  <p className="text-xs text-slate-300">{content.description}</p>
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

          case 'gallery':
          case 'portfolio':
            const galleryImages = content.images || content.items || [];
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>{content.title || 'Portfolio & Creative Work'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((img: any, i: number) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={typeof img === 'string' ? img : img.url}
                        alt={img.caption || 'Portfolio Image'}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 p-3 text-[11px] font-medium text-slate-200">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'testimonials':
            const reviews = content.reviews || content.items || [];
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{content.title || 'Client Testimonials & Reviews'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.map((rev: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 italic">&quot;{rev.text || rev.quote}&quot;</p>
                      <div className="text-[11px] font-bold text-indigo-400">— {rev.author || rev.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'pricing':
            const plans = content.plans || content.items || [];
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>{content.title || 'Membership & Pricing Plans'}</span>
                  </h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🎁 1-Month Free Trial Included
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{plan.name}</span>
                        <div className="text-2xl font-black text-white">{plan.price}</div>
                        {plan.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                        )}
                      </div>
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-xs font-bold shadow-md transition">
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'contact':
          case 'newsletter':
            return (
              <div
                key={blockKey}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <span>{content.title || 'Send a Direct Message / Inquire'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {content.subtitle || 'Submissions are delivered directly to creator dashboard inbox.'}
                  </p>
                </div>

                {submittedLead === blockKey ? (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Thank you! Your message has been sent directly to the creator.</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleLeadSubmit(e, blockKey)} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 transition"
                      />
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 transition"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Your Message / Inquiry Details..."
                      rows={3}
                      value={leadFormData.message}
                      onChange={(e) => setLeadFormData({ ...leadFormData, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 transition"
                      required
                    />
                    <button
                      type="submit"
                      disabled={sendingLead}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingLead ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            );

          case 'ad_banner':
            return (
              <div key={blockKey} className="w-full">
                <SmartAdSlot slotName={content.slotName || 'FEED_INLINE'} creatorId={creatorId} />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
