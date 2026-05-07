"use client";

import { useEffect, useMemo, useState } from "react";
import type { MostPollutedCityRow } from "@/lib/api/aqi-most-polluted";
import { fetchMostPollutedLeaderboard } from "@/lib/api/aqi-most-polluted";
import type { AqiLevelVariant } from "@/lib/air-quality/aqi-levels";
import {
  aqiVariantToLeaderboardRowChrome,
  aqiVariantToLightBadgeShell,
  getAqiLevel,
} from "@/lib/air-quality/aqi-levels";
import { AnimatedCigarette } from "./AnimatedCigarette";
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
  levelVariant: AqiLevelVariant;
};

/** Puff bar scale: scores from API are typically under ~5 cigs/day for per-city rows. */
const PUFF_SCORE_BAR_CAP = 5;

function rankLabel(rank: number): { rank: string; rankClass: string } {
  const label = `${rank}.`;
  if (rank === 1) return { rank: label, rankClass: "text-amber-400" };
  if (rank === 2) return { rank: label, rankClass: "text-slate-400" };
  if (rank === 3) return { rank: label, rankClass: "text-amber-700" };
  return { rank: label, rankClass: "" };
}

function apiCityToRow(c: MostPollutedCityRow): Row {
  const rl = rankLabel(c.rank);
  const level = getAqiLevel(c.aqi);
  const styles = aqiVariantToLeaderboardRowChrome(level.variant);
  const puffPct = Math.min(
    100,
    Math.round((Math.min(c.puff_score, PUFF_SCORE_BAR_CAP) / PUFF_SCORE_BAR_CAP) * 100)
  );
  return {
    ...rl,
    ...styles,
    levelVariant: level.variant,
    city: c.city,
    aqi: String(Math.round(c.aqi)),
    status: level.labelUppercase,
    trend: "flat",
    puffPct,
    puffVal: c.puff_score.toFixed(1),
  };
}

function TrendIcon({ t }: { t: Row["trend"] }) {
  if (t === "up")
    return <span className="text-lg font-extrabold text-bqa-unhealthy">↑</span>;
  if (t === "down")
    return <span className="text-lg font-extrabold text-bqa-good">↓</span>;
  return <span className="text-lg font-extrabold text-bqa-dim">→</span>;
}

function aqiBadgeSurface(variant: AqiLevelVariant, darkClass: string, isLight: boolean): string {
  const darkFull = `inline-flex rounded-lg border px-2.5 py-1 font-mono text-[0.95rem] font-extrabold ${darkClass}`;
  if (!isLight) return darkFull;
  return aqiVariantToLightBadgeShell(variant);
}

/** One shared template: Rank | City | AQI | Status | Trend | Puff (bar + value stay in the last cell — no md:contents split). */
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_64px_88px_40px_minmax(120px,1fr)] items-center gap-x-2.5 gap-y-0 px-3 py-2.5 sm:grid-cols-[52px_minmax(0,1fr)_74px_100px_52px_minmax(130px,1fr)] sm:gap-x-4 sm:px-4 sm:py-3 md:grid-cols-[52px_minmax(0,1fr)_82px_110px_56px_1fr] md:gap-x-5 md:py-3.5";

