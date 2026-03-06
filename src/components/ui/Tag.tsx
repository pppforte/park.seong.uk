interface TagProps {
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="font-mono text-[0.6875rem] font-medium tracking-wide px-2 py-0.5 rounded bg-accent-dim text-accent">
      {children}
    </span>
  );
}
