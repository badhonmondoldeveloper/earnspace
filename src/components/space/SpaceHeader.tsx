'use client';

import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Sparkles,
  UserPlus,
  UserCheck,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Heart,
  Edit,
  Globe,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface SpaceHeaderProps {
  profileData: any;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onOpenEditModal: () => void;
  onOpenCoverModal: () => void;
  onOpenAvatarModal: () => void;
  onOpenTippingModal: () => void;
}

export function SpaceHeader({
  profileData,
  isOwnProfile,
  isFollowing,
  onFollowToggle,
  onOpenEditModal,
  onOpenCoverModal,
  onOpenAvatarModal,
  onOpenTippingModal,
}: SpaceHeaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const profile = profileData?.profile || {};
  const fullName = profile.fullName || profileData?.username || 'EarnSpace User';
  const username = profileData?.username || '';
  const avatarUrl = profile.avatar || '/default-avatar.png';
  const coverUrl = profile.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const referralCode = profileData?.referralCode || username;
  const referralUrl = `https://earnspace-chi.vercel.app/register?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const accountTypeBadge = profileData?.accountType === 'CREATOR'
    ? 'PRO CREATOR'
    : profileData?.accountType === 'BUSINESS'
    ? 'BUSINESS SPACE'
    : 'MEMBER';

  return (
    <div className="relative bg-slate-900 border-b border-slate-800">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-72 w-full overflow-hidden bg-slate-950">
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {isOwnProfile && (
          <button
            onClick={onOpenCoverModal}
            className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" /> Change Cover
          </button>
        )}
      </div>

      {/* Main Profile Info Section */}
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 md:-mt-20 gap-4 relative z-10">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 bg-slate-950 overflow-hidden shadow-2xl">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`;
                  }}
                />
              </div>

              {isOwnProfile && (
                <button
                  onClick={onOpenAvatarModal}
                  className="absolute bottom-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full border-2 border-slate-900 shadow-lg transition-transform hover:scale-110"
                  title="Update profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{fullName}</h1>
                {profileData?.isEmailVerified && (
                  <span title="Verified Creator">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  {accountTypeBadge}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                <span>@{username}</span>
                {profile.category && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-400 font-semibold">{profile.category}</span>
                  </>
                )}
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed pt-1">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {!isOwnProfile ? (
              <>
                <button
                  onClick={onFollowToggle}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isFollowing
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Follow
                    </>
                  )}
                </button>

                <Link
                  href={`/messages?user=${username}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </Link>

                <button
                  onClick={onOpenTippingModal}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 text-rose-200 fill-rose-200" /> Tip Creator
                </button>
              </>
            ) : (
              <button
                onClick={onOpenEditModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" /> Edit Personal Website
              </button>
            )}

            <button
              onClick={copyReferralLink}
              className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Copy referral link to invite & earn"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Referral Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
