"use client";

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import {
  aqiColor,
  genDays,
  rawData,
} from "./chart-data";
import { registerLandingCharts } from "./chart-register";
import { SectionTitle } from "./SectionTitle";

type ChartType = "bar" | "line";
type Metric = "aqi" | "pm25" | "pm10";

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
              label: (c) =>
                ` ${c.parsed.y} ${metric === "aqi" ? "AQI" : "µg/m³"}`,
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
            ticks: { color: "#4a728a", font: { size: 11, family: "var(--font-outfit), system-ui, sans-serif" } },
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
    <section
      id="sec-chart"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-6">Air Quality History</SectionTitle>

        <div className="overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="mb-1 font-outfit text-xl font-bold tracking-[-0.02em] text-bqa-text sm:text-2xl">
                30-Day AQI Trend
              </h3>
              <p className="text-[0.95rem] text-bqa-muted">
                Mumbai · 1hr avg · Totals Stations: 47
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-[10px] bg-bqa-slate p-0.5">
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  className={`rounded-lg px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors ${
                    chartType === "bar"
                      ? "bg-bqa-slate2 text-bqa-text"
                      : "text-bqa-muted hover:text-bqa-text"
                  }`}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("line")}
                  className={`rounded-lg px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors ${
                    chartType === "line"
                      ? "bg-bqa-slate2 text-bqa-text"
                      : "text-bqa-muted hover:text-bqa-text"
                  }`}
                >
                  Line
                </button>
              </div>
              <select
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 text-[0.8rem] text-bqa-text outline-none focus:border-sky-400/30"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
              </select>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as Metric)}
                className="rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 text-[0.8rem] text-bqa-text outline-none focus:border-sky-400/30"
              >
                <option value="aqi">AQI</option>
                <option value="pm25">PM2.5</option>
                <option value="pm10">PM10</option>
              </select>
            </div>
          </div>

          <div className="relative h-[260px] w-full min-w-0 sm:h-[300px]">
            <canvas ref={canvasRef} className="max-h-full" />
          </div>

          <div className="mt-3.5 flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              ["#00e5aa", "Good (0–50)"],
              ["#ffd24d", "Moderate (51–100)"],
              ["#ff8c42", "Poor (101–150)"],
              ["#ff4d6d", "Unhealthy (151–200)"],
              ["#c77dff", "Severe (201–300)"],
              ["#9b2dff", "Hazardous (300+)"],
            ].map(([c, l]) => (
              <div
                key={l}
                className="flex items-center gap-1.5 text-[0.75rem] text-bqa-muted"
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: c }}
                />
                {l}
              </div>
            ))}
          </div>

          {/* Show More */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="rounded-full border border-bqa-accent/30 bg-bqa-accent/10 px-7 py-2 font-outfit text-sm font-semibold text-bqa-accent transition hover:bg-bqa-accent/20"
            >
              Show More
            </button>
          </div>
        </div>

        {/* ── Pollutant Radar + WHO Scorecard ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Pollutant Source Radar */}
          <div className="rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-6">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bqa-accent/15 text-sm">📊</span>
              <h3 className="font-outfit text-base font-bold text-white">Pollutant Source Radar</h3>
            </div>
            <svg viewBox="0 0 320 285" className="w-full">
              {/* Background hexagons */}
              {[
                "160,70 237.9,115 237.9,205 160,250 82.1,205 82.1,115",
                "160,92.5 218.5,126.3 218.5,193.8 160,227.5 101.5,193.8 101.5,126.3",
                "160,115 199,137.5 199,182.5 160,205 121,182.5 121,137.5",
                "160,137.5 179.5,148.8 179.5,171.3 160,182.5 140.5,171.3 140.5,148.8",
              ].map((pts) => (
                <polygon key={pts} points={pts} fill="none" stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
              ))}

              {/* Axis lines */}
              {[["160","70"],["237.9","115"],["237.9","205"],["160","250"],["82.1","205"],["82.1","115"]].map(([x2,y2]) => (
                <line key={`${x2}${y2}`} x1="160" y1="160" x2={x2} y2={y2} stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
              ))}

              {/* Data polygon — PM2.5, PM10, O3, CO, SO2, NO2 */}
              <polygon
                points="160,95.2 210.7,130.8 199,182.5 160,191.5 127.3,178.9 113.2,133"
                fill="rgba(61,158,255,0.12)"
                stroke="#3d9eff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Data dots */}
              {["160,95.2","210.7,130.8","199,182.5","160,191.5","127.3,178.9","113.2,133"].map((pt) => {
                const [cx, cy] = pt.split(",");
                return <circle key={pt} cx={cx} cy={cy} r="3.5" fill="#3d9eff" />;
              })}

              {/* Axis labels */}
              <text x="160" y="12"  textAnchor="middle" dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>PM 2.5</text>
              <text x="261" y="104" textAnchor="start"  dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>PM 10</text>
              <text x="261" y="218" textAnchor="start"  dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>O3</text>
              <text x="160" y="272" textAnchor="middle" dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>CO</text>
              <text x="59"  y="218" textAnchor="end"    dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>SO2</text>
              <text x="59"  y="104" textAnchor="end"    dominantBaseline="middle" fill="#7da5c9" fontSize="12" style={{ fontFamily: "var(--font-outfit), system-ui" }}>NO2</text>
            </svg>
            <p className="font-outfit text-[0.78rem] text-bqa-dim">• Shape changes by hour of day</p>
          </div>

          {/* WHO Compliance Scorecard */}
          <div className="rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-6">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15 text-sm">🏛️</span>
              <h3 className="font-outfit text-base font-bold text-white">Who Compliance Scorecard</h3>
            </div>
            <p className="mb-4 font-outfit text-[0.8rem] text-bqa-dim">Last 30 days · Mumbai</p>

            {/* Donut: 5/30 days in WHO limits */}
            <div className="flex justify-center">
              <svg viewBox="0 0 180 180" className="w-[160px]">
                {/* Gray background ring */}
                <circle cx="90" cy="90" r="60" fill="none" stroke="#1a2d4a" strokeWidth="14" />
                {/* Purple arc — 5/30 × 360° = 60°, circumference=376.99 */}
                <circle
                  cx="90" cy="90" r="60"
                  fill="none"
                  stroke="#c77dff"
                  strokeWidth="14"
                  strokeDasharray="62.83 376.99"
                  strokeDashoffset="94.25"
                  strokeLinecap="round"
                />
                <text x="90" y="84" textAnchor="middle" dominantBaseline="middle" fill="#c77dff" fontSize="30" fontWeight="bold" style={{ fontFamily: "var(--font-outfit), system-ui" }}>5</text>
                <text x="90" y="105" textAnchor="middle" dominantBaseline="middle" fill="#4a728a" fontSize="11" style={{ fontFamily: "var(--font-outfit), system-ui" }}>/30</text>
              </svg>
            </div>

            <div className="mt-1 text-center">
              <p className="font-outfit text-[1rem] font-bold text-white">5 days within WHO Limits</p>
              <p className="font-outfit text-[0.82rem] text-bqa-dim">25 days over WHO threshold</p>
            </div>

            {/* Progress bars */}
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
          </div>

        </div>
      </div>
    </section>
  );
}
