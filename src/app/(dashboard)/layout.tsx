import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl overflow-x-hidden">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

