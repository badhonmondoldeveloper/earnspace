'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Plus,
  Edit3,
  Sliders,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe,
  Clock,
  Sparkles,
  Heart,
  Share2,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  ExternalLink,
  Users,
  Film,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { FacebookPostCard } from '@/components/social/FacebookPostCard';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { EditFacebookProfileModal } from '@/components/modals/EditFacebookProfileModal';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

interface FacebookProfileSpaceProps {
  user: any;
  profile: any;
  posts?: any[];
  reels?: any[];
  videos?: any[];
  blogs?: any[];
  blocks?: any[];
  isOwner?: boolean;
}

export function FacebookProfileSpace({
  user,
  profile: initialProfile,
  posts = [],
  reels = [],
  videos = [],
  blogs = [],
  blocks = [],
  isOwner = false,
}: FacebookProfileSpaceProps) {
  const [profile, setProfile] = useState<any>(initialProfile || {});
  const [activeTab, setActiveTab] = useState<'posts' | 'store' | 'memberships' | 'about' | 'followers' | 'photos' | 'videos' | 'reels' | 'referrals'>('posts');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);

  const authorName = profile?.fullName || user?.username || 'Creator';
  const authorAvatar = profile?.avatar;
  const coverPhoto = profile?.coverPhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200';
  const work = profile?.work || 'Digital Creator & Entrepreneur';
  const education = profile?.education || 'University Graduate';
  const location = profile?.location || 'Dhaka, Bangladesh';
  const websiteUrl = profile?.websiteUrl || `https://earnspace-chi.vercel.app/space/${user?.username}`;

  // Fallback 9-Grid Photo Array
  const samplePhotos = (posts || [])
    .filter((p) => p.media && p.media.length > 0)
    .map((p) => p.media[0].url)
    .concat([
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    ])
    .slice(0, 9);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. FACEBOOK COVER PHOTO & AVATAR HEADER */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Cover Banner */}
          <div className="relative w-full h-48 sm:h-72 md:h-80 bg-slate-800 overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
            <img src={coverPhoto} alt="Cover Banner" className="w-full h-full object-cover" />
            
            {/* Edit Cover Photo Button */}
            {isOwner && (
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
              >
                <Camera className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* Profile Header Details Bar */}
          <div className="px-4 sm:px-8 pb-4 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Left: Overlapping Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Facebook Profile Picture Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-indigo-600 text-white font-extrabold text-4xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden shrink-0">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.[0]?.toUpperCase() || 'U'
                  )}
                </div>

                {isOwner && (
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="absolute bottom-1 right-1 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 border-2 border-white dark:border-slate-900 shadow-md transition"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Name & Bio Tagline */}
              <div className="space-y-1 pb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                  <span>{authorName}</span>
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  @{user?.username || 'username'} • {profile?.category || 'Creator'}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-slate-900">A</div>
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-slate-900">B</div>
                    <div className="w-6 h-6 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-slate-900">C</div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {profile?.followersCount || 128} followers • {posts.length} posts
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Facebook Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto pt-2 sm:pt-0">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Story</span>
              </button>

              {isOwner ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowTipModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Tip via bKash</span>
                </button>
              )}

              <Link
                href="/creator"
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1"
                title="Creator Studio"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
              </Link>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* FACEBOOK PROFILE NAVIGATION TABS */}
          <div className="flex items-center justify-start sm:justify-start gap-1 overflow-x-auto px-4 py-1 no-scrollbar text-xs font-bold">
            {[
              { id: 'posts', label: 'Posts' },
              { id: 'store', label: 'Digital Store 🛍️' },
              { id: 'memberships', label: 'VIP Memberships ⭐' },
              { id: 'about', label: 'About' },
              { id: 'followers', label: `Followers (${profile?.followersCount || 128})` },
              { id: 'photos', label: `Photos (${samplePhotos.length})` },
              { id: 'videos', label: `Videos (${videos.length})` },
              { id: 'reels', label: `Reels (${reels.length})` },
              { id: 'referrals', label: 'Referral Hub' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-xl transition whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN BODY GRID CONTAINER */}
      <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 flex-1">
        {/* Top Header Sponsored Ad Slot */}
        <SmartAdSlot slotName="PERSONAL_SPACE_HEADER" creatorId={user?.id} className="mb-6" />

        {/* TAB 1: POSTS FEED & 2-COLUMN FACEBOOK GRID */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: INTRO, PHOTOS, FOLLOWERS (4 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Facebook Intro Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Intro</h3>

                {profile?.bio && (
                  <p className="text-xs text-center text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {profile.bio}
                  </p>
                )}

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Work at <strong className="text-slate-900 dark:text-white">{work}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Studied at <strong className="text-slate-900 dark:text-white">{education}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Lives in <strong className="text-slate-900 dark:text-white">{location}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                      {websiteUrl}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Joined EarnSpace Network</span>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition text-center"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {/* Photos 9-Grid Preview Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Photos</h3>
                  <button onClick={() => setActiveTab('photos')} className="text-xs font-bold text-blue-500 hover:underline">
                    See all photos
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
                  {samplePhotos.map((imgUrl, i) => (
                    <div key={i} className="aspect-square bg-slate-800 overflow-hidden hover:opacity-90 transition cursor-pointer">
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Followers 9-Grid Preview Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Followers</h3>
                    <p className="text-[10px] text-slate-400">{profile?.followersCount || 128} followers</p>
                  </div>
                  <button onClick={() => setActiveTab('followers')} className="text-xs font-bold text-blue-500 hover:underline">
                    See all
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['Sarah Chen', 'Rahim Ahmed', 'Karim Hasan', 'Anika Tabassum', 'David Miller', 'Elena Rostova'].map((name, i) => (
                    <div key={i} className="text-center space-y-1">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {name[0]}
                      </div>
                      <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Sponsored Ad Slot */}
              <SmartAdSlot slotName="PERSONAL_SPACE_SIDEBAR" creatorId={user?.id} />
            </div>

            {/* RIGHT COLUMN: CREATE POST & FEED (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Facebook Create Post Composer Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium transition"
                  >
                    What&apos;s on your mind, {authorName.split(' ')[0]}?
                  </button>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="flex items-center justify-around text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-rose-500"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo/video</span>
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-amber-500"
                  >
                    <Smile className="w-4 h-4" />
                    <span>Feeling/activity</span>
                  </button>
                </div>
              </div>

              {/* Feed Header Bar */}
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Posts</h3>
                <button className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Feed Stream */}
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400 space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-indigo-500" />
                    <p className="font-bold text-slate-900 dark:text-white">No posts yet on {authorName}&apos;s profile.</p>
                    <p>Be the first to share a post or tip the creator!</p>
                  </div>
                ) : (
                  posts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                      <FacebookPostCard
                        post={{
                          ...post,
                          user: { id: user?.id, username: user?.username, fullName: authorName, avatar: authorAvatar },
                        }}
                      />
                      {(idx + 1) % 2 === 0 && (
                        <SmartAdSlot slotName="PERSONAL_SPACE_CONTENT" creatorId={user?.id} className="my-3" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DIGITAL STORE */}
        {activeTab === 'store' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Digital Product Store</span>
                  <span className="text-xs bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-full">Instant Download</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Exclusive e-books, templates, presets, and digital assets by {authorName}.</p>
              </div>

              {isOwner && (
                <Link
                  href="/dashboard/products"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
                >
                  + Manage Store
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Master Creator Playbook (PDF)', price: '৳499', category: 'E-Book', sales: 48 },
                { title: 'Premere Pro Video Presets Pack', price: '৳299', category: 'Video Assets', sales: 112 },
                { title: 'Monetization & Ads Strategy Guide', price: '৳199', category: 'Guide', sales: 84 },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/50 transition">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-500">{item.sales} downloads • Verified Digital File</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{item.price}</span>
                    <button
                      onClick={() => alert(`Purchase ${item.title} via bKash / Wallet`)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CREATOR MEMBERSHIPS */}
        {activeTab === 'memberships' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="text-center max-w-lg mx-auto space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">Exclusive Access</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Become a VIP Supporter of {authorName}</h2>
              <p className="text-xs text-slate-500">Unlock subscriber-only badges, secret posts, 1-on-1 chats & priority replies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Supporter', price: '৳99', period: '/month', badge: 'Silver', perks: ['Supporter Badge on comments', 'Subscriber-only post feed', 'Direct comment replies'] },
                { name: 'VIP Member', price: '৳299', period: '/month', badge: 'Gold', perks: ['Gold Supporter Badge', 'All Supporter perks', 'Direct 1-on-1 messaging', 'Early video releases'] },
                { name: 'Elite Club', price: '৳599', period: '/month', badge: 'Platinum', perks: ['Platinum Supporter Badge', 'All VIP perks', 'Monthly 1-on-1 Q&A Call', 'Free Digital Downloads'] },
              ].map((tier, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition relative overflow-hidden">
                  {i === 1 && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">MOST POPULAR</span>
                  )}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{tier.badge} Tier</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{tier.name}</h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                      <span className="text-xs text-slate-400 font-semibold">{tier.period}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {tier.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => alert(`Join ${tier.name} (৳${tier.price}/mo) via bKash / Wallet`)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-black text-xs shadow-md transition"
                  >
                    Join {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              About {authorName}
            </h2>

            <div className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-indigo-400">Bio</h4>
                <p className="leading-relaxed">{profile?.bio || 'No bio specified.'}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Work & Profession</h4>
                  <p className="text-slate-500">{work}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Education</h4>
                  <p className="text-slate-500">{education}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Location</h4>
                  <p className="text-slate-500">{location}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Website</h4>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {websiteUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS (PHOTOS, REELS, REFERRALS) */}
        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Photo Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {samplePhotos.map((imgUrl, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-800 hover:opacity-90 transition">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 text-center max-w-xl mx-auto shadow-sm">
            <Sparkles className="w-10 h-10 mx-auto text-indigo-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Join EarnSpace via {authorName}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your account on EarnSpace using {authorName}&apos;s referral link to start building your website & earning ad revenue!
            </p>
            <Link
              href={`/register?ref=${user?.username}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditFacebookProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        profile={profile}
        onSaved={(updated) => setProfile((prev: any) => ({ ...prev, ...updated }))}
      />

      {/* CREATE POST MODAL */}
      <UniversalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
