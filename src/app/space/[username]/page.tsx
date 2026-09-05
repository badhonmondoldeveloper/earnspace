import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sparkles, Globe, Mail, ArrowUpRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();
  const page = await prisma.page.findFirst({
    where: { slug: username },
    include: { user: { include: { profile: true } } },
  });

  if (!page) return { title: 'Space Not Found' };

  return {
    title: page.title || `${page.user.profile?.fullName}'s Space`,
    description: page.description || `Welcome to ${page.user.profile?.fullName}'s official EarnSpace mini-website.`,
  };
}

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

  const { user, blocks } = page;
  const profile = user.profile;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
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
                <div className="w-24 h-24 mx-auto rounded-full bg-brand-500 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-slate-800 shadow-2xl overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.username[0]?.toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-extrabold tracking-tight text-white">{content.title || profile?.fullName}</h1>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">{content.subtitle || profile?.bio}</p>
                </div>

                {content.ctaText && (
                  <Link
                    href={content.ctaUrl || `/@${user.username}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition"
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
              <section key={block.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                {content.title && <h3 className="text-lg font-bold text-white">{content.title}</h3>}
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{content.body}</p>
              </section>
            );
          }

          if (block.type === 'links') {
            const linksList = content.links || [];
            return (
              <section key={block.id} className="space-y-3">
                {linksList.map((linkItem: any, idx: number) => (
                  <a
                    key={idx}
                    href={linkItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/60 hover:bg-slate-850 text-xs font-semibold transition"
                  >
                    <span>{linkItem.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </section>
            );
          }

          return null;
        })}

        {/* Recent Articles Showcase */}
        {user.blogs.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">Latest Articles</h3>
            <div className="grid gap-3">
              {user.blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 transition block space-y-1"
                >
                  <h4 className="text-xs font-bold text-white">{blog.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{blog.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

