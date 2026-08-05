"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { AqiLevelVariant } from "@/lib/air-quality/aqi-levels";
import { aqiVariantToHeroLottie } from "@/lib/air-quality/aqi-levels";

type AqiHeroLottieProps = {
  variant: AqiLevelVariant;
  className?: string;
  /** `hero` = full-bleed section background; `card` = mobile AQI card background */
  placement?: "hero" | "card";
};

const LAYOUT_BY_PLACEMENT = {
  hero: { fit: "fill" as const, align: [0.5, 0.5] as [number, number] },
  card: { fit: "cover" as const, align: [1, 0.85] as [number, number] },
};

export function AqiHeroLottie({
  variant,
  className = "",
  placement = "hero",
}: AqiHeroLottieProps) {
  return (
    <div className={className} aria-hidden>
      <DotLottieReact
        key={`${placement}-${variant}`}
        src={aqiVariantToHeroLottie(variant)}
        loop
        autoplay
        layout={LAYOUT_BY_PLACEMENT[placement]}
        className="h-full w-full"
      />
    </div>
  );
}
