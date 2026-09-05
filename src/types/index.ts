export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface UserSessionPayload {
  userId: string;
  username: string;
  email: string;
  sessionId?: string;
  role?: string;
}

export interface WebsiteBlock {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'blog' | 'social' | 'gallery' | 'links' | 'contact' | 'cta';
  position: number;
  contentJson: string; // JSON parsed data
  visibility: boolean;
}

export interface WebsitePageSettings {
  theme: 'modern' | 'minimalist' | 'dark' | 'elegant' | 'cyberpunk';
  typography: string;
  colorsJson: Record<string, string>;
  layout: string;
  customSettingsJson: Record<string, any>;
}

export interface UserProfileData {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  cover?: string;
  location?: string;
  website?: string;
  socialLinks: Record<string, string>;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  blogsCount: number;
  isFollowing?: boolean;
}

