export interface UploadPolicy {
  mimeTypes: string[];
  maxBytes: number;
  label: string;
}

export const MEDIA_CONFIG = {
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxReelDuration: 90, // seconds
  storyExpirationHours: 24,

  policies: {
    avatar: {
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxBytes: 5 * 1024 * 1024,
      label: 'Avatar image (max 5MB)',
    },
    cover: {
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxBytes: 10 * 1024 * 1024,
      label: 'Cover photo (max 10MB)',
    },
    'post-image': {
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxBytes: 10 * 1024 * 1024,
      label: 'Post photo (max 10MB)',
    },
    'story-image': {
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
      maxBytes: 25 * 1024 * 1024,
      label: 'Story media (max 25MB)',
    },
    thumbnail: {
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxBytes: 5 * 1024 * 1024,
      label: 'Video thumbnail (max 5MB)',
    },
    video: {
      mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
      maxBytes: 100 * 1024 * 1024,
      label: 'Video (max 100MB)',
    },
    reel: {
      mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
      maxBytes: 100 * 1024 * 1024,
      label: 'Reel video (max 100MB)',
    },
  } as Record<string, UploadPolicy>,
};

export interface StoryPreset {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
}

export const STORY_PRESETS: StoryPreset[] = [
  { id: 'indigo', name: 'Indigo Night', gradient: 'from-indigo-600 to-purple-800', textColor: 'text-white' },
  { id: 'sunset', name: 'Sunset Gold', gradient: 'from-amber-500 via-rose-500 to-purple-600', textColor: 'text-white' },
  { id: 'neon', name: 'Neon Cyber', gradient: 'from-cyan-500 via-blue-600 to-fuchsia-600', textColor: 'text-white' },
  { id: 'rose', name: 'Rose Velvet', gradient: 'from-rose-500 to-red-800', textColor: 'text-white' },
  { id: 'emerald', name: 'Emerald Forest', gradient: 'from-emerald-500 via-teal-700 to-slate-900', textColor: 'text-white' },
  { id: 'royal', name: 'Royal Purple', gradient: 'from-purple-900 via-violet-800 to-slate-900', textColor: 'text-white' },
];

export const VIDEO_CATEGORIES = [
  'Gaming',
  'Education',
  'Technology',
  'Entertainment',
  'Lifestyle',
  'Business',
  'News',
  'Music',
  'Sports',
  'Other',
];

export const FEELING_ACTIVITIES = [
  { emoji: '😊', label: 'Happy', category: 'feeling' },
  { emoji: '🥳', label: 'Celebrating', category: 'feeling' },
  { emoji: '❤️', label: 'Loved', category: 'feeling' },
  { emoji: '🚀', label: 'Excited', category: 'feeling' },
  { emoji: '💼', label: 'Working', category: 'activity' },
  { emoji: '🎮', label: 'Gaming', category: 'activity' },
  { emoji: '🎨', label: 'Creative', category: 'activity' },
  { emoji: '📚', label: 'Learning', category: 'activity' },
  { emoji: '✈️', label: 'Traveling', category: 'activity' },
  { emoji: '🍿', label: 'Watching', category: 'activity' },
];
