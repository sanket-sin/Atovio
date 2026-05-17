"use client";

import { useState } from "react";
import { AqiBadge } from "./AqiBadge";
import {
  AUDIENCE_TABS,
  HEALTH_BY_AUDIENCE,
  type AudienceId,
} from "./health-content";

function GearRowIcon({ index, isLight }: { index: number; isLight: boolean }) {
  const cls = `h-4 w-4 shrink-0 ${isLight ? "text-purple-600" : "text-purple-300"}`;
  if (index === 0) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <ellipse cx="12" cy="14" rx="5" ry="3.25" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 13.5L5 15.5M17 13.5L19 15.5"
        />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function OutdoorCrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeWidth={2}
        d="M12 3v3M12 18v3M3 12h3M18 12h3"
      />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-bqa-muted opacity-90 transition-transform duration-200 ${className}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function TabIcon({ id }: { id: AudienceId }) {
  const cls = "h-4 w-4 shrink-0";
  switch (id) {
    case "general":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case "children":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    case "athletes":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      );
  }
}

function GearShieldIcon({ isLight }: { isLight: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${isLight ? "text-purple-600" : "text-purple-300"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

export function HealthGuidanceSection({ isLight = false }: { isLight?: boolean }) {
  const [aud, setAud] = useState<AudienceId>("general");
  const h = HEALTH_BY_AUDIENCE[aud];

  const bodyText = isLight ? "text-slate-600" : "text-white/90";
  const outdoorLabel = isLight ? "text-slate-600" : "text-white";
  const outdoorSub = isLight ? "text-slate-600" : "text-sky-300";

  const tabInactive = isLight
    ? "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
    : "border-sky-400/10 bg-bqa-slate text-sky-400/55 hover:bg-bqa-slate2 hover:text-sky-300/90";

  return (
    <section
      id="sec-health"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-outfit text-[1.65rem] font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:text-[2rem]">
            Adaptive Health Guidance
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent sm:block"
            aria-hidden
          />
        </div>

        <div className="rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-7">
          <div className="mb-6 grid grid-cols-2 gap-2 lg:flex lg:flex-wrap">
            {AUDIENCE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAud(t.id)}
                className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-[0.78rem] font-semibold transition-colors sm:px-4 sm:text-[0.82rem] lg:shrink-0 lg:justify-start ${
                  aud === t.id
                    ? "border-bqa-accent bg-bqa-accent text-white"
                    : tabInactive
                }`}
              >
                <TabIcon id={t.id} />
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile: compact AQI + accordions */}
          <div className="flex flex-col gap-3 lg:hidden">
            <div className="rounded-[14px] border border-sky-400/15 bg-bqa-slate p-4 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.06)]">
              <h4 className={`mb-3 text-[0.72rem] font-bold uppercase tracking-wide ${outdoorLabel}`}>
                Outdoor AQI
              </h4>
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex min-w-0 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-wide ${outdoorSub}`}
                >
                  <OutdoorCrosshairIcon className="h-4 w-4 shrink-0 text-bqa-poor" />
                  <span className="truncate">Outdoors (current)</span>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={`font-outfit text-[2.35rem] font-bold leading-none text-bqa-poor ${
                      isLight ? "" : "drop-shadow-[0_0_20px_rgba(255,140,66,0.3)]"
                    }`}
                  >
                    160
                  </span>
                  <AqiBadge variant="poor" className="text-[0.62rem]">
                    Poor
                  </AqiBadge>
                </div>
              </div>
            </div>

            <details className="overflow-hidden rounded-[14px] border border-rose-400/25 bg-rose-500/[0.06] shadow-[inset_0_0_32px_rgba(244,63,94,0.06)] open:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <h4
                  className={`flex min-w-0 items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wide ${
                    isLight ? "text-rose-600" : "text-rose-300"
                  }`}
                >
                  <span className={isLight ? "text-rose-500" : "text-amber-400"} aria-hidden>
                    ⚠
                  </span>
                  <span className="truncate">{h.warnTitle.replace(/^⚠\s*/u, "")}</span>
                </h4>
                <ChevronDown className="health-details-chevron" />
              </summary>
              <div className="border-t border-rose-400/15 px-4 pb-4 pt-3">
                <p className={`text-[0.85rem] leading-relaxed ${bodyText}`}>{h.warnBody}</p>
              </div>
            </details>

            <details className="overflow-hidden rounded-[14px] border border-sky-400/25 bg-sky-400/[0.06] shadow-[inset_0_0_32px_rgba(56,189,248,0.08)] open:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <h4
                  className={`flex min-w-0 items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wide ${
                    isLight ? "text-sky-600" : "text-bqa-accent2"
                  }`}
                >
                  <span aria-hidden>ℹ</span>
                  <span className="truncate">{h.adviceTitle.replace(/^ℹ\s*/u, "")}</span>
                </h4>
                <ChevronDown className="health-details-chevron" />
              </summary>
              <div className="border-t border-sky-400/15 px-4 pb-4 pt-3">
                <p className={`text-[0.85rem] leading-relaxed ${bodyText}`}>{h.adviceBody}</p>
              </div>
            </details>

            <details className="overflow-hidden rounded-[14px] border border-purple-400/25 bg-purple-400/[0.06] shadow-[inset_0_0_32px_rgba(192,132,252,0.08)] open:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <h4
                  className={`flex min-w-0 items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wide ${
                    isLight ? "text-purple-600" : "text-bqa-compare"
                  }`}
                >
                  <GearShieldIcon isLight={isLight} />
                  <span className="truncate">{h.gearTitle.replace(/^🛡\uFE0F?\s*/, "")}</span>
                </h4>
                <ChevronDown className="health-details-chevron" />
              </summary>
              <div className="border-t border-purple-400/15 px-4 pb-4 pt-3">
                <ul className="flex flex-col gap-2">
                  {h.gear.map((g, i) => (
                    <li
                      key={g}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.85rem] ${
                        isLight
                          ? "border border-slate-200/90 bg-white text-purple-700"
                          : "border border-white/[0.06] bg-bqa-navy2/80 text-white/85"
                      }`}
                    >
                      <GearRowIcon index={i} isLight={isLight} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          {/* Desktop: four-column expanded cards */}
          <div className="hidden grid-cols-1 gap-[18px] lg:grid lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[14px] border border-sky-400/15 bg-bqa-slate p-5 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.06)] transition-transform hover:-translate-y-0.5">
              <h4 className={`mb-4 text-[0.78rem] font-bold uppercase tracking-wide ${outdoorLabel}`}>
                Outdoor AQI
              </h4>
              <div
                className={`mb-4 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wide ${outdoorSub}`}
              >
                <OutdoorCrosshairIcon className="h-4 w-4 shrink-0 text-bqa-poor" />
                Outdoors (current)
              </div>
              <div
                className={`font-outfit text-5xl font-bold leading-none text-bqa-poor ${
                  isLight ? "" : "drop-shadow-[0_0_28px_rgba(255,140,66,0.35)]"
                }`}
              >
                160
              </div>
              <div className="mt-4">
                <AqiBadge variant="poor" className="text-[0.65rem]">
                  Poor
                </AqiBadge>
              </div>
            </div>

            <div className="rounded-[14px] border border-rose-400/25 bg-rose-500/[0.06] p-5 shadow-[inset_0_0_32px_rgba(244,63,94,0.06)] transition-transform hover:-translate-y-0.5">
              <h4
                className={`mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide ${
                  isLight ? "text-rose-600" : "text-rose-300"
                }`}
              >
                <span className={isLight ? "text-rose-500" : "text-amber-400"} aria-hidden>
                  ⚠
                </span>
                {h.warnTitle.replace(/^⚠\s*/u, "")}
              </h4>
              <p className={`text-[0.87rem] leading-relaxed ${bodyText}`}>{h.warnBody}</p>
            </div>

            <div className="rounded-[14px] border border-sky-400/25 bg-sky-400/[0.06] p-5 shadow-[inset_0_0_32px_rgba(56,189,248,0.08)] transition-transform hover:-translate-y-0.5">
              <h4
                className={`mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide ${
                  isLight ? "text-sky-600" : "text-bqa-accent2"
                }`}
              >
                <span aria-hidden>ℹ</span>
                {h.adviceTitle.replace(/^ℹ\s*/u, "")}
              </h4>
              <p className={`text-[0.87rem] leading-relaxed ${bodyText}`}>{h.adviceBody}</p>
            </div>

            <div className="rounded-[14px] border border-purple-400/25 bg-purple-400/[0.06] p-5 shadow-[inset_0_0_32px_rgba(192,132,252,0.08)] transition-transform hover:-translate-y-0.5">
              <h4
                className={`mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide ${
                  isLight ? "text-purple-600" : "text-bqa-compare"
                }`}
              >
                <GearShieldIcon isLight={isLight} />
                {h.gearTitle.replace(/^🛡\uFE0F?\s*/, "")}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {h.gear.map((g, i) => (
                  <li
                    key={g}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.85rem] transition-all ${
                      isLight
                        ? "border border-slate-200/90 bg-white text-purple-700 shadow-sm hover:border-purple-300/80 hover:bg-purple-50/80"
                        : "border border-white/[0.06] bg-bqa-navy2/80 text-white/85 hover:border-purple-400/25 hover:bg-purple-400/[0.08]"
                    }`}
                  >
                    <GearRowIcon index={i} isLight={isLight} />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
