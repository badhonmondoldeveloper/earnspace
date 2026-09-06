'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus, Check, Sparkles, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

interface Creator {
  id: string;
  username: string;
  profile?: {
    fullName?: string;
    avatar?: string;
    category?: string;
    isVerified?: boolean;
  };
}

export function RightSidebar({ user }: { user?: any }) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/creators?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.items)) {
          setCreators(data.data.items.filter((c: any) => c.username !== user?.username).slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.username]);

  const handleFollowToggle = async (creatorId: string) => {
    const isFollowing = followingMap[creatorId];
    setFollowingMap((prev) => ({ ...prev, [creatorId]: !isFollowing }));

    try {
      await fetch(`/api/v1/creators/${creatorId}/follow`, {
        method: 'POST',
      });
    } catch {
      setFollowingMap((prev) => ({ ...prev, [creatorId]: isFollowing }));
    }
  };

  const walletBalance = user?.wallet?.balance || 0;
  const payoutThreshold = 10000;
  const progressPercent = Math.min(100, Math.round((walletBalance / payoutThreshold) * 100));

  return (
    <aside className="hidden xl:block w-80 shrink-0 p-4 space-y-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 text-xs">
      {/* Sponsored Ads Widget */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Sponsored</span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Ad</span>
        </div>
        <SmartAdSlot slotName="sidebar" />
      </div>

      {/* Monetization Goal Progress */}
      {user && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-4 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-xs text-indigo-300">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Monetization Goal</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ৳{walletBalance.toLocaleString()} / ৳10,000
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-indigo-950">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              {progressPercent}% towards minimum payout threshold
            </p>
          </div>

          <Link
            href="/dashboard/earnings"
            className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 hover:text-white pt-1 border-t border-indigo-900/40"
          >
            <span>View Earnings Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Suggested Creators to Follow */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Suggested Creators</span>
          </h3>
          <Link href="/explore" className="text-[11px] font-semibold text-indigo-500 hover:underline">
            See All
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-slate-400 text-center py-2 text-[11px]">Loading suggestions...</div>
          ) : creators.length === 0 ? (
            <div className="text-slate-400 text-center py-2 text-[11px]">No creator suggestions right now.</div>
          ) : (
            creators.map((creator) => {
              const isFollowing = followingMap[creator.id];
              return (
                <div key={creator.id} className="flex items-center justify-between gap-2">
                  <Link href={`/@${creator.username}`} className="flex items-center gap-2 min-w-0 flex-1 group">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {creator.profile?.avatar ? (
                        <img src={creator.profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        creator.username[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 truncate flex items-center gap-1">
                        <span>{creator.profile?.fullName || creator.username}</span>
                        {creator.profile?.isVerified && (
                          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">@{creator.username}</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollowToggle(creator.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition shrink-0 flex items-center gap-1 ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer / Copyright Links */}
      <div className="px-2 text-[10px] text-slate-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/about" className="hover:underline">About</Link>
          <span>•</span>
          <Link href="/monetization-policy" className="hover:underline">Monetization</Link>
          <span>•</span>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        <p className="text-slate-500 dark:text-slate-500">© 2026 EarnSpace Inc. All rights reserved.</p>
      </div>
    </aside>
  );
}
