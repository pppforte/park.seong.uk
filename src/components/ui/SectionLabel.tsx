interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest uppercase text-accent mb-2">
      <span className="block w-6 h-px bg-accent" />
      {children}
    </p>
  );
}
