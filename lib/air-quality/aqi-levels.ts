/**
 * Central BeyondAQI air-quality bands: labels, numeric ranges, theme colors, and Tailwind classes.
 *
 * **Overall AQI** uses National AQI–style breakpoints (product legend):
 * Good 0–50, Moderate 51–100, Poor 101–150, Unhealthy 151–200, Severe 201–300, Hazardous 301+.
 *
 * **PM2.5 / PM10** use the same µg/m³ thresholds already shipped in the app (badges + hero cards).
 */

export type AqiLevelVariant =
  | "good"
  | "moderate"
  | "poor"
  | "unhealthy"
  | "severe"
  | "hazardous";

const COLOR_HEX: Record<AqiLevelVariant, string> = {
  good: "#00e5aa",
  moderate: "#ffd24d",
  poor: "#ff8c42",
  unhealthy: "#ff4d6d",
  severe: "#c77dff",
  hazardous: "#9b2dff",
};

const TEXT_CLASS: Record<AqiLevelVariant, string> = {
  good: "text-bqa-good",
  moderate: "text-bqa-moderate",
  poor: "text-bqa-poor",
  unhealthy: "text-bqa-unhealthy",
  severe: "text-bqa-severe",
  hazardous: "text-bqa-hazardous",
};

/** API `aqi_scale` 1–6 → variant (same order as legend). */
const SCALE_INDEX_TO_VARIANT: readonly AqiLevelVariant[] = [
  "good",
  "moderate",
  "poor",
  "unhealthy",
  "severe",
  "hazardous",
];

export type AqiNumericBand = {
  variant: AqiLevelVariant;
  /** Title case, e.g. "Moderate" */
  label: string;
  minInclusive: number;
  /** Inclusive upper bound; `null` means no upper limit (Hazardous 301+). */
  maxInclusive: number | null;
};

export type AqiLevelResolved = AqiNumericBand & {
  colorHex: string;
  textClass: string;
  /** e.g. "MODERATE" for status chips */
  labelUppercase: string;
  /** e.g. "51–100" or "301+" */
  rangeLabel: string;
};

function formatRangeLabel(min: number, max: number | null): string {
  if (max === null) return `${min}+`;
  if (min === max) return String(min);
  return `${min}–${max}`;
}

function formatLegendLabel(band: AqiNumericBand): string {
  return `${band.label} (${formatRangeLabel(band.minInclusive, band.maxInclusive)})`;
}

function resolveBand(band: AqiNumericBand): AqiLevelResolved {
  return {
    ...band,
    colorHex: COLOR_HEX[band.variant],
    textClass: TEXT_CLASS[band.variant],
    labelUppercase: band.label.toUpperCase(),
    rangeLabel: formatRangeLabel(band.minInclusive, band.maxInclusive),
  };
}

/** Overall AQI (index) — matches dashboard legend / screenshot 3. */
export const BEYONDAQI_AQI_BANDS: readonly AqiNumericBand[] = [
  { variant: "good", label: "Good", minInclusive: 0, maxInclusive: 50 },
  { variant: "moderate", label: "Moderate", minInclusive: 51, maxInclusive: 100 },
  { variant: "poor", label: "Poor", minInclusive: 101, maxInclusive: 150 },
  { variant: "unhealthy", label: "Unhealthy", minInclusive: 151, maxInclusive: 200 },
  { variant: "severe", label: "Severe", minInclusive: 201, maxInclusive: 299 },
  { variant: "hazardous", label: "Hazardous", minInclusive: 300, maxInclusive: null },
] as const;

/** PM2.5 µg/m³ — matches existing hero / badge behaviour (e.g. 62 → Poor). */
export const BEYONDAQI_PM25_UGM3_BANDS: readonly AqiNumericBand[] = [
  { variant: "good", label: "Good", minInclusive: 0, maxInclusive: 30 },
  { variant: "moderate", label: "Moderate", minInclusive: 31, maxInclusive: 60 },
  { variant: "poor", label: "Poor", minInclusive: 61, maxInclusive: 90 },
  { variant: "unhealthy", label: "Unhealthy", minInclusive: 91, maxInclusive: 120 },
  { variant: "severe", label: "Severe", minInclusive: 121, maxInclusive: 250 },
  { variant: "hazardous", label: "Hazardous", minInclusive: 251, maxInclusive: null },
] as const;

/** PM10 µg/m³ — matches existing hero / badge behaviour (e.g. 113 → Poor). */
export const BEYONDAQI_PM10_UGM3_BANDS: readonly AqiNumericBand[] = [
  { variant: "good", label: "Good", minInclusive: 0, maxInclusive: 50 },
  { variant: "moderate", label: "Moderate", minInclusive: 51, maxInclusive: 100 },
  { variant: "poor", label: "Poor", minInclusive: 101, maxInclusive: 250 },
  { variant: "unhealthy", label: "Unhealthy", minInclusive: 251, maxInclusive: 350 },
  { variant: "severe", label: "Severe", minInclusive: 351, maxInclusive: 430 },
  { variant: "hazardous", label: "Hazardous", minInclusive: 431, maxInclusive: null },
] as const;

