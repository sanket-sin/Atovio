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

/** Light-mode AQI pill: pale tint + strong border/text (screenshot 2 reference). */
function aqiBadgeSurface(status: string, darkClass: string, isLight: boolean): string {
  const darkFull = `inline-flex rounded-lg border px-3.5 py-1 font-mono text-[0.95rem] font-extrabold ${darkClass}`;
  if (!isLight) return darkFull;
  const shell = "inline-flex rounded-lg border px-3.5 py-1 font-mono text-[0.95rem] font-extrabold";
  if (status === "Severe") return `${shell} border-purple-400 bg-purple-50 text-purple-800`;
  if (status === "Unhealthy") return `${shell} border-rose-500 bg-rose-50 text-rose-700`;
  if (status === "Poor") return `${shell} border-orange-500 bg-orange-50 text-orange-800`;
  return darkFull;
}

/** One shared template: Rank | City | AQI | Status | Trend | Puff (bar + value stay in the last cell — no md:contents split). */
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_72px_88px_40px_minmax(120px,1fr)] items-center gap-x-2.5 gap-y-0 px-3 py-2.5 sm:grid-cols-[52px_minmax(0,1fr)_88px_100px_52px_minmax(130px,1fr)] sm:gap-x-4 sm:px-4 sm:py-3 md:grid-cols-[52px_minmax(0,1fr)_96px_110px_56px_1fr] md:gap-x-5 md:py-3.5";

export function LeaderboardSection({ isLight = false }: { isLight?: boolean }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ROWS;
    return ROWS.filter((r) => r.city.toLowerCase().includes(s));
  }, [q]);

  const cardShell = isLight
    ? "border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.06)] transition-colors hover:border-slate-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]"
    : "border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-sm transition-colors hover:border-sky-400/20 hover:bg-bqa-slate/70";

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

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="min-w-[680px] sm:min-w-0">
            <div
              className={`${ROW_GRID} pb-2.5 text-[0.62rem] font-mono uppercase tracking-widest ${
                isLight ? "text-slate-400" : "text-bqa-dim"
              }`}
            >
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

            <div className="flex flex-col gap-1.5">
              {filtered.map((r) => (
                <div
                  key={r.city}
                  className={`rounded-xl border-l-4 ${r.rowBorder} ${cardShell}`}
                >
                  <div className={ROW_GRID}>
                    <span
                      className={`shrink-0 font-mono text-base font-extrabold tabular-nums ${
                        isLight ? "text-slate-500" : `text-bqa-dim ${r.rankClass}`
                      }`}
                    >
                      {r.rank}
                    </span>
                    <span
                      className={`min-w-0 truncate font-semibold ${
                        isLight ? "font-bold text-slate-900" : "text-bqa-text"
                      }`}
                    >
                      {r.city}
                    </span>
                    <span className={aqiBadgeSurface(r.status, r.aqiClass, isLight)}>{r.aqi}</span>
                    <div className={`text-xs font-bold leading-none sm:text-sm ${r.statusColor}`}>
                      {r.status}
                    </div>
                    <div className="flex justify-center">
                      <TrendIcon t={r.trend} />
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={`h-1.5 min-w-[48px] flex-1 rounded ${
                          isLight ? "bg-slate-200" : "bg-bqa-slate2"
                        }`}
                      >
                        <div
                          className="h-full rounded bg-gradient-to-r from-bqa-accent2 to-bqa-accent"
                          style={{ width: `${r.puffPct}%` }}
                        />
                      </div>
                      <span
                        className={`shrink-0 whitespace-nowrap font-mono text-xs font-bold sm:text-sm ${
                          isLight ? "text-slate-900" : "text-bqa-text"
                        }`}
                      >
                        {r.puffVal}
                        <span
                          className={`text-[0.65rem] font-medium ${isLight ? "text-slate-500" : "text-bqa-muted"}`}
                        >
                          {" "}
                          cigs/day
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 && (
          <button
            type="button"
            className={`mt-3 w-full rounded-lg px-3 py-2 font-outfit text-[0.72rem] font-semibold transition sm:mt-4 md:hidden ${
              isLight
                ? "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                : "bg-bqa-accent text-white shadow-[0_4px_12px_rgba(61,158,255,0.25)] hover:brightness-110"
            }`}
          >
            View Detailed List
          </button>
        )}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-bqa-muted">No cities match.</p>
        )}

        <div className="mt-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <span
            className={`font-mono text-[0.8rem] ${isLight ? "text-slate-500" : "text-bqa-dim"}`}
          >
            Showing 1–{filtered.length} of {ROWS.length} cities
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {["‹", "1", "2", "3", "···", "17", "›"].map((p, i) => (
              <button
                key={`${p}-${i}`}
                type="button"
                className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors ${
                  p === "1"
                    ? "border-bqa-accent bg-bqa-accent text-white hover:brightness-110"
                    : isLight
                      ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      : "border-sky-400/10 bg-bqa-slate text-bqa-muted hover:bg-bqa-slate2 hover:text-bqa-text"
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
