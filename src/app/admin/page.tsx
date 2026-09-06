'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  DollarSign,
  CreditCard,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  XCircle,
  FileText,
  Settings,
  Sparkles,
  AlertTriangle,
  Radio,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adsActive, setAdsActive] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('Welcome to EarnSpace Bangladesh!');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const users = data?.users || { total: 0, active: 0, suspended: 0 };
  const creators = data?.creators || { total: 0, active: 0, monetized: 0, pendingApplications: 0 };
  const content = data?.content || { posts: 0, photos: 0, videos: 0, reels: 0, blogs: 0, stories: 0, comments: 0, reports: 0 };
  const revenue = data?.revenue || { gross: 0, userShare: 0, platformShare: 0 };
  const withdrawals = data?.withdrawals || { pending: 0, completed: 0 };

  const handleToggleAds = () => {
    setAdsActive(!adsActive);
    setMsg(`Global House Ads Engine set to ${!adsActive ? 'ACTIVE' : 'INACTIVE'}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleToggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    setMsg(`Site Maintenance Mode ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span>Master Admin & Operations Desk</span>
          </h1>
          <p className="text-xs text-slate-400">Complete control over users, bKash/Nagad payouts, ads monetization, and site settings</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAds}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              adsActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{adsActive ? 'Ads Engine: ON' : 'Ads Engine: OFF'}</span>
          </button>

          <button
            onClick={handleToggleMaintenance}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              maintenanceMode ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{maintenanceMode ? 'Maintenance: ON' : 'Maintenance: OFF'}</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-700 text-indigo-200 text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* 1. Core Financial & Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 space-y-2 shadow-md">
          <span className="text-xs font-semibold text-slate-400">Gross Platform Revenue</span>
          <p className="text-3xl font-black text-emerald-400">৳{(revenue.gross * 115).toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 block">Total Ads & Subscriptions Collected</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Creator Revenue Share Pool</span>
          <p className="text-3xl font-black text-indigo-400">৳{(revenue.userShare * 115).toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 block">55% Allocated to Bangladeshi Creators</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">bKash / Nagad Payout Queue</span>
          <p className="text-3xl font-black text-amber-400">{withdrawals.pending} requests</p>
          <span className="text-[10px] text-slate-400 block">{withdrawals.completed} Completed payouts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
          <p className="text-3xl font-black text-white">{users.total}</p>
          <span className="text-[10px] text-emerald-400 block">{users.active} Active accounts</span>
        </div>
      </div>

      {/* 2. Content & Creator Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Monetized Creators</span>
          <p className="text-3xl font-black text-white">{creators.monetized}</p>
          <span className="text-[10px] text-indigo-400 font-bold">{creators.pendingApplications} pending applications</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Published Content</span>
          <p className="text-3xl font-black text-white">{content.posts + content.videos + content.reels + content.blogs}</p>
          <span className="text-[10px] text-slate-400">Posts, videos, reels, blogs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Stories & Comments</span>
          <p className="text-3xl font-black text-white">{content.stories + content.comments}</p>
          <span className="text-[10px] text-emerald-400">24-hour active stories & discussion</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Moderation Items</span>
          <p className="text-3xl font-black text-amber-400">{content.reports}</p>
          <span className="text-[10px] text-slate-400">Flagged content reports</span>
        </div>
      </div>

      {/* 3. 20+ Master Admin Navigation Controls Hub */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>20+ Master Controlling Desks</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link href="/admin/users" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            👥 User Management
          </Link>

          <Link href="/admin/withdrawals" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            💳 bKash / Nagad Payouts ({withdrawals.pending})
          </Link>

          <Link href="/admin/monetization/programs" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            🎨 Creator Monetization Desk
          </Link>

          <Link href="/admin/ads/house-ads" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            📢 House Ads & CPM Rates
          </Link>

          <Link href="/admin/ads/placements" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            🎯 Ad Placements Setup
          </Link>

          <Link href="/admin/audit-logs" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            📜 Immutable Audit Logs
          </Link>

          <Link href="/admin/system-health" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            ⚡ System Health & DB Ops
          </Link>

          <Link href="/admin/settings" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-bold text-center block text-white border border-slate-700">
            ⚙️ Platform Global Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
