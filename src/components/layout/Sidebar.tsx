'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Globe, Film, BookOpen, MessageSquare, Bell, DollarSign, Wallet, CreditCard, Share2, Target, Megaphone, Settings } from 'lucide-react';

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: username ? `/@${username}` : '/settings', icon: User },
    { label: 'Reels Feed', href: '/reels', icon: Film },
    { label: 'Creator Studio', href: '/creator', icon: LayoutDashboard },
    { label: 'My Website', href: '/dashboard/website', icon: Globe },
    { label: 'Stories', href: '/stories', icon: Film },
    { label: 'Blog Portal', href: '/dashboard/blog', icon: BookOpen },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Withdrawals', href: '/withdrawals', icon: CreditCard },
    { label: 'Referrals', href: '/referrals', icon: Share2 },
    { label: 'Campaigns', href: '/campaigns', icon: Target },
    { label: 'Advertiser', href: '/advertiser', icon: Megaphone },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)]">
      <nav className="space-y-1 sticky top-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
