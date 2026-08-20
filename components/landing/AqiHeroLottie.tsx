"use client";

import { useEffect, useRef, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import type { AqiLevelVariant } from "@/lib/air-quality/aqi-levels";
import {
  aqiVariantToHeroLottie,
  aqiVariantToHeroLottieAlignX,
} from "@/lib/air-quality/aqi-levels";

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
 * card's height and drops roughly a fifth of the width off each side.
 *
 * The horizontal anchor is per variant — see AQI_HERO_LOTTIE_ALIGN_X for why one shared
 * value cannot keep every character in frame.
 */
export function AqiHeroLottie({ variant, className = "" }: AqiHeroLottieProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<DotLottie | null>(null);

  /**
   * The player's own default for this was measured rasterising at 1.75x on a 2x display —
   * it samples `window.devicePixelRatio` once, early, and keeps whatever it saw. Reading it
   * ourselves after mount pins the canvas to the real device pixels. Capped at 3 because the
   * backing store is width x height x dpr^2 bytes and the gain past 3 is not visible.
   */
  const [dpr, setDpr] = useState(1);
  useEffect(() => {
    setDpr(Math.min(3, Math.max(1, window.devicePixelRatio || 1)));
  }, []);

  /**
   * Keep the canvas backing store matched to the box it is painted into.
   *
   * The player rasterises once at whatever the container measures on mount, and on this card
   * that is the scene at its bare `min-height` before the copy has expanded it and before the
   * final width settles — measured at 313x280 against a final 358x321. Nothing re-rasterises
   * afterwards, so the browser stretches a too-small bitmap and the artwork loses ~13% of its
   * resolution before the source is even sampled. Re-running `resize()` on every real box
   * change costs nothing and keeps the render 1:1 with the device pixels.
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!player || !host) return;

    const sync = () => {
      try {
        player.resize();
      } catch {
        /* player torn down mid-frame; the next mount re-runs this */
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(host);
    return () => observer.disconnect();
  }, [player]);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <DotLottieReact
        key={variant}
        src={aqiVariantToHeroLottie(variant)}
        loop
        autoplay
        dotLottieRefCallback={setPlayer}
        layout={{ fit: "cover", align: [aqiVariantToHeroLottieAlignX(variant), 0] }}
        renderConfig={{ autoResize: true, quality: 100, devicePixelRatio: dpr }}
        className="h-full w-full"
      />
    </div>
  );
}
