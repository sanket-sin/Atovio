"use client";

import { useState } from "react";
import { SectionTitle } from "./SectionTitle";

const CLOCK_LABELS = [
  "12AM",
  "3AM",
  "6AM",
  "9AM",
  "12PM",
  "3PM",
  "6PM",
  "9PM",
];

export function AirQualityToolkitSection() {
  const [age, setAge] = useState("32");
  const [years, setYears] = useState("10");

  return (
    <section
      id="sec-toolkit"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-8">Your Air Quality Toolkit</SectionTitle>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-6 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-2">
              <span className="text-emerald-400">🕐</span>
              <h3 className="text-lg font-bold text-white">
                Health Exposure Clock
              </h3>
            </div>
            <div className="relative mx-auto aspect-square max-w-[240px]">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    from -90deg,
                    #00e5aa 0deg 45deg,
                    #ffd24d 45deg 90deg,
                    #ff8c42 90deg 135deg,
                    #ff4d6d 135deg 180deg,
                    #c77dff 180deg 225deg,
                    #00e5aa 225deg 270deg,
                    #ffd24d 270deg 315deg,
                    #ff8c42 315deg 360deg
                  )`,
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px + 1px))",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px + 1px))",
                }}
              />
              <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-bqa-navy2">
                <span className="font-mono text-4xl font-black text-white">
                  24
                </span>
                <span className="text-xs text-bqa-dim">hours</span>
              </div>
              {CLOCK_LABELS.map((lb, i) => {
                const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const r = 52;
                const x = 50 + Math.cos(ang) * r;
                const y = 50 + Math.sin(ang) * r;
                return (
                  <span
                    key={lb}
                    className="absolute font-mono text-[0.55rem] text-bqa-dim"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {lb}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-[0.72rem] text-bqa-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Best window
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Worst window
              </span>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[0.8rem] text-emerald-300/90">
              <span>✓</span>
              Best outdoors: 5am–7am (AQI ~52)
            </p>
            <p className="mt-2 flex items-start gap-2 text-[0.8rem] text-rose-300/90">
              <span>✕</span>
              Avoid outdoors: 8am–12pm (AQI ~185)
            </p>
          </div>

          <div className="rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-300">📈</span>
                <h3 className="text-lg font-bold text-white">
                  72-Hours AQI Forecast
                </h3>
              </div>
              <button
                type="button"
                className="rounded-lg border border-sky-400/15 bg-bqa-slate px-2 py-1 text-[0.7rem] font-semibold text-bqa-muted"
              >
                AQI ▾
              </button>
            </div>
            <div className="relative h-[180px] w-full">
              <svg
                viewBox="0 0 320 160"
                className="h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <line
                  x1="0"
                  y1="40"
                  x2="320"
                  y2="40"
                  stroke="rgba(96,165,250,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="80"
                  x2="320"
                  y2="80"
                  stroke="rgba(96,165,250,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="120"
                  x2="320"
                  y2="120"
                  stroke="rgba(96,165,250,0.08)"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="320"
                  y2="100"
                  stroke="rgba(251,146,60,0.25)"
                  strokeDasharray="6 4"
                />
                <line
                  x1="0"
                  y1="60"
                  x2="320"
                  y2="60"
                  stroke="rgba(167,139,250,0.25)"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 10 120 L 50 100 L 90 85 L 130 95 L 170 70 L 210 55 L 250 48 L 290 42 L 310 38"
                  fill="none"
                  stroke="#3d9eff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="8" y="155" fill="#4a728a" fontSize="9">
                  4PM
                </text>
                <text x="140" y="155" fill="#4a728a" fontSize="9">
                  30/03
                </text>
                <text x="260" y="155" fill="#4a728a" fontSize="9">
                  01/04
                </text>
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["Today", "160", "text-purple-400"],
                ["Tomorrow", "110", "text-amber-300"],
                ["+2 Days", "130", "text-rose-300"],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  className="rounded-lg border border-sky-400/10 bg-bqa-slate/50 px-2 py-2 text-center"
                >
                  <div className="text-[0.65rem] text-bqa-dim">{l}</div>
                  <div className={`font-mono text-lg font-bold ${c}`}>{v}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.78rem] text-bqa-dim">
              • Best window tomorrow: 6–7 AM, (AQI 85)
            </p>
          </div>

          <div className="rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-6 backdrop-blur-md">
            <div className="mb-5 flex items-center gap-2">
              <span className="text-purple-400">🚬</span>
              <h3 className="text-lg font-bold text-white">
                Puff Score Lifetime Calculator
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-[0.65rem] text-bqa-dim">
                  Your Age
                </span>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 text-sm text-bqa-text outline-none focus:border-bqa-accent/50"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[0.65rem] text-bqa-dim">
                  City
                </span>
                <select className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 text-sm text-bqa-text outline-none focus:border-bqa-accent/50">
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bengaluru</option>
                </select>
              </label>
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-[0.65rem] text-bqa-dim">
                Years Lived Here
              </span>
              <input
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full rounded-lg border border-sky-400/15 bg-bqa-slate px-3 py-2.5 text-sm text-bqa-text outline-none focus:border-bqa-accent/50"
              />
            </label>
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-bqa-accent py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(61,158,255,0.25)] transition hover:brightness-110"
            >
              Submit
            </button>
            <p className="mt-3 text-center text-[0.72rem] text-bqa-dim">
              • Share your result and raise awareness about air quality
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
