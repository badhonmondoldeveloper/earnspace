'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TemplateMarketplace } from '@/components/website/TemplateMarketplace';
import { TemplatePreviewModal } from '@/components/website/TemplatePreviewModal';
import { TemplateOnboardingModal } from '@/components/website/TemplateOnboardingModal';
import { TemplateDefinition } from '@/lib/templates/templateRegistry';
import { Sparkles, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TemplatesPage() {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUseTemplate = async (templateSlug: string) => {
    if (!user) {
      window.location.href = `/login?redirect=/templates`;
      return;
    }

    try {
      const res = await fetch(`/api/v1/templates/${templateSlug}/use`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = `/dashboard/website`;
      } else {
        alert(json.message || 'Failed to apply template');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar initialUser={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Flagship Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> EarnSpace Website Studio Ecosystem
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Create Your Creator Website <span className="text-indigo-400">In Minutes.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Showcase your content, grow your audience, sell digital products, accept fan support, and build your personal brand without writing code.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" /> Start Smart Onboarding <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Template Browsing Grid */}
        <TemplateMarketplace
          onSelectTemplate={(t) => handleUseTemplate(t.slug)}
          onPreviewTemplate={(t) => {
            setPreviewTemplate(t);
            setIsPreviewOpen(true);
          }}
        />
      </main>

      {/* Live Responsive Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onUseTemplate={(slug) => handleUseTemplate(slug)}
      />

      {/* Smart Onboarding Modal */}
      <TemplateOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectRecommended={(answers) => {
          console.log('Survey answers:', answers);
        }}
      />

      <Footer />
    </div>
  );
}
