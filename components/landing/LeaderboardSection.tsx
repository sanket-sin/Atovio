"use client";

import { useMemo, useState } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

type Row = {
  rank: string;
  rankClass: string;
  city: string;
  aqi: string;
  aqiClass: string;
  status: string;
  statusColor: string;
  trend: "up" | "down" | "flat";
  puffPct: number;
  puffVal: string;
  rowBorder: string;
};

const ROWS: Row[] = [
  { rank: "1.", rankClass: "text-amber-400", city: "Gurugram", aqi: "319", aqiClass: "border-purple-400/40 bg-purple-400/10 text-bqa-severe", status: "Severe", statusColor: "text-bqa-severe", trend: "up", puffPct: 72, puffVal: "7.2", rowBorder: "border-l-purple-500" },
  { rank: "2.", rankClass: "text-slate-400", city: "Ahmedabad", aqi: "296", aqiClass: "border-rose-400/40 bg-rose-400/10 text-bqa-unhealthy", status: "Unhealthy", statusColor: "text-bqa-unhealthy", trend: "up", puffPct: 25, puffVal: "2.5", rowBorder: "border-l-rose-500" },
  { rank: "3.", rankClass: "text-amber-700", city: "Hardoi", aqi: "291", aqiClass: "border-rose-400/40 bg-rose-400/10 text-bqa-unhealthy", status: "Unhealthy", statusColor: "text-bqa-unhealthy", trend: "flat", puffPct: 45, puffVal: "4.5", rowBorder: "border-l-rose-500" },
  { rank: "4.", rankClass: "", city: "Bahadurgarh", aqi: "275", aqiClass: "border-rose-400/40 bg-rose-400/10 text-bqa-unhealthy", status: "Unhealthy", statusColor: "text-bqa-unhealthy", trend: "down", puffPct: 27, puffVal: "2.7", rowBorder: "border-l-rose-500" },
  { rank: "5.", rankClass: "", city: "Lucknow", aqi: "212", aqiClass: "border-rose-400/40 bg-rose-400/10 text-bqa-unhealthy", status: "Unhealthy", statusColor: "text-bqa-unhealthy", trend: "flat", puffPct: 34, puffVal: "3.4", rowBorder: "border-l-rose-500" },
  { rank: "6.", rankClass: "", city: "Faridabad", aqi: "200", aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor", status: "Poor", statusColor: "text-bqa-poor", trend: "up", puffPct: 41, puffVal: "4.1", rowBorder: "border-l-orange-500" },
  { rank: "7.", rankClass: "", city: "Greater Noida", aqi: "198", aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor", status: "Poor", statusColor: "text-bqa-poor", trend: "down", puffPct: 12, puffVal: "1.2", rowBorder: "border-l-orange-500" },
  { rank: "8.", rankClass: "", city: "Chhapra", aqi: "194", aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor", status: "Poor", statusColor: "text-bqa-poor", trend: "flat", puffPct: 16, puffVal: "1.6", rowBorder: "border-l-orange-500" },
  { rank: "9.", rankClass: "", city: "Noida", aqi: "178", aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor", status: "Poor", statusColor: "text-bqa-poor", trend: "down", puffPct: 33, puffVal: "3.3", rowBorder: "border-l-orange-500" },
  { rank: "10.", rankClass: "", city: "Bulandshahr", aqi: "171", aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor", status: "Poor", statusColor: "text-bqa-poor", trend: "flat", puffPct: 15, puffVal: "1.5", rowBorder: "border-l-orange-500" },
];

function TrendIcon({ t }: { t: Row["trend"] }) {
  if (t === "up")
    return <span className="text-lg font-extrabold text-bqa-unhealthy">↑</span>;
  if (t === "down")
    return <span className="text-lg font-extrabold text-bqa-good">↓</span>;
  return <span className="text-lg font-extrabold text-bqa-dim">→</span>;
}

export function LeaderboardSection() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ROWS;
    return ROWS.filter((r) => r.city.toLowerCase().includes(s));
  }, [q]);

  return (
    <section
      id="sec-leaderboard"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <SectionEyebrow>Pollution Index · India</SectionEyebrow>
            <SectionTitle className="mb-1">National AQI Leaderboard</SectionTitle>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search here......"
              className="w-full rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-mono text-sm text-bqa-text outline-none focus:border-sky-400/30 sm:w-52"
            />
            <select className="rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 text-sm text-bqa-text">
              <option>All India</option>
              <option>Maharashtra</option>
              <option>Delhi NCR</option>
              <option>UP</option>
            </select>
            <select className="rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 text-sm text-bqa-text">
              <option>Most Polluted</option>
              <option>Cleanest First</option>
              <option>Puff Score</option>
            </select>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-[52px_1fr_96px_110px_80px_1fr] gap-5 px-4 pb-3 text-[0.62rem] font-mono uppercase tracking-widest text-bqa-dim">
            <span>Rank</span>
            <span>City</span>
            <span>AQI</span>
            <span>Status</span>
            <span className="text-center">Trend</span>
            <span>
              Puff Score{" "}
              <span className="cursor-help text-bqa-accent" title="Approximate cigarettes inhaled per day">
                🚬
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {filtered.map((r) => (
            <div
              key={r.city}
              className={`rounded-xl border border-sky-400/10 border-l-4 bg-bqa-navy2/70 p-4 backdrop-blur-sm transition-colors hover:border-sky-400/20 hover:bg-bqa-slate/70 md:grid md:grid-cols-[52px_1fr_96px_110px_80px_1fr] md:items-center md:gap-5 md:px-4 md:py-3.5 ${r.rowBorder}`}
            >
              <span
                className={`font-mono text-base font-extrabold text-bqa-dim ${r.rankClass}`}
              >
                {r.rank}
              </span>
              <span className="font-semibold text-bqa-text">{r.city}</span>
              <div>
                <span
                  className={`inline-flex rounded-lg border px-3.5 py-1 font-mono text-[0.95rem] font-extrabold ${r.aqiClass}`}
                >
                  {r.aqi}
                </span>
              </div>
              <div className={`text-sm font-bold ${r.statusColor}`}>
                {r.status}
              </div>
              <div className="flex justify-center">
                <TrendIcon t={r.trend} />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 max-w-[120px] flex-1 rounded bg-bqa-slate2">
                  <div
                    className="h-full rounded bg-gradient-to-r from-bqa-accent2 to-bqa-accent"
                    style={{ width: `${r.puffPct}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-bold text-bqa-text">
                  {r.puffVal}
                  <span className="text-[0.65rem] font-medium text-bqa-muted">
                    {" "}
                    cigs/day
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-bqa-muted">No cities match.</p>
        )}

        <div className="mt-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <span className="font-mono text-[0.8rem] text-bqa-dim">
            Showing 1–{filtered.length} of {ROWS.length} cities
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {["‹", "1", "2", "3", "···", "17", "›"].map((p, i) => (
              <button
                key={`${p}-${i}`}
                type="button"
                className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-sky-400/10 bg-bqa-slate font-mono text-sm font-semibold text-bqa-muted transition-colors hover:bg-bqa-slate2 hover:text-bqa-text ${
                  p === "1" ? "border-bqa-accent bg-bqa-accent text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
