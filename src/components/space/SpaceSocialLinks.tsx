'use client';

import React from 'react';
import { Globe, Youtube, Facebook, Twitter, Instagram, Github, Linkedin, MessageCircle, Send } from 'lucide-react';

interface SpaceSocialLinksProps {
  socialLinks?: string | Record<string, string>;
  website?: string;
}

export function SpaceSocialLinks({ socialLinks, website }: SpaceSocialLinksProps) {
  let linksObj: Record<string, string> = {};
  if (typeof socialLinks === 'string') {
    try {
      linksObj = JSON.parse(socialLinks);
    } catch (e) {}
  } else if (socialLinks && typeof socialLinks === 'object') {
    linksObj = socialLinks;
  }

  if (website) {
    linksObj.website = website;
  }

  const platforms = [
    { key: 'website', label: 'Website', icon: Globe, color: 'hover:text-cyan-400' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'hover:text-red-500' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'hover:text-blue-500' },
    { key: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'hover:text-sky-400' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'hover:text-pink-500' },
    { key: 'github', label: 'GitHub', icon: Github, color: 'hover:text-slate-200' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-400' },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'hover:text-emerald-400' },
    { key: 'telegram', label: 'Telegram', icon: Send, color: 'hover:text-sky-400' },
  ];

  const activePlatforms = platforms.filter((p) => linksObj[p.key]);

  if (activePlatforms.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Links & Websites</h4>
      <div className="flex flex-wrap gap-2">
        {activePlatforms.map((p) => {
          const Icon = p.icon;
          const url = linksObj[p.key];
          const href = url.startsWith('http') ? url : `https://${url}`;
          return (
            <a
              key={p.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 ${p.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

