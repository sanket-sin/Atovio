"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Chart } from "chart.js";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import {
  fetchAqiHistoricalRange,
  historyMetricToPollutantParam,
  type HistoricalRangePeriod,
} from "@/lib/api/aqi-historical-range";
import { resolveHistoricalSlug } from "@/lib/api/aqi-historical-24h";
import { aqiColor } from "./chart-data";
import { AQI_LEGEND_CHART_TUPLES } from "@/lib/air-quality/aqi-levels";
import { registerLandingCharts } from "./chart-register";
import { useAnimatedProgress, useInViewOnce } from "./ReadingAnimation";
import { DetailsPanelAnimation } from "./DetailsPanelAnimation";
import { SectionTitle } from "./SectionTitle";
import { WhoComplianceScorecard } from "./WhoComplianceScorecard";

type ChartType = "bar" | "line";
type Metric = "aqi" | "pm25" | "pm10";

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
      className={`shrink-0 text-bqa-muted opacity-90 transition-transform duration-200 ${className}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconLineChart({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7 14l4-4 3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBarChart({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
      <rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="16" y="6" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

const selectClass =
  "min-h-[2.75rem] min-w-0 flex-1 appearance-none rounded-[10px] border border-sky-400/10 bg-bqa-slate bg-[length:14px] bg-[right_0.65rem_center] bg-no-repeat px-3 py-2 pr-9 text-[0.8rem] text-bqa-text outline-none focus:border-sky-400/30 sm:w-auto sm:min-w-[7.5rem] sm:flex-none";
const selectChevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M4 6l3 3 3-3'/%3E%3C/svg%3E\")";

/** Soft caps — values above cap sit on the outer ring (same numeric scale as API). */
const RADAR_AXIS_ORDER = ["pm2_5", "pm10", "o3", "co", "so2", "no2"] as const;
const RADAR_AXIS_CAPS: Record<(typeof RADAR_AXIS_ORDER)[number], number> = {
  pm2_5: 150,
  pm10: 300,
  o3: 180,
  co: 5000,
  so2: 80,
  no2: 200,
};

const RADAR_CX = 160;
const RADAR_CY = 160;
const RADAR_R_OUT = 90;
const RADAR_R_IN = 26;

function radarNorm(value: number, cap: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(1, value / cap);
}

function radarPoint(axisIndex: number, norm: number): { x: number; y: number } {
  const angleDeg = -90 + axisIndex * 60;
  const rad = (angleDeg * Math.PI) / 180;
  const r = RADAR_R_IN + norm * (RADAR_R_OUT - RADAR_R_IN);
  return {
    x: RADAR_CX + r * Math.cos(rad),
    y: RADAR_CY + r * Math.sin(rad),
  };
}

function radarPolygonFromSnapshot(snapshot: HeroCitySnapshot | null): {
  points: string;
  vertices: { x: number; y: number }[];
} {
  const pol = snapshot?.pollutants;
  const raw: number[] = [
    pol?.pm2_5 ?? snapshot?.pm25 ?? 0,
    pol?.pm10 ?? snapshot?.pm10 ?? 0,
    pol?.o3 ?? 0,
    pol?.co ?? 0,
    pol?.so2 ?? 0,
    pol?.no2 ?? 0,
  ];
  const norms = raw.map((v, i) => radarNorm(v, RADAR_AXIS_CAPS[RADAR_AXIS_ORDER[i]]));
  const vertices = norms.map((n, i) => radarPoint(i, n));
  const points = vertices.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return { points, vertices };
}

function radarRawValues(snapshot: HeroCitySnapshot | null): Array<number | null> {
  const pol = snapshot?.pollutants;
  return [
    pol?.pm2_5 ?? snapshot?.pm25 ?? null,
    pol?.pm10 ?? snapshot?.pm10 ?? null,
    pol?.o3 ?? null,
    pol?.co ?? null,
    pol?.so2 ?? null,
    pol?.no2 ?? null,
  ];
}

const RADAR_LABELS: {
  x: number;
  y: number;
  anchor: "middle" | "start" | "end";
  text: string;
}[] = [
  { x: 160, y: 52, anchor: "middle", text: "PM 2.5" },
  { x: 245, y: 112, anchor: "start", text: "PM 10" },
  { x: 245, y: 206, anchor: "start", text: "O3" },
  { x: 160, y: 242, anchor: "middle", text: "CO" },
  { x: 75, y: 206, anchor: "end", text: "SO2" },
  { x: 75, y: 112, anchor: "end", text: "NO2" },
];

function PollutantRadarBody({ citySnapshot }: { citySnapshot: HeroCitySnapshot | null }) {
  const { vertices } = radarPolygonFromSnapshot(citySnapshot);
  const values = radarRawValues(citySnapshot);
  const hasLive = Boolean(citySnapshot);
  const tooltipId = useId().replace(/:/g, "");
  const [radarRef, radarActive] = useInViewOnce<HTMLDivElement>([citySnapshot?.cityName, citySnapshot?.aqi]);
  const radarProgress = useAnimatedProgress(radarActive, 1100, 80);
  const animatedVertices = vertices.map((v) => ({
    x: RADAR_CX + (v.x - RADAR_CX) * radarProgress,
    y: RADAR_CY + (v.y - RADAR_CY) * radarProgress,
  }));
  const points = animatedVertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const tooltipAxis = hoveredAxis ?? 0;
  const tooltipPoint = vertices[tooltipAxis];
  const tooltipValue = values[tooltipAxis];
  const tooltipText = tooltipValue == null ? "No live value" : `${tooltipValue.toFixed(1)}`;
  const tooltipX = Math.max(64, Math.min(256, tooltipPoint.x));
  const tooltipY = Math.max(28, tooltipPoint.y - 20);

  return (
    <div ref={radarRef}>
      <svg viewBox="0 0 320 285" className="mx-auto w-full max-w-[32rem]" aria-label="Pollutant mix radar chart">
        <defs>
          <linearGradient id={`radar-tooltip-bg-${tooltipId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12274a" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#09142b" stopOpacity="0.97" />
          </linearGradient>
          <linearGradient id={`radar-tooltip-stroke-${tooltipId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#40a9ff" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#b07bff" stopOpacity="0.56" />
          </linearGradient>
          <filter id={`radar-tooltip-shadow-${tooltipId}`} x="-40%" y="-80%" width="180%" height="240%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.38" />
          </filter>
        </defs>

        {[
          "160,70 237.9,115 237.9,205 160,250 82.1,205 82.1,115",
          "160,92.5 218.5,126.3 218.5,193.8 160,227.5 101.5,193.8 101.5,126.3",
          "160,115 199,137.5 199,182.5 160,205 121,182.5 121,137.5",
          "160,137.5 179.5,148.8 179.5,171.3 160,182.5 140.5,171.3 140.5,148.8",
        ].map((pts) => (
          <polygon key={pts} points={pts} fill="none" stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
        ))}

        {[["160", "70"], ["237.9", "115"], ["237.9", "205"], ["160", "250"], ["82.1", "205"], ["82.1", "115"]].map(
          ([x2, y2]) => (
            <line key={`${x2}${y2}`} x1="160" y1="160" x2={x2} y2={y2} stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
          )
        )}

        <polygon
          points={points}
          fill="rgba(61,158,255,0.12)"
          stroke="#3d9eff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {animatedVertices.map((pt, i) => (
          <g key={RADAR_AXIS_ORDER[i]}>
            <circle
              cx={pt.x.toFixed(1)}
              cy={pt.y.toFixed(1)}
              r="9"
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={`${RADAR_LABELS[i].text} value`}
              onMouseEnter={() => setHoveredAxis(i)}
              onMouseLeave={() => setHoveredAxis((prev) => (prev === i ? null : prev))}
              onFocus={() => setHoveredAxis(i)}
              onBlur={() => setHoveredAxis((prev) => (prev === i ? null : prev))}
            />
            <circle
              cx={pt.x.toFixed(1)}
              cy={pt.y.toFixed(1)}
              r={hoveredAxis === i ? "4.7" : "3.5"}
              fill="#3d9eff"
              className="transition-all"
              pointerEvents="none"
            />
          </g>
        ))}

        {hoveredAxis !== null && (
          <g pointerEvents="none">
            <path
              d={`M ${tooltipX - 6} ${tooltipY + 8} L ${tooltipX + 6} ${tooltipY + 8} L ${tooltipX} ${tooltipY + 14} Z`}
              fill={`url(#radar-tooltip-bg-${tooltipId})`}
              stroke={`url(#radar-tooltip-stroke-${tooltipId})`}
              strokeWidth="0.55"
              opacity="0.95"
            />
            <rect
              x={tooltipX - 42}
              y={tooltipY - 18}
              width="84"
              height="28"
              rx="7"
              fill={`url(#radar-tooltip-bg-${tooltipId})`}
              stroke={`url(#radar-tooltip-stroke-${tooltipId})`}
              strokeWidth="0.8"
              filter={`url(#radar-tooltip-shadow-${tooltipId})`}
            />
            <rect
              x={tooltipX - 41}
              y={tooltipY - 17}
              width="82"
              height="5"
              rx="5"
              fill="rgba(255,255,255,0.07)"
            />
            <text
              x={tooltipX}
              y={tooltipY - 8}
              textAnchor="middle"
              fill="#9ec3ea"
              fontSize="7.6"
              letterSpacing="0.2"
              style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
            >
              {RADAR_LABELS[tooltipAxis].text}
            </text>
            <text
              x={tooltipX}
              y={tooltipY + 2}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9.8"
              fontWeight="700"
              style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
            >
              {tooltipText}
            </text>
          </g>
        )}

        {RADAR_LABELS.map((lab) => (
          <text
            key={lab.text}
            x={lab.x}
            y={lab.y}
            textAnchor={lab.anchor}
            dominantBaseline="middle"
            fill="#7da5c9"
            fontSize="12"
            style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
          >
            {lab.text}
          </text>
        ))}
      </svg>
      <p className="mt-1.5 font-sans text-[0.78rem] text-bqa-dim">
        {hasLive && citySnapshot
          ? `• Latest mix for ${citySnapshot.cityName} — spoke length vs reference cap`
          : "• Load a city above to see live pollutant mix"}
      </p>
    </div>
  );
}

