"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fetchMostPollutedCities } from "@/lib/api/aqi-most-polluted";
import { aqiScaleToTextClass, getAqiLevel } from "@/lib/air-quality/aqi-levels";

/** One segment width scrolls in this many seconds — keeps px/s steady as content/fonts load. */
const TICKER_PX_PER_SEC = 52;

/** Fallback when the API is unavailable (matches prior static ticker styling). */
const FALLBACK_CITIES: { rank: number; city: string; aqi: number; color: string }[] = [
  { rank: 1, city: "Delhi", aqi: 160, color: getAqiLevel(160).textClass },
  { rank: 2, city: "Mumbai", aqi: 160, color: getAqiLevel(160).textClass },
  { rank: 3, city: "Chennai", aqi: 94, color: getAqiLevel(94).textClass },
  { rank: 4, city: "Bengaluru", aqi: 116, color: getAqiLevel(116).textClass },
  { rank: 5, city: "Hyderabad", aqi: 88, color: getAqiLevel(88).textClass },
  { rank: 6, city: "Kolkata", aqi: 74, color: getAqiLevel(74).textClass },
  { rank: 7, city: "Pune", aqi: 102, color: getAqiLevel(102).textClass },
  { rank: 8, city: "Gurugram", aqi: 118, color: getAqiLevel(118).textClass },
  { rank: 9, city: "Ahmedabad", aqi: 143, color: getAqiLevel(143).textClass },
];

/** Maps API `aqi_scale` (1–6) to readable ticker colors (aligned with `AqiBadge` bands). */
function aqiScaleToTickerColor(scale: number): string {
  return aqiScaleToTextClass(scale);
}

type TickerRow = { rank: number; city: string; aqi: number; color: string };

type LiveAQITickerProps = {
  rowPad?: string;
  isLight?: boolean;
};

function TickerSegment({
  rows,
  segmentKey,
  cityClass,
  sepClass,
  hidden,
}: {
  rows: TickerRow[];
  segmentKey: string;
  cityClass: string;
  sepClass: string;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {rows.map((c) => (
        <span
          key={`${segmentKey}-${c.rank}`}
          className="inline-flex items-baseline whitespace-nowrap font-sans text-[0.78rem] sm:text-[0.8rem]"
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
  );
}

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

  const rows = useMemo(() => liveRows ?? FALLBACK_CITIES, [liveRows]);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncDuration = () => {
      const segment = track.children[0] as HTMLElement | undefined;
      if (!segment) return;
      const width = segment.getBoundingClientRect().width;
      if (width <= 0) return;
      track.style.animationDuration = `${width / TICKER_PX_PER_SEC}s`;
      track.style.animationPlayState = "running";
    };

    syncDuration();

    const ro = new ResizeObserver(syncDuration);
    const segment = track.children[0] as HTMLElement | undefined;
    if (segment) ro.observe(segment);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) syncDuration();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [rows]);

  const barClass = isLight
    ? "border-b border-black/[0.07] bg-white"
    : "border-b border-white/[0.06] bg-[#020617]";
  const labelClass = isLight
    ? "font-sans text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gray-800"
    : "font-sans text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white";
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
            ref={trackRef}
            className="live-aqi-ticker-track flex w-max animate-ticker transform-gpu will-change-transform"
          >
            <TickerSegment
              rows={rows}
              segmentKey="a"
              cityClass={cityClass}
              sepClass={sepClass}
            />
            <TickerSegment
              rows={rows}
              segmentKey="b"
              cityClass={cityClass}
              sepClass={sepClass}
              hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
