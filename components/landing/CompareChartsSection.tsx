"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { prevAqi30, prevPm25, rawData } from "./chart-data";
import { registerLandingCharts } from "./chart-register";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

const labels = Array.from({ length: 30 }, (_, i) => `D${i + 1}`);

export function CompareChartsSection() {
  const lineRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<Chart[]>([]);

  useEffect(() => {
    registerLandingCharts();
    const lineCtx = lineRef.current?.getContext("2d");
    const barCtx = barRef.current?.getContext("2d");
    if (!lineCtx || !barCtx) return;

    charts.current.forEach((c) => c.destroy());
    charts.current = [];

    charts.current.push(
      new Chart(lineCtx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Current 30D",
              data: rawData.aqi30,
              borderColor: "#3d9eff",
              backgroundColor: "rgba(61,158,255,0.08)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: "Prev 30D",
              data: prevAqi30,
              borderColor: "#a78bfa",
              backgroundColor: "rgba(167,139,250,0.05)",
              borderDash: [5, 4],
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
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
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(61,158,255,0.06)" },
              ticks: { color: "#4a728a", maxTicksLimit: 8, font: { size: 9 } },
            },
            y: {
              grid: { color: "rgba(61,158,255,0.06)" },
              ticks: { color: "#4a728a", font: { size: 10 } },
            },
          },
        },
      })
    );

    charts.current.push(
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Current",
              data: rawData.pm25_30,
              backgroundColor: "rgba(255,140,66,0.75)",
              borderRadius: 3,
            },
            {
              label: "Previous",
              data: prevPm25,
              backgroundColor: "rgba(167,139,250,0.5)",
              borderRadius: 3,
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
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(61,158,255,0.06)" },
              ticks: { color: "#4a728a", maxTicksLimit: 8, font: { size: 9 } },
            },
            y: {
              grid: { color: "rgba(61,158,255,0.06)" },
              ticks: { color: "#4a728a", font: { size: 10 } },
            },
          },
        },
      })
    );

    return () => {
      charts.current.forEach((c) => c.destroy());
      charts.current = [];
    };
  }, []);

  return (
    <section
      id="sec-compare"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionEyebrow>Period Comparison</SectionEyebrow>
        <SectionTitle>30-Day AQI vs. Previous 30 Days</SectionTitle>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-7">
            <h3 className="mb-1 font-display text-2xl text-bqa-text">
              AQI Trend Overlay
            </h3>
            <p className="mb-4 text-sm text-bqa-muted">
              Mar 17 – Feb 15 vs. Feb 14 – Jan 15
            </p>
            <div className="mb-4 flex flex-wrap gap-4 text-[0.8rem] text-bqa-muted">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded bg-bqa-accent" />
                Current 30 days
              </span>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded bg-bqa-compare opacity-70" />
                Previous 30 days
              </span>
            </div>
            <div className="relative h-[260px] w-full sm:h-[300px]">
              <canvas ref={lineRef} />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-7">
            <h3 className="mb-1 font-display text-2xl text-bqa-text">
              PM₂.₅ Period Comparison
            </h3>
            <p className="mb-4 text-sm text-bqa-muted">
              Daily avg µg/m³ — current vs. previous period
            </p>
            <div className="mb-4 flex flex-wrap gap-4 text-[0.8rem] text-bqa-muted">
              <span className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-sm bg-bqa-poor" />
                Current 30 days
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-sm bg-bqa-compare opacity-70" />
                Previous 30 days
              </span>
            </div>
            <div className="relative h-[260px] w-full sm:h-[300px]">
              <canvas ref={barRef} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Avg AQI — Current", "134", "↑ +18 vs prev period", "border-l-rose-500"],
            ["Avg AQI — Previous", "116", "— baseline", "border-l-sky-500"],
            ["Bad Air Days (AQI > 150)", "12 days", "↑ +4 days vs prev", "border-l-rose-500"],
            ["Good Days (AQI ≤ 100)", "6 days", "↓ −3 days vs prev", "border-l-emerald-500"],
            ["Peak 5-day avg", "248", "↑ +61 vs prev peak", "border-l-rose-500"],
            ["Avg PM₂.₅ — Current", "49 µg/m³", "↑ +9 µg/m³ vs prev", "border-l-rose-500"],
          ].map(([label, val, delta, border]) => (
            <div
              key={label}
              className={`rounded-[10px] border-l-[3px] bg-bqa-slate p-3.5 ${border}`}
            >
              <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-wide text-bqa-dim">
                {label}
              </div>
              <div className="text-xl font-bold text-bqa-text">{val}</div>
              <div
                className={`mt-1 text-sm font-bold ${
                  delta.startsWith("↑")
                    ? "text-bqa-unhealthy"
                    : delta.startsWith("↓")
                      ? "text-bqa-good"
                      : "text-bqa-dim"
                }`}
              >
                {delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
