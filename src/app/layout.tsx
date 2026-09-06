import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { GlobalHeadAdInjector } from '@/components/ads/GlobalHeadAdInjector';
import { AdBlockDetector } from '@/components/ads/AdBlockDetector';
import { PwaInstallPrompt } from '@/components/layout/PwaInstallPrompt';
import { LanguageProvider } from '@/context/LanguageContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'EarnSpace — Create • Connect • Grow • Earn',
  description: 'Commercial-grade social platform, creator network, and personal digital space builder.',
  manifest: '/manifest.json',
  other: {
    'google-adsense-account': 'ca-pub-9249570729862532',
  },
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
      <head>
        <meta name="google-adsense-account" content="ca-pub-9249570729862532" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9249570729862532"
          crossOrigin="anonymous"
        />
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 lg:pb-0 overflow-x-hidden">
        {/* Google AMP Auto Ads Tag */}
        {React.createElement('amp-auto-ads', {
          type: 'adsense',
          'data-ad-client': 'ca-pub-9249570729862532',
        })}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9249570729862532"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
          strategy="beforeInteractive"
          custom-element="amp-auto-ads"
        />
        <GlobalHeadAdInjector />
        <AdBlockDetector />
        <PwaInstallPrompt />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
