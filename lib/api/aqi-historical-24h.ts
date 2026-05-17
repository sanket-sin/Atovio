import axios from "axios";
import { BEYONDAQI_API_BASE, beyondaqiRequestHeaders } from "@/lib/config/beyondaqi-api";
import { encodeAqiPathSegments, slugToAqiPath } from "@/lib/api/aqi-city";

export type ExposureClockWindow = {
  startHour: number;
  endHour: number;
  avgAqi: number;
};

export type ExposureClockModel = {
  segmentColors: string[];
  best: ExposureClockWindow;
  worst: ExposureClockWindow;
};

/** Single row in `data.data` — BeyondAQI 24h historical (AQI filter). */
export type Historical24hSampleRow = {
  time: string;
  datetime: string;
  location: { city: string; state: string; country: string };
  aqi: number;
  aqi_scale: number;
  aqi_status: string;
  pollutants: {
    co: number;
    no: number;
    o3: number;
    nh3: number;
    no2: number;
    so2: number;
    pm10: number;
    pm2_5: number;
  };
};

/** Inner `data` object on success. */
export type Historical24hPayload = {
  location: { country: string; state: string; city: string };
  period: string;
  filter: { type: string };
  data: Historical24hSampleRow[];
  summary: {
    min: { value: number };
    max: { value: number };
    average: number;
  };
};

/** Top-level BeyondAQI JSON for `GET …/historical/…/24hour`. */
export type Historical24hApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: Historical24hPayload;
  error: unknown;
};

function utcIsoToIstHourAndDate(iso: string): { hour: number; dateKey: string; t: number } {
  const d = new Date(iso);
  const hour = parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(d),
    10
  );
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return { hour, dateKey, t: d.getTime() };
}

/** Linear blend between hex colors `a` and `b`, t in [0,1]. */
function lerpHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 0xff,
    ag = (pa >> 8) & 0xff,
    ab = pa & 0xff;
  const br = (pb >> 16) & 0xff,
    bg = (pb >> 8) & 0xff,
    bb = pb & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  const n = (r << 16) | (g << 8) | bl;
  return `#${n.toString(16).padStart(6, "0")}`;
}

/**
 * India AQI–style clock colors (smooth ramp): good → hazardous.
 * Stops at 0, 50, 100, 200, 300, 500.
 */
export function aqiToClockSegmentColor(aqi: number): string {
  const x = Math.max(0, Math.min(500, aqi));
  const stops: [number, string][] = [
    [0, "#00e5aa"],
    [50, "#a3e635"],
    [100, "#ffd24d"],
    [200, "#f97316"],
    [300, "#fb7185"],
    [500, "#a855f7"],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, c0] = stops[i];
    const [x1, c1] = stops[i + 1];
    if (x <= x1) {
      const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      return lerpHex(c0, c1, t);
    }
  }
  return stops[stops.length - 1][1];
}

/** Circular interpolation between sparse hourly samples (hours 0–23). */
function interpolate24Ring(points: [number, number][]): number[] {
  if (points.length === 0) return Array.from({ length: 24 }, () => 100);
  const s = [...points].sort((a, b) => a[0] - b[0]);
  const out: number[] = [];
  for (let h = 0; h < 24; h++) {
    const ex = s.find((p) => p[0] === h);
    if (ex) {
      out[h] = ex[1];
      continue;
    }
    let i0 = -1;
    for (let i = 0; i < s.length; i++) {
      const h0 = s[i][0];
      const h1 = s[(i + 1) % s.length][0];
      const wrap = h1 < h0;
      const inSeg = wrap ? h >= h0 || h < h1 : h >= h0 && h < h1;
      if (inSeg) {
        i0 = i;
        break;
      }
    }
    if (i0 < 0) {
      out[h] = s[0][1];
      continue;
    }
    const ha = s[i0][0];
    const hb = s[(i0 + 1) % s.length][0];
    const va = s[i0][1];
    const vb = s[(i0 + 1) % s.length][1];
    let span = (hb - ha + 24) % 24;
    if (span === 0) span = 24;
    const dist = (h - ha + 24) % 24;
    out[h] = va + (dist / span) * (vb - va);
  }
  return out;
}

function hourlySeriesFromSamples(
  rows: { hour: number; dateKey: string; t: number; aqi: number }[]
): number[] {
  if (rows.length === 0) return Array.from({ length: 24 }, () => 100);

  const latestRow = rows.reduce((a, b) => (a.t >= b.t ? a : b));
  const targetDate = latestRow.dateKey;

  const sameDay = rows.filter((r) => r.dateKey === targetDate);
  const useRows = sameDay.length >= 3 ? sameDay : rows;

  /** Latest sample per clock hour (IST) within chosen rows */
  const latestPerHour = new Map<number, { aqi: number; t: number }>();
  for (const r of useRows) {
    const cur = latestPerHour.get(r.hour);
    if (!cur || r.t > cur.t) latestPerHour.set(r.hour, { aqi: r.aqi, t: r.t });
  }

  const pairs: [number, number][] = [...latestPerHour.entries()].map(([h, v]) => [h, v.aqi]);
  return interpolate24Ring(pairs);
}

/** Hours in `[startHour, endHour)` on the 24h ring (end is exclusive). */
function windowHourIndices(startHour: number, endHour: number): number[] {
  const hours: number[] = [];
  let h = startHour;
  while (h !== endHour) {
    hours.push(h);
    h = (h + 1) % 24;
    if (hours.length > 24) break;
  }
  return hours;
}

