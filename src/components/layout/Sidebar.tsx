'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  LayoutDashboard,
  Globe,
  Tv,
  Film,
  MessageSquare,
  Bell,
  BookOpen,
  DollarSign,
  Wallet,
  CreditCard,
  Share2,
  Target,
  Megaphone,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'News Feed', href: '/dashboard', icon: Home },
    { label: 'My Profile', href: username ? `/@${username}` : '/settings', icon: User },
    { label: 'Watch Videos', href: '/reels', icon: Tv },
    { label: 'Creator Studio', href: '/creator', icon: LayoutDashboard },
    { label: 'Personal Website', href: '/dashboard/website', icon: Globe },
    { label: 'Stories Carousel', href: '/stories', icon: Film },
    { label: 'Blog Portal', href: '/dashboard/blog', icon: BookOpen },
    { label: 'Messenger', href: '/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Earnings Dashboard', href: '/dashboard/earnings', icon: DollarSign },
    { label: 'Wallet Balance', href: '/wallet', icon: Wallet },
    { label: 'Withdrawal Portal', href: '/withdrawals', icon: CreditCard },
    { label: 'Referral Rewards', href: '/referrals', icon: Share2 },
    { label: 'Ad Campaigns', href: '/campaigns', icon: Target },
    { label: 'Advertiser Desk', href: '/advertiser', icon: Megaphone },
    { label: 'Settings & Privacy', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0 p-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200">
      {/* Quick Profile Card Header */}
      {username && (
        <Link
          href={`/@${username}`}
          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition mb-2 group"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500 shadow-sm">
            {username[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
              @{username}
            </p>
            <p className="text-[10px] text-slate-400">View your profile</p>
          </div>
        </Link>
      )}

      <div className="border-t border-slate-100 dark:border-slate-800/60 my-2" />

      {/* Nav Section Header */}
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">Navigation</p>

      {/* Main Left Menu Links */}
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
