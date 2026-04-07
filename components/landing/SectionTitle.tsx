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
      className={`mb-9 font-display text-[2rem] font-normal leading-tight tracking-tight text-bqa-text ${className}`}
    >
      {children}
    </Tag>
  );
}