/** Figma best #22C55E, avoid #EF4444 */
const CLOCK_BEST_PALETTE = ["#15803d", "#16a34a", "#22c55e", "#4ade80"];
const CLOCK_WORST_PALETTE = ["#f97316", "#ef4444", "#dc2626", "#ef4444"];

function paletteAt(palette: string[], index: number, count: number): string {
  if (count <= 1) return palette[Math.floor(palette.length / 2)] ?? palette[0];
  const t = index / (count - 1);
  const i = Math.round(t * (palette.length - 1));
  return palette[Math.min(Math.max(i, 0), palette.length - 1)];
}

/**
 * Ring colors that match the best/worst summary lines: green best window, red worst,
 * AQI ramp elsewhere (stretched when the day is flat so bands still read clearly).
 */
export function buildExposureClockVisualColors(
  hourly: number[],
  best: ExposureClockWindow,
  worst: ExposureClockWindow
): string[] {
  const bestHours = windowHourIndices(best.startHour, best.endHour);
  const worstHours = windowHourIndices(worst.startHour, worst.endHour);
  const min = Math.min(...hourly);
  const max = Math.max(...hourly);
  const span = max - min;
  const stretch = span < 25;

  return Array.from({ length: 24 }, (_, h) => {
    if (bestHours.includes(h)) {
      return paletteAt(CLOCK_BEST_PALETTE, bestHours.indexOf(h), bestHours.length);
    }
    if (worstHours.includes(h)) {
      return paletteAt(CLOCK_WORST_PALETTE, worstHours.indexOf(h), worstHours.length);
    }
    const v = hourly[h] ?? min;
    const paintAqi = stretch ? min + ((v - min) / (span || 1)) * 220 : v;
    return aqiToClockSegmentColor(paintAqi);
  });
}

function bestWorstTwoHourWindows(hourly: number[]): { best: ExposureClockWindow; worst: ExposureClockWindow } {
  let bestStart = 0;
  let bestAvg = Infinity;
  let worstStart = 0;
  let worstAvg = -Infinity;
  for (let s = 0; s < 24; s++) {
    const a = hourly[s];
    const b = hourly[(s + 1) % 24];
    const avg = (a + b) / 2;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestStart = s;
    }
    if (avg > worstAvg) {
      worstAvg = avg;
      worstStart = s;
    }
  }
  const endHour = (start: number) => (start + 2) % 24;
  return {
    best: { startHour: bestStart, endHour: endHour(bestStart), avgAqi: bestAvg },
    worst: { startHour: worstStart, endHour: endHour(worstStart), avgAqi: worstAvg },
  };
}

function sampleTimestamp(row: Historical24hSampleRow): string {
  return row.datetime?.trim() || row.time?.trim() || "";
}

/** Maps API `data.data[]` into 24 clock segments + best/worst 2h windows (IST). */
export function buildExposureClockModel(rows: Historical24hSampleRow[]): ExposureClockModel {
  const samples = rows
    .map((row) => {
      const iso = sampleTimestamp(row);
      if (!iso) return null;
      const { hour, dateKey, t } = utcIsoToIstHourAndDate(iso);
      return { hour, dateKey, t, aqi: row.aqi };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const hourly = hourlySeriesFromSamples(samples);
  const { best, worst } = bestWorstTwoHourWindows(hourly);
  const segmentColors = buildExposureClockVisualColors(hourly, best, worst);
  return { segmentColors, best, worst };
}

export function formatClockHourRange12h(startHour: number, endHour: number): string {
  const h12 = (h: number) => {
    const am = h < 12;
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}${am ? "am" : "pm"}`;
  };
  return `${h12(startHour)}–${h12(endHour)}`;
}

/**
 * GET /api/aqi/historical/{Country}/{State}/{City}/24hour?pollutant=
 * Same path casing rules as `slugToAqiPath`.
 */
export async function fetchAqiHistorical24Hour(
  slug: string,
  pollutant = ""
): Promise<ExposureClockModel> {
  const path = slugToAqiPath(slug);
  const depth = path.split("/").filter(Boolean).length;
  if (depth < 3) {
    throw new Error(
      `BeyondAQI 24h historical expects Country/State/City — got ${depth} segment(s): "${path}"`
    );
  }
  const q = pollutant === "" ? "" : encodeURIComponent(pollutant);
  const url = `${BEYONDAQI_API_BASE}/api/aqi/historical/${encodeAqiPathSegments(path)}/24hour?pollutant=${q}`;
  const { data } = await axios.get<Historical24hApiResponse>(url, {
    headers: beyondaqiRequestHeaders(),
  });

  const ok =
    data.statusCode === 200 && String(data.status ?? "").toLowerCase() === "success";
  if (!ok) {
    throw new Error(
      data.message || `BeyondAQI 24h historical failed (statusCode ${data.statusCode})`
    );
  }
  if (data.error != null && data.error !== "") {
    throw new Error(String(data.error));
  }

  const list = data.data?.data;
  if (!list?.length) {
    throw new Error(data.message || "BeyondAQI 24h historical: empty data array");
  }
  return buildExposureClockModel(list);
}

/** Demo path from product curl; used when no city is selected or state is missing. */
export const DEFAULT_HISTORICAL_SLUG = "India/Haryana/Narnaul";

export function resolveHistoricalSlug(snapshot: {
  countryName?: string;
  stateName?: string;
  cityName?: string;
} | null): string {
  const state = snapshot?.stateName?.trim();
  const city = snapshot?.cityName?.trim();
  if (snapshot && state && city) {
    const country = snapshot.countryName?.trim() || "India";
    return slugToAqiPath(`${country}/${state}/${city}`);
  }
  return slugToAqiPath(DEFAULT_HISTORICAL_SLUG);
}
