'use client';

import React from 'react';
import { FacebookProfileSpace } from '@/components/space/FacebookProfileSpace';

interface PersonalSpaceClientContainerProps {
  page: any;
  user: any;
  profile: any;
  posts: any[];
  reels: any[];
  videos: any[];
  blogs: any[];
  stories: any[];
  blocks: any[];
  settings: any;
}

export function PersonalSpaceClientContainer({
  page,
  user,
  profile,
  posts,
  reels,
  videos,
  blogs,
  blocks,
}: PersonalSpaceClientContainerProps) {
  return (
    <FacebookProfileSpace
      user={user}
      profile={profile}
      posts={posts}
      reels={reels}
      videos={videos}
      blogs={blogs}
      blocks={blocks}
      isOwner={false}
    />
  );
}
