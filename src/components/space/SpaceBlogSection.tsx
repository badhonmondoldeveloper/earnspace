'use client';

import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, Tag, X, Clock } from 'lucide-react';
import Link from 'next/link';

interface SpaceBlogSectionProps {
  blogs: any[];
  username: string;
  isOwnProfile: boolean;
}

export function SpaceBlogSection({ blogs, username, isOwnProfile }: SpaceBlogSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
        <BookOpen className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Readymade Blog Website</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No published articles yet. {isOwnProfile && 'Start writing your personal blog posts to publish on your space!'}
        </p>
        {isOwnProfile && (
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <BookOpen className="w-4 h-4" /> Write New Article
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Articles & Blog</h2>
            <p className="text-xs text-slate-400">Personal blog posts published by @{username}</p>
          </div>

          {isOwnProfile && (
            <Link
              href="/dashboard/blog"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> Write Article
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog) => {
            const dateStr = blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            const readTime = Math.max(1, Math.ceil((blog.content || blog.excerpt || '').length / 800));

            return (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                {blog.coverImage && (
                  <div className="h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                      {blog.category && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {blog.category}
                        </span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {readTime} min read
                      </span>
                      {dateStr && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" /> {dateStr}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Article Reader</span>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedBlog.coverImage && (
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  className="w-full h-56 object-cover rounded-2xl border border-slate-800"
                />
              )}

              <h1 className="text-2xl font-extrabold text-white leading-tight">{selectedBlog.title}</h1>

              <div className="text-xs text-slate-400 border-b border-slate-800 pb-3">
                Published by @{username}
              </div>

              <div className="text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-line">
                {selectedBlog.content || selectedBlog.excerpt}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

