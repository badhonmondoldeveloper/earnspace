import Link from 'next/link';
import { Sparkles, Globe, UserCheck, Share2, Layers, ShieldCheck, ArrowRight, CheckCircle2, MessageSquare, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-brand-50/50 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Next-Generation Social Platform & Personal Space Builder</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Create Your Space. Build Your Audience. <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-sky-400">Grow Your Digital Presence.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Build your professional social profile, launch your custom personal website, publish articles, and connect with your community—all from one unified platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Create Your Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              Explore EarnSpace
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Built For Creators, Thinkers & Professionals</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            EarnSpace gives you full ownership over your brand identity with tools designed for modern creators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Profile</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your custom <code className="text-brand-500 font-mono">/@username</code> profile with bio, follower metrics, activity feed, and social links.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Block Website Builder</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Build your personal mini-website at <code className="text-brand-500 font-mono">/space/username</code> with draggable blocks, heroes, galleries, and custom links.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blogging & Publishing</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Publish rich, SEO-optimized articles with automated OpenGraph cards, custom canonical URLs, and structured metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Ecosystem & Future Readiness Section */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparent & Authentic Platform</span>
            </div>
            <h2 className="text-3xl font-bold">A Sustainable Creator Economy</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike platforms with artificial engagement and misleading earnings, EarnSpace is built on organic community growth and genuine creator content. Prepare your brand today for upcoming campaign rewards, subscriptions, and creator tools.
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero fake metrics or artificial bot engagement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% clean data model ready for legitimate monetization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Full privacy controls & direct 1-on-1 community messaging</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/60 space-y-6">
            <h3 className="text-xl font-bold">Start Building Today</h3>
            <p className="text-xs text-slate-400">
              Claim your unique username and set up your personal space in less than 2 minutes.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Choose username..."
                className="flex-1 px-4 py-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <Link
                href="/register"
                className="px-6 py-3 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shrink-0"
              >
                Claim Space
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">What is EarnSpace?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              EarnSpace is a commercial-grade social platform, blogging network, and personal digital space builder designed to help creators create content, connect with audiences, and establish their digital identity.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">How does the Personal Website Builder work?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every user receives a dedicated page at <code className="text-brand-500">/space/username</code>. Using our block-based editor, you can add custom heroes, text, media galleries, links, and contact forms with custom themes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

