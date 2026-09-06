'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import {
  Code,
  Power,
  Trash2,
  Edit3,
  Plus,
  ShieldCheck,
  Sparkles,
  Check,
  X,
  Globe,
  Share2,
  Film,
  Zap,
  HelpCircle,
} from 'lucide-react';

export default function AdminRevenueProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Creation Tab
  const [activeTab, setActiveTab] = useState<'adsense' | 'meta' | 'script_network' | 'custom' | 'direct'>('adsense');

  // AdSense Form
  const [adsensePubId, setAdsensePubId] = useState('');
  const [adsenseFeedSlot, setAdsenseFeedSlot] = useState('');
  const [adsenseSidebarSlot, setAdsenseSidebarSlot] = useState('');
  const [enableAutoAds, setEnableAutoAds] = useState(true);

  // Meta Audience Form
  const [metaDomainToken, setMetaDomainToken] = useState('');
  const [metaAppId, setMetaAppId] = useState('');
  const [metaPlacementId, setMetaPlacementId] = useState('');

  // Script Network Form (Adsterra / Popunder)
  const [scriptNetworkName, setScriptNetworkName] = useState('Adsterra Native Network');
  const [scriptNetworkKey, setScriptNetworkKey] = useState('adsterra_network');
  const [scriptCode, setScriptCode] = useState('');

  // Custom Snippet Form
  const [customName, setCustomName] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [customHeadSnippet, setCustomHeadSnippet] = useState('');
  const [customBodySnippet, setCustomBodySnippet] = useState('');

  // Direct House Banner Form
  const [bannerName, setBannerName] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerMediaUrl, setBannerMediaUrl] = useState('');
  const [bannerDestUrl, setBannerDestUrl] = useState('');
  const [bannerCta, setBannerCta] = useState('Learn More');

  const [priority, setPriority] = useState('1');
  const [msg, setMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editPriority, setEditPriority] = useState('1');
  const [editAdCodeSnippet, setEditAdCodeSnippet] = useState('');
  const [editHeadCodeSnippet, setEditHeadCodeSnippet] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/revenue/providers');
      const json = await res.json();
      if (res.ok) {
        setProviders(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoogleAdSense = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const pubId = adsensePubId.trim();
    if (!pubId) {
      setMsg('Error: Please enter a valid Google AdSense Publisher ID (e.g. ca-pub-XXXXXXXXXXXXXXXX)');
      return;
    }

    const headSnippet = enableAutoAds
      ? `<meta name="google-adsense-account" content="${pubId}">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}" crossorigin="anonymous"></script>`
      : `<meta name="google-adsense-account" content="${pubId}">`;

    const bodySnippet = `<ins className="adsbygoogle" style="display:block" data-ad-client="${pubId}" data-ad-slot="${adsenseFeedSlot || '1234567890'}" data-ad-format="auto" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;

    try {
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Google AdSense Network',
          providerKey: 'google_adsense',
          providerType: 'google_adsense',
          priority: parseInt(priority),
          headCodeSnippet: headSnippet,
          adCodeSnippet: bodySnippet,
          credentialsJson: JSON.stringify({ publisherId: pubId, feedSlot: adsenseFeedSlot, sidebarSlot: adsenseSidebarSlot }),
          placementsJson: JSON.stringify(['SOCIAL_FEED_MID', 'SIDEBAR_BANNER', 'BLOG_INLINE', 'all']),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to connect Google AdSense');

      setMsg('Google AdSense connected successfully with Auto-Ads & Meta Account Tag!');
      setAdsensePubId('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleCreateMetaAudience = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const domainToken = metaDomainToken.trim();
    if (!domainToken) {
      setMsg('Error: Please enter Meta Domain Verification token');
      return;
    }

    const headSnippet = `<meta name="facebook-domain-verification" content="${domainToken}" />`;
    const bodySnippet = `<div className="fb-ad-card p-4 bg-slate-900 border border-slate-800 rounded-2xl"><span className="text-xs text-indigo-400 font-bold">Meta Audience Network</span><p className="text-xs text-slate-300">App ID: ${metaAppId || 'Meta Ads'}</p></div>`;

    try {
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Meta Audience Network',
          providerKey: 'meta_audience_network',
          providerType: 'meta_audience',
          priority: parseInt(priority),
          headCodeSnippet: headSnippet,
          adCodeSnippet: bodySnippet,
          credentialsJson: JSON.stringify({ domainToken, appId: metaAppId, placementId: metaPlacementId }),
          placementsJson: JSON.stringify(['SOCIAL_FEED_TOP', 'REELS_FEED', 'SIDEBAR_BANNER', 'all']),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to connect Meta Audience Network');

      setMsg('Meta Audience Network connected with Facebook Domain Verification tag!');
      setMetaDomainToken('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleCreateScriptNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scriptNetworkName,
          providerKey: scriptNetworkKey.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          providerType: 'script_network',
          priority: parseInt(priority),
          adCodeSnippet: scriptCode.trim(),
          placementsJson: JSON.stringify(['SOCIAL_FEED_MID', 'SIDEBAR_BANNER', 'all']),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to add script network');

      setMsg('Script Ad Network added successfully!');
      setScriptCode('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleCreateCustomSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customName,
          providerKey: customKey.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          providerType: 'custom_snippet',
          priority: parseInt(priority),
          headCodeSnippet: customHeadSnippet.trim() || null,
          adCodeSnippet: customBodySnippet.trim() || null,
          placementsJson: JSON.stringify(['SOCIAL_FEED_MID', 'SIDEBAR_BANNER', 'all']),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to add custom ad provider');

      setMsg('Custom Ad Snippet & Meta Tags added successfully!');
      setCustomName('');
      setCustomKey('');
      setCustomHeadSnippet('');
      setCustomBodySnippet('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleCreateDirectBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const pKey = `direct_${Date.now()}`;
      const res = await fetch('/api/v1/admin/revenue/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bannerName || 'Direct Sponsor Banner',
          providerKey: pKey,
          providerType: 'direct_banner',
          priority: parseInt(priority),
          credentialsJson: JSON.stringify({
            title: bannerTitle,
            description: bannerDesc,
            mediaUrl: bannerMediaUrl,
            destinationUrl: bannerDestUrl,
            ctaText: bannerCta,
          }),
          placementsJson: JSON.stringify(['SOCIAL_FEED_MID', 'SIDEBAR_BANNER', 'all']),
          status: 'active',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Failed to add direct banner');

      setMsg('Direct Sponsor Banner created successfully!');
      setBannerName('');
      setBannerTitle('');
      setBannerMediaUrl('');
      setBannerDestUrl('');
      fetchProviders();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleToggleStatus = async (provider: any) => {
    const newStatus = provider.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad provider?')) return;
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (p: any) => {
    setEditingProvider(p);
    setEditName(p.name);
    setEditPriority(p.priority?.toString() || '1');
    setEditAdCodeSnippet(p.adCodeSnippet || '');
    setEditHeadCodeSnippet(p.headCodeSnippet || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/v1/admin/revenue/providers/${editingProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          priority: parseInt(editPriority),
          adCodeSnippet: editAdCodeSnippet.trim() || null,
          headCodeSnippet: editHeadCodeSnippet.trim() || null,
        }),
      });
      if (res.ok) {
        setEditingProvider(null);
        fetchProviders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="w-7 h-7 text-indigo-400" />
              <span>Multi-Provider Ad Network & Meta Tag Control Center</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Connect Google AdSense (`ca-pub`), Meta Audience Network (Domain Verification), Adsterra script networks, and custom Meta tag snippets into EarnSpace.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            ← Back to Admin
          </Link>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-xs flex items-center justify-between shadow-lg">
            <span>{msg}</span>
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Specialized Provider Creator Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" /> Connect Ad Provider & System
            </h2>

            {/* Priority Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-400">Fallback Priority Order:</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                min={1}
                className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-white text-center font-bold"
              />
            </div>
          </div>

          {/* Provider System Tabs */}
          <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('adsense')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'adsense'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-amber-400" /> 1. Google AdSense (ca-pub)
            </button>

            <button
              onClick={() => setActiveTab('meta')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'meta'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-4 h-4 text-blue-400" /> 2. Meta Audience Network
            </button>

            <button
              onClick={() => setActiveTab('script_network')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'script_network'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-4 h-4 text-emerald-400" /> 3. Script Networks (Adsterra/Ezoic)
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'custom'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" /> 4. Custom Meta & HTML Tags
            </button>

            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'direct'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" /> 5. Direct Sponsor Banner
            </button>
          </div>

          {/* TAB 1: GOOGLE ADSENSE */}
          {activeTab === 'adsense' && (
            <form onSubmit={handleCreateGoogleAdSense} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <HelpCircle className="w-4 h-4" /> Google AdSense System Instructions:
                </div>
                <p>
                  AdSense uses a Publisher Client ID (e.g. <code className="bg-black/40 px-1 py-0.5 rounded font-mono">ca-pub-1234567890123456</code>). It requires a <code className="bg-black/40 px-1 py-0.5 rounded font-mono">&lt;meta name=&quot;google-adsense-account&quot; content=&quot;ca-pub-...&quot;&gt;</code> tag in the site head.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">AdSense Publisher ID (ca-pub-...) *</label>
                  <input
                    type="text"
                    value={adsensePubId}
                    onChange={(e) => setAdsensePubId(e.target.value)}
                    placeholder="ca-pub-1234567890123456"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Feed Ad Slot ID (Optional)</label>
                  <input
                    type="text"
                    value={adsenseFeedSlot}
                    onChange={(e) => setAdsenseFeedSlot(e.target.value)}
                    placeholder="1234567890"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="auto-ads"
                  checked={enableAutoAds}
                  onChange={(e) => setEnableAutoAds(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950"
                />
                <label htmlFor="auto-ads" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Enable Site-Wide Auto Ads & Inject Head Script (`adsbygoogle.js`)
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Connect Google AdSense System
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: META AUDIENCE NETWORK */}
          {activeTab === 'meta' && (
            <form onSubmit={handleCreateMetaAudience} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-400">
                  <HelpCircle className="w-4 h-4" /> Meta Audience Network System Instructions:
                </div>
                <p>
                  Meta / Facebook requires Domain Verification via a head meta tag: <code className="bg-black/40 px-1 py-0.5 rounded font-mono">&lt;meta name=&quot;facebook-domain-verification&quot; content=&quot;TOKEN&quot; /&gt;</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Facebook Domain Verification Token *</label>
                  <input
                    type="text"
                    value={metaDomainToken}
                    onChange={(e) => setMetaDomainToken(e.target.value)}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Meta App ID</label>
                  <input
                    type="text"
                    value={metaAppId}
                    onChange={(e) => setMetaAppId(e.target.value)}
                    placeholder="123456789012345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Audience Placement Token</label>
                  <input
                    type="text"
                    value={metaPlacementId}
                    onChange={(e) => setMetaPlacementId(e.target.value)}
                    placeholder="PLACEMENT_ID"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Connect Meta Audience Network
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SCRIPT NETWORKS */}
          {activeTab === 'script_network' && (
            <form onSubmit={handleCreateScriptNetwork} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Network Name *</label>
                  <input
                    type="text"
                    value={scriptNetworkName}
                    onChange={(e) => setScriptNetworkName(e.target.value)}
                    placeholder="Adsterra Native Network"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Network Key *</label>
                  <input
                    type="text"
                    value={scriptNetworkKey}
                    onChange={(e) => setScriptNetworkKey(e.target.value)}
                    placeholder="adsterra_native"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Script Tag / Code Block *</label>
                <textarea
                  value={scriptCode}
                  onChange={(e) => setScriptCode(e.target.value)}
                  placeholder="Paste JavaScript snippet tag from Adsterra, PopAds, PropellerAds, or Ezoic..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 font-mono resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Add Script Network Provider
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CUSTOM META & HTML TAGS */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCreateCustomSnippet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Name *</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Custom Network"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Key *</label>
                  <input
                    type="text"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="custom_meta_ads"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Head Code Snippet (&lt;head&gt; Meta / Script Tags)</label>
                <textarea
                  value={customHeadSnippet}
                  onChange={(e) => setCustomHeadSnippet(e.target.value)}
                  placeholder="<meta name='custom-ad-tag' content='...' />"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-purple-300 font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Body Ad Unit Snippet (&lt;body&gt; Ad Cards / iFrame)</label>
                <textarea
                  value={customBodySnippet}
                  onChange={(e) => setCustomBodySnippet(e.target.value)}
                  placeholder="<div id='custom-ad-unit'></div>"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Add Custom Ad Snippet
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: DIRECT HOUSE BANNER */}
          {activeTab === 'direct' && (
            <form onSubmit={handleCreateDirectBanner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Banner Title *</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="Promote Your Business on EarnSpace"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Destination Target URL *</label>
                  <input
                    type="text"
                    value={bannerDestUrl}
                    onChange={(e) => setBannerDestUrl(e.target.value)}
                    placeholder="https://earnspace-chi.vercel.app/pricing"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Image Media URL</label>
                  <input
                    type="text"
                    value={bannerMediaUrl}
                    onChange={(e) => setBannerMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerCta}
                    onChange={(e) => setBannerCta(e.target.value)}
                    placeholder="Learn More"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="Get 50% extra reach with EarnSpace Partner Ads..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Create Direct Sponsor Banner
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Active Providers Table */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Configured Ad Networks & System Fallback Chain</span>
            <span className="text-xs text-indigo-400 font-semibold">{providers.length} Networks Configured</span>
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading ad providers...</div>
            ) : providers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No ad providers configured yet.</div>
            ) : (
              providers.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        key: {p.providerKey}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {p.providerType || 'external'}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Priority #{p.priority}
                      </span>
                    </div>

                    {p.headCodeSnippet && (
                      <div className="text-[10px] text-amber-400/80 font-mono bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 max-w-md truncate">
                        Head: {p.headCodeSnippet}
                      </div>
                    )}

                    {p.adCodeSnippet && (
                      <div className="text-[10px] text-indigo-400/80 font-mono bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 max-w-md truncate">
                        Body: {p.adCodeSnippet}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        p.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{p.status === 'active' ? 'ON (Active)' : 'OFF (Paused)'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                      title="Edit Provider"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteProvider(p.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete Provider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Ad Provider</h3>
              <button onClick={() => setEditingProvider(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                <input
                  type="number"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Head Code Snippet (&lt;head&gt; Meta / Script Tags)</label>
                <textarea
                  value={editHeadCodeSnippet}
                  onChange={(e) => setEditHeadCodeSnippet(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-300 font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Body Code Snippet (&lt;body&gt; Ad Cards / iFrame)</label>
                <textarea
                  value={editAdCodeSnippet}
                  onChange={(e) => setEditAdCodeSnippet(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
