import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AiMonetizationAssistant } from '@/components/ai/AiMonetizationAssistant';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar initialUser={user} />
      
      <div className="flex-1 flex justify-center max-w-7xl mx-auto w-full">
        {/* Left Sidebar */}
        <Sidebar username={user.username} />

        {/* Center Main Content Area */}
        <main className="flex-1 max-w-2xl w-full p-2 sm:p-4 pb-24 lg:pb-8 min-w-0">
          {children}
        </main>

        {/* Right Sidebar Widgets */}
        <RightSidebar user={user} />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav username={user.username} />

      {/* Futuristic AI Creator Assistant */}
      <AiMonetizationAssistant user={user} />
    </div>
  );
}
