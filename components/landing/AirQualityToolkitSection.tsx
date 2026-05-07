"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import { AnimatedCigarette } from "./AnimatedCigarette";
import {
  fetchAqiHistorical24Hour,
  formatClockHourRange12h,
  resolveHistoricalSlug,
  type ExposureClockModel,
} from "@/lib/api/aqi-historical-24h";

/* ── Clock fallback (before API load or on error) ── */
const FALLBACK_SEGMENT_COLORS = [
  "#ffd24d",
  "#ffd24d", // 12–2AM yellow
  "#14532d",
  "#166534",
  "#15803d", // 2–5AM dark green
  "#4ade80",
  "#86efac", // 5–7AM best window
  "#ffd24d", // 7–8AM
  "#fb7185",
  "#f87171",
  "#ef4444",
  "#f97316", // 8AM–12PM worst band
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#f97316", // 12–4PM orange
  "#fdba74",
  "#fb923c",
  "#fbbf24",
  "#f59e0b",
  "#fcd34d", // 4–9PM yellow-orange
  "#ffd24d",
  "#ffd24d",
  "#ffd24d", // 9PM–12AM yellow
];

const CLOCK_LABELS = [
  { label: "12AM", h: 0 },
  { label: "3AM", h: 3 },
  { label: "6AM", h: 6 },
  { label: "9AM", h: 9 },
  { label: "12PM", h: 12 },
  { label: "3PM", h: 15 },
  { label: "6PM", h: 18 },
  { label: "9PM", h: 21 },
];

const CX = 50,
  CY = 50,
  RI = 26,
  RO = 49;

function segPath(h: number): string {
  const gap = 1.25;
  const a1 = (h / 24) * 360 - 90 + gap / 2;
  const a2 = ((h + 1) / 24) * 360 - 90 - gap / 2;
  const rad = (d: number) => (d * Math.PI) / 180;
  const f = (n: number) => n.toFixed(2);
  const cos = (d: number) => Math.cos(rad(d));
  const sin = (d: number) => Math.sin(rad(d));
  return (
    `M${f(CX + RI * cos(a1))} ${f(CY + RI * sin(a1))}` +
    `L${f(CX + RO * cos(a1))} ${f(CY + RO * sin(a1))}` +
    `A${RO} ${RO} 0 0 1 ${f(CX + RO * cos(a2))} ${f(CY + RO * sin(a2))}` +
    `L${f(CX + RI * cos(a2))} ${f(CY + RI * sin(a2))}` +
    `A${RI} ${RI} 0 0 0 ${f(CX + RI * cos(a1))} ${f(CY + RI * sin(a1))}Z`
  );
}

