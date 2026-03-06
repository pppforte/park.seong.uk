import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import { EXPERIENCE } from "@/lib/constants";

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-surface" aria-labelledby="experience-title">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>Experience</SectionLabel>
        <FadeIn>
          <h2 id="experience-title" className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-10">
            경력
          </h2>
        </FadeIn>

        <div className="relative pl-10" role="list">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border" aria-hidden="true" />

          {EXPERIENCE.map((exp, i) => (
            <FadeIn key={exp.period} delay={Math.min(i * 0.1, 0.3)}>
              <div className={`relative ${i < EXPERIENCE.length - 1 ? "pb-16" : ""}`} role="listitem">
                {/* Dot */}
                <div
                  className="absolute -left-10 top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface -translate-x-[4.5px] shadow-[0_0_0_3px_var(--accent-dim)]"
                  aria-hidden="true"
                />

                <p className="font-mono text-xs text-accent tracking-wide mb-1">{exp.period}</p>
                <h3 className="text-lg font-bold text-text tracking-tight mb-1">{exp.role}</h3>
                <p className="text-[0.9375rem] font-medium text-text-muted mb-4">{exp.company}</p>
                <ul className="text-sm text-text-muted leading-[1.75]" aria-label="주요 업무">
                  {exp.tasks.map((task) => (
                    <li key={task} className="relative pl-4 mb-1">
                      <span className="absolute left-0 text-text-subtle">&mdash;</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
