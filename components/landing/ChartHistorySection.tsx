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
              font: { size: 11 },
            },
          },
          y: {
            grid: { color: "rgba(61,158,255,0.06)" },
            ticks: { color: "#4a728a", font: { size: 11 } },
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
              <h3 className="mb-1 font-display text-xl text-bqa-text sm:text-2xl">
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

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Min (30D)", "62", "27 Feb 2026", "text-bqa-good"],
              ["Max (30D)", "301", "04 Mar 2026", "text-bqa-unhealthy"],
              ["Avg (30D)", "134", "Moderate band", "text-bqa-moderate"],
              ["Today", "160", "↑ +19 vs yesterday", "text-bqa-poor"],
            ].map(([label, val, note, color]) => (
              <div
                key={label}
                className="rounded-[10px] border border-transparent bg-bqa-slate p-3.5 transition-colors hover:border-sky-400/10"
              >
                <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-wide text-bqa-dim">
                  {label}
                </div>
                <div className={`text-2xl font-bold ${color}`}>{val}</div>
                <div className="mt-0.5 text-sm text-bqa-dim">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
