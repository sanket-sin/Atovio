"use client";

import { useEffect, useState } from "react";
import type { MostPollutedCityRow } from "@/lib/api/aqi-most-polluted";
import { fetchMostAndLeastPollutedCities } from "@/lib/api/aqi-most-polluted";
import { getAqiLevel } from "@/lib/air-quality/aqi-levels";
import { RealtimeAqiGoogleMap } from "./RealtimeAqiGoogleMap";
import { SectionTitle } from "./SectionTitle";

const METRICS = ["AQI", "PM10", "PM2.5", "Temp", "Humidity", "Wind"] as const;
const STANDARDS = ["CPCB", "US EPA", "WHO"] as const;
const TIMES = [
  "7PM",
  "10PM",
  "1AM",
  "4AM",
  "7AM",
  "10AM",
  "1PM",
  "4PM",
  "NOW",
];

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

export function RealtimeAqiMapSection({ isLight = false }: { isLight?: boolean }) {
  const [metric, setMetric] = useState<(typeof METRICS)[number]>("AQI");
  const [standard, setStandard] = useState<(typeof STANDARDS)[number]>("CPCB");
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

  const cityTitle = isLight ? "text-bqa-text" : "text-white";
  const barTrack = isLight ? "bg-slate-200/90" : "bg-bqa-navy";
  const mostCity = toCardData(extremes?.most ?? null, FALLBACK_MOST);
  const leastCity = toCardData(extremes?.least ?? null, FALLBACK_LEAST);

  return (
    <section
      id="sec-realtime-map"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionTitle className="mb-6">Real-Time AQI Map</SectionTitle>

        <div className="overflow-hidden rounded-3xl border border-sky-400/10 bg-[#0a0c10] shadow-xl">
          <div className="relative aspect-[16/10] min-h-[320px] w-full sm:min-h-[420px]">
            <RealtimeAqiGoogleMap className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bqa-navy/25 via-transparent to-bqa-navy/10" />

            <div className="absolute left-4 top-4 z-[2] flex flex-col gap-2">
              <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                200+ live sensors
              </div>
              <div className="pointer-events-auto rounded-full border border-sky-400/20 bg-black/55 px-3 py-1.5 text-xs text-bqa-muted backdrop-blur-md">
                Showing:{" "}
                <span className="font-semibold text-bqa-text">{metric}</span> ·{" "}
                <span className="font-semibold text-bqa-accent2">{standard}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-sky-400/10 bg-bqa-navy2/95 p-4 backdrop-blur-md sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-bqa-slate text-bqa-text hover:bg-bqa-slate2"
                aria-label="Play timeline"
              >
                <span className="ml-0.5 text-lg">▶</span>
              </button>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="mb-1 flex min-w-0 justify-between gap-1 overflow-x-auto pb-0.5 font-mono text-[0.58rem] leading-tight text-bqa-dim [-ms-overflow-style:none] [scrollbar-width:none] sm:text-xs [&::-webkit-scrollbar]:hidden">
                  {TIMES.map((t) => (
                    <span key={t} className="shrink-0">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="h-1.5 rounded-full bg-bqa-slate2">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-bqa-accent/50 to-bqa-accent" />
                </div>
              </div>
              <span className="shrink-0 text-right text-[0.65rem] font-semibold text-bqa-accent2 sm:text-xs">
                Now Live
              </span>
            </div>
          </div>
        </div>

        {/* Most Polluted + Cleanest City */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Most Polluted */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] p-5">
            <p
              className={`mb-3 font-outfit text-[0.65rem] font-bold uppercase tracking-widest ${
                isLight ? "text-rose-600" : "text-rose-400"
              }`}
            >
              Most Polluted City Today
            </p>
            <h3 className={`mb-2 font-outfit text-2xl font-bold ${cityTitle}`}>{mostCity.city}</h3>
            <div className="flex items-baseline gap-3">
              <span className={`font-outfit text-4xl font-bold ${mostCity.aqiClass}`}>{mostCity.aqi}</span>
              <span
                className={`rounded-md px-2 py-0.5 font-outfit text-[0.75rem] font-semibold ${
                  isLight
                    ? "bg-rose-100 text-rose-900"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {mostCity.status}
              </span>
            </div>
            <div className={`mt-5 h-1.5 w-full rounded-full ${barTrack}`}>
              <div className="h-full rounded-full bg-bqa-unhealthy" style={{ width: mostCity.barPct }} />
            </div>
          </div>

          {/* Cleanest City */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5">
            <p
              className={`mb-3 font-outfit text-[0.65rem] font-bold uppercase tracking-widest ${
                isLight ? "text-emerald-600" : "text-emerald-400"
              }`}
            >
              Cleanest City Today
            </p>
            <h3 className={`mb-2 font-outfit text-2xl font-bold ${cityTitle}`}>{leastCity.city}</h3>
            <div className="flex items-baseline gap-3">
              <span className={`font-outfit text-4xl font-bold ${leastCity.aqiClass}`}>{leastCity.aqi}</span>
              <span
                className={`rounded-md px-2 py-0.5 font-outfit text-[0.75rem] font-semibold ${
                  isLight
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {leastCity.status}
              </span>
            </div>
            <div className={`mt-5 h-1.5 w-full rounded-full ${barTrack}`}>
              <div className="h-full rounded-full bg-bqa-good" style={{ width: leastCity.barPct }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
