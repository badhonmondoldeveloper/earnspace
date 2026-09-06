import type { Metadata } from 'next';
import './globals.css';
import { GlobalHeadAdInjector } from '@/components/ads/GlobalHeadAdInjector';

export const metadata: Metadata = {
  title: 'EarnSpace — Create • Connect • Grow • Earn',
  description: 'Commercial-grade social platform, creator network, and personal digital space builder.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'EarnSpace — Create • Connect • Grow • Earn',
    description: 'Create your space, build your audience, and establish your digital presence on EarnSpace.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <GlobalHeadAdInjector />
        {children}
      </body>
    </html>
  );
}
