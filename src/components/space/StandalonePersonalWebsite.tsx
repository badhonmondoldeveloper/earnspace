'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  ShoppingBag,
  Share2,
  QrCode,
  Heart,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  DollarSign,
} from 'lucide-react';
import { TemplateBlockRenderer } from '@/components/website/TemplateBlockRenderer';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

interface StandalonePersonalWebsiteProps {
  page?: any;
  user: any;
  profile?: any;
  blogs?: any[];
  blocks?: any[];
  settings?: any;
  isOwner?: boolean;
}

export function StandalonePersonalWebsite({
  page,
  user,
  profile,
  blogs = [],
  blocks = [],
  settings = {},
  isOwner = false,
}: StandalonePersonalWebsiteProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'about' | 'contact'>('home');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const authorName = profile?.fullName || user?.username || 'Creator';
  const authorAvatar = profile?.avatar;
  const bio = profile?.bio || 'Building my professional personal website on EarnSpace.';
  const category = profile?.category || 'Digital Creator';
  const location = profile?.location || 'Dhaka, Bangladesh';
  const websiteUrl = typeof window !== 'undefined' ? window.location.href : `https://earnspace-chi.vercel.app/space/${user?.username}`;

  const theme = settings?.theme || 'modern';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* 1. PROFESSIONAL WEBSITE NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href={`/space/${user?.username}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-lg shadow-indigo-600/30 overflow-hidden group-hover:scale-105 transition-transform">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                authorName[0]?.toUpperCase()
              )}
            </div>
            <div>
              <span className="text-base font-black text-white group-hover:text-indigo-400 transition flex items-center gap-1.5">
                {authorName}
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">{category}</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold">
            {[
              { id: 'home', label: 'Home & Portfolio' },
              { id: 'store', label: 'Store & Downloads' },
              { id: 'about', label: 'About & Resume' },
              { id: 'contact', label: 'Contact & Hire' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              title="Copy Website Link"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share Website'}</span>
            </button>

            {isOwner && (
              <Link
                href="/dashboard/website"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customize Site</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. TOP AD SLOT INJECTION */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4">
        <SmartAdSlot slotName="PERSONAL_SPACE_HEADER" creatorId={user?.id} />
      </div>

      {/* 3. MAIN WEBSITE CONTENT BODY */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* TAB 1: HOME & PORTFOLIO TEMPLATE BLOCKS */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* If template blocks exist, render them via TemplateBlockRenderer */}
            {blocks && blocks.length > 0 ? (
              <TemplateBlockRenderer blocks={blocks} theme={theme} />
            ) : (
              /* Fallback Starter Site Hero when no template applied yet */
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Welcome to My Official Digital Space</span>
                </div>

                <div className="max-w-3xl space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Hi, I&apos;m {authorName} 👋
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">{bio}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 pt-2">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>{category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>{location}</span>
                  </div>
                </div>

                {isOwner && (
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-3">
                    <Link
                      href="/templates"
                      className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Browse 80+ Ready-Made Templates</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Featured Articles & Blog Section */}
            {blogs && blogs.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>Published Articles & Insights</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                    {blogs.length} Articles
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blogs.map((blog: any) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition space-y-2 group"
                    >
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {blog.category || 'Article'}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition line-clamp-2">
                        {blog.title}
                      </h4>
                      {blog.excerpt && <p className="text-xs text-slate-400 line-clamp-2">{blog.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STORE & DOWNLOADS */}
        {activeTab === 'store' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <span>Digital Product Store & Downloads</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Instant file download after bKash / Nagad payment verification.
                </p>
              </div>

              {isOwner && (
                <Link
                  href="/dashboard/products"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
                >
                  + Add Digital Item
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Master Creator Playbook (PDF)', price: '৳499', category: 'E-Book', sales: '140+ sales' },
                { title: 'Lightroom Mobile & Desktop Presets', price: '৳299', category: 'Presets', sales: '280+ sales' },
                { title: '1-on-1 Creator Mentorship Session', price: '৳1,500', category: 'Service', sales: '45 booked' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.sales} • Verified Instant Asset</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                    <span className="text-lg font-black text-indigo-400">{item.price}</span>
                    <button
                      onClick={() => alert(`Purchasing ${item.title} via bKash / Nagad`)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT & RESUME */}
        {activeTab === 'about' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-4">
              About {authorName}
            </h2>

            <div className="space-y-4 max-w-3xl text-sm text-slate-300 leading-relaxed">
              <p>{bio}</p>
              <p>
                Professional Category: <strong className="text-white">{category}</strong>
              </p>
              <p>
                Based in: <strong className="text-white">{location}</strong>
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT & HIRE */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">Work With {authorName}</h2>
              <p className="text-xs text-slate-400">
                Send a project inquiry, sponsorship proposal, or mentorship request.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your inquiry has been sent to the creator.');
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Message / Project Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your project, budget, or sponsorship inquiry..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* 4. FOOTER AD SLOT & COPYRIGHT */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          <SmartAdSlot slotName="website_sticky_footer" creatorId={user?.id} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-900 pt-6">
            <p>© {new Date().getFullYear()} {authorName}. Powered by EarnSpace Website Studio.</p>
            <Link href="/" className="hover:text-slate-300 transition flex items-center gap-1 font-bold">
              <span>Create Your Own Personal Website 🚀</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
