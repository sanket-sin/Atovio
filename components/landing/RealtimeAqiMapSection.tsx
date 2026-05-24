"use client";

import { useEffect, useState } from "react";
import type { MostPollutedCityRow } from "@/lib/api/aqi-most-polluted";
import { fetchMostAndLeastPollutedCities } from "@/lib/api/aqi-most-polluted";
import { getAqiLevel } from "@/lib/air-quality/aqi-levels";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import { AnimatedProgressBar, AnimatedReadingValue, useInViewOnce } from "./ReadingAnimation";
import { RealtimeAqiGoogleMap } from "./RealtimeAqiGoogleMap";
import { SectionTitle } from "./SectionTitle";

const METRICS = ["AQI", "PM10", "PM2.5", "Temp", "Humidity", "Wind"] as const;
const METRIC_ROWS: (typeof METRICS)[number][][] = [
  ["AQI", "PM10", "PM2.5", "Temp"],
  ["Humidity", "Wind"],
];
const STANDARDS = ["CPCB", "US EPA", "WHO"] as const;

const TIMELINE = [
  { id: "7PM", label: "7 PM" },
  { id: "10PM", label: "10 PM" },
  { id: "1AM", label: "1 AM" },
  { id: "4AM", label: "4 AM" },
  { id: "7AM", label: "7 AM" },
  { id: "10AM", label: "10 AM" },
  { id: "1PM", label: "1 PM" },
  { id: "4PM", label: "4 PM" },
  { id: "NOW", label: "NOW", isNow: true },
] as const;

function metricBtnClass(active: boolean): string {
  return active
    ? "border-sky-400/35 bg-bqa-slate2 text-bqa-text"
    : "border-sky-400/12 bg-bqa-slate/40 text-bqa-muted hover:text-bqa-text";
}

function standardBtnClass(active: boolean): string {
  return active
    ? "border-bqa-accent bg-bqa-accent text-white shadow-[0_2px_10px_rgba(61,158,255,0.35)]"
    : "border-sky-400/12 bg-bqa-slate/40 text-bqa-muted hover:text-bqa-text";
}

