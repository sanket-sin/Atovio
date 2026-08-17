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
 * The source is a 720x405 opaque 16:9 scene: cityscape across the frame with the character
 * standing right of centre. That is far wider than the card, so `cover` scales it to the
 * card's height and drops roughly a fifth of the width off each side — `contain` would
 * letterbox instead and shrink the figure to nothing.
 *
 * The 0.65 horizontal anchor is what keeps the character whole. Centred (0.5) clips his
 * trailing arm off the right edge; anchored right (1) walks him into the middle of the card
 * and straight over the copy. 0.65 lands him head-to-shoes inside the right-hand third,
 * clear of the text column. Retune it if the artwork's composition changes.
 */
export function AqiHeroLottie({ variant, className = "" }: AqiHeroLottieProps) {
  return (
    <div className={className} aria-hidden>
      <DotLottieReact
        key={variant}
        src={aqiVariantToHeroLottie(variant)}
        loop
        autoplay
        layout={{ fit: "cover", align: [0.65, 0] }}
        className="h-full w-full"
      />
    </div>
  );
}
