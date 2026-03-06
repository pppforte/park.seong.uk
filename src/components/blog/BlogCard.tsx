import Link from "next/link";
import Tag from "@/components/ui/Tag";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="p-10 border border-border border-l-[3px] border-l-accent rounded-xl mb-6 bg-surface hover:border-accent hover:translate-x-1 hover:bg-elevated transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-4 mb-2">
          <time dateTime={post.createdAt} className="font-mono text-xs text-text-subtle tracking-wide">
            {formatDate(post.createdAt)}
          </time>
          {post.category && (
            <span className="font-mono text-[0.6875rem] font-medium px-2 py-0.5 rounded bg-accent-dim text-accent">
              {post.category}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-text tracking-tight mb-2 leading-snug">
          {post.title}
        </h2>
        <p className="text-[0.9375rem] text-text-muted leading-[1.75] mb-4">
          {post.excerpt}
        </p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
