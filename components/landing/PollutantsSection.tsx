"use client";

import { useState } from "react";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import { getPm10Ugm3Level, getPm25Ugm3Level } from "@/lib/air-quality/aqi-levels";
import { AqiBadge, type AqiBadgeVariant } from "./AqiBadge";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

type Pol = {
  accent: string;
  tab: string;
  name: string;
  value: string;
  unit: string;
  fillWidth: string;
  fillClass: string;
  thresholdLeft: string;
  scale: [string, string, string];
  badge: AqiBadgeVariant;
  badgeLabel: string;
  who: string;
};

type PollutantKey = "pm2_5" | "pm10" | "co" | "so2" | "no2" | "o3";

const POLLUTANT_META: Record<
  PollutantKey,
  Omit<Pol, "value" | "fillWidth" | "fillClass" | "thresholdLeft" | "badge" | "badgeLabel"> & {
    unit: string;
    safeLimit: number;
    maxScale: number;
    fallbackValue: number;
  }
> = {
  pm2_5: {
    accent: "#ffd24d",
    tab: "PM2.5",
    name: "Particulate Matter – PM₂.₅",
    unit: "µg/m³",
    safeLimit: 15,
    maxScale: 125,
    fallbackValue: 46,
    scale: ["0", "Safe: 15 µg/m³", "125"],
    who: "WHO SAFE LIMIT: 15 µg/m³",
  },
  pm10: {
    accent: "#ff4d6d",
    tab: "PM10",
    name: "Particulate Matter – PM₁₀",
    unit: "µg/m³",
    safeLimit: 45,
    maxScale: 250,
    fallbackValue: 124,
    scale: ["0", "Safe: 45 µg/m³", "250"],
    who: "WHO SAFE LIMIT: 45 µg/m³",
  },
  co: {
    accent: "#00e5aa",
    tab: "CO",
    name: "Carbon Monoxide (CO)",
    unit: "ppm",
    safeLimit: 700,
    maxScale: 2000,
    fallbackValue: 289,
    scale: ["0", "Safe: 700 ppm", "2000"],
    who: "WHO SAFE LIMIT: 700 ppm",
  },
  so2: {
    accent: "#00e5aa",
    tab: "SO₂",
    name: "Sulfur Dioxide (SO₂)",
    unit: "ppb",
    safeLimit: 20,
    maxScale: 50,
    fallbackValue: 5,
    scale: ["0", "Safe: 20 ppb", "50"],
    who: "WHO SAFE LIMIT: 20 ppb",
  },
  no2: {
    accent: "#00e5aa",
    tab: "NO₂",
    name: "Nitrogen Dioxide (NO₂)",
    unit: "ppb",
    safeLimit: 40,
    maxScale: 200,
    fallbackValue: 18,
    scale: ["0", "Safe: 40 ppb", "200"],
    who: "WHO SAFE LIMIT: 40 ppb",
  },
  o3: {
    accent: "#00e5aa",
    tab: "O₃",
    name: "Ozone (O₃)",
    unit: "ppm",
    safeLimit: 60,
    maxScale: 200,
    fallbackValue: 7,
    scale: ["0", "Safe: 60 ppm", "200"],
    who: "WHO SAFE LIMIT: 60 ppm",
  },
};

const POLLUTANT_ORDER: PollutantKey[] = ["pm2_5", "pm10", "co", "so2", "no2", "o3"];

const FILL_CLASS_BY_VARIANT: Record<AqiBadgeVariant, string> = {
  good: "bg-bqa-good",
  moderate: "bg-bqa-moderate",
  poor: "bg-bqa-poor",
  unhealthy: "bg-bqa-unhealthy",
  severe: "bg-bqa-severe",
  hazardous: "bg-bqa-hazardous",
};

