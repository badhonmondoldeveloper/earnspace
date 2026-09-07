'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Settings,
  History,
  Activity,
  Megaphone,
  Layers,
  Server,
  BadgeDollarSign,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // If on admin login page, return standalone wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Payment Gateway Numbers 🏦', href: '/admin/payment-accounts', icon: CreditCard },
    { label: 'Multi-User Wallet Finance 💳', href: '/admin/finance', icon: CreditCard },
    { label: 'bKash / Nagad Withdrawals', href: '/admin/withdrawals', icon: DollarSign },
    { label: 'User Management & Badges', href: '/admin/users', icon: Users },
    { label: 'House Ads & SmartLinks 🚀', href: '/admin/ads/house-ads', icon: Megaphone },
    { label: 'Ads Control Center', href: '/admin/ads', icon: Layers },
    { label: 'Ad Providers', href: '/admin/revenue/providers', icon: Server },
    { label: 'Ad Placements', href: '/admin/ads/placements', icon: Layers },
    { label: 'Ad Campaigns', href: '/admin/ads/campaigns', icon: BadgeDollarSign },
    { label: 'Payout Operations', href: '/admin/payouts', icon: DollarSign },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { label: 'Maintenance Mode', href: '/admin/settings/maintenance', icon: Server },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    { label: 'System Health', href: '/admin/system-health', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            title="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2 font-extrabold text-base sm:text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>
              EarnSpace <span className="text-indigo-400">Admin</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit to User App</span>
            <span className="sm:hidden">Exit</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0 p-4 border-r border-slate-800/80 min-h-[calc(100vh-4rem)]">
          <nav className="space-y-1 sticky top-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Slide-out Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex bg-slate-950/80 backdrop-blur-sm">
            <div className="w-4/5 max-w-xs h-full bg-slate-900 flex flex-col border-r border-slate-800 shadow-2xl overflow-y-auto">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Admin Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Content Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
