import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import { ABOUT_DETAILS } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" className="py-24" aria-labelledby="about-title">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>About</SectionLabel>
        <FadeIn>
          <h2 id="about-title" className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-10">
            소개
          </h2>
        </FadeIn>

        <div className="grid gap-16 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <FadeIn>
            <div className="flex justify-center">
              <Image
                src="/profile.jpg"
                alt="박성욱 프로필 사진"
                width={220}
                height={220}
                className="w-[200px] h-[200px] md:w-[220px] md:h-[220px] rounded-full object-cover object-top border-[3px] border-border hover:border-accent transition-colors duration-200"
                priority={false}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="text-[1.0625rem] text-text-muted leading-[1.8] max-w-[600px] space-y-4">
              <p>
                <strong className="text-text font-semibold">Node.js</strong>와{" "}
                <strong className="text-text font-semibold">MongoDB</strong> 전문 백엔드 개발자로 약
                7년간 B2B/B2C 서비스를 개발해왔습니다.
              </p>
              <p>
                레거시 챗봇 시스템을 OOP 기반으로 전면 재설계하여 응답 속도 및 코드 구조를 개선한 경험이
                있으며, 현재 서티라이프에서 AI 챗봇 시스템 전체 개발을 담당하고 있습니다.
              </p>
              <p>&ldquo;왜?&rdquo;를 끊임없이 묻고 원리를 파고드는 개발 철학을 가지고 있습니다.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col gap-4">
              {ABOUT_DETAILS.map((detail) => (
                <div key={detail.label} className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-xs text-text-subtle tracking-wide min-w-[80px]">
                    {detail.label}
                  </span>
                  {detail.href ? (
                    <a href={detail.href} className="text-text-muted hover:text-accent transition-colors">
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-text-muted">{detail.value}</span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
