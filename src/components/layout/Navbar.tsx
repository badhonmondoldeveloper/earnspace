'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sparkles, Search, Bell, MessageSquare, PlusSquare, User, LogOut, Sun, Moon, LayoutDashboard } from 'lucide-react';

export function Navbar({ initialUser }: { initialUser?: any }) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        } else if (!data.success) {
          setUser(null);
        }
      })
      .catch(() => {});

    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Earn<span className="text-brand-500">Space</span></span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search creators, posts, blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/explore?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm"
              >
                <PlusSquare className="w-4 h-4" />
                <span>Create</span>
              </Link>

              <Link
                href="/messages"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              <Link
                href="/notifications"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>

              <div className="relative group">
                <Link href={`/@${user.username}`} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 font-bold text-sm flex items-center justify-center border border-brand-200 dark:border-brand-700">
                    {user.profile?.avatar ? (
                      <img src={user.profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                </Link>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 hidden group-hover:block">
                  <Link href={`/@${user.username}`} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <User className="w-4 h-4 text-brand-500" />
                    <span>{user.profile?.fullName || user.username}<small className="block text-[10px] text-slate-400">@{user.username}</small></span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <LayoutDashboard className="w-4 h-4 text-brand-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/reels" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span>⚡ Reels Feed</span>
                  </Link>
                  <Link href="/creator" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span>🎨 Creator Studio</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-semibold rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

