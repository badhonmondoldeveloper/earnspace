'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, CreditCard, ShieldAlert, FileText, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-500" />
          <span>Operations & SaaS Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400">Real-time database aggregated metrics & platform financial balances</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
          <p className="text-3xl font-extrabold text-white">{users.total}</p>
          <span className="text-[10px] text-emerald-400 block">{users.active} Active accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Gross Revenue Processed</span>
          <p className="text-3xl font-extrabold text-emerald-400">${revenue.gross.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400 block">Net Platform Share: ${revenue.platformShare.toFixed(2)}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">User Revenue Share Pool</span>
          <p className="text-3xl font-extrabold text-brand-400">${revenue.userShare.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400 block">Creator Share Allocation (50%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Pending Withdrawals</span>
          <p className="text-3xl font-extrabold text-amber-400">{withdrawals.pending}</p>
          <span className="text-[10px] text-slate-400 block">{withdrawals.completed} Completed payouts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Creators</span>
          <p className="text-3xl font-extrabold text-white">{creators.total}</p>
          <span className="text-[10px] text-emerald-400">{creators.monetized} monetized · {creators.pendingApplications} pending</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Content Inventory</span>
          <p className="text-3xl font-extrabold text-white">{content.posts + content.videos + content.reels + content.blogs}</p>
          <span className="text-[10px] text-slate-400">Posts, videos, reels, and blogs</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Comments & Reports</span>
          <p className="text-3xl font-extrabold text-white">{content.comments}</p>
          <span className="text-[10px] text-amber-400">{content.reports} moderation items</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Active Campaigns</span>
          <p className="text-3xl font-extrabold text-white">{data?.campaigns || 0}</p>
          <span className="text-[10px] text-cyan-400">{data?.advertisers || 0} active advertisers</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Operations Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <a href="/admin/users" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-semibold block text-center">
            User Management
          </a>
          <a href="/admin/withdrawals" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-semibold block text-center">
            Review Withdrawals ({withdrawals.pending})
          </a>
          <a href="/admin/settings" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-semibold block text-center">
            Platform Settings
          </a>
          <a href="/admin/audit-logs" className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-semibold block text-center">
            Audit Logs
          </a>
        </div>
      </div>
    </div>
  );
}

