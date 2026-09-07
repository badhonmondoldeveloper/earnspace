'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Heart,
  Eye,
  Check,
  Star,
  SlidersHorizontal,
  Filter,
  Monitor,
  Zap,
} from 'lucide-react';
import { TEMPLATE_CATEGORIES, TEMPLATE_REGISTRY, TemplateDefinition } from '@/lib/templates/templateRegistry';

interface TemplateMarketplaceProps {
  onSelectTemplate: (template: TemplateDefinition) => void;
  onPreviewTemplate: (template: TemplateDefinition) => void;
}

export function TemplateMarketplace({ onSelectTemplate, onPreviewTemplate }: TemplateMarketplaceProps) {
  const [templates, setTemplates] = useState<TemplateDefinition[]>(TEMPLATE_REGISTRY);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, searchQuery, selectedStyle]);

  const fetchTemplates = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (selectedStyle && selectedStyle !== 'all') queryParams.append('style', selectedStyle);

      const res = await fetch(`/api/v1/templates?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTemplates(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Ready-Made Income Engine Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
              💰 Ready-Made Income Engine
            </span>
            <span className="text-xs text-emerald-400 font-semibold">100% Monetization Ready</span>
          </div>
          <h2 className="text-lg font-black text-white">Turn Every Template Into a Ready-Made Earning Website</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Choose any template below — each comes fully pre-configured with monetized ad slots, digital store checkout (bKash & Nagad), and fan tipping. Start earning revenue share immediately upon launching your space.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-slate-900/80 border border-slate-700/60 rounded-2xl text-center">
            <div className="text-xs font-mono text-emerald-400 font-bold">50-70%</div>
            <div className="text-[10px] text-slate-400">Ad RevShare</div>
          </div>
          <div className="px-3 py-2 bg-slate-900/80 border border-slate-700/60 rounded-2xl text-center">
            <div className="text-xs font-mono text-indigo-400 font-bold">bKash/Nagad</div>
            <div className="text-[10px] text-slate-400">Direct Payouts</div>
          </div>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search templates (e.g. photographer, gaming)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
            >
              <option value="all">All Visual Styles</option>
              <option value="Modern">Modern</option>
              <option value="Minimal">Minimal</option>
              <option value="Cyber">Cyber</option>
              <option value="Luxury">Luxury</option>
              <option value="Elegant">Elegant</option>
              <option value="Bold">Bold</option>
            </select>
          </div>
        </div>

        {/* 28 Level-1 Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Templates ({templates.length})
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name.replace('⭐ ', ''))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory.toLowerCase().includes(cat.id) || selectedCategory === cat.name.replace('⭐ ', '')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col group"
          >
            {/* Template Header Preview Frame */}
            <div className="h-44 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 p-4 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors"></div>

              <div className="flex items-start justify-between z-10">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {tpl.category}
                  </span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-0.5">
                    💰 Ready Income Site
                  </span>
                </div>
                <button
                  onClick={() => toggleFav(tpl.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                    favorites[tpl.id] ? 'bg-rose-500 text-white' : 'bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites[tpl.id] ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="z-10">
                <div className="text-lg font-black text-white tracking-tight">{tpl.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{tpl.subcategory || tpl.style}</div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-400 line-clamp-2">{tpl.description}</p>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{tpl.blocks?.length || 4} Sections</span>
                  <span className="font-semibold text-slate-300">{tpl.style} Design</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPreviewTemplate(tpl)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" /> Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateMarketplace;
