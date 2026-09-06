'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Globe,
  Mail,
  ArrowUpRight,
  Play,
  BookOpen,
  Briefcase,
  ExternalLink,
  Film,
  Video as VideoIcon,
  Share2,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { FacebookPostCard } from '@/components/social/FacebookPostCard';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { FanSupportModal } from '@/components/modals/FanSupportModal';

interface PersonalSpaceClientContainerProps {
  page: any;
  user: any;
  profile: any;
  posts: any[];
  reels: any[];
  videos: any[];
  blogs: any[];
  stories: any[];
  blocks: any[];
  settings: any;
}

const THEME_CLASSES: Record<string, { bg: string; card: string; text: string; subtext: string; accent: string }> = {
  modern: { bg: 'bg-slate-950', card: 'bg-slate-900/90 border-slate-800', text: 'text-white', subtext: 'text-slate-400', accent: 'bg-indigo-600 hover:bg-indigo-500' },
  minimal: { bg: 'bg-slate-900', card: 'bg-slate-900 border-slate-800', text: 'text-slate-100', subtext: 'text-slate-400', accent: 'bg-slate-800 hover:bg-slate-700' },
  cyber: { bg: 'bg-black', card: 'bg-zinc-950 border-cyan-900/60', text: 'text-cyan-100', subtext: 'text-cyan-400/80', accent: 'bg-cyan-600 hover:bg-cyan-500 text-white' },
  creator: { bg: 'bg-slate-950', card: 'bg-indigo-950/40 border-indigo-800/50', text: 'text-white', subtext: 'text-slate-300', accent: 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90' },
  sunset: { bg: 'bg-stone-950', card: 'bg-stone-900/90 border-stone-800', text: 'text-stone-100', subtext: 'text-stone-400', accent: 'bg-rose-600 hover:bg-rose-500' },
};

export function PersonalSpaceClientContainer({
  page,
  user,
  profile,
  posts,
  reels,
  videos,
  blogs,
  stories,
  blocks,
  settings,
}: PersonalSpaceClientContainerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'reels' | 'videos' | 'blogs' | 'referrals'>('overview');
  const [showTipModal, setShowTipModal] = useState(false);

  const themeKey = settings?.theme || 'modern';
  const theme = THEME_CLASSES[themeKey] || THEME_CLASSES.modern;

  const authorName = profile?.fullName || user.username;
  const authorAvatar = profile?.avatar;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} selection:bg-indigo-500 selection:text-white flex flex-col`}>
      {/* Top Fixed Floating Branding Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowTipModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-xs font-bold text-white shadow-lg transition flex items-center gap-1.5"
        >
          <span>💖 Tip Creator</span>
        </button>

        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/15 text-white transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by EarnSpace</span>
        </Link>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 py-10 space-y-8 flex-1">
        {/* Header Hero Section */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${theme.card} text-center space-y-5 shadow-2xl relative overflow-hidden`}>
          <div className="w-28 h-28 mx-auto rounded-full bg-indigo-600 text-white font-extrabold text-4xl flex items-center justify-center border-4 border-indigo-500 shadow-2xl overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              user.username[0]?.toUpperCase()
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
              {authorName}
              {profile?.isVerified && <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />}
            </h1>
            <p className="text-xs font-mono text-indigo-400">@{user.username}</p>
            {profile?.bio && <p className={`text-xs ${theme.subtext} max-w-md mx-auto leading-relaxed`}>{profile.bio}</p>}
          </div>

          {/* Social Stats Counter */}
          <div className="flex items-center justify-center gap-6 text-xs border-t border-slate-800/80 pt-4">
            <div>
              <span className="font-bold text-white block text-sm">{profile?.followersCount || 0}</span>
              <span className={theme.subtext}>Followers</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="font-bold text-white block text-sm">{posts.length}</span>
              <span className={theme.subtext}>Posts</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="font-bold text-white block text-sm">{reels.length}</span>
              <span className={theme.subtext}>Reels</span>
            </div>
          </div>

          {/* Action Buttons & Social Marketing Share Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowTipModal(true)}
                className={`px-6 py-2.5 rounded-full ${theme.accent} font-bold text-xs shadow-lg transition flex items-center gap-2`}
              >
                <span>Support Creator via bKash / Nagad</span>
                <span>💖</span>
              </button>
            </div>

            {/* Marketing Share Buttons */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Share Space:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `https://earnspace-chi.vercel.app/space/${user.username}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[11px] font-bold transition flex items-center gap-1"
              >
                📘 Facebook
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${authorName}'s official EarnSpace blog website & digital space: https://earnspace-chi.vercel.app/space/${user.username}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition flex items-center gap-1"
              >
                💬 WhatsApp
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Website link copied! Share it on social media to get visitors & ad revenue.');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Top Header Sponsored Ad Slot */}
        <SmartAdSlot slotName="PERSONAL_SPACE_HEADER" creatorId={user.id} />

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'posts', label: `Posts (${posts.length})` },
            { id: 'reels', label: `Reels (${reels.length})` },
            { id: 'videos', label: `Videos (${videos.length})` },
            { id: 'blogs', label: `Blogs (${blogs.length})` },
            { id: 'referrals', label: 'Referral Hub' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & HYBRID BUILDER BLOCKS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Creator Referral Hub Card */}
              <div className={`p-5 rounded-2xl border ${theme.card} space-y-3`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Join EarnSpace</h3>
                <p className={`text-xs ${theme.subtext}`}>Join EarnSpace using {authorName}&apos;s invite link and start earning!</p>
                <Link
                  href={`/register?ref=${user.username}`}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition block text-center"
                >
                  <span>Register & Earn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sidebar Ad Slot */}
              <SmartAdSlot slotName="PERSONAL_SPACE_SIDEBAR" creatorId={user.id} />
            </div>

            {/* Main Content Stream */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customizable Builder Blocks */}
              {blocks.map((block) => {
                let content: any = {};
                try {
                  content = JSON.parse(block.contentJson || '{}');
                } catch (e) {}

                if (block.type === 'text') {
                  return (
                    <div key={block.id} className={`p-5 rounded-2xl border ${theme.card} space-y-2`}>
                      {content.title && <h3 className="text-sm font-bold text-white">{content.title}</h3>}
                      <p className={`text-xs ${theme.subtext} whitespace-pre-wrap leading-relaxed`}>{content.body}</p>
                    </div>
                  );
                }

                if (block.type === 'links') {
                  return (
                    <div key={block.id} className="space-y-2">
                      {content.title && <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{content.title}</h3>}
                      {(content.links || []).map((l: any, i: number) => (
                        <a
                          key={i}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3.5 rounded-xl border ${theme.card} hover:border-indigo-500 text-xs font-semibold transition`}
                        >
                          <span>{l.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  );
                }

                return null;
              })}

              {/* Posts Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Recent Posts & Feed</span>
                </h3>

                {posts.length === 0 ? (
                  <div className={`p-8 text-center text-xs ${theme.subtext} border ${theme.card} rounded-2xl`}>
                    No posts published yet.
                  </div>
                ) : (
                  posts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                      <FacebookPostCard
                        post={{
                          ...post,
                          user: { id: user.id, username: user.username, fullName: profile?.fullName, avatar: profile?.avatar },
                        }}
                      />
                      {(idx + 1) % 2 === 0 && (
                        <SmartAdSlot slotName="PERSONAL_SPACE_CONTENT" creatorId={user.id} className="my-3" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS */}
        {activeTab === 'posts' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {posts.map((post, idx) => (
              <React.Fragment key={post.id}>
                <FacebookPostCard
                  post={{
                    ...post,
                    user: { id: user.id, username: user.username, fullName: profile?.fullName, avatar: profile?.avatar },
                  }}
                />
                {(idx + 1) % 2 === 0 && (
                  <SmartAdSlot slotName="PERSONAL_SPACE_CONTENT" creatorId={user.id} className="my-3" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* TAB 3: REELS */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {reels.map((r) => (
              <div key={r.id} className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative group border border-slate-800">
                <video src={r.videoUrl} poster={r.thumbnailUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center text-lg shadow-lg">
                    ▶
                  </div>
                </div>
                {r.caption && (
                  <div className="absolute bottom-2 left-2 right-2 text-white font-bold text-xs truncate drop-shadow-md">
                    {r.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: VIDEOS */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v) => (
              <Link key={v.id} href={`/video/${v.id}`} className="space-y-2 group block">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800">
                  <video src={v.videoUrl} poster={v.thumbnailUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center text-xl shadow-lg">
                      ▶
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition">{v.title}</h4>
              </Link>
            ))}
          </div>
        )}

        {/* TAB 5: BLOGS */}
        {activeTab === 'blogs' && (
          <div className="grid gap-4">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className={`p-5 rounded-2xl border ${theme.card} hover:border-indigo-500 transition block space-y-2`}
              >
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                {b.excerpt && <p className={`text-xs ${theme.subtext} line-clamp-2`}>{b.excerpt}</p>}
                <div className="text-[10px] text-indigo-400 font-semibold">Read Full Article →</div>
              </Link>
            ))}
          </div>
        )}

        {/* TAB 6: REFERRAL HUB */}
        {activeTab === 'referrals' && (
          <div className={`p-6 rounded-3xl border ${theme.card} space-y-4 text-center max-w-xl mx-auto`}>
            <h3 className="text-lg font-bold text-white">Join EarnSpace via {authorName}</h3>
            <p className={`text-xs ${theme.subtext}`}>
              Sign up today to build your own personal website, upload stories & reels, and earn revenue share!
            </p>
            <Link
              href={`/register?ref=${user.username}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Create Your Own Space Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Fan Support Tipping Modal */}
      <FanSupportModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        creatorId={user.id}
        creatorName={authorName}
        creatorAvatar={authorAvatar}
      />
    </div>
  );
}
