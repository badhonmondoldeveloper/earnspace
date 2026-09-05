'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPortalPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/v1/blogs?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.data || []);
        }
      });
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setPublishing(true);
    setSuccess('');
    try {
      const res = await fetch('/api/v1/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content, status: 'published' }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Article published successfully!');
        setTitle('');
        setContent('');
        setBlogs([data.data, ...blogs]);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (e) {
      console.error('Blog error:', e);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-500" />
            <span>Blog & Article Portal</span>
          </h1>
          <p className="text-xs text-slate-500">Publish long-form articles, guides, and tutorials on EarnSpace</p>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handlePublish} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Write New Article</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Creativity">Creativity</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Article Content</label>
          <textarea
            rows={8}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your main article content here..."
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-y"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={publishing || !title.trim() || !content.trim()}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{publishing ? 'Publishing...' : 'Publish Article'}</span>
          </button>
        </div>
      </form>

      {/* Articles List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Published Articles</h3>
        <div className="grid gap-3">
          {blogs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No articles published yet.
            </div>
          ) : (
            blogs.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</h4>
                  <span className="text-[10px] text-slate-400">Published: {new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/blog/${b.slug}`} className="text-xs font-semibold text-brand-500 hover:underline">
                  View Article
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

