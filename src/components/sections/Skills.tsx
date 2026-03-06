"use client";

import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import SkillBar from "@/components/ui/SkillBar";
import { SKILLS } from "@/lib/constants";

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-surface" aria-labelledby="skills-title">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>Skills</SectionLabel>
        <FadeIn>
          <h2 id="skills-title" className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-10">
            기술 스택
          </h2>
        </FadeIn>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-6 gap-4" role="list">
          {SKILLS.map((skill, i) => (
            <FadeIn key={skill.name} delay={Math.min(i * 0.1, 0.3)}>
              <div
                className="flex flex-col items-center gap-2 p-6 bg-elevated border border-border rounded-xl hover:border-accent hover:bg-accent-dim hover:-translate-y-0.5 transition-all duration-200"
                role="listitem"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={40}
                  height={40}
                  className={`w-10 h-10 rounded-lg ${skill.name === "Express" ? "skill-icon-invert" : ""}`}
                  loading="lazy"
                />
                <span className="text-[0.8125rem] font-semibold text-text-muted text-center">
                  {skill.name}
                </span>
                <SkillBar level={skill.level} label={skill.name} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