export function LeaderboardSection({ isLight = false }: { isLight?: boolean }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { cities, pagination } = await fetchMostPollutedLeaderboard({ page });
        if (cancelled) return;
        setRows(cities.map(apiCityToRow));
        setTotal(pagination.total);
        setRowPerPage(pagination.rowPerPage);
        setTotalPages(Math.max(1, pagination.totalPages));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load leaderboard.");
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, retryTick]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => r.city.toLowerCase().includes(s));
  }, [rows, q]);

  const rangeStart = total === 0 ? 0 : (page - 1) * rowPerPage + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * rowPerPage, total);

  const pageButtonNums = useMemo(() => {
    const t = totalPages;
    if (t <= 12) return Array.from({ length: t }, (_, i) => i + 1);
    const nums = new Set<number>([1, t, page, page - 1, page + 1].filter((n) => n >= 1 && n <= t));
    return [...nums].sort((a, b) => a - b);
  }, [page, totalPages]);

  const cardShell = isLight
    ? "border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.06)] transition-colors hover:border-slate-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]"
    : "border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-sm transition-colors hover:border-sky-400/20 hover:bg-bqa-slate/70";

  return (
    <section
      id="sec-leaderboard"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
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
              disabled={loading || !!error}
              className="w-full rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-text outline-none focus:border-sky-400/30 disabled:opacity-50 sm:w-52"
            />
            <select
              disabled
              className="cursor-not-allowed rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-muted opacity-70"
              title="Coming soon"
            >
              <option>All India</option>
            </select>
            <select
              disabled
              className="cursor-not-allowed rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-muted opacity-70"
              title="Sorted by most polluted (API)"
            >
              <option>Most Polluted</option>
            </select>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="min-w-[680px] sm:min-w-0">
            <div
              className={`${ROW_GRID} pb-2.5 font-outfit text-[0.78rem] font-semibold uppercase tracking-widest sm:text-[0.85rem] ${
                isLight ? "text-slate-400" : "text-bqa-dim"
              }`}
            >
              <span>Rank</span>
              <span>City</span>
              <span className="text-center">AQI</span>
              <span>Status</span>
              <span className="text-center">Trend</span>
              <span className="inline-flex flex-wrap items-center gap-x-1">
                Puff Score
                <AnimatedCigarette isLight={isLight} className="cursor-help text-bqa-accent" />
              </span>
            </div>

            {loading && (
              <p className={`py-10 text-center font-mono text-sm ${isLight ? "text-slate-500" : "text-bqa-muted"}`}>
                Loading leaderboard…
              </p>
            )}

            {!loading && error && (
              <div className="py-10 text-center">
                <p className={`mb-3 text-sm ${isLight ? "text-rose-700" : "text-rose-300"}`}>{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryTick((t) => t + 1)}
                  className={`rounded-lg px-4 py-2 font-mono text-sm font-semibold ${
                    isLight
                      ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                      : "border border-sky-400/20 bg-bqa-slate text-bqa-text hover:bg-bqa-slate2"
                  }`}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-1.5">
                {filtered.map((r) => (
                  <div
                    key={`${r.rank}-${r.city}`}
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
                      <span
                        className={`${aqiBadgeSurface(r.levelVariant, r.aqiClass, isLight)} aqi-pill-bubble w-fit justify-self-center`}
                      >
                        {r.aqi}
                      </span>
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
            )}
          </div>
        </div>

        {!loading && !error && filtered.length > 0 && (
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

        {!loading && !error && filtered.length === 0 && rows.length > 0 && (
          <p className="py-8 text-center text-bqa-muted">No cities match.</p>
        )}

        {!loading && !error && (
          <div className="mt-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <span
              className={`font-mono text-[0.8rem] ${isLight ? "text-slate-500" : "text-bqa-dim"}`}
            >
              {q.trim()
                ? `Showing ${filtered.length} match${filtered.length === 1 ? "" : "es"} on this page (${rangeStart}–${rangeEnd} of ${total})`
                : `Showing ${rangeStart}–${rangeEnd} of ${total} cities`}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isLight
                    ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    : "border-sky-400/10 bg-bqa-slate text-bqa-muted hover:bg-bqa-slate2 hover:text-bqa-text"
                }`}
              >
                ‹
              </button>
              {pageButtonNums.map((pNum, idx) => {
                const prevNum = pageButtonNums[idx - 1];
                const showGap = idx > 0 && prevNum !== undefined && pNum - prevNum > 1;
                return (
                  <span key={pNum} className="flex items-center gap-1.5">
                    {showGap && (
                      <span className={`px-0.5 font-mono text-sm ${isLight ? "text-slate-400" : "text-bqa-dim"}`}>
                        ···
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors ${
                        pNum === page
                          ? "border-bqa-accent bg-bqa-accent text-white hover:brightness-110"
                          : isLight
                            ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            : "border-sky-400/10 bg-bqa-slate text-bqa-muted hover:bg-bqa-slate2 hover:text-bqa-text"
                      }`}
                    >
                      {pNum}
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isLight
                    ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    : "border-sky-400/10 bg-bqa-slate text-bqa-muted hover:bg-bqa-slate2 hover:text-bqa-text"
                }`}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