const cardShell = "rounded-2xl border border-sky-400/10 bg-bqa-navy2/75 backdrop-blur-md";

function rangeToApiPeriod(days: 7 | 30): HistoricalRangePeriod {
  return days === 7 ? "7day" : "30day";
}

function metricChartTitle(metric: Metric): string {
  if (metric === "aqi") return "AQI";
  if (metric === "pm25") return "PM2.5";
  return "PM10";
}

function formatHistorySubtitle(
  city: string,
  state: string,
  metric: Metric,
  summary?: { min: number; max: number; average: number }
): string {
  const base = `${city} · ${state} · daily avg`;
  if (!summary) return base;
  if (metric === "aqi") {
    return `${base} · avg ${summary.average} (${summary.min}–${summary.max})`;
  }
  return `${base} · avg ${summary.average} µg/m³ (${summary.min}–${summary.max})`;
}

export function ChartHistorySection({
  citySnapshot = null,
}: {
  citySnapshot?: HeroCitySnapshot | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartWrapRef, chartInView] = useInViewOnce<HTMLDivElement>([]);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [range, setRange] = useState<7 | 30>(30);
  const [metric, setMetric] = useState<Metric>("aqi");
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);
  const [historySubtitle, setHistorySubtitle] = useState<string>("");
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    registerLandingCharts();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const slug = resolveHistoricalSlug(citySnapshot ?? null);
    const period = rangeToApiPeriod(range);
    const pollutant = historyMetricToPollutantParam(metric);

    setHistoryLoading(true);
    setHistoryError(null);

    fetchAqiHistoricalRange(slug, period, pollutant)
      .then((res) => {
        if (cancelled) return;
        setChartLabels(res.labels);
        setChartValues(res.values);
        const { city, state } = res.location;
        setHistorySubtitle(formatHistorySubtitle(city, state, metric, res.summary));
        setHistoryLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setHistoryError(err instanceof Error ? err.message : "Failed to load air quality history");
        setChartLabels([]);
        setChartValues([]);
        setHistorySubtitle("");
        setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [citySnapshot, range, metric]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    chartRef.current?.destroy();

    const data = chartValues;
    const labels = chartLabels;
    const colors = data.map((v) => aqiColor(v));

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(61,158,255,0.3)");
    gradient.addColorStop(1, "rgba(61,158,255,0)");

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: chartType === "bar" ? colors : gradient,
            borderColor: chartType === "line" ? "#3d9eff" : colors,
            borderWidth: chartType === "line" ? 2 : 0,
            borderRadius: chartType === "bar" ? 4 : 0,
            fill: chartType === "line",
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(10,22,40,0.95)",
            borderColor: "rgba(61,158,255,0.3)",
            borderWidth: 1,
            titleColor: "#7da5c9",
            bodyColor: "#e8f4ff",
            padding: 10,
            callbacks: {
              label: (c) => ` ${c.parsed.y} ${metric === "aqi" ? "AQI" : "µg/m³"}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(61,158,255,0.06)" },
            ticks: {
              color: "#4a728a",
              maxTicksLimit: 10,
              font: { size: 11, family: "Inter, ui-sans-serif, system-ui, sans-serif" },
            },
          },
          y: {
            grid: { color: "rgba(61,158,255,0.06)" },
            ticks: {
              color: "#4a728a",
              font: { size: 11, family: "Inter, ui-sans-serif, system-ui, sans-serif" },
            },
          },
        },
        animation: chartInView
          ? {
              duration: 1000,
              easing: "easeOutCubic",
            }
          : false,
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartType, chartLabels, chartValues, metric, chartInView]);

  return (
    <section id="sec-chart" className="sec-fx border-t border-sky-400/10 py-12 sm:py-14">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionTitle className="mb-6 text-left">Air Quality History</SectionTitle>

        {/* Main trend card — layout: header row → controls row → chart → 2×3 legend */}
        <div className="overflow-hidden rounded-[16px] border border-sky-400/10 bg-bqa-navy2/80 p-5 backdrop-blur-md sm:p-7">
          {/* Header: title + meta | chart controls */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-sans text-lg font-bold tracking-[-0.02em] text-bqa-text sm:text-xl md:text-2xl">
                {range}-Day {metricChartTitle(metric)} Trend
              </h3>
              <p className="mt-1 text-[0.85rem] leading-snug text-bqa-muted sm:text-[0.95rem]">
                {historyLoading && !historySubtitle
                  ? "Loading history…"
                  : historyError
                    ? historyError
                    : historySubtitle || "—"}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex shrink-0 rounded-[10px] bg-bqa-slate p-0.5">
                <button
                  type="button"
                  onClick={() => setChartType("line")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.78rem] font-semibold transition-colors sm:px-3.5 sm:text-[0.8rem] ${
                    chartType === "line"
                      ? "bg-bqa-slate2 text-bqa-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "text-bqa-muted hover:text-bqa-text"
                  }`}
                >
                  <IconLineChart
                    className={chartType === "line" ? "text-bqa-text" : "text-bqa-muted"}
                  />
                  Line
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.78rem] font-semibold transition-colors sm:px-3.5 sm:text-[0.8rem] ${
                    chartType === "bar"
                      ? "bg-bqa-slate2 text-bqa-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "text-bqa-muted hover:text-bqa-text"
                  }`}
                >
                  <IconBarChart
                    className={chartType === "bar" ? "text-bqa-text" : "text-bqa-muted"}
                  />
                  Bar
                </button>
              </div>
              <select
                value={range}
                onChange={(e) => setRange(Number(e.target.value) as 7 | 30)}
                style={{ backgroundImage: selectChevronBg }}
                className={selectClass}
                aria-label="Date range"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
              </select>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as Metric)}
                style={{ backgroundImage: selectChevronBg }}
                className={selectClass}
                aria-label="Metric"
              >
                <option value="aqi">AQI</option>
                <option value="pm25">PM2.5</option>
                <option value="pm10">PM10</option>
              </select>
            </div>
          </div>

          <div className="mt-6 border-t border-sky-400/10 pt-5">
            <div
              ref={chartWrapRef}
              className="relative h-[260px] w-full min-w-0 sm:h-[300px]"
            >
              <canvas ref={canvasRef} className="max-h-full" />
            </div>
          </div>

          <div className="mx-auto mt-5 grid max-w-[22rem] grid-cols-3 gap-x-4 gap-y-3 text-[0.72rem] text-bqa-muted sm:max-w-none">
            {AQI_LEGEND_CHART_TUPLES.map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm shadow-sm" style={{ background: c }} />
                <span className="leading-tight">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: accordions (screenshot 1) */}
        <div className="mt-4 flex flex-col gap-3 lg:hidden">
          <details className={`${cardShell} overflow-hidden open:shadow-[0_8px_30px_rgba(0,0,0,0.2)]`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-500/35 bg-[#14102a]">
                  <Image
                    src="/images/pollutant-source-Icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <span className="truncate font-sans text-[0.95rem] font-bold text-white">
                  Pollutant Source Radar
                </span>
              </div>
              <ChevronDown className="history-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <PollutantRadarBody citySnapshot={citySnapshot} />
            </div>
          </details>

          <details className={`${cardShell} overflow-hidden open:shadow-[0_8px_30px_rgba(0,0,0,0.2)]`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/35 bg-[#0c1628]">
                  <Image
                    src="/images/badge-Icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <span className="truncate font-sans text-[0.95rem] font-bold text-white">
                  Who Compliance Scorecard
                </span>
              </div>
              <ChevronDown className="history-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <DetailsPanelAnimation>
                {(active) => <WhoComplianceScorecard active={active} />}
              </DetailsPanelAnimation>
            </div>
          </details>
        </div>

        {/* Desktop: two-column panels */}
        <div className="mt-6 hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-2 lg:items-stretch">
          <div className={`${cardShell} h-full p-5 sm:p-6`}>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bqa-accent/15">
                <Image
                  src="/images/pollutant-source-Icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="object-contain"
                  unoptimized
                />
              </span>
              <h3 className="font-sans text-base font-bold text-white">Pollutant Source Radar</h3>
            </div>
            <PollutantRadarBody citySnapshot={citySnapshot} />
          </div>

          <div className={`${cardShell} h-full p-5 sm:p-6`}>
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
                <Image
                  src="/images/badge-Icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="object-contain"
                  unoptimized
                />
              </span>
              <h3 className="font-sans text-base font-bold text-white">Who Compliance Scorecard</h3>
            </div>
            <WhoComplianceScorecard />
          </div>
        </div>
      </div>
    </section>
  );
}
