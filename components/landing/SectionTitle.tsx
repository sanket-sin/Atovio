type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
};

export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: SectionTitleProps) {
  return (
    <Tag
      className={`mb-7 font-outfit text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:mb-9 ${className}`}
    >
      {children}
    </Tag>
  );
}
