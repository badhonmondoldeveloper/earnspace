'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Globe, Eye, Save, GripVertical, Sparkles, CheckCircle2,
  ArrowUp, ArrowDown, Layout, Palette, Image as ImageIcon, Video, Link2,
  Briefcase, BookOpen, Mail, Sliders, Edit3, User
} from 'lucide-react';
import Link from 'next/link';
import { FacebookProfileSpace } from '@/components/space/FacebookProfileSpace';
import { EditFacebookProfileModal } from '@/components/modals/EditFacebookProfileModal';

export interface Block {
  id: string;
  type: 'hero' | 'text' | 'links' | 'gallery' | 'video' | 'services' | 'articles' | 'contact';
  contentJson: string;
  visibility: boolean;
}

const THEMES = [
  { id: 'modern', name: 'Modern Dark', bg: 'bg-slate-950', accent: 'border-indigo-500 text-indigo-400' },
  { id: 'minimal', name: 'Minimal Light', bg: 'bg-white', accent: 'border-slate-900 text-slate-900' },
  { id: 'cyber', name: 'Neon Cyber', bg: 'bg-black', accent: 'border-cyan-500 text-cyan-400' },
  { id: 'creator', name: 'Creator Pro', bg: 'bg-slate-900', accent: 'border-brand-500 text-brand-400' },
  { id: 'elegant', name: 'Corporate Elegant', bg: 'bg-zinc-950', accent: 'border-amber-500 text-amber-400' },
  { id: 'sunset', name: 'Warm Sunset', bg: 'bg-stone-950', accent: 'border-rose-500 text-rose-400' },
];

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
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

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
      initialContent = { title: 'Welcome to My Space', subtitle: 'Digital Creator & Entrepreneur', ctaText: 'Explore My Space', ctaUrl: '#' };
    } else if (type === 'text') {
      initialContent = { title: 'About Me', body: 'Share your journey, mission, and background here.' };
    } else if (type === 'links') {
      initialContent = { title: 'My Custom Links', links: [{ title: 'My Portfolio', url: 'https://example.com' }, { title: 'YouTube Channel', url: 'https://youtube.com' }] };
    } else if (type === 'gallery') {
      initialContent = { title: 'Featured Gallery', images: [{ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', caption: 'Creative Showcase' }] };
    } else if (type === 'video') {
      initialContent = { title: 'Featured Video', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Check out my latest featured project video.' };
    } else if (type === 'services') {
      initialContent = { title: 'Services & Products', items: [{ name: 'Brand Consultation', price: '$99', description: '1-on-1 strategy session for creators.', link: '#' }] };
    } else if (type === 'articles') {
      initialContent = { title: 'Latest Published Articles', limit: 3 };
    } else if (type === 'contact') {
      initialContent = { title: 'Get In Touch', email: 'creator@example.com', location: 'Dhaka, Bangladesh', showSocials: true };
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

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/v1/pages/${page.slug}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          title: pageTitle,
          description: pageDescription,
          settings: { theme: selectedTheme },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Digital Space updated & published live!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error('Save blocks error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-500" />
            <span>Facebook Profile Digital Space Studio</span>
          </h1>
          <p className="text-xs text-slate-500">
            Customize your 1:1 Facebook Profile Space live at <code className="text-brand-500 font-mono">/space/{page?.slug || user?.username || 'username'}</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Facebook Profile Info</span>
          </button>

          {page && (
            <Link
              href={`/space/${page.slug}`}
              target="_blank"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Open Live Space</span>
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('preview')}
          className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'preview' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Facebook Profile Live Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'editor' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Block Layout Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'settings' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Theme & Page Settings</span>
        </button>
      </div>

      {/* TAB 1: FACEBOOK PROFILE LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-white dark:bg-slate-950">
          <FacebookProfileSpace
            user={user || { username: 'creator' }}
            profile={profile || {}}
            blocks={blocks}
            isOwner={true}
          />
        </div>
      )}

      {/* TAB 2: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-500" />
              <span>Choose Space Theme</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between h-24 ${t.bg} ${
                    selectedTheme === t.id ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border self-start ${t.accent}`}>
                    {selectedTheme === t.id ? 'Active' : 'Select'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">SEO & Space Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Space Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="e.g. Alex Rivera's Creator Hub"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={pageDescription}
                  onChange={(e) => setPageDescription(e.target.value)}
                  placeholder="Welcome to my official digital space on EarnSpace."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BLOCK LAYOUT EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Add Dynamic Section Block:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAddBlock('hero')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Hero Banner</span>
              </button>
              <button
                onClick={() => handleAddBlock('text')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>+ Text / About</span>
              </button>
              <button
                onClick={() => handleAddBlock('links')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>+ Custom Links</span>
              </button>
              <button
                onClick={() => handleAddBlock('gallery')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Photo Gallery</span>
              </button>
              <button
                onClick={() => handleAddBlock('video')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>+ Featured Video</span>
              </button>
              <button
                onClick={() => handleAddBlock('services')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>+ Services / Products</span>
              </button>
              <button
                onClick={() => handleAddBlock('articles')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Articles Feed</span>
              </button>
              <button
                onClick={() => handleAddBlock('contact')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>+ Contact & Social</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-brand-500" />
                <p className="font-semibold text-slate-900 dark:text-white">Your Space is currently empty.</p>
                <p>Click any button above to add custom dynamic sections to your personal website.</p>
              </div>
            ) : (
              blocks.map((block, index) => {
                let content: any = {};
                try {
                  content = JSON.parse(block.contentJson || '{}');
                } catch (e) {}

                return (
                  <div key={block.id} className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-4 shadow-sm transition ${block.visibility ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-rose-300 dark:border-rose-900/60 opacity-60'}`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                        <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                          Section #{index + 1}: {block.type}
                        </span>
                        {!block.visibility && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-semibold">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveBlock(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveBlock(index, 'down')}
                          disabled={index === blocks.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 transition"
                          title="Toggle Visibility"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveBlock(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                          title="Delete Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {block.type === 'hero' && (
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-500">Hero Main Title</label>
                            <input
                              type="text"
                              value={content.title || ''}
                              onChange={(e) => handleUpdateBlockContent(index, { ...content, title: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-500">Hero Subtitle</label>
                            <input
                              type="text"
                              value={content.subtitle || ''}
                              onChange={(e) => handleUpdateBlockContent(index, { ...content, subtitle: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <EditFacebookProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user || { username: 'creator' }}
        profile={profile || {}}
        onSaved={(updated) => setProfile((prev: any) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
