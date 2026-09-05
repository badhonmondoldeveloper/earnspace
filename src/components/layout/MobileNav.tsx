'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';

interface MobileNavProps {
  username?: string;
}

export function MobileNav({ username }: MobileNavProps) {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Create', href: '/dashboard?action=create', icon: PlusCircle },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Profile', href: username ? `/@${username}` : '/settings/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-2 px-4">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition ${
                isActive ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

