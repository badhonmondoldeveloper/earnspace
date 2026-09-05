'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Search, UserRound, FileText, Video } from 'lucide-react';

interface ExploreData {
  users: Array<{ id: string; username: string; profile?: { fullName?: string; avatar?: string } }>;
  posts: Array<{ id: string; content: string; user?: { username: string; profile?: { fullName?: string } } }>;
  blogs: Array<{ id: string; slug: string; title: string; excerpt?: string | null; user?: { username: string } }>;
}

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<ExploreData>({ users: [], posts: [], blogs: [] });
  const [loading, setLoading] = useState(true);

  const loadExplore = async (search = '') => {
    setLoading(true);
    try {
      const endpoint = search ? `/api/v1/search?q=${encodeURIComponent(search)}` : '/api/v1/posts?limit=12';
      const response = await fetch(endpoint, { cache: 'no-store' });
      const result = await response.json();
      if (search && result.success) {
        setData(result.data);
      } else if (!search && result.success) {
        setData({ users: [], posts: result.data?.items || [], blogs: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    setQuery(initialQuery);
    loadExplore(initialQuery);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const nextQuery = query.trim();
    window.history.replaceState({}, '', nextQuery ? `/explore?q=${encodeURIComponent(nextQuery)}` : '/explore');
    loadExplore(nextQuery);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-400">EarnSpace discovery</p>
          <h1 className="text-3xl font-black flex items-center gap-3"><Compass className="w-7 h-7 text-brand-400" /> Explore</h1>
          <p className="text-sm text-slate-400">Discover real creators, posts, and blogs from EarnSpace.</p>
        </header>

        <form onSubmit={submitSearch} className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search creators, posts, and blogs" className="w-full rounded-2xl bg-slate-900 border border-slate-800 pl-11 pr-4 py-3 text-sm outline-none focus:border-brand-500" />
        </form>

        {loading ? <div className="py-16 text-center text-sm text-slate-500">Loading discovery...</div> : (
          <div className="grid gap-5 md:grid-cols-3">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><UserRound className="w-4 h-4 text-brand-400" /> Creators</h2>
              {data.users.length ? data.users.map((user) => <Link key={user.id} href={`/@${user.username}`} className="block text-sm hover:text-brand-400">{user.profile?.fullName || user.username}<span className="block text-xs text-slate-500">@{user.username}</span></Link>) : <p className="text-xs text-slate-500">No creators found.</p>}
            </section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> Posts</h2>
              {data.posts.length ? data.posts.map((post) => <article key={post.id} className="border-b border-slate-800 pb-3 last:border-0"><p className="text-sm line-clamp-3">{post.content}</p><span className="text-xs text-slate-500">@{post.user?.username || 'creator'}</span></article>) : <p className="text-xs text-slate-500">No content to explore yet.</p>}
            </section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><Video className="w-4 h-4 text-cyan-400" /> Blogs</h2>
              {data.blogs.length ? data.blogs.map((blog) => <Link key={blog.id} href={`/blog/${blog.slug}`} className="block hover:text-brand-400"><p className="text-sm font-semibold">{blog.title}</p><span className="text-xs text-slate-500">@{blog.user?.username || 'creator'}</span></Link>) : <p className="text-xs text-slate-500">No blogs found.</p>}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
