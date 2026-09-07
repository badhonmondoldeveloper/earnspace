'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  X,
  Star,
} from 'lucide-react';
import { TemplateDefinition } from '@/lib/templates/templateRegistry';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Creators');
  const [subcategory, setSubcategory] = useState('Content Creator');
  const [style, setStyle] = useState('Modern');
  const [isPro, setIsPro] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/templates');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTemplates(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminTemplates();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/v1/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          subcategory,
          style,
          isPro,
          isFeatured,
          blocks: [
            { type: 'hero', content: { title: name, subtitle: description } },
            { type: 'text', content: { title: 'About Section', body: 'Template overview content' } },
            { type: 'contact', content: { title: 'Contact Us', email: 'admin@earnspace.com' } },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMsg(`Template "${name}" created successfully!`);
        setIsModalOpen(false);
        setName('');
        setSlug('');
        setDescription('');
        fetchAdminTemplates();
      } else {
        alert(json.message || 'Failed to create template');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layout className="w-7 h-7 text-indigo-400" />
            <span>Admin Website Template Control Desk</span>
          </h1>
          <p className="text-xs text-slate-400">Manage 65+ website templates, categories, schema versions & features.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Template
          </button>
          <button onClick={fetchAdminTemplates} className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionMsg}
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Template Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Style</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {templates.map((tpl) => (
              <tr key={tpl.id || tpl.slug} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-white">
                  {tpl.name}
                  {tpl.isFeatured && <Star className="w-3 h-3 text-amber-400 inline ml-1.5 fill-current" />}
                </td>
                <td className="py-3 px-4 text-indigo-400 font-semibold">{tpl.category}</td>
                <td className="py-3 px-4">{tpl.style}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tpl.isPro ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {tpl.isPro ? 'PRO' : 'FREE'}
                  </span>
                </td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Published</td>
                <td className="py-3 px-4 text-right">
                  <a href={`/templates`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE TEMPLATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Create New Website Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Creator Noir"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-4 text-xs font-semibold">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={isPro} onChange={(e) => setIsPro(e.target.checked)} /> Pro Template
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {submitting ? 'Publishing...' : 'Publish Template'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
