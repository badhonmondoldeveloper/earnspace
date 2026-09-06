'use client';

import React from 'react';
import { Briefcase, Award, CheckCircle, ExternalLink, Mail, Sparkles, Star } from 'lucide-react';

interface SpacePortfolioSectionProps {
  profile: any;
  username: string;
  isOwnProfile: boolean;
}

export function SpacePortfolioSection({ profile, username, isOwnProfile }: SpacePortfolioSectionProps) {
  const fullName = profile?.fullName || username;
  const skillsStr = profile?.skills || '[]';
  let skillsArr: string[] = [];
  try {
    skillsArr = JSON.parse(skillsStr);
  } catch (e) {
    skillsArr = ['Content Creation', 'Digital Marketing', 'Web Development', 'Video Editing'];
  }

  if (skillsArr.length === 0) {
    skillsArr = ['Creator Economy', 'Digital Space', 'Monetization', 'Social Growth'];
  }

  const sampleProjects = [
    {
      title: 'EarnSpace Creator Monetization Showcase',
      description: 'Building high-converting digital creator space with referral reward engine.',
      category: 'Creator Space',
      link: '#',
    },
    {
      title: 'Social Growth & Content Platform',
      description: 'Strategic video marketing and viral engagement workflow.',
      category: 'Digital Strategy',
      link: '#',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero CTA Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-extrabold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Professional Portfolio
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Work With {fullName}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Available for brand collaborations, content sponsorship, digital consultancy, and custom projects.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={`mailto:${username}@earnspace.com`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" /> Contact & Hire Me
            </a>
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Skills & Expertise</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {skillsArr.map((skill, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-indigo-300 flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Featured Work & Projects</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleProjects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-indigo-500/40 transition-colors"
            >
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{proj.category}</div>
              <h4 className="text-sm font-bold text-white">{proj.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

