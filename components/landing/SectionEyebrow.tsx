type SectionEyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <p
      className={`mb-2.5 inline-flex items-center gap-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-bqa-accent before:h-px before:w-5 before:bg-bqa-accent before:opacity-70 ${className}`}
    >
      {children}
    </p>
  );
}
