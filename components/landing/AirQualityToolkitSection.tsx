"use client";

import Image from "next/image";
import { useId, useState } from "react";

/* ── Clock ── */
const SEG_COLORS = [
  "#ffd24d",
  "#ffd24d",
  "#a3e635",
  "#00e5aa",
  "#00e5aa",
  "#00e5aa",
  "#00e5aa",
  "#ffd24d",
  "#ff8c42",
  "#ff4d6d",
  "#ff4d6d",
  "#ff8c42",
  "#ff8c42",
  "#ff8c42",
  "#ffd24d",
  "#ffd24d",
  "#ffd24d",
  "#ffd24d",
  "#ffd24d",
  "#ffd24d",
  "#a3e635",
  "#ffd24d",
  "#a3e635",
  "#ffd24d",
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
  RI = 30,
  RO = 46;

function segPath(h: number): string {
  const gap = 2;
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

function ClockFace() {
  /** ~1 AM segment center — floating marker (matches reference pin) */
  const markerR = 54;
  const markerAngle = ((1.5 / 24) * 360 - 90) * (Math.PI / 180);
  const markerX = CX + markerR * Math.cos(markerAngle);
  const markerY = CY + markerR * Math.sin(markerAngle);

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,220px)] shrink-0">
      <svg viewBox="-12 -38 124 124" className="w-full overflow-visible">
        {SEG_COLORS.map((color, h) => (
          <path key={h} d={segPath(h)} fill={color} />
        ))}
        <circle cx={CX} cy={CY} r={RI - 1} fill="#0b111e" />
        <text
          x={CX}
          y={CY - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize="15"
          fontWeight="bold"
          style={{ fontFamily: OUTFIT }}
        >
          24
        </text>
        <text
          x={CX}
          y={CY + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9ca3af"
          fontSize="5.2"
          style={{ fontFamily: OUTFIT }}
        >
          hours
        </text>
        {CLOCK_LABELS.map(({ label, h }) => {
          const { x, y } = labelPos(h, 52);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9ca3af"
              fontSize="5"
              letterSpacing="0.02em"
              style={{ fontFamily: OUTFIT }}
            >
              {label}
            </text>
          );
        })}

        {/* Pin — dark bubble, tail toward ring (~1 AM), white badge */}
        <g transform={`translate(${markerX.toFixed(2)}, ${markerY.toFixed(2)})`}>
          <path
            d="M -21 -34 L 21 -34 Q 23 -34 23 -32 L 23 -17 Q 23 -15 21 -15 L 7 -15 L 0 -6 L -7 -15 L -21 -15 Q -23 -15 -23 -17 L -23 -32 Q -23 -34 -21 -34 Z"
            fill="#111827"
            stroke="#475569"
            strokeWidth="0.5"
          />
          <circle cx={0} cy={-25} r={6.5} fill="#ffffff" />
          <text
            x={0}
            y={-23.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0f172a"
            fontSize="4.5"
            fontWeight="bold"
            style={{ fontFamily: OUTFIT }}
          >
            atovio
          </text>
        </g>
      </svg>
    </div>
  );
}

function ClockLegendColumn({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex shrink-0 flex-col justify-center gap-4 font-outfit text-[0.75rem] leading-tight text-[#9ca3af] ${compact ? "text-left" : ""}`}
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

function ClockRecommendations() {
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
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
          <span className="text-white">Best outdoors: </span>
          <span className="font-semibold text-[#4ade80]">5am–7am (AQI ~52)</span>
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
          <span className="text-white">Avoid outdoors: </span>
          <span className="font-semibold text-[#f87171]">8am–12pm (AQI ~185)</span>
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

/** Matches reference: navy card, green icon frame, clock + legend row, summary footer */
function HealthExposureClockCard() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b111e] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/85 bg-[#060a14]">
          <Image
            src="/images/watch-icon.svg"
            alt=""
            width={18}
            height={18}
            className="object-contain"
            unoptimized
          />
        </span>
        <h3 className="font-outfit text-[1rem] font-bold tracking-tight text-white">Health Exposure Clock</h3>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
          <ClockFace />
        </div>
        <ClockLegendColumn compact />
      </div>

      <ClockRecommendations />
    </div>
  );
}

export function AirQualityToolkitSection() {
  const [age, setAge] = useState("32");
  const [years, setYears] = useState("10");

  const cardShell = "rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-md";

  return (
    <section id="sec-toolkit" className="sec-fx border-t border-sky-400/10 py-12 sm:py-16">
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <h2 className="mb-6 font-outfit text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:mb-8">
          Your Air Quality Toolkit
        </h2>

        {/* Mobile / tablet: clock expanded + accordions */}
        <div className="flex flex-col gap-4 lg:hidden">
          <HealthExposureClockCard />

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
              <div className="flex min-w-0 items-center gap-3">
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
                <span className="truncate font-outfit text-[0.95rem] font-bold text-white">
                  Puff Score Lifetime Calculator
                </span>
              </div>
              <ChevronDown className="toolkit-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <PuffForm age={age} setAge={setAge} years={years} setYears={setYears} />
            </div>
          </details>
        </div>

        {/* Desktop: three-column grid */}
        <div className="hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-3">
          <HealthExposureClockCard />

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

          <div className={`${cardShell} p-6`}>
            <div className="mb-5 flex items-center gap-3">
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
              <h3 className="font-outfit text-[1rem] font-bold text-white">Puff Score Lifetime Calculator</h3>
            </div>
            <PuffForm age={age} setAge={setAge} years={years} setYears={setYears} />
          </div>
        </div>
      </div>
    </section>
  );
}
