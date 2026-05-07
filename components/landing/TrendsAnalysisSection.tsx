"use client";

import Image from "next/image";
import { useMemo } from "react";
import { SectionTitle } from "./SectionTitle";

const AQI_LEVELS = [
  { label: "Good (0–50)", color: "#00e5aa" },
  { label: "Moderate (51–100)", color: "#ffd24d" },
  { label: "Poor (101–150)", color: "#ff8c42" },
  { label: "Unhealthy (151–200)", color: "#ff4d6d" },
  { label: "Severe (201–300)", color: "#c77dff" },
  { label: "Hazardous (300+)", color: "#9b2dff" },
];

const COLORS = AQI_LEVELS.map((l) => l.color);

function cellColor(seed: number) {
  return COLORS[seed % COLORS.length];
}

export function TrendsAnalysisSection() {
  const heatmap = useMemo(() => {
    const rows: string[][] = [];
    for (let r = 0; r < 7; r++) {
      const row: string[] = [];
      for (let c = 0; c < 48; c++) {
        row.push(cellColor((r * 53 + c * 17) % 97));
      }
      rows.push(row);
    }
    return rows;
  }, []);

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <section
      id="sec-trends"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionTitle className="mb-8">Trends &amp; Analysis</SectionTitle>

        <div className="mb-6 overflow-hidden rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-5 backdrop-blur-md sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span aria-hidden>📅</span>
            <h3 className="text-lg font-bold text-white">
              Seasonal AQI Calendar
            </h3>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[640px]">
              <div className="mb-1 flex pl-8">
                {monthLabels.map((m) => (
                  <div
                    key={m}
                    className="flex-1 text-center font-mono text-[0.6rem] text-bqa-dim"
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                <div className="flex w-7 shrink-0 flex-col justify-between py-0.5 pr-1 text-right font-mono text-[0.55rem] leading-[10px] text-bqa-dim">
                  <span>Mon</span>
                  <span />
                  <span>Wed</span>
                  <span />
                  <span>Fri</span>
                  <span />
                  <span>Sun</span>
                </div>
                <div className="grid flex-1 grid-rows-7 gap-0.5">
                  {heatmap.map((row, ri) => (
                    <div key={ri} className="flex gap-0.5">
                      {row.map((bg, ci) => (
                        <div
                          key={ci}
                          className="h-2.5 min-w-[6px] flex-1 rounded-sm"
                          style={{ backgroundColor: bg }}
                          title="Daily AQI"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {AQI_LEVELS.map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-[0.7rem] text-bqa-muted"
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[0.75rem] text-bqa-dim">
            • Annual AQI at a glance — hover cells for details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bqa-accent/15" aria-hidden>
                <Image
                  src="/images/pollutant-source-Icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="object-contain"
                  unoptimized
                />
              </span>
              <h3 className="text-lg font-bold text-white">
                Pollutant Source Radar
              </h3>
            </div>
            <div className="mx-auto max-w-[280px]">
              <svg viewBox="0 0 200 200" className="w-full">
                <g stroke="rgba(96,165,250,0.15)" fill="none" strokeWidth="1">
                  <polygon points="100,28 162,67 162,133 100,172 38,133 38,67" />
                  <polygon points="100,40 152,72 152,128 100,160 48,128 48,72" />
                  <polygon points="100,52 142,77 142,123 100,148 58,123 58,77" />
                </g>
                <polygon
                  points="100,52 142,77 138,118 100,142 62,118 58,77"
                  fill="rgba(61,158,255,0.22)"
                  stroke="#3d9eff"
                  strokeWidth="1.5"
                />
                {[
                  [100, 24, "PM2.5"],
                  [158, 70, "PM10"],
                  [156, 132, "O3"],
                  [100, 176, "CO"],
                  [44, 132, "SO2"],
                  [42, 70, "NO2"],
                ].map(([x, y, lab]) => (
                  <text
                    key={lab}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#7da5c9"
                    fontSize="8"
                  >
                    {lab}
                  </text>
                ))}
              </svg>
            </div>
            <p className="mt-2 text-center text-[0.75rem] text-bqa-dim">
              • Shape changes by hour of day
            </p>
          </div>

          <div className="rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-6 backdrop-blur-md">
            <div className="mb-1 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15" aria-hidden>
                <Image
                  src="/images/badge-Icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="object-contain"
                  unoptimized
                />
              </span>
              <h3 className="text-lg font-bold text-white">
                WHO Compliance Scorecard
              </h3>
            </div>
            <p className="mb-4 text-sm text-bqa-dim">Last 30 days · Mumbai</p>
            <div className="mx-auto flex max-w-[220px] flex-col items-center">
              <div
                className="relative h-44 w-44 rounded-full"
                style={{
                  background: `conic-gradient(#c77dff 0deg 60deg, #1a2d4a 60deg 360deg)`,
                }}
              >
                <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-bqa-navy2">
                  <span className="font-mono text-4xl font-black text-purple-400">
                    5
                  </span>
                  <span className="text-sm text-bqa-dim">/ 30</span>
                </div>
              </div>
              <p className="mt-4 text-center font-semibold text-bqa-text">
                5 days within WHO Limits
              </p>
              <p className="text-sm text-bqa-dim">
                25 days over WHO threshold
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-[0.75rem]">
                  <span className="text-teal-400">CPCB Standard</span>
                  <span className="text-bqa-muted">18 Days Safe</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bqa-slate2">
                  <div className="h-full w-[60%] rounded-full bg-teal-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[0.75rem]">
                  <span className="text-purple-400">WHO Guideline</span>
                  <span className="text-bqa-muted">5 Days Safe</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bqa-slate2">
                  <div className="h-full w-[17%] rounded-full bg-purple-500" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[0.75rem] text-bqa-dim">
              • Govt &apos;safe&apos; ≠ WHO &apos;safe&apos; — big gap
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