function labelPos(h: number, r: number) {
  const rad = ((h / 24) * 360 - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

/* ── Forecast chart ── */
const VW = 336,
  VH = 192;
const PL = 28,
  PT = 8,
  PB = 42,
  PR = 4;
const GW = VW - PL - PR,
  GH = VH - PT - PB;

const AQI_PTS = [160, 172, 190, 215, 258, 308, 360, 405, 426, 412, 346, 166];
const X_LABS = ["4PM", "6PM", "8PM", "10PM", "12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM"];

const gx = (i: number) => PL + (i / (AQI_PTS.length - 1)) * GW;
const gy = (v: number) => PT + GH - (v / 500) * GH;

function smoothPath(data: number[]): string {
  const pts: [number, number][] = data.map((v, i) => [gx(i), gy(v)]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const [xp, yp] = pts[Math.max(i - 2, 0)];
    const [xn, yn] = pts[Math.min(i + 1, pts.length - 1)];
    const cp1x = x0 + (x1 - xp) / 6;
    const cp1y = y0 + (y1 - yp) / 6;
    const cp2x = x1 - (xn - x0) / 6;
    const cp2y = y1 - (yn - y0) / 6;
    d += `C${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

const LINE_D = smoothPath(AQI_PTS);
const AREA_D =
  LINE_D +
  `L${gx(AQI_PTS.length - 1).toFixed(1)} ${(PT + GH).toFixed(1)}` +
  `L${PL.toFixed(1)} ${(PT + GH).toFixed(1)}Z`;

const OUTFIT = "var(--font-outfit), system-ui, sans-serif";

function ClockFace({
  isLight,
  segmentColors,
}: {
  isLight: boolean;
  segmentColors: string[];
}) {
  const holeFill = isLight ? "#f0f4f8" : "#0b111e";
  const centerNumFill = isLight ? "#0f172a" : "#ffffff";
  const subFill = isLight ? "#64748b" : "#9ca3af";
  const ringLabelFill = isLight ? "#94a3b8" : "#9ca3af";

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,240px)] shrink-0">
      <svg viewBox="-14 -28 128 128" className="w-full overflow-visible">
        {segmentColors.map((color, h) => (
          <path key={h} d={segPath(h)} fill={color} />
        ))}
        <circle cx={CX} cy={CY} r={RI - 0.5} fill={holeFill} />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={centerNumFill}
          fontSize="18"
          fontWeight="bold"
          style={{ fontFamily: OUTFIT }}
        >
          24
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={subFill}
          fontSize="6.25"
          style={{ fontFamily: OUTFIT }}
        >
          hours
        </text>
        {CLOCK_LABELS.map(({ label, h }) => {
          const { x, y } = labelPos(h, 54);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ringLabelFill}
              fontSize="5"
              letterSpacing="0.02em"
              style={{ fontFamily: OUTFIT }}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ClockLegendRow({ isLight }: { isLight: boolean }) {
  const legendMuted = isLight ? "text-slate-500" : "text-[#9ca3af]";

  return (
    <div
      className={`flex w-full flex-row flex-wrap items-center justify-center gap-x-10 gap-y-2 font-outfit text-[0.75rem] leading-tight ${legendMuted}`}
    >
      <span className="flex items-center gap-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#4ade80]" />
        Best window
      </span>
      <span className="flex items-center gap-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#f87171]" />
        Worst window
      </span>
    </div>
  );
}

function ClockRecommendations({
  isLight,
  bestRange,
  worstRange,
}: {
  isLight: boolean;
  bestRange: string;
  worstRange: string;
}) {
  const labelClass = isLight ? "text-bqa-muted" : "text-white";

  return (
    <div className={`mt-6 border-t pt-5 ${isLight ? "border-slate-200" : "border-white/10"}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#4ade80]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="font-outfit text-[0.82rem] leading-snug">
          <span className={labelClass}>Best outdoors: </span>
          <span className="font-semibold text-[#4ade80]">{bestRange}</span>
        </p>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#f87171]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <p className="font-outfit text-[0.82rem] leading-snug">
          <span className={labelClass}>Avoid outdoors: </span>
          <span className="font-semibold text-[#f87171]">{worstRange}</span>
        </p>
      </div>
    </div>
  );
}

function ForecastChartBlock() {
  const gradId = useId().replace(/:/g, "");

  return (
    <>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d9eff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3d9eff" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0, 100, 200, 300, 400, 500].map((v) => (
          <g key={v}>
            {v > 0 && (
              <line
                x1={PL}
                y1={gy(v)}
                x2={VW - PR}
                y2={gy(v)}
                stroke="rgba(96,165,250,0.1)"
                strokeDasharray="4 3"
              />
            )}
            <text
              x={PL - 3}
              y={gy(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#4a728a"
              fontSize="7.5"
              style={{ fontFamily: OUTFIT }}
            >
              {v}
            </text>
          </g>
        ))}

        <path d={AREA_D} fill={`url(#${gradId})`} />
        <path
          d={LINE_D}
          fill="none"
          stroke="#3d9eff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {X_LABS.map((lb, i) => (
          <text
            key={lb}
            x={gx(i)}
            y={PT + GH + 11}
            textAnchor="middle"
            fill="#4a728a"
            fontSize="7"
            style={{ fontFamily: OUTFIT }}
          >
            {lb}
          </text>
        ))}

        <text x={PL} y={VH - 2} fill="#4a728a" fontSize="7" style={{ fontFamily: OUTFIT }}>
          30/03/2026
        </text>
        <text x={VW / 2} y={VH - 2} textAnchor="middle" fill="#4a728a" fontSize="7" style={{ fontFamily: OUTFIT }}>
          Time
        </text>
        <text x={VW - PR} y={VH - 2} textAnchor="end" fill="#4a728a" fontSize="7" style={{ fontFamily: OUTFIT }}>
          01/04/2026
        </text>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {(
          [
            ["Today", "160", "text-purple-400"],
            ["Tomorrow", "110", "text-amber-300"],
            ["+2 Days", "130", "text-rose-300"],
          ] as const
        ).map(([l, v, c]) => (
          <div
            key={l}
            className="rounded-lg border border-sky-400/10 bg-bqa-slate/50 px-2 py-2 text-center"
          >
            <div className="font-outfit text-[0.65rem] text-bqa-dim">{l}</div>
            <div className={`font-outfit text-lg font-bold ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-outfit text-[0.78rem] text-bqa-dim">
        • Best window tomorrow: 6–7 AM, (AQI 85)
      </p>
    </>
  );
}

function PuffForm({
  age,
  setAge,
  years,
  setYears,
}: {
  age: string;
  setAge: (v: string) => void;
  years: string;
  setYears: (v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block font-outfit text-[0.65rem] text-bqa-dim">Your Age</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 font-outfit text-sm text-bqa-text outline-none focus:border-bqa-accent/50"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-outfit text-[0.65rem] text-bqa-dim">City</span>
          <select className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 font-outfit text-sm text-bqa-text outline-none focus:border-bqa-accent/50">
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Bengaluru</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block font-outfit text-[0.65rem] text-bqa-dim">Years Lived Here</span>
        <input
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 font-outfit text-sm text-bqa-text outline-none focus:border-bqa-accent/50"
        />
      </label>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-bqa-accent py-3 font-outfit text-sm font-bold text-white shadow-[0_4px_16px_rgba(61,158,255,0.25)] transition hover:brightness-110"
      >
        Submit
      </button>
      <p className="mt-3 text-center font-outfit text-[0.72rem] text-bqa-dim">
        • Share your result and raise awareness about air quality
      </p>
    </>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-bqa-muted opacity-80 transition-transform duration-200 ${className}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function exposureDetail(model: ExposureClockModel, kind: "best" | "worst"): string {
  const w = kind === "best" ? model.best : model.worst;
  const range = formatClockHourRange12h(w.startHour, w.endHour);
  return `${range} (AQI ~${Math.round(w.avgAqi)})`;
}

const STATIC_BEST = "5am–7am (AQI ~52)";
const STATIC_WORST = "8am–12pm (AQI ~185)";

/** Dark: inset navy card + dark clock hole. Light: white card, mint icon tile, pale clock center (ref screenshot 2). */
function HealthExposureClockCard({
  isLight,
  clockModel,
  clockLoading,
}: {
  isLight: boolean;
  clockModel: ExposureClockModel | null;
  clockLoading: boolean;
}) {
  const segmentColors =
    clockModel?.segmentColors?.length === 24 ? clockModel.segmentColors : FALLBACK_SEGMENT_COLORS;
  const bestRange = clockModel
    ? exposureDetail(clockModel, "best")
    : clockLoading
      ? "Loading…"
      : STATIC_BEST;
  const worstRange = clockModel
    ? exposureDetail(clockModel, "worst")
    : clockLoading
      ? "Loading…"
      : STATIC_WORST;

  const shell = isLight
    ? "rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-5 shadow-[0_2px_24px_rgba(15,23,42,0.07)] backdrop-blur-md sm:p-6"
    : "rounded-2xl border border-white/[0.07] bg-[#0b111e] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6";

  const iconTile = isLight
    ? "border-emerald-300/90 bg-[#e8f5e9]"
    : "border-emerald-400/85 bg-[#060a14]";

  return (
    <div className={shell}>
      <div className="mb-2 flex items-center gap-3 sm:mb-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconTile}`}>
          <Image
            src="/images/watch-icon.svg"
            alt=""
            width={18}
            height={18}
            className="object-contain"
            unoptimized
          />
        </span>
        <h3
          className={`font-outfit text-[1rem] font-bold tracking-tight ${isLight ? "text-bqa-text" : "text-white"}`}
        >
          Health Exposure Clock
        </h3>
      </div>

      <div
        className={`-mt-2 flex flex-col items-center gap-4 sm:-mt-2.5 ${clockLoading ? "opacity-[0.72]" : ""} transition-opacity duration-300`}
      >
        <ClockFace isLight={isLight} segmentColors={segmentColors} />
        <ClockLegendRow isLight={isLight} />
      </div>

      <ClockRecommendations isLight={isLight} bestRange={bestRange} worstRange={worstRange} />
    </div>
  );
}

export function AirQualityToolkitSection({
  isLight = false,
  citySnapshot = null,
}: {
  isLight?: boolean;
  citySnapshot?: HeroCitySnapshot | null;
}) {
  const [age, setAge] = useState("32");
  const [years, setYears] = useState("10");
  const [clockModel, setClockModel] = useState<ExposureClockModel | null>(null);
  const [clockLoading, setClockLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const slug = resolveHistoricalSlug(citySnapshot);
    setClockLoading(true);
    fetchAqiHistorical24Hour(slug)
      .then((model) => {
        if (!cancelled) setClockModel(model);
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[BeyondAQI] 24h historical for Health Exposure Clock failed:", err);
        }
        if (!cancelled) setClockModel(null);
      })
      .finally(() => {
        if (!cancelled) setClockLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [citySnapshot]);

  const cardShell = "rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-md";

  return (
    <section id="sec-toolkit" className="sec-fx border-t border-sky-400/10 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 className="mb-6 font-outfit text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:mb-8">
          Your Air Quality Toolkit
        </h2>

        {/* Mobile / tablet: clock expanded + accordions */}
        <div className="flex flex-col gap-4 lg:hidden">
          <HealthExposureClockCard
            isLight={isLight}
            clockModel={clockModel}
            clockLoading={clockLoading}
          />

          <details className={`${cardShell} overflow-hidden open:shadow-[0_8px_30px_rgba(0,0,0,0.25)]`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/35 bg-[#0c1424]">
                  <Image
                    src="/images/stats-arrow-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <span className="truncate font-outfit text-[0.95rem] font-bold text-white">
                  72-Hours AQI Forecast
                </span>
              </div>
              <ChevronDown className="toolkit-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-2">
              <div className="mb-4 flex items-center justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-sky-400/15 bg-bqa-slate px-2.5 py-1 font-outfit text-[0.7rem] font-semibold text-bqa-muted"
                >
                  AQI ▾
                </button>
              </div>
              <ForecastChartBlock />
            </div>
          </details>

          <details className={`${cardShell} overflow-hidden open:shadow-[0_8px_30px_rgba(0,0,0,0.25)]`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-500/40 bg-[#0c1424]">
                  <Image
                    src="/images/cigaratte-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                  <span className="min-w-0 shrink truncate font-outfit text-[0.95rem] font-bold text-white">
                    Puff Score Lifetime Calculator
                  </span>
                  <AnimatedCigarette compact isLight={isLight} className="ml-0 shrink-0" />
                </div>
              </div>
              <ChevronDown className="toolkit-details-chevron shrink-0" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <PuffForm age={age} setAge={setAge} years={years} setYears={setYears} />
            </div>
          </details>
        </div>

        {/* Desktop: three-column grid */}
        <div className="hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-3">
          <HealthExposureClockCard
            isLight={isLight}
            clockModel={clockModel}
            clockLoading={clockLoading}
          />

          <div className={`${cardShell} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/15">
                  <Image
                    src="/images/stats-arrow-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <h3 className="font-outfit text-[1rem] font-bold text-white">72-Hours AQI Forecast</h3>
              </div>
              <button
                type="button"
                className="rounded-lg border border-sky-400/15 bg-bqa-slate px-2.5 py-1 font-outfit text-[0.7rem] font-semibold text-bqa-muted"
              >
                AQI ▾
              </button>
            </div>
            <ForecastChartBlock />
          </div>

          <div className={`${cardShell} relative overflow-visible p-6`}>
            <div className="mb-5 flex items-center gap-2 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
                <Image
                  src="/images/cigaratte-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="object-contain"
                  unoptimized
                />
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                <h3 className="min-w-0 shrink truncate font-outfit text-[1rem] font-bold text-white">
                  Puff Score Lifetime Calculator
                </h3>
                <AnimatedCigarette
                  compact
                  isLight={isLight}
                  className="ml-0 shrink-0"
                  title="Approximate cigarettes inhaled per day (lifetime exposure model)"
                />
              </div>
            </div>
            <PuffForm age={age} setAge={setAge} years={years} setYears={setYears} />
          </div>
        </div>
      </div>
    </section>
  );
}
