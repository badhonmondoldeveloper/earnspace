import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sparkles, Globe, Mail, ArrowUpRight, Play, BookOpen, Briefcase, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();
  const page = await prisma.page.findFirst({
    where: { slug: username },
    include: { user: { include: { profile: true } } },
  });

  if (!page) return { title: 'Space Not Found' };

  return {
    title: page.title || `${page.user.profile?.fullName}'s Space — EarnSpace`,
    description: page.description || `Welcome to ${page.user.profile?.fullName}'s official EarnSpace digital space.`,
  };
}

const THEME_CLASSES: Record<string, { bg: string; card: string; text: string; subtext: string; accent: string }> = {
  modern: { bg: 'bg-slate-950', card: 'bg-slate-900/90 border-slate-800', text: 'text-white', subtext: 'text-slate-400', accent: 'bg-brand-500 hover:bg-brand-600' },
  minimal: { bg: 'bg-slate-50', card: 'bg-white border-slate-200 shadow-sm', text: 'text-slate-900', subtext: 'text-slate-600', accent: 'bg-slate-900 hover:bg-slate-800' },
  cyber: { bg: 'bg-black', card: 'bg-zinc-950 border-cyan-900/60', text: 'text-cyan-100', subtext: 'text-cyan-400/80', accent: 'bg-cyan-500 hover:bg-cyan-400 text-black' },
  creator: { bg: 'bg-slate-900', card: 'bg-indigo-950/40 border-indigo-800/50', text: 'text-white', subtext: 'text-slate-300', accent: 'bg-indigo-600 hover:bg-indigo-500' },
  elegant: { bg: 'bg-zinc-950', card: 'bg-zinc-900/90 border-zinc-800', text: 'text-zinc-100', subtext: 'text-zinc-400', accent: 'bg-amber-600 hover:bg-amber-500' },
  sunset: { bg: 'bg-stone-950', card: 'bg-stone-900/90 border-stone-800', text: 'text-stone-100', subtext: 'text-stone-400', accent: 'bg-rose-600 hover:bg-rose-500' },
};

export default async function PersonalWebsitePage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();

  const page = await prisma.page.findFirst({
    where: { slug: username },
    include: {
      user: {
        include: {
          profile: true,
          posts: { take: 3, orderBy: { createdAt: 'desc' } },
          blogs: { where: { status: 'published' }, take: 3, orderBy: { publishedAt: 'desc' } },
        },
      },
      blocks: { where: { visibility: true }, orderBy: { position: 'asc' } },
      settings: true,
    },
  });

  if (!page) {
    notFound();
  }

  const { user, blocks, settings } = page;
  const profile = user.profile;
  const themeKey = settings?.theme || 'modern';
  const theme = THEME_CLASSES[themeKey] || THEME_CLASSES.modern;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} selection:bg-brand-500 selection:text-white`}>
      {/* Top Floating Branding */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href={`/@${user.username}`}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/15 text-white transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Powered by EarnSpace</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        {/* Dynamic Blocks Rendering */}
        {blocks.map((block) => {
          let content: any = {};
          try {
            content = JSON.parse(block.contentJson || '{}');
          } catch (e) {}

          if (block.type === 'hero') {
            return (
              <section key={block.id} className="text-center space-y-6 pt-8 pb-4">
                <div className="w-28 h-28 mx-auto rounded-full bg-brand-500 text-white font-extrabold text-4xl flex items-center justify-center border-4 border-slate-800 shadow-2xl overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.username[0]?.toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-extrabold tracking-tight">{content.title || profile?.fullName}</h1>
                  <p className={`text-sm ${theme.subtext} max-w-md mx-auto leading-relaxed`}>
                    {content.subtitle || profile?.bio}
                  </p>
                </div>

                {content.ctaText && (
                  <Link
                    href={content.ctaUrl || `/@${user.username}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${theme.accent} font-bold text-xs shadow-lg transition`}
                  >
                    <span>{content.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </section>
            );
          }

          if (block.type === 'text') {
            return (
              <section key={block.id} className={`p-6 rounded-2xl border ${theme.card} space-y-3`}>
                {content.title && <h3 className="text-lg font-bold">{content.title}</h3>}
                <p className={`text-xs ${theme.subtext} leading-relaxed whitespace-pre-wrap`}>{content.body}</p>
              </section>
            );
          }

          if (block.type === 'links') {
            const linksList = content.links || [];
            return (
              <section key={block.id} className="space-y-3">
                {content.title && <h3 className="text-base font-bold mb-2">{content.title}</h3>}
                {linksList.map((linkItem: any, idx: number) => (
                  <a
                    key={idx}
                    href={linkItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl border ${theme.card} hover:opacity-90 text-xs font-semibold transition`}
                  >
                    <span>{linkItem.title}</span>
                    <ExternalLink className={`w-4 h-4 ${theme.subtext}`} />
                  </a>
                ))}
              </section>
            );
          }

          if (block.type === 'gallery') {
            const images = content.images || [];
            return (
              <section key={block.id} className="space-y-4">
                {content.title && <h3 className="text-base font-bold">{content.title}</h3>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img: any, idx: number) => (
                    <div key={idx} className="rounded-xl overflow-hidden aspect-square relative group bg-slate-900 border border-slate-800">
                      <img src={img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      {img.caption && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-2 text-[10px] text-white">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (block.type === 'video') {
            return (
              <section key={block.id} className={`p-6 rounded-2xl border ${theme.card} space-y-4`}>
                {content.title && <h3 className="text-base font-bold">{content.title}</h3>}
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                  {content.videoUrl?.includes('youtube') ? (
                    <iframe
                      src={content.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video src={content.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>
                {content.description && <p className={`text-xs ${theme.subtext}`}>{content.description}</p>}
              </section>
            );
          }

          if (block.type === 'services') {
            const items = content.items || [];
            return (
              <section key={block.id} className="space-y-4">
                {content.title && <h3 className="text-base font-bold">{content.title}</h3>}
                <div className="grid gap-3">
                  {items.map((srv: any, idx: number) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme.card} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">{srv.name}</h4>
                        {srv.price && <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">{srv.price}</span>}
                      </div>
                      {srv.description && <p className={`text-xs ${theme.subtext}`}>{srv.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (block.type === 'articles') {
            return (
              <section key={block.id} className="space-y-4">
                <h3 className="text-base font-bold">{content.title || 'Latest Articles'}</h3>
                <div className="grid gap-3">
                  {user.blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className={`p-4 rounded-xl border ${theme.card} hover:opacity-90 transition block space-y-1`}
                    >
                      <h4 className="text-xs font-bold">{blog.title}</h4>
                      <p className={`text-[11px] ${theme.subtext} line-clamp-1`}>{blog.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          }

          if (block.type === 'contact') {
            return (
              <section key={block.id} className={`p-6 rounded-2xl border ${theme.card} space-y-3 text-center`}>
                <h3 className="text-base font-bold">{content.title || 'Get In Touch'}</h3>
                {content.email && (
                  <a href={`mailto:${content.email}`} className="text-xs font-bold text-brand-400 hover:underline block">
                    ✉️ {content.email}
                  </a>
                )}
                {content.location && <p className={`text-xs ${theme.subtext}`}>📍 {content.location}</p>}
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
