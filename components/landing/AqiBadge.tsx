const variants = {
  good: "border-emerald-400/30 bg-emerald-400/10 text-bqa-good",
  moderate: "border-amber-300/30 bg-amber-300/10 text-bqa-moderate",
  poor: "border-orange-400/30 bg-orange-400/10 text-bqa-poor",
  unhealthy: "border-rose-400/30 bg-rose-400/10 text-bqa-unhealthy",
  severe: "border-purple-400/30 bg-purple-400/10 text-bqa-severe",
  hazardous: "border-violet-500/30 bg-violet-500/10 text-bqa-hazardous",
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
