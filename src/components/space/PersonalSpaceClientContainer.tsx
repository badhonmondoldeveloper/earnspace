'use client';

import React from 'react';
import { StandalonePersonalWebsite } from '@/components/space/StandalonePersonalWebsite';

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
  blogs,
  blocks,
  settings,
}: PersonalSpaceClientContainerProps) {
  return (
    <StandalonePersonalWebsite
      page={page}
      user={user}
      profile={profile}
      blogs={blogs}
      blocks={blocks}
      settings={settings}
      isOwner={false}
    />
  );
}
