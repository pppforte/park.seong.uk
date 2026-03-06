"use client";

import { useIntersection } from "@/hooks/useIntersection";

interface SkillBarProps {
  level: number;
  label: string;
}

export default function SkillBar({ level, label }: SkillBarProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="w-full h-[3px] bg-border rounded-full overflow-hidden"
      role="progressbar"
      aria-label={`${label} 숙련도`}
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-accent rounded-full transition-[width] duration-1000"
        style={{
          width: isVisible ? `${level}%` : "0%",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
