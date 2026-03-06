import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "블로그 — 박성욱",
  description: "백엔드 개발자 박성욱의 기술 블로그입니다.",
};

export const revalidate = 60;

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // MongoDB unavailable during build or runtime
  }

  return (
    <main className="pt-[calc(var(--header-height)+6rem)] pb-24">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>Blog</SectionLabel>
        <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-4">
          블로그
        </h1>
        <p className="text-[1.0625rem] text-text-muted leading-[1.75] max-w-[480px] mb-10">
          개발하며 배운 것들을 기록합니다.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-text-subtle font-mono text-[0.8125rem] border border-dashed border-border rounded-xl mt-4">
            <p>아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
