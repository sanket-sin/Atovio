"use client";

import { useState } from "react";
import { AqiBadge } from "./AqiBadge";
import {
  AUDIENCE_TABS,
  HEALTH_BY_AUDIENCE,
  type AudienceId,
} from "./health-content";

function GearRowIcon({ index }: { index: number }) {
  const cls = "h-4 w-4 shrink-0 text-purple-300";
  if (index === 0) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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

export function HealthGuidanceSection() {
  const [aud, setAud] = useState<AudienceId>("general");
  const h = HEALTH_BY_AUDIENCE[aud];

  return (
    <section
      id="sec-health"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-display text-[1.65rem] font-normal leading-tight tracking-tight text-bqa-text sm:text-[2rem]">
            Adaptive Health Guidance
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent sm:block"
            aria-hidden
          />
        </div>

        <div className="rounded-[20px] border border-sky-400/10 bg-bqa-navy2/75 p-5 backdrop-blur-md sm:p-7">
          <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {AUDIENCE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAud(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                  aud === t.id
                    ? "border-bqa-accent bg-bqa-accent text-white"
                    : "border-sky-400/10 bg-bqa-slate text-bqa-muted hover:bg-bqa-slate2 hover:text-bqa-text"
                }`}
              >
                <TabIcon id={t.id} />
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2 xl:grid-cols-4">
            {aud === "general" ? (
              <div className="rounded-[14px] border border-sky-400/10 bg-bqa-slate p-5 transition-transform hover:-translate-y-0.5">
                <h4 className="mb-4 text-[0.78rem] font-bold uppercase tracking-wide text-bqa-dim">
                  Indoor vs Outdoor AQI
                </h4>
                <div className="space-y-4 border-b border-sky-400/10 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wide text-emerald-400">
                      <span aria-hidden>⌂</span>
                      Indoors (with purifier)
                    </div>
                    <AqiBadge variant="good" className="shrink-0 text-[0.65rem]">
                      Good
                    </AqiBadge>
                  </div>
                  <div className="font-mono text-5xl font-bold text-emerald-400">
                    38
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wide text-bqa-poor">
                      <span aria-hidden>◇</span>
                      Outdoors (current)
                    </div>
                    <AqiBadge variant="poor" className="shrink-0 text-[0.65rem]">
                      Poor
                    </AqiBadge>
                  </div>
                  <div className="font-mono text-5xl font-bold text-bqa-poor">
                    160
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[14px] border border-sky-400/10 bg-bqa-slate p-5 transition-transform hover:-translate-y-0.5">
                <h4 className="mb-3 text-[0.78rem] font-bold uppercase tracking-wide text-bqa-dim">
                  {h.liveTitle}
                </h4>
                <div className="font-mono text-5xl font-bold text-bqa-poor">
                  160
                </div>
                <AqiBadge variant="poor" className="mt-2">
                  Poor
                </AqiBadge>
                <p className="mt-2.5 text-[0.87rem] leading-relaxed text-bqa-muted">
                  {h.liveNote}
                </p>
              </div>
            )}

            <div className="rounded-[14px] border border-rose-400/20 bg-rose-500/[0.05] p-5 transition-transform hover:-translate-y-0.5">
              <h4 className="mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide text-rose-300">
                <span className="text-amber-400" aria-hidden>
                  ⚠
                </span>
                {h.warnTitle.replace(/^⚠\s*/u, "")}
              </h4>
              <p className="text-[0.87rem] leading-relaxed text-bqa-muted">
                {h.warnBody}
              </p>
            </div>

            <div className="rounded-[14px] border border-sky-400/20 bg-sky-400/[0.05] p-5 transition-transform hover:-translate-y-0.5">
              <h4 className="mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide text-bqa-accent2">
                <span aria-hidden>ℹ</span>
                {h.adviceTitle.replace(/^ℹ\s*/u, "")}
              </h4>
              <p className="text-[0.87rem] leading-relaxed text-bqa-muted">
                {h.adviceBody}
              </p>
            </div>

            <div className="rounded-[14px] border border-purple-400/20 bg-purple-400/[0.05] p-5 transition-transform hover:-translate-y-0.5">
              <h4 className="mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wide text-bqa-compare">
                <svg
                  className="h-4 w-4 shrink-0 text-purple-300"
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
                {h.gearTitle.replace(/^🛡\s*/, "")}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {h.gear.map((g, i) => (
                  <li
                    key={g}
                    className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 text-[0.85rem] text-bqa-muted transition-all hover:border-purple-400/20 hover:bg-purple-400/[0.08]"
                  >
                    <GearRowIcon index={i} />
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
