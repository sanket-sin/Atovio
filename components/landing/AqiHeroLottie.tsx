"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { AqiLevelVariant } from "@/lib/air-quality/aqi-levels";
import { aqiVariantToHeroLottie } from "@/lib/air-quality/aqi-levels";

type AqiHeroLottieProps = {
  variant: AqiLevelVariant;
  className?: string;
};

/**
 * Animated AQI character for the mobile hero card. Desktop keeps the still illustration
 * (`aqiVariantToHeroBackground`), so this only ever mounts below lg.
 *
 * The source is a 924x996 opaque scene (a video conversion): city behind, character in the
 * upper right, and roughly a third of empty ground below it. It fills the card edge to edge
 * — `contain` would letterbox that dead ground into view and shrink the figure — and is
 * anchored to the top so the crop takes the empty ground rather than the character's head.
 */
export function AqiHeroLottie({ variant, className = "" }: AqiHeroLottieProps) {
  return (
    <div className={className} aria-hidden>
      <DotLottieReact
        key={variant}
        src={aqiVariantToHeroLottie(variant)}
        loop
        autoplay
        layout={{ fit: "cover", align: [0.5, 0] }}
        className="h-full w-full"
      />
    </div>
  );
}
