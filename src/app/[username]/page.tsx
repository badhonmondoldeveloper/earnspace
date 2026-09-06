'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  UserPlus,
  UserCheck,
  MessageSquare,
  Globe,
  ShieldAlert,
  Camera,
  Edit,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Link as LinkIcon,
  Video,
  Film,
  Plus,
  MoreHorizontal,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username.replace(/^%40/, '').replace(/^@/, '');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'videos' | 'reels' | 'blogs'>('posts');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Media items
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [userReels, setUserReels] = useState<any[]>([]);

  // Avatar/Cover Modal State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [savingEdit, setSavingEdit] = useState(false);

  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await fetch('/api/v1/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName,
          bio: editBio,
          location: editLocation,
          website: editWebsite,
          category: editCategory,
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

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
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20 text-xs text-slate-400">
          Loading Facebook profile...
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto pb-16">
        {/* Facebook Header Container */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-72 md:h-80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
            {profile.cover ? (
              <img src={profile.cover} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
                Facebook Banner
              </div>
            )}
            {profileData.isOwnProfile && (
              <button
                onClick={() => setShowCoverModal(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md transition"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* Profile Header Details Bar */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Avatar + Basic Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden shrink-0 group">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full text-white font-black text-4xl flex items-center justify-center">
                      {profileData.username[0]?.toUpperCase()}
                    </div>
                  )}
                  {profileData.isOwnProfile && (
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                  )}
                </div>

                <div className="space-y-1 pb-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {profile.fullName}
                    </h1>
                    {profile.isVerified && (
                      <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    @{profileData.username} • {profile.followersCount} followers • {profile.followingCount} following
                  </p>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 pb-2">
                {!profileData.isOwnProfile && (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                        isFollowing
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    <a
                      href={`/messages?user=${profileData.id}`}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </>
                )}

                {profileData.isOwnProfile && (
                  <>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Story</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditFullName(profile.fullName || '');
                        setEditBio(profile.bio || '');
                        setEditLocation(profile.location || '');
                        setEditWebsite(profile.website || '');
                        setEditCategory(profile.category || 'General');
                        setShowEditModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                )}

                <a
                  href={`/space/${profileData.username}`}
                  className="px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/50 transition flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Personal Space</span>
                </a>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            {/* Profile Nav Tabs Bar */}
            <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'about' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'videos' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Videos ({userVideos.length})
              </button>
              <button
                onClick={() => setActiveTab('reels')}
                className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'reels' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Reels ({userReels.length})
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                  activeTab === 'blogs' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Articles ({blogs.length})
              </button>
            </div>
          </div>
        </div>

        {/* Facebook 2-Column Responsive Body */}
        <div className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Intro & Info Card */}
          <div className="md:col-span-5 space-y-4">
            {/* Intro Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Intro</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center py-1">
                {profile.bio || 'Digital content creator on EarnSpace.'}
              </p>
              
              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {profile.category && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Category: <strong>{profile.category}</strong></span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Lives in <strong>{profile.location}</strong></span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                    <a href={profile.website} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline truncate">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined EarnSpace Creator Network</span>
                </div>
              </div>
            </div>

            {/* Photos Preview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Photos</h3>
                <span className="text-xs text-indigo-500 font-semibold cursor-pointer">See all</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                {posts.filter((p: any) => p.media?.length > 0).slice(0, 6).length === 0 ? (
                  <div className="col-span-3 text-slate-400 text-xs text-center py-4">No photos yet.</div>
                ) : (
                  posts.filter((p: any) => p.media?.length > 0).slice(0, 6).map((p: any, i: number) => (
                    <div key={i} className="aspect-square bg-slate-800 overflow-hidden">
                      <img src={p.media[0].url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Feed & Tab Content */}
          <div className="md:col-span-7 space-y-4">
            {/* Create Post Box for Profile Owner */}
            {profileData.isOwnProfile && (
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 cursor-pointer hover:border-indigo-500 transition"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profileData.username[0]?.toUpperCase()
                  )}
                </div>
                <div className="flex-1 text-xs text-slate-400 font-medium">
                  What&apos;s on your mind? Post to your timeline...
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No posts published on this timeline yet.
                  </div>
                ) : (
                  posts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              profileData.username[0]?.toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.fullName}</p>
                            <p className="text-[10px] text-slate-400">@{profileData.username} • {new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="p-1 text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                      {post.media && post.media.length > 0 && (
                        <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                          <img src={post.media[0].url} alt="" className="w-full max-h-96 object-cover" />
                        </div>
                      )}

                      <hr className="border-slate-100 dark:border-slate-800" />

                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <button className="flex items-center gap-1.5 hover:text-indigo-500">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Like</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-indigo-500">
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-indigo-500">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm text-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">About {profile.fullName}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{profile.bio || 'No detailed info provided.'}</p>
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p><strong>Username:</strong> @{profileData.username}</p>
                  <p><strong>Category:</strong> {profile.category || 'General'}</p>
                  <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userVideos.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No videos uploaded yet.
                  </div>
                ) : (
                  userVideos.map((v: any) => (
                    <Link
                      key={v.id}
                      href={`/video/${v.id}`}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-indigo-500 transition block"
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
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition">{v.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{v.viewsCount} views</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Reels Tab */}
            {activeTab === 'reels' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userReels.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No reels uploaded yet.
                  </div>
                ) : (
                  userReels.map((r: any) => (
                    <Link
                      key={r.id}
                      href="/reels"
                      className="group rounded-2xl bg-black border border-slate-800 overflow-hidden aspect-[9/16] relative hover:border-indigo-500 transition block"
                    >
                      <video src={r.videoUrl} poster={r.thumbnailUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                        <p className="text-xs text-white font-medium line-clamp-2">{r.caption}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Blogs Tab */}
            {activeTab === 'blogs' && (
              <div className="space-y-3">
                {blogs.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    No published articles yet.
                  </div>
                ) : (
                  blogs.map((blog: any) => (
                    <a
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm hover:border-indigo-500 transition block"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{blog.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Profile Picture</h3>
            <form onSubmit={handleUpdateAvatar} className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                required
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Cover Photo</h3>
            <form onSubmit={handleUpdateCover} className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                required
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCoverModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveEditProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Creator">Creator</option>
                    <option value="Tech & Science">Tech & Science</option>
                    <option value="Education">Education</option>
                    <option value="Vlogger">Vlogger</option>
                    <option value="Business & Entrepreneur">Business & Entrepreneur</option>
                    <option value="Artist & Designer">Artist & Designer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Website URL</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                >
                  {savingEdit ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchProfile()}
      />

      <Footer />
    </div>
  );
}
