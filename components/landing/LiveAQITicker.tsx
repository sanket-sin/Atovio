"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMostPollutedCities } from "@/lib/api/aqi-most-polluted";

/**
 * Remount key so the CSS marquee restarts after layout-affecting changes.
 * `translateX(-50%)` is measured against the track width; if width changes (fallback → API,
 * or fonts finishing loading) without a remount, motion looks wrong until the next reflow (e.g. scroll).
 */
function useMarqueeRemountKey(itemCount: number, source: "live" | "fallback") {
  const [fontEpoch, setFontEpoch] = useState(0);

  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts?.ready) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontEpoch((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return `${itemCount}-${source}-${fontEpoch}`;
}

/** Fallback when the API is unavailable (matches prior static ticker styling). */
const FALLBACK_CITIES: { rank: number; city: string; aqi: number; color: string }[] = [
  { rank: 1, city: "Delhi", aqi: 160, color: "text-red-500" },
  { rank: 2, city: "Mumbai", aqi: 160, color: "text-red-500" },
  { rank: 3, city: "Chennai", aqi: 94, color: "text-amber-300" },
  { rank: 4, city: "Bengaluru", aqi: 116, color: "text-orange-400" },
  { rank: 5, city: "Hyderabad", aqi: 88, color: "text-amber-300" },
  { rank: 6, city: "Kolkata", aqi: 74, color: "text-amber-300" },
  { rank: 7, city: "Pune", aqi: 102, color: "text-orange-400" },
  { rank: 8, city: "Gurugram", aqi: 118, color: "text-orange-400" },
  { rank: 9, city: "Ahmedabad", aqi: 143, color: "text-orange-600" },
];

/** Maps API `aqi_scale` (1–6) to readable ticker colors (aligned with `AqiBadge` bands). */
function aqiScaleToTickerColor(scale: number): string {
  switch (scale) {
    case 1:
      return "text-bqa-good";
    case 2:
      return "text-bqa-moderate";
    case 3:
      return "text-bqa-poor";
    case 4:
      return "text-bqa-unhealthy";
    case 5:
      return "text-bqa-severe";
    default:
      return "text-bqa-hazardous";
  }
}

type LiveAQITickerProps = {
  rowPad?: string;
  isLight?: boolean;
};

export function LiveAQITicker({
  rowPad = "px-4 sm:px-6 lg:px-8 xl:px-10",
  isLight = false,
}: LiveAQITickerProps) {
  const [liveRows, setLiveRows] = useState<
    { rank: number; city: string; aqi: number; color: string }[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cities = await fetchMostPollutedCities();
        if (cancelled || cities.length === 0) return;
        setLiveRows(
          cities.map((c) => ({
            rank: c.rank,
            city: c.city,
            aqi: c.aqi,
            color: aqiScaleToTickerColor(c.aqi_scale),
          }))
        );
      } catch {
        /* keep null → FALLBACK_CITIES */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const rows = liveRows ?? FALLBACK_CITIES;
    return [...rows, ...rows];
  }, [liveRows]);

  const marqueeKey = useMarqueeRemountKey(
    items.length,
    liveRows ? "live" : "fallback"
  );

  const barClass = isLight
    ? "border-b border-black/[0.07] bg-white"
    : "border-b border-white/[0.06] bg-[#020617]";
  const labelClass = isLight
    ? "font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gray-800"
    : "font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white";
  const tickerBorderClass = isLight
    ? "border-l border-gray-300"
    : "border-l border-slate-600/70";
  const cityClass = isLight ? "text-gray-600" : "text-slate-400";
  const sepClass = isLight ? "px-2 text-gray-300 sm:px-2.5" : "px-2 text-slate-600 sm:px-2.5";

  return (
    <div className={`w-full min-w-0 transition-colors ${barClass}`}>
      <div
        className={`flex w-full min-w-0 items-stretch overflow-hidden py-2.5 ${rowPad}`}
      >
        <div className="flex shrink-0 items-center gap-2.5 pr-3 sm:pr-4">
          <span
            className="h-1.5 w-1.5 shrink-0 animate-blink rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
            aria-hidden
          />
          <span className={labelClass}>Live AQI</span>
        </div>
        <div
          className={`min-h-[1.25rem] min-w-0 flex-1 self-center overflow-hidden pl-3 sm:pl-4 ${tickerBorderClass}`}
        >
          <div
            key={marqueeKey}
            className="flex w-max animate-ticker gap-0 pr-8 will-change-transform"
          >
            {items.map((c, i) => (
              <span
                key={`${c.rank}-${i}`}
                className="inline-flex items-baseline whitespace-nowrap font-mono text-[0.78rem] sm:text-[0.8rem]"
              >
                <span className={cityClass}>{c.city}</span>
                <span className="ml-1.5 font-bold tabular-nums sm:ml-2">
                  <span className={c.color}>{c.aqi}</span>
                </span>
                <span className={sepClass} aria-hidden>
                  |
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
