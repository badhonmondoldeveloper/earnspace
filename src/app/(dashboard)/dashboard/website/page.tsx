'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Globe, Eye, Save, GripVertical, Sparkles, CheckCircle2,
  ArrowUp, ArrowDown, Layout, Palette, Image as ImageIcon, Video, Link2,
  Briefcase, BookOpen, Mail, Sliders, Edit3, User, Compass, QrCode, Share2
} from 'lucide-react';
import Link from 'next/link';
import { FacebookProfileSpace } from '@/components/space/FacebookProfileSpace';
import { EditFacebookProfileModal } from '@/components/modals/EditFacebookProfileModal';
import { ThemeBrandKitDrawer } from '@/components/website/ThemeBrandKitDrawer';
import { SeoQrModal } from '@/components/website/SeoQrModal';
import { TemplateOnboardingModal } from '@/components/website/TemplateOnboardingModal';

export interface Block {
  id: string;
  type: 'hero' | 'text' | 'links' | 'gallery' | 'video' | 'services' | 'articles' | 'contact';
  contentJson: string;
  visibility: boolean;
}

export default function WebsiteBuilderPage() {
  const [page, setPage] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'settings'>('preview');

  // Modals & Drawers
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [isSeoQrModalOpen, setIsSeoQrModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
          setProfile(data.data.profile || {});
        }
      })
      .catch(() => {});

    fetch('/api/v1/pages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPage(data.data);
          setBlocks(data.data.blocks || []);
          setPageTitle(data.data.title || '');
          setPageDescription(data.data.description || '');
          if (data.data.settings?.theme) {
            setSelectedTheme(data.data.settings.theme);
          }
        }
      });
  }, []);

  const handleAddBlock = (type: Block['type']) => {
    let initialContent = {};
    if (type === 'hero') {
      initialContent = { title: `Welcome to ${user?.username || 'My'}'s Space`, subtitle: 'Digital Creator & Entrepreneur', ctaText: 'Explore My Space', ctaUrl: '#' };
    } else if (type === 'text') {
      initialContent = { title: 'About Me', body: profile?.bio || 'Share your journey, mission, and background here.' };
    } else if (type === 'links') {
      initialContent = { title: 'My Custom Links', links: [{ title: 'My Portfolio', url: 'https://example.com' }, { title: 'YouTube Channel', url: 'https://youtube.com' }] };
    } else if (type === 'gallery') {
      initialContent = { title: 'Featured Gallery', images: [{ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', caption: 'Creative Showcase' }] };
    } else if (type === 'video') {
      initialContent = { title: 'Featured Video', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Check out my latest featured project video.' };
    } else if (type === 'services') {
      initialContent = { title: 'Services & Products', items: [{ name: 'Brand Consultation', price: '৳1,500', description: '1-on-1 strategy session for creators.', link: '#' }] };
    } else if (type === 'articles') {
      initialContent = { title: 'Latest Published Articles', limit: 3 };
    } else if (type === 'contact') {
      initialContent = { title: 'Get In Touch', email: user?.email || 'creator@example.com', location: profile?.location || 'Dhaka, Bangladesh', showSocials: true };
    }

    const newBlock: Block = {
      id: `temp_${Date.now()}`,
      type,
      contentJson: JSON.stringify(initialContent),
      visibility: true,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  const handleToggleVisibility = (index: number) => {
    const updated = [...blocks];
    updated[index].visibility = !updated[index].visibility;
    setBlocks(updated);
  };

  const handleUpdateBlockContent = (index: number, newContent: any) => {
    const updated = [...blocks];
    updated[index].contentJson = JSON.stringify(newContent);
    setBlocks(updated);
  };

  const handleSavePage = async () => {
    if (!page?.slug) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/v1/pages/${page.slug}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageTitle,
          description: pageDescription,
          theme: selectedTheme,
          blocks: blocks.map((b, idx) => ({
            type: b.type,
            position: idx,
            contentJson: b.contentJson,
            visibility: b.visibility,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Website changes published successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message || 'Failed to save page');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const parseJson = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return {};
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              EarnSpace Website Studio
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              PRO BUILDER
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build, design, and publish your personal creator website with 65+ templates and modular blocks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/templates"
            className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Layout className="w-4 h-4" /> Explore 65+ Templates
          </Link>
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4 text-cyan-400" /> Smart Advisor
          </button>
          <button
            onClick={() => setIsThemeDrawerOpen(true)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Palette className="w-4 h-4 text-pink-400" /> Theme & Brand
          </button>
          <button
            onClick={() => setIsSeoQrModalOpen(true)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-400" /> SEO & QR
          </button>

          <Link
            href={`/space/${user?.username}`}
            target="_blank"
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Live Site
          </Link>

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" /> Visual Studio Canvas
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'editor'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Modular Block Editor ({blocks.length})
        </button>
      </div>

      {/* TAB 1: VISUAL CANVAS */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <FacebookProfileSpace
              user={user}
              profile={profile}
              blocks={blocks}
              isOwner={true}
            />
          </div>
        </div>
      )}

      {/* TAB 2: BLOCK EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {/* Add Block Options */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Add Content & Modular Blocks
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'hero', label: 'Hero Banner', icon: Layout },
                { type: 'text', label: 'About / Text', icon: BookOpen },
                { type: 'links', label: 'Custom Links', icon: Link2 },
                { type: 'gallery', label: 'Image Gallery', icon: ImageIcon },
                { type: 'video', label: 'Featured Video', icon: Video },
                { type: 'services', label: 'Services / Store', icon: Briefcase },
                { type: 'articles', label: 'Latest Articles', icon: BookOpen },
                { type: 'contact', label: 'Contact Details', icon: Mail },
              ].map((b) => (
                <button
                  key={b.type}
                  onClick={() => handleAddBlock(b.type as any)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <b.icon className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Block Reordering & Content Editor Cards */}
          <div className="space-y-3">
            {blocks.map((block, idx) => {
              const content = parseJson(block.contentJson);
              return (
                <div
                  key={block.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {block.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveBlock(idx)}
                        className="p-1 rounded hover:bg-rose-500/10 text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Block Field Inputs */}
                  <div className="space-y-2 text-xs">
                    {block.type === 'hero' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Hero Title"
                          value={content.title || ''}
                          onChange={(e) => handleUpdateBlockContent(idx, { ...content, title: e.target.value })}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={content.subtitle || ''}
                          onChange={(e) => handleUpdateBlockContent(idx, { ...content, subtitle: e.target.value })}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    )}

                    {block.type === 'text' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={content.title || ''}
                          onChange={(e) => handleUpdateBlockContent(idx, { ...content, title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <textarea
                          rows={3}
                          placeholder="Body Content..."
                          value={content.body || ''}
                          onChange={(e) => handleUpdateBlockContent(idx, { ...content, body: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drawers & Modals */}
      <ThemeBrandKitDrawer
        isOpen={isThemeDrawerOpen}
        onClose={() => setIsThemeDrawerOpen(false)}
        selectedTheme={selectedTheme}
        onSelectTheme={(themeId) => setSelectedTheme(themeId)}
      />

      <SeoQrModal
        isOpen={isSeoQrModalOpen}
        onClose={() => setIsSeoQrModalOpen(false)}
        websiteUrl={`https://earnspace.app/space/${user?.username}`}
        initialSeoTitle={pageTitle}
        initialSeoDesc={pageDescription}
        onSaveSeo={(t, d) => {
          setPageTitle(t);
          setPageDescription(d);
        }}
      />

      <TemplateOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectRecommended={(answers) => {
          window.location.href = `/templates?category=${encodeURIComponent(answers.doWhat || 'Creators')}`;
        }}
      />

      {isEditProfileModalOpen && (
        <EditFacebookProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          user={user}
          profile={profile}
          onSaved={() => {
            fetch('/api/v1/auth/me')
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.data) {
                  setUser(data.data);
                  setProfile(data.data.profile || {});
                }
              });
          }}
        />
      )}
    </div>
  );
}
