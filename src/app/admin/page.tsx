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
  FileText,
  Settings,
  Sparkles,
  AlertTriangle,
  Radio,
  Sliders,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Zap,
  Lock,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adsActive, setAdsActive] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, finRes] = await Promise.all([
        fetch('/api/v1/admin/dashboard').then((r) => r.json()),
        fetch('/api/v1/admin/finance/overview').then((r) => r.json()),
      ]);

      if (dashRes.success) setData(dashRes.data);
      if (finRes.success) setFinanceData(finRes.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const users = data?.users || { total: 0, active: 0, suspended: 0 };
  const creators = data?.creators || { total: 0, active: 0, monetized: 0 };
  const revenue = data?.revenue || { gross: 0, userShare: 0, platformShare: 0 };
  const withdrawals = data?.withdrawals || { pending: 0, completed: 0 };
  const finMetrics = financeData?.metrics || { totalWallets: 0, frozenWallets: 0, totalAvailableBalance: 0, totalPendingBalance: 0 };

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
    <div className="space-y-8 text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Activity className="w-7 h-7 text-indigo-400" />
            <span>Master Admin & Operations Control Desk</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time management for users, multi-user wallets, bKash/Nagad payouts, house ads & site configuration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
            title="Refresh All Real-time Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleAds}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              adsActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{adsActive ? 'Ads Engine: ACTIVE' : 'Ads Engine: OFF'}</span>
          </button>

          <button
            onClick={handleToggleMaintenance}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              maintenanceMode ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{maintenanceMode ? 'Maintenance: ON' : 'Maintenance: OFF'}</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-700 text-indigo-200 text-xs font-bold flex items-center gap-2 shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* 1. MASTER QUICK ACTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/finance"
          className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition space-y-2 group shadow-md"
        >
          <div className="flex items-center justify-between text-indigo-400">
            <Wallet className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-base font-black text-white">Multi-User Wallets</div>
          <p className="text-[11px] text-slate-400">৳{finMetrics.totalAvailableBalance.toLocaleString()} System Available</p>
        </Link>

        <Link
          href="/admin/withdrawals"
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition space-y-2 group shadow-md"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <CreditCard className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-base font-black text-white">bKash/Nagad Payouts</div>
          <p className="text-[11px] text-slate-400">{withdrawals.pending || 0} Pending Withdrawals</p>
        </Link>

        <Link
          href="/admin/ads/house-ads"
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition space-y-2 group shadow-md"
        >
          <div className="flex items-center justify-between text-amber-400">
            <Megaphone className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-base font-black text-white">House Ads & SmartLinks</div>
          <p className="text-[11px] text-slate-400">Publish manual ads & high-CPM links</p>
        </Link>

        <Link
          href="/admin/users"
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition space-y-2 group shadow-md"
        >
          <div className="flex items-center justify-between text-purple-400">
            <Users className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-base font-black text-white">User Management</div>
          <p className="text-[11px] text-slate-400">{users.total || 0} Registered Users</p>
        </Link>
      </div>

      {/* 2. REAL METRICS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
            <span>User Network</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Accounts</span>
              <span className="font-bold text-white text-sm">{users.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Monetized Creators</span>
              <span className="font-bold text-emerald-400 text-sm">{creators.monetized}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Suspended / Restricted</span>
              <span className="font-bold text-rose-400 text-sm">{users.suspended}</span>
            </div>
          </div>
        </div>

        {/* Financial Balances */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
            <span>System Financials</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total User Available</span>
              <span className="font-bold text-emerald-400 text-sm">৳{finMetrics.totalAvailableBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Holds</span>
              <span className="font-bold text-amber-400 text-sm">৳{finMetrics.totalPendingBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Frozen Wallets</span>
              <span className="font-bold text-rose-400 text-sm">{finMetrics.frozenWallets}</span>
            </div>
          </div>
        </div>

        {/* Payout & Ads Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Payouts & Operations</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Payout Requests</span>
              <span className="font-bold text-amber-400 text-sm">{withdrawals.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Completed Payouts</span>
              <span className="font-bold text-white text-sm">{withdrawals.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">House Ads Engine</span>
              <span className="font-bold text-emerald-400 text-sm">Active & Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MASTER OPERATIONS DESK LINKS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Master Operations Directory</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-bold">
          {[
            { label: 'Multi-User Finance', href: '/admin/finance', icon: Wallet },
            { label: 'bKash Withdrawals', href: '/admin/withdrawals', icon: CreditCard },
            { label: 'User Management', href: '/admin/users', icon: Users },
            { label: 'House Ads & SmartLinks', href: '/admin/ads/house-ads', icon: Megaphone },
            { label: 'Ad Placements', href: '/admin/ads/placements', icon: Radio },
            { label: 'Ad Campaigns', href: '/admin/ads/campaigns', icon: TrendingUp },
            { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
            { label: 'System Health', href: '/admin/system-health', icon: Activity },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-2.5"
              >
                <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
