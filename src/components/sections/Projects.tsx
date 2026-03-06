import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Tag from "@/components/ui/Tag";
import { PROJECTS } from "@/lib/constants";

export default function Projects() {
  return (
    <section id="projects" className="py-24" aria-labelledby="projects-title">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-6">
        <SectionLabel>Projects</SectionLabel>
        <FadeIn>
          <h2 id="projects-title" className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-tight leading-tight text-text mb-10">
            프로젝트
          </h2>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={Math.min(i * 0.1, 0.3)}>
              <article
                className="flex flex-col bg-surface border border-border border-t-[3px] border-t-accent rounded-2xl overflow-hidden hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
                aria-labelledby={`project-${i}-title`}
              >
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex flex-wrap gap-1" aria-label="사용 기술">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <h3 id={`project-${i}-title`} className="text-lg font-bold text-text tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-[1.7] flex-1">
                    {project.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
