import { Mail, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 bg-surface" role="contentinfo">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6 flex flex-col md:flex-row items-center md:justify-between gap-4 text-center md:text-left">
        <p className="text-[0.8125rem] text-text-subtle">
          &copy; 2026 박성욱. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="mailto:developer@park.seong.uk"
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors duration-200"
            aria-label="이메일 보내기"
          >
            <Mail size={16} />
            Email
          </a>
          <a
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors duration-200"
            aria-label="블로그 열기"
          >
            <BookOpen size={16} />
            Blog
          </a>
        </div>
      </div>
    </footer>
  );
}
