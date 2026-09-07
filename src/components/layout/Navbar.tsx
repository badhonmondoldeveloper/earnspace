'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  Plus,
  User,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  Home,
  Tv,
  Globe,
  Film,
  Settings,
  Shield,
  Wallet,
} from 'lucide-react';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export function Navbar({ initialUser }: { initialUser?: any }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(initialUser || null);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        }
      })
      .catch(() => {});

    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      fetch(`/api/v1/creators?q=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data?.items)) {
            setSearchResults(data.data.items);
          }
        })
        .catch(() => {});
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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

  const centerTabs = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Watch', href: '/reels', icon: Tv },
    { label: 'Marketplace', href: '/marketplace', icon: Globe },
    { label: 'Website Studio', href: '/dashboard/website', icon: LayoutDashboard },
    { label: 'Reels', href: '/stories', icon: Film },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Facebook Search */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900 dark:text-white">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <span className="hidden sm:inline">
                Earn<span className="text-indigo-600 dark:text-indigo-400">Space</span>
              </span>
            </Link>

            {/* Instant Search Bar */}
            <div ref={searchRef} className="relative">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 w-9 sm:w-60 focus-within:w-64 sm:focus-within:w-72 transition-all duration-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search creators, posts..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/explore?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none ml-2 hidden sm:block focus:block"
                />
              </div>

              {/* Search Dropdown Popup */}
              {isSearchFocused && searchQuery.trim().length > 1 && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Creators & Pages</p>
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-400">No results found for &quot;{searchQuery}&quot;</div>
                  ) : (
                    searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/@${item.username}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {item.profile?.avatar ? (
                            <img src={item.profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            item.username[0]?.toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.profile?.fullName || item.username}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">@{item.username}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center: Facebook Navigation Tabs (Hidden on small mobile screens) */}
          {user && (
            <nav className="hidden md:flex items-center justify-center gap-1 sm:gap-2 flex-1 max-w-md h-full">
              {centerTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    title={tab.label}
                    className={`flex items-center justify-center px-4 py-2 rounded-xl transition relative group ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right: Action Buttons & Facebook Avatar Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Create Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition shadow-md shadow-indigo-600/20 flex items-center justify-center"
                  title="Create Post / Video / Reel"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Messenger Icon */}
                <Link
                  href="/messages"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition"
                  title="Messenger"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Bell */}
                <Link
                  href="/notifications"
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                </Link>

                {/* Profile Avatar Dropdown Menu */}
                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border-2 border-indigo-500 overflow-hidden shadow-sm transition hover:opacity-90"
                  >
                    {user.profile?.avatar ? (
                      <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                      <Link
                        href={`/@${user.username}`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
                          {user.profile?.avatar ? (
                            <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.username?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {user.profile?.fullName || user.username}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">See your profile</p>
                        </div>
                      </Link>

                      <hr className="border-slate-100 dark:border-slate-800 my-1" />

                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Home className="w-4 h-4 text-indigo-500" />
                        <span>Dashboard Studio</span>
                      </Link>

                      <Link
                        href="/creator"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                        <span>Creator Studio</span>
                      </Link>

                      <Link
                        href="/dashboard/website"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span>My Personal Space</span>
                      </Link>

                      <Link
                        href="/wallet"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Wallet className="w-4 h-4 text-indigo-500" />
                        <span>Wallet & Payouts</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings & Privacy</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition"
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <hr className="border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-500 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Universal Create Modal Triggered by Navbar */}
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
