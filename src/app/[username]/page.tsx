'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserPlus, UserCheck, MessageSquare, Globe, ShieldAlert, Camera, Edit, Video as VideoIcon, Film } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username.replace(/^%40/, '').replace(/^@/, '');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'reels' | 'blogs' | 'about'>('posts');

  // Media items
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [userReels, setUserReels] = useState<any[]>([]);

  // Avatar/Cover Modal State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = () => {
    setLoading(true);
    fetch(`/api/v1/profiles/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileData(data.data);
          setIsFollowing(data.data.isFollowing);
          fetchUserMedia(data.data.id);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchUserMedia = async (userId: string) => {
    try {
      const [vRes, rRes] = await Promise.all([
        fetch(`/api/v1/videos?userId=${userId}`),
        fetch(`/api/v1/reels?userId=${userId}`),
      ]);
      const vData = await vRes.json();
      const rData = await rRes.json();
      if (vRes.ok) setUserVideos(vData.data?.items || []);
      if (rRes.ok) setUserReels(rData.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('purpose', 'avatar');
      const upload = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
      const uploadData = await upload.json();
      if (!upload.ok) throw new Error(uploadData.message || 'Upload failed');
      const res = await fetch('/api/v1/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: uploadData.data.url }),
      });
      if (res.ok) {
        setShowAvatarModal(false);
        setAvatarFile(null);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) return;
    try {
      const formData = new FormData();
      formData.append('file', coverFile);
      formData.append('purpose', 'cover');
      const upload = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
      const uploadData = await upload.json();
      if (!upload.ok) throw new Error(uploadData.message || 'Upload failed');
      const res = await fetch('/api/v1/profile/cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverUrl: uploadData.data.url }),
      });
      if (res.ok) {
        setShowCoverModal(false);
        setCoverFile(null);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20 text-xs text-slate-400">
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Cover Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 h-48 sm:h-64 border border-slate-800 shadow-md">
          {profile.cover && (
            <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />
          )}
          {profileData.isOwnProfile && (
            <button
              onClick={() => setShowCoverModal(true)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Cover</span>
            </button>
          )}
        </div>

        {/* Profile Details Bar */}
        <div className="relative bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm -mt-16 sm:-mt-20 pt-16 sm:pt-20 space-y-6">
          <div className="absolute -top-12 sm:-top-16 left-6 flex items-end gap-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-600 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center border-4 border-slate-900 shadow-xl overflow-hidden group">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profileData.username[0]?.toUpperCase()
              )}
              {profileData.isOwnProfile && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <Camera className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white">
                  {profile.fullName}
                </h1>
                {profile.category && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {profile.category}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-400">@{profileData.username}</p>
            </div>

            <div className="flex items-center gap-3">
              {!profileData.isOwnProfile && (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>

                  <a
                    href={`/messages?user=${profileData.id}`}
                    className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                    title="Send message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </>
              )}

              <a
                href={`/space/${profileData.username}`}
                className="px-4 py-2 rounded-full bg-sky-950/50 border border-sky-800 text-sky-400 text-xs font-semibold hover:bg-sky-900/50 transition flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Personal Space</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {profile.bio || 'No bio provided.'}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="font-bold text-white mr-1">{profile.followersCount}</span>
              <span className="text-slate-400">Followers</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1">{profile.followingCount}</span>
              <span className="text-slate-400">Following</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1">{profile.postsCount}</span>
              <span className="text-slate-400">Posts</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1">{profile.videosCount || userVideos.length}</span>
              <span className="text-slate-400">Videos</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1">{profile.reelsCount || userReels.length}</span>
              <span className="text-slate-400">Reels</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1">{profile.blogsCount}</span>
              <span className="text-slate-400">Articles</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'posts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'videos' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Videos ({userVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'reels' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Reels ({userReels.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'blogs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Articles ({blogs.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No posts published yet.
              </div>
            ) : (
              posts.map((post: any) => (
                <div key={post.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  <span className="text-[10px] text-slate-400 block">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userVideos.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No videos uploaded yet.
              </div>
            ) : (
              userVideos.map((v: any) => (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition block"
                >
                  <div className="aspect-video bg-black relative">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">Video</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <span className="text-white text-2xl">▶</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition">{v.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{v.viewsCount} views</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userReels.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No reels uploaded yet.
              </div>
            ) : (
              userReels.map((r: any) => (
                <Link
                  key={r.id}
                  href="/reels"
                  className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-[9/16] relative hover:border-indigo-500/50 transition block"
                >
                  <video src={r.videoUrl} poster={r.thumbnailUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <p className="text-xs text-white font-medium line-clamp-2">{r.caption}</p>
                    <p className="text-[10px] text-slate-300 mt-1">👁️ {r.viewsCount} views</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {blogs.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No published articles yet.
              </div>
            ) : (
              blogs.map((blog: any) => (
                <a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-indigo-500/50 transition block"
                >
                  <h3 className="text-sm font-bold text-white line-clamp-1">{blog.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{blog.excerpt}</p>
                </a>
              ))
            )}
          </div>
        )}
      </main>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Update Profile Picture</h3>
            <form onSubmit={handleUpdateAvatar} className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Save Avatar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Update Cover Photo</h3>
            <form onSubmit={handleUpdateCover} className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCoverModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Save Cover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
