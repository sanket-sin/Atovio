"use client";

import { useState } from "react";
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

export function RealtimeAqiMapSection() {
  const [metric, setMetric] = useState<(typeof METRICS)[number]>("AQI");
  const [standard, setStandard] = useState<(typeof STANDARDS)[number]>("CPCB");

  return (
    <section
      id="sec-realtime-map"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-6">Real-Time AQI Map</SectionTitle>

        <div className="overflow-hidden rounded-3xl border border-sky-400/10 bg-[#0a0c10] shadow-xl">
          <div className="relative aspect-[16/10] min-h-[320px] w-full sm:min-h-[420px]">
            <iframe
              src="https://map.beyondaqi.in"
              title="BeyondAQI real-time sensor map"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.2] contrast-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bqa-navy/40 via-transparent to-bqa-navy/20" />

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
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between font-mono text-[0.65rem] text-bqa-dim sm:text-xs">
                  {TIMES.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="h-1.5 rounded-full bg-bqa-slate2">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-bqa-accent/50 to-bqa-accent" />
                </div>
              </div>
              <span className="shrink-0 text-right text-xs font-semibold text-bqa-accent2">
                Now Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
