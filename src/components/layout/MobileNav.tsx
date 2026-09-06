'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Tv,
  PlusCircle,
  Bell,
  Menu,
  X,
  User,
  LayoutDashboard,
  Globe,
  Film,
  MessageSquare,
  DollarSign,
  Wallet,
  CreditCard,
  Share2,
  Settings,
  Shield,
  BookOpen,
  Target,
  Megaphone,
} from 'lucide-react';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

interface MobileNavProps {
  username?: string;
}

export function MobileNav({ username }: MobileNavProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Watch', href: '/reels', icon: Tv },
    { label: 'Create', action: () => setIsCreateModalOpen(true), icon: PlusCircle, isHighlight: true },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Menu', action: () => setIsDrawerOpen(true), icon: Menu },
  ];

  const drawerLinks = [
    { label: 'My Profile', href: username ? `/@${username}` : '/settings', icon: User },
    { label: 'News Feed', href: '/dashboard', icon: Home },
    { label: 'Creator Studio', href: '/creator', icon: LayoutDashboard },
    { label: 'My Website Space', href: '/dashboard/website', icon: Globe },
    { label: 'Watch Videos & Reels', href: '/reels', icon: Tv },
    { label: 'Stories Carousel', href: '/stories', icon: Film },
    { label: 'Messages & Chat', href: '/messages', icon: MessageSquare },
    { label: 'Blog Portal', href: '/dashboard/blog', icon: BookOpen },
    { label: 'Earnings Dashboard', href: '/dashboard/earnings', icon: DollarSign },
    { label: 'Wallet Balance', href: '/wallet', icon: Wallet },
    { label: 'Withdrawal Portal', href: '/withdrawals', icon: CreditCard },
    { label: 'Referral Rewards', href: '/referrals', icon: Share2 },
    { label: 'Campaigns', href: '/campaigns', icon: Target },
    { label: 'Advertiser Portal', href: '/advertiser', icon: Megaphone },
    { label: 'Settings & Control', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Fixed Facebook Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            if (item.action) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`flex flex-col items-center gap-0.5 p-1 transition ${
                    item.isHighlight
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.isHighlight ? 'w-6 h-6 stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex flex-col items-center gap-0.5 p-1 transition ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Slide-out Mobile Menu Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950/70 backdrop-blur-sm">
          <div className="ml-auto w-4/5 max-w-xs h-full bg-white dark:bg-slate-900 flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">EarnSpace Menu</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="p-3 space-y-1 flex-1">
              {drawerLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <UniversalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          if (window.location.pathname === '/dashboard') {
            window.location.reload();
          }
        }}
      />
    </>
  );
}
