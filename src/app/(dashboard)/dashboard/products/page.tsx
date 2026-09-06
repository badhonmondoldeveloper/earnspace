'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, DollarSign, Download, ExternalLink, RefreshCw, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export default function CreatorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('299');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [category, setCategory] = useState('E-Book');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          description,
          fileUrl,
          isDigital: true,
          currency: 'BDT',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Digital Product created and published to your Personal Space store!');
        setTitle('');
        setDescription('');
        setFileUrl('');
        setIsAdding(false);
        fetchProducts();
      } else {
        setMessage(`Error: ${json.message}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Digital Product Store Manager</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sell e-books, video courses, presets, and digital tools directly on your personal space with 90% revenue payout!
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Creator Form' : 'Create New Product'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Add Product Modal/Form */}
      {isAdding && (
        <form onSubmit={handleCreateProduct} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Publish New Digital Product</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Creator Playbook (PDF)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price (BDT ৳) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="E-Book">E-Book (PDF)</option>
                <option value="Video Course">Video Course</option>
                <option value="Audio / Podcast">Audio / Podcast</option>
                <option value="Presets & Assets">Presets & Assets</option>
                <option value="Software / Source Code">Software / Source Code</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Digital Delivery File Download URL</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://storage.earnspace.com/files/my-ebook.pdf"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what customers will get when buying this digital asset..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      )}

      {/* Product List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Active Digital Products ({products.length})</h2>
          <button onClick={fetchProducts} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <Package className="w-10 h-10 mx-auto text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No products created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &quot;Create New Product&quot; to publish your first digital item and start earning revenue!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">{item.currency} ৳{item.price}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{item.salesCount || 0} Sales</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.description || 'No description provided.'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 90% Creator Revenue
                  </span>
                  <a
                    href={`/space/${item.seller?.username}?tab=store`}
                    target="_blank"
                    className="text-indigo-500 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View in Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
