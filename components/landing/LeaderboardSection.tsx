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
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

type Row = {
  rank: string;
  rankClass: string;
  city: string;
  aqi: string;
  aqiClass: string;
  puffVal: string;
  rowBorder: string;
  levelVariant: AqiLevelVariant;
};

function rankLabel(rank: number): { rank: string; rankClass: string } {
  const label = `${rank}.`;
  if (rank === 1) return { rank: label, rankClass: "text-amber-400" };
  if (rank === 2) return { rank: label, rankClass: "text-sky-400" };
  if (rank === 3) return { rank: label, rankClass: "text-orange-500" };
  if (rank === 4) return { rank: label, rankClass: "text-indigo-400" };
  if (rank === 5) return { rank: label, rankClass: "text-sky-300" };
  return { rank: label, rankClass: "" };
}

function apiCityToRow(c: MostPollutedCityRow): Row {
  const rl = rankLabel(c.rank);
  const level = getAqiLevel(c.aqi);
  const styles = aqiVariantToLeaderboardRowChrome(level.variant);
  return {
    ...rl,
    ...styles,
    levelVariant: level.variant,
    city: c.city,
    aqi: String(Math.round(c.aqi)),
    puffVal: c.puff_score.toFixed(1),
  };
}

function aqiBadgeSurface(variant: AqiLevelVariant, darkClass: string, isLight: boolean): string {
  const darkFull = `inline-flex shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[0.95rem] font-extrabold ${darkClass}`;
  if (!isLight) return darkFull;
  return aqiVariantToLightBadgeShell(variant);
}

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
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search here......"
              disabled={loading || !!error}
              className="w-full min-w-0 rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-text outline-none focus:border-sky-400/30 disabled:opacity-50 sm:w-52"
            />
            <select
              disabled
              className="w-full min-w-0 cursor-not-allowed rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-muted opacity-70 sm:w-auto"
              title="Coming soon"
            >
              <option>All India</option>
            </select>
            <select
              disabled
              className="w-full min-w-0 cursor-not-allowed rounded-[10px] border border-sky-400/10 bg-bqa-slate px-3.5 py-2 font-outfit text-sm text-bqa-muted opacity-70 sm:w-auto"
              title="Sorted by most polluted (API)"
            >
              <option>Most Polluted</option>
            </select>
          </div>
        </div>

        <div className="w-full min-w-0">
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
            <div className="flex flex-col gap-2.5">
              {filtered.map((r) => (
                <article
                  key={`${r.rank}-${r.city}`}
                  className={`min-w-0 overflow-hidden rounded-xl border-l-4 ${r.rowBorder} ${cardShell}`}
                >
                  <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <span
                        className={`shrink-0 font-mono text-base font-extrabold tabular-nums sm:text-lg ${
                          isLight ? "text-slate-500" : r.rankClass || "text-bqa-dim"
                        }`}
                      >
                        {r.rank}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate text-base font-bold sm:text-lg ${
                          isLight ? "text-slate-900" : "text-bqa-text"
                        }`}
                      >
                        {r.city}
                      </span>
                      <span className={`${aqiBadgeSurface(r.levelVariant, r.aqiClass, isLight)} aqi-pill-bubble`}>
                        {r.aqi}
                      </span>
                    </div>
                    <div
                      className={`my-2.5 border-t border-dotted sm:my-3 ${
                        isLight ? "border-slate-200" : "border-sky-400/15"
                      }`}
                      aria-hidden
                    />
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <span
                        className={`shrink-0 font-outfit text-[0.68rem] font-semibold uppercase tracking-wider sm:text-xs ${
                          isLight ? "text-slate-500" : "text-bqa-muted"
                        }`}
                      >
                        Puff Score:
                      </span>
                      <span
                        className={`min-w-0 truncate text-right font-mono text-sm font-bold tabular-nums sm:text-base ${
                          isLight ? "text-slate-900" : "text-bqa-text"
                        }`}
                      >
                        {r.puffVal}
                        <span
                          className={`ml-1 text-[0.65rem] font-medium sm:text-xs ${
                            isLight ? "text-slate-500" : "text-bqa-muted"
                          }`}
                        >
                          cigs/day
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

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
