"use client";

import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="hero" className="min-h-svh flex items-center pt-16 pb-24" aria-labelledby="hero-name">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <FadeIn>
          <p className="font-mono text-[0.8125rem] text-accent tracking-wide mb-6">
            안녕하세요, 저는
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 id="hero-name" className="text-[clamp(2.5rem,10vw,5.5rem)] font-extrabold tracking-tighter leading-[1.05] mb-4">
            <span className="block text-text">박성욱</span>
            <span className="block text-text-muted">Park Seonguk</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-[clamp(1.125rem,3vw,1.5rem)] font-medium text-text-muted mb-6 tracking-tight">
            <span className="text-accent font-bold">Node.js</span> &amp;{" "}
            <span className="text-accent font-bold">MongoDB</span> Backend Developer
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-[clamp(0.9375rem,2.5vw,1.0625rem)] text-text-muted max-w-[480px] leading-[1.75] mb-10">
            원리를 파고들며 견고한 백엔드 시스템을 만듭니다.
            <br />
            Node.js와 MongoDB를 기반으로 약 7년간 B2B/B2C 서비스를 개발해왔습니다.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-4 items-center">
            <Button as="a" href="#projects" variant="primary" onClick={(e) => handleScroll(e, "projects")}>
              프로젝트 보기
              <ArrowRight size={16} />
            </Button>
            <Button as="a" href="#contact" variant="ghost" onClick={(e) => handleScroll(e, "contact")}>
              연락하기
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-24 flex items-center gap-2 font-mono text-xs text-text-subtle tracking-wide">
            <span className="w-10 h-px bg-border" />
            scroll
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