function MapFilterButton({
  label,
  active,
  onClick,
  variant,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant: "metric" | "standard";
}) {
  const tone = variant === "metric" ? metricBtnClass(active) : standardBtnClass(active);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-2.5 py-2 text-center text-xs font-semibold transition-colors ${tone}`}
    >
      {label}
    </button>
  );
}

function MapControlsPanel({
  metric,
  setMetric,
  standard,
  setStandard,
}: {
  metric: (typeof METRICS)[number];
  setMetric: (m: (typeof METRICS)[number]) => void;
  standard: (typeof STANDARDS)[number];
  setStandard: (s: (typeof STANDARDS)[number]) => void;
}) {
  return (
    <div className="border-t border-sky-400/10 bg-bqa-navy2/95 p-4 backdrop-blur-md md:p-5">
      {/* Mobile: screenshot rows */}
      <div className="space-y-2.5 md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {METRIC_ROWS[0]!.map((m) => (
            <MapFilterButton
              key={m}
              label={m}
              active={metric === m}
              variant="metric"
              onClick={() => setMetric(m)}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {METRIC_ROWS[1]!.map((m) => (
            <MapFilterButton
              key={m}
              label={m}
              active={metric === m}
              variant="metric"
              onClick={() => setMetric(m)}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STANDARDS.map((s) => (
            <MapFilterButton
              key={s}
              label={s}
              active={standard === s}
              variant="standard"
              onClick={() => setStandard(s)}
            />
          ))}
        </div>
      </div>

      {/* md+: original horizontal controls */}
      <div className="mb-4 hidden flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                metric === m
                  ? "border-sky-400/30 bg-bqa-slate2 text-bqa-text"
                  : "border-sky-400/10 bg-bqa-slate/50 text-bqa-muted hover:text-bqa-text"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STANDARDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStandard(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                standard === s
                  ? "border-bqa-accent bg-bqa-accent text-white"
                  : "border-sky-400/10 bg-bqa-slate/50 text-bqa-muted hover:text-bqa-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <MapTimeline />
    </div>
  );
}

function MapExpandIcon({ expanded }: { expanded: boolean }) {
  if (expanded) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
        <path
          d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapViewport({
  expanded,
  onToggleExpanded,
  selectedCity,
  metric,
  standard,
}: {
  expanded: boolean;
  onToggleExpanded: () => void;
  selectedCity: HeroCitySnapshot | null;
  metric: (typeof METRICS)[number];
  standard: (typeof STANDARDS)[number];
}) {
  return (
    <div
      className={`map-shell relative w-full ${
        expanded ? "h-full min-h-0" : "h-[min(480px,calc(100dvh-17rem))] min-h-[240px] sm:min-h-[280px]"
      }`}
    >
      <RealtimeAqiGoogleMap className="absolute inset-0" selectedCity={selectedCity} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bqa-navy/25 via-transparent to-bqa-navy/10" />

      <div className="absolute left-4 top-4 z-[2] flex flex-col gap-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          200+ live sensors
        </div>
        <div className="pointer-events-auto rounded-full border border-sky-400/20 bg-black/55 px-3 py-1.5 text-xs text-bqa-muted backdrop-blur-md">
          Showing: <span className="font-semibold text-bqa-text">{metric}</span> ·{" "}
          <span className="font-semibold text-bqa-accent2">{standard}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleExpanded}
        className="pointer-events-auto absolute right-4 top-4 z-[3] flex items-center gap-2 rounded-full border border-sky-400/25 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-sky-400/45 hover:bg-black/75"
        aria-expanded={expanded}
        aria-label={expanded ? "Exit full width map" : "View map full width"}
      >
        <MapExpandIcon expanded={expanded} />
        {expanded ? "Exit full width" : "Full width"}
      </button>
    </div>
  );
}

function MapTimeline() {
  return (
    <>
      {/* Mobile timeline */}
      <div className="mt-4 md:hidden">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-bqa-slate text-bqa-text"
            aria-label="Play timeline"
          >
            <span className="ml-0.5 text-base">▶</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex justify-between gap-0.5 font-sans text-[0.58rem] leading-tight">
              {TIMELINE.map((t) => (
                <span
                  key={t.id}
                  className={`shrink-0 ${"isNow" in t && t.isNow ? "font-bold text-bqa-text" : "text-bqa-dim"}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-bqa-slate2">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-bqa-accent/50 to-bqa-accent" />
            </div>
            <p className="mt-1 text-right text-[0.62rem] font-medium text-bqa-dim">Live</p>
          </div>
        </div>
      </div>

      {/* Desktop timeline */}
      <div className="hidden flex-col gap-2 md:flex md:flex-row md:items-center md:gap-4">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-bqa-slate text-bqa-text hover:bg-bqa-slate2"
          aria-label="Play timeline"
        >
          <span className="ml-0.5 text-lg">▶</span>
        </button>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-1 flex min-w-0 justify-between gap-1 overflow-x-auto pb-0.5 font-sans text-[0.58rem] leading-tight text-bqa-dim [-ms-overflow-style:none] [scrollbar-width:none] md:text-xs [&::-webkit-scrollbar]:hidden">
            {TIMELINE.map((t) => (
              <span key={t.id} className="shrink-0">
                {t.id}
              </span>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-bqa-slate2">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-bqa-accent/50 to-bqa-accent" />
          </div>
        </div>
        <span className="shrink-0 text-right text-xs font-semibold text-bqa-accent2">Now Live</span>
      </div>
    </>
  );
}

const FALLBACK_MOST = {
  city: "Kharagpur",
  aqi: 182,
  status: "Unhealthy",
};

const FALLBACK_LEAST = {
  city: "Srinagar",
  aqi: 21,
  status: "Good",
};

function ExtremeCityCard({
  label,
  labelClass,
  borderClass,
  bgClass,
  badgeClass,
  cityTitle,
  barTrack,
  barClass,
  city,
  aqi,
  status,
  barPct,
  aqiClass,
  animateKey,
  delayMs,
}: {
  label: string;
  labelClass: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  cityTitle: string;
  barTrack: string;
  barClass: string;
  city: string;
  aqi: number;
  status: string;
  barPct: string;
  aqiClass: string;
  animateKey: string;
  delayMs: number;
}) {
  const [cardRef, inView] = useInViewOnce<HTMLDivElement>([animateKey, city, aqi]);

  return (
    <div ref={cardRef} className={`rounded-2xl border p-5 ${borderClass} ${bgClass}`}>
      <p className={`mb-3 font-sans text-[0.65rem] font-bold uppercase tracking-widest ${labelClass}`}>
        {label}
      </p>
      <h3 className={`mb-2 font-sans text-2xl font-bold ${cityTitle}`}>{city}</h3>
      <div className="flex items-baseline gap-3">
        <span className={`font-sans text-4xl font-bold ${aqiClass}`}>
          <AnimatedReadingValue
            value={aqi}
            format={(n) => String(Math.round(n))}
            active={inView}
            delayMs={delayMs}
          />
        </span>
        <span className={`rounded-md px-2 py-0.5 font-sans text-[0.75rem] font-semibold ${badgeClass}`}>
          {status}
        </span>
      </div>
      <div className={`relative mt-5 h-1.5 w-full overflow-hidden rounded-full ${barTrack}`}>
        <AnimatedProgressBar
          targetWidth={barPct}
          className={barClass}
          active={inView}
          delayMs={delayMs}
          durationMs={1100}
        />
      </div>
    </div>
  );
}

function toCardData(
  row: MostPollutedCityRow | null,
  fallback: { city: string; aqi: number; status: string }
) {
  if (!row) {
    return {
      city: fallback.city,
      aqi: fallback.aqi,
      status: fallback.status,
      barPct: `${Math.max(2, (fallback.aqi / 500) * 100)}%`,
      aqiClass: getAqiLevel(fallback.aqi).textClass,
    };
  }

  const roundedAqi = Math.round(row.aqi);
  const level = getAqiLevel(roundedAqi);
  return {
    city: row.city,
    aqi: roundedAqi,
    status: level.label,
    barPct: `${Math.max(2, (roundedAqi / 500) * 100)}%`,
    aqiClass: level.textClass,
  };
}

export function RealtimeAqiMapSection({
  isLight = false,
  selectedCity = null,
}: {
  isLight?: boolean;
  selectedCity?: HeroCitySnapshot | null;
}) {
  const [metric, setMetric] = useState<(typeof METRICS)[number]>("AQI");
  const [standard, setStandard] = useState<(typeof STANDARDS)[number]>("CPCB");
  const [mapExpanded, setMapExpanded] = useState(false);
  const [extremes, setExtremes] = useState<{
    most: MostPollutedCityRow | null;
    least: MostPollutedCityRow | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMostAndLeastPollutedCities();
        if (!cancelled) setExtremes(data);
      } catch {
        /* keep fallback values */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapExpanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMapExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mapExpanded]);

  const cityTitle = isLight ? "text-bqa-text" : "text-white";
  const barTrack = isLight ? "bg-slate-200/90" : "bg-bqa-navy";
  const mostCity = toCardData(extremes?.most ?? null, FALLBACK_MOST);
  const leastCity = toCardData(extremes?.least ?? null, FALLBACK_LEAST);
  const extremesKey = `${mostCity.city}:${mostCity.aqi}|${leastCity.city}:${leastCity.aqi}`;

  return (
    <section
      id="sec-realtime-map"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionTitle className="mb-6">Real-Time AQI Map</SectionTitle>

        {mapExpanded && (
          <div
            aria-hidden
            className="h-[min(480px,calc(100dvh-17rem))] min-h-[240px] sm:min-h-[280px]"
          />
        )}

        <div
          className={`overflow-hidden border border-sky-400/10 bg-[#0a0c10] shadow-xl ${
            mapExpanded
              ? "fixed inset-x-0 bottom-0 top-[7.25rem] z-[150] flex flex-col rounded-none border-x-0"
              : "rounded-3xl"
          }`}
        >
          <MapViewport
            expanded={mapExpanded}
            onToggleExpanded={() => setMapExpanded((prev) => !prev)}
            selectedCity={selectedCity}
            metric={metric}
            standard={standard}
          />

          {!mapExpanded && (
            <MapControlsPanel
              metric={metric}
              setMetric={setMetric}
              standard={standard}
              setStandard={setStandard}
            />
          )}
        </div>

        {/* Most Polluted + Cleanest City */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

          <ExtremeCityCard
            label="Most Polluted City Today"
            labelClass={isLight ? "text-rose-600" : "text-rose-400"}
            borderClass="border-rose-500/20"
            bgClass="bg-rose-500/[0.07]"
            badgeClass={
              isLight ? "bg-rose-100 text-rose-900" : "bg-rose-500/20 text-rose-300"
            }
            cityTitle={cityTitle}
            barTrack={barTrack}
            barClass="bg-bqa-unhealthy"
            city={mostCity.city}
            aqi={mostCity.aqi}
            status={mostCity.status}
            barPct={mostCity.barPct}
            aqiClass={mostCity.aqiClass}
            animateKey={extremesKey}
            delayMs={0}
          />

          <ExtremeCityCard
            label="Cleanest City Today"
            labelClass={isLight ? "text-emerald-600" : "text-emerald-400"}
            borderClass="border-emerald-500/20"
            bgClass="bg-emerald-500/[0.07]"
            badgeClass={
              isLight ? "bg-emerald-100 text-emerald-900" : "bg-emerald-500/20 text-emerald-300"
            }
            cityTitle={cityTitle}
            barTrack={barTrack}
            barClass="bg-bqa-good"
            city={leastCity.city}
            aqi={leastCity.aqi}
            status={leastCity.status}
            barPct={leastCity.barPct}
            aqiClass={leastCity.aqiClass}
            animateKey={extremesKey}
            delayMs={120}
          />

        </div>
      </div>
    </section>
  );
}
