"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { aqiColor, genDays, rawData } from "./chart-data";
import { registerLandingCharts } from "./chart-register";
import { SectionTitle } from "./SectionTitle";

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

/** Legend swatches aligned with mobile reference */
const LEGEND_ITEMS: [string, string][] = [
  ["#70E0A3", "Good (0–50)"],
  ["#F9D250", "Moderate (51–100)"],
  ["#F39C52", "Poor (101–150)"],
  ["#F06262", "Unhealthy (151–200)"],
  ["#A865F8", "Severe (201–300)"],
  ["#8D2AF0", "Hazardous (300+)"],
];

const selectClass =
  "min-h-[2.75rem] min-w-0 flex-1 appearance-none rounded-[10px] border border-sky-400/10 bg-bqa-slate bg-[length:14px] bg-[right_0.65rem_center] bg-no-repeat px-3 py-2 pr-9 text-[0.8rem] text-bqa-text outline-none focus:border-sky-400/30 sm:w-auto sm:min-w-[7.5rem] sm:flex-none";
const selectChevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M4 6l3 3 3-3'/%3E%3C/svg%3E\")";

function PollutantRadarBody() {
  return (
    <>
      <svg viewBox="0 0 320 285" className="w-full">
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
          points="160,95.2 210.7,130.8 199,182.5 160,191.5 127.3,178.9 113.2,133"
          fill="rgba(61,158,255,0.12)"
          stroke="#3d9eff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {["160,95.2", "210.7,130.8", "199,182.5", "160,191.5", "127.3,178.9", "113.2,133"].map((pt) => {
          const [cx, cy] = pt.split(",");
          return <circle key={pt} cx={cx} cy={cy} r="3.5" fill="#3d9eff" />;
        })}

        <text
          x="160"
          y="12"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          PM 2.5
        </text>
        <text
          x="261"
          y="104"
          textAnchor="start"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          PM 10
        </text>
        <text
          x="261"
          y="218"
          textAnchor="start"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          O3
        </text>
        <text
          x="160"
          y="272"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          CO
        </text>
        <text
          x="59"
          y="218"
          textAnchor="end"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          SO2
        </text>
        <text
          x="59"
          y="104"
          textAnchor="end"
          dominantBaseline="middle"
          fill="#7da5c9"
          fontSize="12"
          style={{ fontFamily: "var(--font-outfit), system-ui" }}
        >
          NO2
        </text>
      </svg>
      <p className="mt-2 font-outfit text-[0.78rem] text-bqa-dim">• Shape changes by hour of day</p>
    </>
  );
}

function WhoComplianceBody() {
  return (
    <>
      <p className="mb-4 font-outfit text-[0.8rem] text-bqa-dim">Last 30 days · Mumbai</p>

      <div className="flex justify-center">
        <svg viewBox="0 0 180 180" className="w-[160px]">
          <circle cx="90" cy="90" r="60" fill="none" stroke="#1a2d4a" strokeWidth="14" />
          <circle
            cx="90"
            cy="90"
            r="60"
            fill="none"
            stroke="#c77dff"
            strokeWidth="14"
            strokeDasharray="62.83 376.99"
            strokeDashoffset="94.25"
            strokeLinecap="round"
          />
          <text
            x="90"
            y="84"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c77dff"
            fontSize="30"
            fontWeight="bold"
            style={{ fontFamily: "var(--font-outfit), system-ui" }}
          >
            5
          </text>
          <text
            x="90"
            y="105"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#4a728a"
            fontSize="11"
            style={{ fontFamily: "var(--font-outfit), system-ui" }}
          >
            /30
          </text>
        </svg>
      </div>

      <div className="mt-1 text-center">
        <p className="font-outfit text-[1rem] font-bold text-white">5 days within WHO Limits</p>
        <p className="font-outfit text-[0.82rem] text-bqa-dim">25 days over WHO threshold</p>
      </div>

      <div className="mt-5 space-y-4 rounded-[14px] border border-sky-400/10 bg-bqa-slate/40 p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between font-outfit text-[0.78rem]">
            <span className="text-bqa-muted">CPCB Standard</span>
            <span className="font-semibold text-bqa-good">18 Days Safe</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bqa-navy">
            <div className="h-full rounded-full bg-bqa-good" style={{ width: "60%" }} />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between font-outfit text-[0.78rem]">
            <span className="text-bqa-muted">WHO Guideline</span>
            <span className="font-semibold text-bqa-compare">5 Days Safe</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bqa-navy">
            <div className="h-full rounded-full bg-bqa-compare" style={{ width: "16.7%" }} />
          </div>
        </div>
      </div>
      <p className="mt-3 font-outfit text-[0.78rem] text-bqa-dim">
        • Govt &ldquo;safe&rdquo; ≠ WHO &ldquo;safe&rdquo; — big gap
      </p>
    </>
  );
}

