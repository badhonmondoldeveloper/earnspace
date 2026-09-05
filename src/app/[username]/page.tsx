'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserPlus, UserCheck, MessageSquare, Globe, MapPin, Calendar, Share2, MoreHorizontal, Flag, ShieldAlert } from 'lucide-react';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username.replace(/^%40/, '').replace(/^@/, '');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'blogs' | 'about'>('posts');
  const [reportModal, setReportModal] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/profiles/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileData(data.data);
          setIsFollowing(data.data.isFollowing);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      const res = await fetch('/api/v1/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profileData.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.data.isFollowing);
        setProfileData((prev: any) => ({
          ...prev,
          profile: {
            ...prev.profile,
            followersCount: data.data.isFollowing
              ? prev.profile.followersCount + 1
              : prev.profile.followersCount - 1,
          },
        }));
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20 text-xs text-slate-400">
          Loading space profile...
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20 space-y-4">
          <ShieldAlert className="w-12 h-12 text-slate-400" />
          <h2 className="text-xl font-bold">User Not Found</h2>
          <p className="text-xs text-slate-500">The profile @{username} does not exist on EarnSpace.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { profile, posts = [], blogs = [] } = profileData;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Cover Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-sky-500 h-48 sm:h-64 shadow-md">
          {profile.cover && (
            <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Details Bar */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm -mt-16 sm:-mt-20 pt-16 sm:pt-20 space-y-6">
          <div className="absolute -top-12 sm:-top-16 left-6 flex items-end gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-brand-500 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profileData.username[0]?.toUpperCase()
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{profile.fullName}</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">@{profileData.username}</p>
            </div>

            <div className="flex items-center gap-3">
              {!profileData.isOwnProfile && (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>

                  <a
                    href={`/messages?user=${profileData.id}`}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Send message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </>
              )}

              <a
                href={`/space/${profileData.username}`}
                className="px-4 py-2 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-100 transition flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Personal Space</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {profile.bio || 'No bio provided.'}
          </p>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white mr-1">{profile.followersCount}</span>
              <span className="text-slate-500">Followers</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white mr-1">{profile.followingCount}</span>
              <span className="text-slate-500">Following</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white mr-1">{profile.postsCount}</span>
              <span className="text-slate-500">Posts</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white mr-1">{profile.blogsCount}</span>
              <span className="text-slate-500">Articles</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'posts' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'blogs' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Articles ({blogs.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No posts published yet.
              </div>
            ) : (
              posts.map((post: any) => (
                <div key={post.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  <span className="text-[10px] text-slate-400 block">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {blogs.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No published articles yet.
              </div>
            ) : (
              blogs.map((blog: any) => (
                <a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-brand-500/50 transition block"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{blog.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
                </a>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
