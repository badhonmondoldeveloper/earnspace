'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  TrendingUp,
  DollarSign,
  Zap,
  Copy,
  Check,
  X,
  MessageSquare,
  BarChart3,
  Layers,
  ChevronRight,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface AiMonetizationAssistantProps {
  user?: any;
}

export function AiMonetizationAssistant({ user }: AiMonetizationAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'advisor' | 'captions' | 'monetization' | 'ads'>('advisor');

  // Captions Generator State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'viral' | 'professional' | 'bangladeshi' | 'sales'>('viral');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Monetization Calculator State
  const [monthlyViews, setMonthlyViews] = useState(50000);
  const [supporters, setSupporters] = useState(100);

  const handleGenerateCaption = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedCaption('');

    // Simulate AI inference stream/response tailored for EarnSpace Bangladesh context
    setTimeout(() => {
      let output = '';
      if (tone === 'viral') {
        output = `🔥 ${topic} — Get ready for something huge! Don't miss out on this absolute game changer on EarnSpace. 🚀\n\nWhat do you think about this? Let me know in the comments below! 👇\n\n#EarnSpace #ViralBD #CreatorEconomy #DhakaLife #TechBD #TrendingNow`;
      } else if (tone === 'bangladeshi') {
        output = `সবাইকে স্বাগতম! 🇧🇩 ${topic} নিয়ে আপনাদের সাথে নতুন কিছু শেয়ার করছি। EarnSpace-এ আমার ফ্যান স্পেস ফলো করতে ভুলবেন না! ❤️\n\nলিঙ্ক বায়োতে এবং নিচে কমেন্টে দেওয়া আছে।\n\n#EarnSpace #BangladeshCreators #DhakaVibes #BDContent #MonetizeBD`;
      } else if (tone === 'sales') {
        output = `⚡ EXCLUSIVE OFFER: ${topic} is now LIVE on my EarnSpace Digital Store! 🛍️\n\nGrab your copy today & start earning. Direct bKash / Nagad instant checkout available.\n\n👉 Click link in post to buy now!\n\n#DigitalProduct #EarnSpaceStore #bKashPayment #CourseBD #CreatorMarketplace`;
      } else {
        output = `Excited to announce our latest update regarding ${topic}. We are committed to building the ultimate creator ecosystem on EarnSpace.\n\nRead more details and support our work directly through our space.\n\n#Professional #CreatorEconomy #EarnSpace #DigitalInnovation`;
      }

      setGeneratedCaption(output);
      setIsGenerating(false);
    }, 900);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Earnings Estimate Calculations
  const adEst = Math.round((monthlyViews / 1000) * 0.85 * 115); // BDT ~0.85 USD CPM -> BDT
  const fanEst = supporters * 150; // Average BDT 150 tip/supporter
  const digitalEst = Math.round(monthlyViews * 0.005 * 500); // 0.5% conversion on BDT 500 product
  const totalEstBDT = adEst + fanEst + digitalEst;

  return (
    <>
      {/* Floating AI Launcher Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-slate-900 dark:bg-indigo-950 text-white rounded-full shadow-2xl hover:shadow-indigo-500/25 border border-indigo-500/30 transition-all duration-300 hover:scale-105"
            title="EarnSpace AI Monetization Assistant"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <Bot className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1">
                EarnSpace AI <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-[10px] text-cyan-300 font-medium">Monetization Advisor</div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[640px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-indigo-500/40 backdrop-blur-xl flex flex-[#111827] flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  EarnSpace AI Advisor
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                    PRO v2.5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Smart Creator & Monetization Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Tips
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'captions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> AI Captions
            </button>
            <button
              onClick={() => setActiveTab('monetization')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'monetization'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Calculator
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ads'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Smart Ads
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 overflow-y-auto max-h-[460px] space-y-4 bg-slate-900/90 text-slate-200">
            {/* TAB 1: SMART ADVISOR */}
            {activeTab === 'advisor' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900/40 to-slate-800/80 border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1.5">
                    <Flame className="w-4 h-4 text-orange-400" /> Viral Posting Time Recommendation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Peak engagement for Bangladesh social users is <strong className="text-white">7:30 PM - 10:00 PM</strong>. Posts published during this window get 2.4x more reach!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> High-Converting Strategy Tips
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-2 list-disc list-inside">
                    <li>Add direct bKash fan support buttons on video posts to boost micro-tipping.</li>
                    <li>Link your EarnSpace Digital Store products inside post descriptions.</li>
                    <li>Use 3-5 trending Bangladeshi tags for optimal feed algorithm ranking.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-cyan-300">Creator Monetization Tier</div>
                    <div className="text-[11px] text-cyan-200/80">Verified Gold Creator • 80% RevShare</div>
                  </div>
                  <a
                    href="/dashboard/earnings"
                    className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                  >
                    View Wallet
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: AI CAPTION GENERATOR */}
            {activeTab === 'captions' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    What is your post about?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Launching my new digital Photoshop preset course..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tone & Audience</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'viral', label: '🔥 Viral & Hype' },
                      { id: 'bangladeshi', label: '🇧🇩 Bangla Local' },
                      { id: 'sales', label: '🛍️ Direct Sales' },
                      { id: 'professional', label: '💼 Professional' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id as any)}
                        className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-all ${
                          tone === t.id
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCaption}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating AI Caption...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Generate Post Caption
                    </>
                  )}
                </button>

                {generatedCaption && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 relative space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                      <span>AI Generated Result</span>
                      <button
                        onClick={() => copyToClipboard(generatedCaption)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded text-[10px]"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {generatedCaption}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MONETIZATION CALCULATOR */}
            {activeTab === 'monetization' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Est. Monthly Feed Views:</span>
                      <span className="font-bold text-cyan-400">{monthlyViews.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={monthlyViews}
                      onChange={(e) => setMonthlyViews(Number(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Monthly Fan Supporters:</span>
                      <span className="font-bold text-indigo-400">{supporters.toLocaleString()} fans</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={supporters}
                      onChange={(e) => setSupporters(Number(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Earnings Breakdown */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    Estimated Monthly Revenue (BDT)
                  </div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    ৳{totalEstBDT.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">📺 Ad Impression Rev:</span>
                      <span className="font-semibold text-slate-200">৳{adEst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">❤️ Fan Micro-Tipping:</span>
                      <span className="font-semibold text-slate-200">৳{fanEst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">🛍️ Marketplace Sales:</span>
                      <span className="font-semibold text-slate-200">৳{digitalEst.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="/dashboard/earnings"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  Withdraw Earnings to bKash <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* TAB 4: SMART AD PLACEMENT AI */}
            {activeTab === 'ads' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-cyan-400" /> Dynamic Smart Ads Optimizer
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    EarnSpace automatically inserts responsive house ads and high-CPM advertiser placements into your post feed without ruining user experience.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Feed Ad Frequency:</span>
                    <span className="font-bold text-green-400">Optimal (Every 3 Posts)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ad Block Bypass Engine:</span>
                    <span className="font-bold text-cyan-400">Active ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ad Revenue Share:</span>
                    <span className="font-bold text-indigo-400">70% Creator / 30% Platform</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200">
                  💡 Tip: Creators with completed profile space get 35% higher ad view duration!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AiMonetizationAssistant;
