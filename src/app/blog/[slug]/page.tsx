import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, incrementViews, getAllPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import BlogContent from "@/components/blog/BlogContent";
import Tag from "@/components/ui/Tag";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "글을 찾을 수 없습니다 — 박성욱" };
  }

  return {
    title: `${post.title} — 박성욱`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Fire-and-forget view count increment
  incrementViews(slug).catch(() => {});

  const html = renderMarkdown(post.content);

  return (
    <main className="pt-[calc(var(--header-height)+2.5rem)] pb-24">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-accent transition-colors duration-200 mb-10 py-2"
        >
          <ArrowLeft size={16} />
          목록으로
        </Link>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <time dateTime={post.createdAt} className="font-mono text-xs text-text-subtle tracking-wide">
            {formatDate(post.createdAt)}
          </time>
          {post.category && (
            <span className="font-mono text-[0.6875rem] font-medium px-2 py-0.5 rounded bg-accent-dim text-accent">
              {post.category}
            </span>
          )}
          <span className="font-mono text-[0.6875rem] text-text-subtle">
            {post.views || 0}회 읽음
          </span>
        </div>

        <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-text tracking-tight leading-snug mb-6">
          {post.title}
        </h1>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-16">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <BlogContent html={html} />
      </div>
    </main>
  );
}
