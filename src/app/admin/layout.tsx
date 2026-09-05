'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, Users, CreditCard, DollarSign, Settings, History, Activity, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on admin login page, return standalone wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Withdrawal Approvals', href: '/admin/withdrawals', icon: CreditCard },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    { label: 'System Health', href: '/admin/system-health', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md h-16 flex items-center justify-between px-6">
        <Link href="/admin" className="flex items-center gap-2 font-extrabold text-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span>EarnSpace <span className="text-brand-400">Control Center</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Exit to User Web App
          </Link>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Admin Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 p-4 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
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
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
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

        <main className="flex-1 p-6 max-w-5xl overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