const cardShell = "rounded-2xl border border-sky-400/10 bg-bqa-navy2/75 backdrop-blur-md";

export function ChartHistorySection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [range, setRange] = useState(30);
  const [metric, setMetric] = useState<Metric>("aqi");

  useEffect(() => {
    registerLandingCharts();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    chartRef.current?.destroy();

    const metricData =
      metric === "aqi"
        ? rawData.aqi30
        : metric === "pm25"
          ? rawData.pm25_30
          : rawData.pm10_30;
    const data = metricData.slice(-range);
    const labels = genDays(range);
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
              font: { size: 11, family: "var(--font-outfit), system-ui, sans-serif" },
            },
          },
          y: {
            grid: { color: "rgba(61,158,255,0.06)" },
            ticks: {
              color: "#4a728a",
              font: { size: 11, family: "var(--font-outfit), system-ui, sans-serif" },
            },
          },
        },
        animation: { duration: 600 },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartType, range, metric]);

  return (
    <section id="sec-chart" className="sec-fx border-t border-sky-400/10 py-12 sm:py-14">
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-6 text-left">Air Quality History</SectionTitle>

        {/* Main trend card — layout: header row → controls row → chart → 2×3 legend */}
        <div className="overflow-hidden rounded-[16px] border border-sky-400/10 bg-bqa-navy2/80 p-5 backdrop-blur-md sm:p-7">
          {/* Header: title + meta | Show More */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-outfit text-lg font-bold tracking-[-0.02em] text-bqa-text sm:text-xl md:text-2xl">
                30-Day AQI Trend
              </h3>
              <p className="mt-1 text-[0.85rem] leading-snug text-bqa-muted sm:text-[0.95rem]">
                Mumbai · 1hr avg · Totals Stations: 47
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl bg-bqa-accent px-4 py-2 font-outfit text-[0.78rem] font-semibold text-white shadow-[0_4px_14px_rgba(61,158,255,0.35)] transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Show More
            </button>
          </div>

          {/* Controls: Line/Bar + range + metric */}
          <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
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
              onChange={(e) => setRange(Number(e.target.value))}
              style={{ backgroundImage: selectChevronBg }}
              className={selectClass}
              aria-label="Date range"
            >
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
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

          <div className="mt-6 border-t border-sky-400/10 pt-5">
            <div className="relative h-[260px] w-full min-w-0 sm:h-[300px]">
              <canvas ref={canvasRef} className="max-h-full" />
            </div>
          </div>

          <div className="mx-auto mt-5 grid max-w-[22rem] grid-cols-3 gap-x-4 gap-y-3 text-[0.72rem] text-bqa-muted sm:max-w-none">
            {LEGEND_ITEMS.map(([c, l]) => (
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
                <span className="truncate font-outfit text-[0.95rem] font-bold text-white">
                  Pollutant Source Radar
                </span>
              </div>
              <ChevronDown className="history-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <PollutantRadarBody />
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
                <span className="truncate font-outfit text-[0.95rem] font-bold text-white">
                  Who Compliance Scorecard
                </span>
              </div>
              <ChevronDown className="history-details-chevron" />
            </summary>
            <div className="border-t border-sky-400/10 px-5 pb-5 pt-4">
              <WhoComplianceBody />
            </div>
          </details>
        </div>

        {/* Desktop: two-column panels */}
        <div className="mt-6 hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
          <div className={`${cardShell} p-5 sm:p-6`}>
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
              <h3 className="font-outfit text-base font-bold text-white">Pollutant Source Radar</h3>
            </div>
            <PollutantRadarBody />
          </div>

          <div className={`${cardShell} p-5 sm:p-6`}>
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
              <h3 className="font-outfit text-base font-bold text-white">Who Compliance Scorecard</h3>
            </div>
            <WhoComplianceBody />
          </div>
        </div>
      </div>
    </section>
  );
}
