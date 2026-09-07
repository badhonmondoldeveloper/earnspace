import Link from 'next/link';
import { Sparkles, Globe, UserCheck, Share2, Layers, ShieldCheck, ArrowRight, CheckCircle2, DollarSign, Zap, Star, Shield, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-24 bg-slate-950 text-slate-100 font-sans">
      {/* Ultra-Modern Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        {/* Decorative Radial Background Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>💰 Next-Gen Ready-Made Creator Income Website Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Build Your Brand. Launch Your Website. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
              Earn Lifetime Creator Revenue.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Turn your passion into a professional high-converting personal website with built-in ad monetization (AdSense & House Ads), bKash/Nagad digital product store, and fan tipping in less than 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-9 py-4 text-sm font-extrabold rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>⚡ Launch Your Earning Site Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-9 py-4 text-sm font-extrabold rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Browse 14+ Ready-Made Templates</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400">Zero Code Required</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-400">50 - 70%</div>
              <div className="text-[11px] text-slate-400">Ad Revenue Share</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-2xl font-black text-cyan-400">bKash / Nagad</div>
              <div className="text-[11px] text-slate-400">Instant Direct Payouts</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-2xl font-black text-indigo-400">14+ Packs</div>
              <div className="text-[11px] text-slate-400">Ready Professional Sites</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Creator Revenue Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Transparent Monetization Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How Much Can You Earn on EarnSpace?</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Combine Ad Revenue Share, Digital Product Sales, and Fan Tips directly to your bKash or Nagad wallet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">📢 Ad Revenue Share (70%)</div>
              <div className="text-3xl font-black text-emerald-400">৳ 15,000 - ৳ 45,000 / mo</div>
              <p className="text-xs text-slate-400">Based on 50k monthly visits on your personal space with automated house ads & AdSense.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">🛍️ Digital Store Sales</div>
              <div className="text-3xl font-black text-indigo-400">৳ 25,000 - ৳ 80,000 / mo</div>
              <p className="text-xs text-slate-400">Sell course PDFs, Lightroom presets, consulting calls, or digital downloads directly.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">☕ Fan Tips & Memberships</div>
              <div className="text-3xl font-black text-cyan-400">৳ 10,000 - ৳ 30,000 / mo</div>
              <p className="text-xs text-slate-400">Receive coffee tips and recurring monthly supporter subscriptions via manual bKash cashout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built For YouTubers, Streamers & Professionals</h2>
          <p className="text-sm text-slate-400">
            EarnSpace provides an all-in-one digital workspace replacing link-in-bio tools, website hosting, and paywalls.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Ready-Made Personal Site</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Launch your site at <code className="text-indigo-400 font-mono">/space/username</code> with custom block layouts, hero header, portfolio grid, and contact forms.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Automated Ad Monetization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monetize every visitor instantly. Smart ad placement slots deliver House Ads and advertiser banners with transparent itemized logs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">bKash & Nagad Cashout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No complicated international banking required. Withdraw your settled balance directly to your local bKash, Nagad, or Upay number.
            </p>
          </div>
        </div>
      </section>

      {/* Glowing CTA Bottom Footer Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 border border-indigo-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to Claim Your Personal Website Space?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join thousands of creators building their digital presence and earning lifetime revenue on EarnSpace.
            </p>
          </div>
          <div className="pt-2 relative z-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-0.5"
            >
              <span>Get Started In 60 Seconds</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


