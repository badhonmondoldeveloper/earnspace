'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  SpaceHeader,
  SpaceTabNav,
  SpaceTab,
  SpaceStoryRail,
  SpaceCreatorComposer,
  SpaceBlogSection,
  SpacePortfolioSection,
  SpaceReferralHub,
  SpaceTippingModal,
  SpaceSocialLinks,
  SpaceAnalyticsBar,
  SpaceProductsSection,
} from '@/components/space';
import UniversalCreateModal from '@/components/content/UniversalCreateModal';
import { StoryViewerModal } from '@/components/content/StoryViewerModal';
import { uploadMedia } from '@/services/mediaUploadService';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Film,
  Video as VideoIcon,
  BookOpen,
  Sparkles,
  Calendar,
  Eye,
  Camera,
  X,
  Send,
} from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username.replace(/^%40/, '').replace(/^@/, '');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<SpaceTab>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialType, setCreateInitialType] = useState<'post' | 'story' | 'video' | 'reel'>('post');

  // Media items
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [userReels, setUserReels] = useState<any[]>([]);

  // Tipping Modal State
  const [showTippingModal, setShowTippingModal] = useState(false);

  // Story Viewer State
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Avatar / Cover Modals
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [savingEdit, setSavingEdit] = useState(false);

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
          setEditFullName(data.data.profile?.fullName || '');
          setEditBio(data.data.profile?.bio || '');
          setEditLocation(data.data.profile?.location || '');
          setEditWebsite(data.data.profile?.website || '');
          setEditCategory(data.data.profile?.category || 'General');
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
      if (vData.success && vData.data?.items) setUserVideos(vData.data.items);
      if (rData.success && rData.data?.items) setUserReels(rData.data.items);
    } catch (err) {}
  };

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      const res = await fetch('/api/v1/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: profileData.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFollowing(data.data.isFollowing);
      }
    } catch (err) {}
  };

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

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploadingPhoto(true);
    try {
      const upload = await uploadMedia(file, 'avatar');
      await fetch('/api/v1/profile/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: upload.url }),
      });
      setShowAvatarModal(false);
      fetchProfile();
    } catch (err) {} finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploadingPhoto(true);
    try {
      const upload = await uploadMedia(file, 'cover');
      await fetch('/api/v1/profile/cover', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover: upload.url }),
      });
      setShowCoverModal(false);
      fetchProfile();
    } catch (err) {} finally {
      setIsUploadingPhoto(false);
    }
  };

  const openCreateModalWithType = (type: 'post' | 'story' | 'video' | 'reel' = 'post') => {
    setCreateInitialType(type);
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" /> Loading Personal Digital Space...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3 bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm">
            <h2 className="text-lg font-bold text-white">Space Not Found</h2>
            <p className="text-xs text-slate-400">The user space @{username} does not exist or has been made private.</p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              Back to Feed
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = profileData.isOwnProfile;
  const profile = profileData.profile || {};
  const posts = profileData.posts || [];
  const blogs = profileData.blogs || [];
  const stories = profileData.stories || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header */}
        <SpaceHeader
          profileData={profileData}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          onOpenEditModal={() => setShowEditModal(true)}
          onOpenCoverModal={() => setShowCoverModal(true)}
          onOpenAvatarModal={() => setShowAvatarModal(true)}
          onOpenTippingModal={() => setShowTippingModal(true)}
        />

        {/* Tab Navigation */}
        <SpaceTabNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          counts={{
            posts: posts.length,
            blogs: blogs.length,
            reels: userReels.length,
            videos: userVideos.length,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Analytics Bar */}
          <SpaceAnalyticsBar profile={profile} />

          {/* Active Story Rail */}
          {(stories.length > 0 || isOwnProfile) && (
            <SpaceStoryRail
              stories={stories}
              isOwnProfile={isOwnProfile}
              onOpenCreateStory={() => openCreateModalWithType('story')}
              onSelectStory={(idx) => {
                setSelectedStoryIndex(idx);
                setIsStoryViewerOpen(true);
              }}
            />
          )}

          {/* Owner Direct Composer */}
          {isOwnProfile && (
            <SpaceCreatorComposer user={profileData} onOpenCreate={openCreateModalWithType} />
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="space-y-6">
                <SpaceSocialLinks socialLinks={profile.socialLinks} website={profile.website} />
                <SpaceReferralHub referralCode={profileData.referralCode} username={username} />
              </div>

              {/* Center Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Articles */}
                {blogs.length > 0 && (
                  <SpaceBlogSection blogs={blogs.slice(0, 2)} username={username} isOwnProfile={isOwnProfile} />
                )}

                {/* Posts Stream */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Latest Activity & Posts</h3>
                  {posts.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
                      No posts published on this space yet.
                    </div>
                  ) : (
                    posts.map((post: any) => (
                      <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={profile.avatar || '/default-avatar.png'}
                            alt={profile.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{profile.fullName || username}</div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{post.content}</p>

                        {post.media && post.media.length > 0 && (
                          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-96">
                            <img src={post.media[0].url} alt="Media" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POSTS */}
          {activeTab === 'posts' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{post.content}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-96">
                      <img src={post.media[0].url} alt="Media" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ARTICLES / BLOGS */}
          {activeTab === 'blogs' && (
            <SpaceBlogSection blogs={blogs} username={username} isOwnProfile={isOwnProfile} />
          )}

          {/* TAB 4: REELS */}
          {activeTab === 'reels' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userReels.map((reel: any) => (
                <div key={reel.id} className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-slate-800 relative group">
                  <video src={reel.videoUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 p-2 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-white bg-rose-500/80 px-2 py-0.5 rounded-full w-max">
                      Reel
                    </span>
                    <p className="text-[10px] text-white font-medium line-clamp-2">{reel.caption}</p>
                  </div>
                </div>
              ))}
              {userReels.length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
                  No short video Reels published yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WATCH VIDEOS */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userVideos.map((vid: any) => (
                <div key={vid.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden space-y-2 p-3">
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
                    <video src={vid.videoUrl} controls className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-xs font-bold text-white px-1">{vid.title}</h4>
                </div>
              ))}
              {userVideos.length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
                  No long-form videos published yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <SpacePortfolioSection profile={profile} username={username} isOwnProfile={isOwnProfile} />
          )}

          {/* TAB 7: SERVICES & PRODUCTS */}
          {activeTab === 'products' && (
            <SpaceProductsSection username={username} />
          )}

          {/* TAB 8: REFERRAL HUB */}
          {activeTab === 'referrals' && (
            <SpaceReferralHub referralCode={profileData.referralCode} username={username} />
          )}

          {/* TAB 9: ABOUT */}
          {activeTab === 'about' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-w-2xl mx-auto">
              <h3 className="text-base font-bold text-white">About @{username}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{profile.bio || 'No bio provided.'}</p>
              <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
                <div>Location: {profile.location || 'Not specified'}</div>
                <div>Category: {profile.category || 'General Creator'}</div>
                <div>Website: {profile.website || 'Not specified'}</div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Universal Create Modal */}
      <UniversalCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchProfile()}
        user={profileData}
        initialType={createInitialType}
      />

      {/* Story Viewer Modal */}
      {isStoryViewerOpen && stories.length > 0 && (
        <StoryViewerModal
          isOpen={isStoryViewerOpen}
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setIsStoryViewerOpen(false)}
        />
      )}

      {/* Fan Tipping Modal */}
      <SpaceTippingModal
        isOpen={showTippingModal}
        onClose={() => setShowTippingModal(false)}
        username={username}
        creatorId={profileData.id}
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Personal Website</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProfile} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Bio / Headline</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-none h-20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Website URL</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
            <h3 className="text-sm font-bold text-white">Update Profile Photo</h3>
            <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" id="avatar-input" />
            <label
              htmlFor="avatar-input"
              className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Choose Photo'}
            </label>
            <button onClick={() => setShowAvatarModal(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cover Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
            <h3 className="text-sm font-bold text-white">Update Cover Banner</h3>
            <input type="file" accept="image/*" onChange={handleUploadCover} className="hidden" id="cover-input" />
            <label
              htmlFor="cover-input"
              className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Choose Cover Photo'}
            </label>
            <button onClick={() => setShowCoverModal(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
