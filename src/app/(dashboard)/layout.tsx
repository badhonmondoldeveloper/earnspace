import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar initialUser={user} />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar username={user.username} />
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl overflow-x-hidden">
          {children}
        </main>
      </div>
      <MobileNav username={user.username} />
    </div>
  );
}

