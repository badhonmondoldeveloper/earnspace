import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function PublicBlogPage({ params }: { params: { slug: string } }) {
  const blog = await prisma.blog.findFirst({
    where: { slug: params.slug, status: 'published' },
    select: {
      title: true,
      content: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      seoDescription: true,
      user: { select: { username: true, profile: { select: { fullName: true } } } },
    },
  });

  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <header className="space-y-3">
          <p className="text-xs text-brand-400">By @{blog.user.username}</p>
          <h1 className="text-4xl font-black">{blog.title}</h1>
          <p className="text-sm text-slate-400">{blog.excerpt || blog.seoDescription}</p>
          {blog.publishedAt && <time className="text-xs text-slate-500">{blog.publishedAt.toLocaleDateString()}</time>}
        </header>
        {blog.coverImage && <img src={blog.coverImage} alt="" className="w-full rounded-2xl max-h-96 object-cover" />}
        <article className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{blog.content}</article>
      </main>
      <Footer />
    </div>
  );
}
