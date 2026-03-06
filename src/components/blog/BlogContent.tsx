interface BlogContentProps {
  html: string;
}

export default function BlogContent({ html }: BlogContentProps) {
  return (
    <div
      className="blog-post-body max-w-[720px] text-[1.0625rem] text-text-muted leading-[1.85]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
