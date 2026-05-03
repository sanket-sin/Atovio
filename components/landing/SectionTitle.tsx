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
      className={`mb-9 font-outfit text-[2rem] font-bold leading-tight tracking-[-0.03em] text-bqa-text ${className}`}
    >
      {children}
    </Tag>
  );
}