function pickBand(bands: readonly AqiNumericBand[], value: number): AqiNumericBand {
  const v = Number.isFinite(value) ? Math.max(0, value) : 0;
  for (const b of bands) {
    if (b.maxInclusive === null) {
      if (v >= b.minInclusive) return b;
    } else if (v >= b.minInclusive && v <= b.maxInclusive) {
      return b;
    }
  }
  return bands[bands.length - 1]!;
}

export function getAqiLevel(aqi: number): AqiLevelResolved {
  return resolveBand(pickBand(BEYONDAQI_AQI_BANDS, aqi));
}

export function getPm25Ugm3Level(ugPerM3: number): AqiLevelResolved {
  return resolveBand(pickBand(BEYONDAQI_PM25_UGM3_BANDS, ugPerM3));
}

export function getPm10Ugm3Level(ugPerM3: number): AqiLevelResolved {
  return resolveBand(pickBand(BEYONDAQI_PM10_UGM3_BANDS, ugPerM3));
}

export function aqiLevelToTextClass(variant: AqiLevelVariant): string {
  return TEXT_CLASS[variant];
}

export function aqiLevelToColorHex(variant: AqiLevelVariant): string {
  return COLOR_HEX[variant];
}

/** Hex color for an overall AQI reading (charts, canvas, etc.). */
export function aqiIndexToColorHex(aqi: number): string {
  return getAqiLevel(aqi).colorHex;
}

/**
 * Most-polluted API returns `aqi_scale` 1…6. Map to the same Tailwind classes as numeric AQI.
 */
export function aqiScaleToTextClass(scale: number): string {
  const idx = Math.min(6, Math.max(1, Math.round(scale))) - 1;
  return aqiLevelToTextClass(SCALE_INDEX_TO_VARIANT[idx]!);
}

/** Leaderboard row accent — matches existing Tailwind treatment per category. */
export function aqiVariantToLeaderboardRowChrome(variant: AqiLevelVariant): {
  aqiClass: string;
  statusColor: string;
  rowBorder: string;
} {
  switch (variant) {
    case "hazardous":
      return {
        aqiClass: "border-fuchsia-400/40 bg-fuchsia-400/10 text-bqa-hazardous",
        statusColor: "text-bqa-hazardous",
        rowBorder: "border-l-fuchsia-500",
      };
    case "severe":
      return {
        aqiClass: "border-purple-400/40 bg-purple-400/10 text-bqa-severe",
        statusColor: "text-bqa-severe",
        rowBorder: "border-l-purple-500",
      };
    case "unhealthy":
      return {
        aqiClass: "border-rose-400/40 bg-rose-400/10 text-bqa-unhealthy",
        statusColor: "text-bqa-unhealthy",
        rowBorder: "border-l-rose-500",
      };
    case "poor":
      return {
        aqiClass: "border-orange-400/40 bg-orange-400/10 text-bqa-poor",
        statusColor: "text-bqa-poor",
        rowBorder: "border-l-orange-500",
      };
    case "moderate":
      return {
        aqiClass: "border-amber-400/40 bg-amber-400/10 text-bqa-moderate",
        statusColor: "text-bqa-moderate",
        rowBorder: "border-l-amber-500",
      };
    case "good":
      return {
        aqiClass: "border-emerald-400/40 bg-emerald-400/10 text-bqa-good",
        statusColor: "text-bqa-good",
        rowBorder: "border-l-emerald-500",
      };
  }
}

/** Light-mode AQI pill surface (Leaderboard). */
export function aqiVariantToLightBadgeShell(variant: AqiLevelVariant): string {
  const shell =
    "inline-flex rounded-lg border px-2.5 py-1 font-sans text-[0.95rem] font-extrabold";
  switch (variant) {
    case "hazardous":
      return `${shell} border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900`;
    case "severe":
      return `${shell} border-purple-400 bg-purple-50 text-purple-800`;
    case "unhealthy":
      return `${shell} border-rose-500 bg-rose-50 text-rose-700`;
    case "poor":
      return `${shell} border-orange-500 bg-orange-50 text-orange-800`;
    case "moderate":
      return `${shell} border-amber-500 bg-amber-50 text-amber-900`;
    case "good":
      return `${shell} border-emerald-500 bg-emerald-50 text-emerald-900`;
  }
}

/** Full-bleed hero backgrounds keyed by overall AQI band. */
export const AQI_HERO_BACKGROUNDS: Record<AqiLevelVariant, string> = {
  good: "/images/goodAQIs.svg",
  moderate: "/images/moderateAQIs.svg",
  poor: "/images/poorAQIs.svg",
  unhealthy: "/images/unhealthyAQIs.svg",
  severe: "/images/severeAQIs.svg",
  hazardous: "/images/hazardousAQIs.svg",
};

export function aqiVariantToHeroBackground(variant: AqiLevelVariant): string {
  return AQI_HERO_BACKGROUNDS[variant];
}

/** Legend rows for charts / heatmaps: `[hex, "Good (0–50)"]` etc. */
export const AQI_LEGEND_CHART_TUPLES: [string, string][] = BEYONDAQI_AQI_BANDS.map((b) => [
  COLOR_HEX[b.variant],
  formatLegendLabel(b),
]);

/** `{ label, color }[]` for sections that need objects. */
export const AQI_LEGEND_ITEMS: { label: string; color: string }[] = BEYONDAQI_AQI_BANDS.map(
  (b) => ({
    label: formatLegendLabel(b),
    color: COLOR_HEX[b.variant],
  })
);
