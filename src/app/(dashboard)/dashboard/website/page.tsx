'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, Eye, Save, GripVertical, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Block {
  id: string;
  type: 'hero' | 'text' | 'links';
  contentJson: string;
  visibility: boolean;
}

export default function WebsiteBuilderPage() {
  const [page, setPage] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/pages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPage(data.data);
          setBlocks(data.data.blocks || []);
        }
      });
  }, []);

  const handleAddBlock = (type: 'hero' | 'text' | 'links') => {
    const newBlock: Block = {
      id: `temp_${Date.now()}`,
      type,
      contentJson:
        type === 'hero'
          ? JSON.stringify({ title: 'Welcome to My Space', subtitle: 'Digital Creator & Entrepreneur' })
          : type === 'text'
          ? JSON.stringify({ title: 'About Me', body: 'Share your background and mission here...' })
          : JSON.stringify({ links: [{ title: 'My Portfolio', url: 'https://example.com' }] }),
      visibility: true,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
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
        body: JSON.stringify({ blocks }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Website changes saved & published!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error('Save blocks error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-500" />
            <span>Digital Space Builder</span>
          </h1>
          <p className="text-xs text-slate-500">Customize your public mini-website blocks at /space/{page?.slug || 'username'}</p>
        </div>

        <div className="flex items-center gap-3">
          {page && (
            <Link
              href={`/space/${page.slug}`}
              target="_blank"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Space</span>
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Block Options */}
      <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 mr-2">Add Block:</span>
        <button
          onClick={() => handleAddBlock('hero')}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition"
        >
          + Hero Block
        </button>
        <button
          onClick={() => handleAddBlock('text')}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition"
        >
          + Text Block
        </button>
        <button
          onClick={() => handleAddBlock('links')}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition"
        >
          + Links Block
        </button>
      </div>

      {/* Blocks List Editor */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-brand-500" />
            <p className="font-semibold">Your Space is currently empty.</p>
            <p>Click any button above to add custom blocks to your website.</p>
          </div>
        ) : (
          blocks.map((block, index) => {
            let content: any = {};
            try {
              content = JSON.parse(block.contentJson || '{}');
            } catch (e) {}

            return (
              <div key={block.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                    Block #{index + 1}: {block.type}
                  </span>
                  <button
                    onClick={() => handleRemoveBlock(index)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                    title="Remove block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {block.type === 'hero' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Hero Title</label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(index, { ...content, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Hero Subtitle</label>
                      <input
                        type="text"
                        value={content.subtitle || ''}
                        onChange={(e) => handleUpdateBlockContent(index, { ...content, subtitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                )}

                {block.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Section Title</label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(index, { ...content, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Section Body</label>
                      <textarea
                        rows={3}
                        value={content.body || ''}
                        onChange={(e) => handleUpdateBlockContent(index, { ...content, body: e.target.value })}
                        className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