function formatValue(value: number): string {
  if (!Number.isFinite(value)) return "--";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function labelFromVariant(v: AqiBadgeVariant): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function gasBadgeVariant(value: number, safeLimit: number): AqiBadgeVariant {
  if (value <= safeLimit) return "good";
  if (value <= safeLimit * 1.5) return "moderate";
  if (value <= safeLimit * 2.5) return "poor";
  if (value <= safeLimit * 4) return "unhealthy";
  if (value <= safeLimit * 6) return "severe";
  return "hazardous";
}

function buildPollutants(snapshot?: HeroCitySnapshot | null): Pol[] {
  const values = snapshot?.pollutants;

  return POLLUTANT_ORDER.map((key) => {
    const meta = POLLUTANT_META[key];
    const rawValue = values?.[key] ?? meta.fallbackValue;
    const numeric = Number.isFinite(rawValue) ? Number(rawValue) : meta.fallbackValue;
    const fillPct = Math.max(2, Math.min(100, (numeric / meta.maxScale) * 100));
    const thresholdLeft = `${Math.min(100, (meta.safeLimit / meta.maxScale) * 100)}%`;
    let badge: AqiBadgeVariant;

    if (key === "pm2_5") {
      badge = getPm25Ugm3Level(numeric).variant;
    } else if (key === "pm10") {
      badge = getPm10Ugm3Level(numeric).variant;
    } else {
      badge = gasBadgeVariant(numeric, meta.safeLimit);
    }

    return {
      accent: meta.accent,
      tab: meta.tab,
      name: meta.name,
      value: formatValue(numeric),
      unit: meta.unit,
      fillWidth: `${fillPct}%`,
      fillClass: FILL_CLASS_BY_VARIANT[badge],
      thresholdLeft,
      scale: meta.scale,
      badge,
      badgeLabel: labelFromVariant(badge),
      who: meta.who,
    };
  });
}

function PollutantCard({ p }: { p: Pol }) {
  return (
    <div className="group relative cursor-default overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/70 p-5 pb-5 pl-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-sky-400/20 sm:p-6">
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[20px]"
        style={{ background: p.accent }}
        aria-hidden
      />
      <div className="pl-2.5 text-[0.8rem] font-semibold text-bqa-muted">{p.name}</div>
      <div className="pl-2.5 font-sans text-[1.8rem] font-bold text-bqa-text">
        {p.value}{" "}
        <span className="text-[0.75rem] font-normal text-bqa-dim">{p.unit}</span>
      </div>
      <div className="mt-3.5 pl-2.5">
        <div className="relative mb-1.5 h-[7px] rounded bg-bqa-slate2">
          <div
            className={`absolute left-0 top-0 h-full rounded ${p.fillClass}`}
            style={{ width: p.fillWidth }}
          />
          <div
            className="absolute -top-1 bottom-0 w-0.5 rounded-sm bg-white/45"
            style={{ left: p.thresholdLeft }}
          />
        </div>
        <div className="flex justify-between gap-2 text-[0.62rem] text-bqa-dim sm:text-[0.65rem]">
          <span className="shrink-0">{p.scale[0]}</span>
          <span className="min-w-0 text-center">{p.scale[1]}</span>
          <span className="shrink-0">{p.scale[2]}</span>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pl-2.5">
        <AqiBadge variant={p.badge}>{p.badgeLabel}</AqiBadge>
        <span className="max-w-[min(100%,14rem)] text-right text-[0.65rem] text-bqa-dim sm:text-[0.68rem]">
          {p.who}
        </span>
      </div>
    </div>
  );
}

export function PollutantsSection({ citySnapshot = null }: { citySnapshot?: HeroCitySnapshot | null }) {
  const pollutants = buildPollutants(citySnapshot);
  const [sel, setSel] = useState(0);
  const active = pollutants[sel] ?? pollutants[0];

  return (
    <section
      id="sec-pollutants"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionEyebrow>Signal Breakdown</SectionEyebrow>
        <SectionTitle>Raw Pollutant Readings</SectionTitle>

        {/* Mobile / tablet: pill tabs + single card */}
        <div className="lg:hidden">
          <div className="mb-4 flex gap-0 overflow-x-auto rounded-xl border border-sky-400/10 bg-bqa-navy2/50 p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {pollutants.map((p, i) => (
              <button
                key={p.tab}
                type="button"
                onClick={() => setSel(i)}
                className={`shrink-0 rounded-lg px-3.5 py-2 font-sans text-[0.78rem] font-semibold transition-colors ${
                  sel === i
                    ? "bg-bqa-accent text-white shadow-sm"
                    : "text-bqa-muted hover:bg-white/[0.04] hover:text-bqa-text"
                }`}
              >
                {p.tab}
              </button>
            ))}
          </div>
          <PollutantCard p={active} />
        </div>

        <div className="hidden grid-cols-1 gap-[18px] lg:grid lg:grid-cols-3">
          {pollutants.map((p) => (
            <PollutantCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
