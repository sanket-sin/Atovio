const variants = {
  good: "border-bqa-good bg-bqa-good/12 text-bqa-good",
  moderate: "border-bqa-moderate bg-bqa-moderate/12 text-bqa-moderate",
  poor: "border-bqa-poor bg-bqa-poor/12 text-bqa-poor",
  unhealthy: "border-bqa-unhealthy bg-bqa-unhealthy/12 text-bqa-unhealthy",
  severe: "border-bqa-severe bg-bqa-severe/12 text-bqa-severe",
  hazardous: "border-bqa-hazardous bg-bqa-hazardous/12 text-bqa-hazardous",
} as const;

export type AqiBadgeVariant = keyof typeof variants;

type AqiBadgeProps = {
  variant: AqiBadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export function AqiBadge({ variant, children, className = "" }: AqiBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.72rem] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
