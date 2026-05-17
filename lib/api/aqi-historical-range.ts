import axios from "axios";
import { BEYONDAQI_API_BASE, beyondaqiRequestHeaders } from "@/lib/config/beyondaqi-api";
import { encodeAqiPathSegments, slugToAqiPath } from "@/lib/api/aqi-city";

/** API allows 24hour, 7day, 30day — chart uses the day-based periods. */
export type HistoricalRangePeriod = "7day" | "30day";

type HistoricalRangePollutants = {
  co: number;
  no: number;
  o3: number;
  nh3: number;
  no2: number;
  so2: number;
  pm10: number;
  pm2_5: number;
};

/** Repeated on each sample row in the API payload. */
export type HistoricalRangeRowLocation = {
  city: string;
  state: string;
  country: string;
};

/** Row when `pollutant=` (AQI) — includes `aqi` (see Jaipur 30day example). */
export type HistoricalRangeRowAqi = {
  time: string;
  datetime: string;
  location?: HistoricalRangeRowLocation;
  aqi: number;
  aqi_scale?: number;
  aqi_status?: string;
  pollutants: HistoricalRangePollutants;
};

/** Row when `pollutant=pm2_5` etc. — primary value in `pollutant_value`. */
export type HistoricalRangeRowPollutant = {
  time: string;
  datetime: string;
  location?: HistoricalRangeRowLocation;
  pollutant_name?: string;
  pollutant_value: number;
  pollutant_unit?: string;
  pollutant_status?: string;
  pollutants: HistoricalRangePollutants;
};

export type HistoricalRangeSampleRow = HistoricalRangeRowAqi | HistoricalRangeRowPollutant;

export type HistoricalRangePayload = {
  location: HistoricalRangeRowLocation;
  period: string;
  /** e.g. `{ type: "aqi" }` or `{ type: "pollutant", value: "pm2_5" }` */
  filter: { type: string; value?: string };
  data: HistoricalRangeSampleRow[];
  summary?: {
    min: { value: number };
    max: { value: number };
    average: number;
  };
};

/** Top-level JSON for successful historical range calls (`error` is often `null`). */
export type HistoricalRangeApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: HistoricalRangePayload;
  error: unknown | null;
};

export type HistoricalRangeChartSeries = {
  labels: string[];
  values: number[];
  location: HistoricalRangeRowLocation;
  period: string;
  /** Mirrors `data.summary` when present (same units as the active metric). */
  summary?: { min: number; max: number; average: number };
};

function sampleTime(row: HistoricalRangeSampleRow): string {
  return row.datetime?.trim() || row.time?.trim() || "";
}

function formatChartDayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

function rowValue(
  row: HistoricalRangeSampleRow,
  metric: "aqi" | "pm25" | "pm10"
): number {
  if (metric === "aqi") {
    return "aqi" in row && typeof row.aqi === "number" ? row.aqi : 0;
  }
  if ("pollutant_value" in row && typeof row.pollutant_value === "number") {
    return row.pollutant_value;
  }
  if (metric === "pm25") return row.pollutants?.pm2_5 ?? 0;
  return row.pollutants?.pm10 ?? 0;
}

/** Maps UI metric to `pollutant` query (empty string = overall AQI). */
export function historyMetricToPollutantParam(metric: "aqi" | "pm25" | "pm10"): string {
  if (metric === "aqi") return "";
  if (metric === "pm25") return "pm2_5";
  return "pm10";
}

/**
 * GET /api/aqi/historical/{Country}/{State}/{City}/{7day|30day}?pollutant=
 * Same path rules as `slugToAqiPath`.
 */
export async function fetchAqiHistoricalRange(
  slug: string,
  period: HistoricalRangePeriod,
  pollutant = ""
): Promise<HistoricalRangeChartSeries> {
  const path = slugToAqiPath(slug);
  const depth = path.split("/").filter(Boolean).length;
  if (depth < 3) {
    throw new Error(
      `BeyondAQI historical expects Country/State/City — got ${depth} segment(s): "${path}"`
    );
  }
  const q = pollutant === "" ? "" : encodeURIComponent(pollutant);
  const url = `${BEYONDAQI_API_BASE}/api/aqi/historical/${encodeAqiPathSegments(path)}/${period}?pollutant=${q}`;
  const { data } = await axios.get<HistoricalRangeApiResponse>(url, {
    headers: beyondaqiRequestHeaders(),
  });

  const ok =
    data.statusCode === 200 && String(data.status ?? "").toLowerCase() === "success";
  if (!ok) {
    throw new Error(
      data.message || `BeyondAQI historical failed (statusCode ${data.statusCode})`
    );
  }
  if (data.error != null && data.error !== "") {
    throw new Error(String(data.error));
  }

  const list = data.data?.data;
  if (!list?.length) {
    throw new Error(data.message || "BeyondAQI historical: empty data array");
  }

  const metric: "aqi" | "pm25" | "pm10" =
    pollutant === "" ? "aqi" : pollutant === "pm2_5" ? "pm25" : "pm10";

  const sorted = [...list].sort(
    (a, b) => new Date(sampleTime(a)).getTime() - new Date(sampleTime(b)).getTime()
  );

  const labels: string[] = [];
  const values: number[] = [];
  for (const row of sorted) {
    const t = sampleTime(row);
    if (!t) continue;
    labels.push(formatChartDayLabel(t));
    values.push(rowValue(row, metric));
  }

  const apiSummary = data.data.summary;
  const summary =
    apiSummary &&
    typeof apiSummary.min?.value === "number" &&
    typeof apiSummary.max?.value === "number" &&
    typeof apiSummary.average === "number"
      ? {
          min: apiSummary.min.value,
          max: apiSummary.max.value,
          average: apiSummary.average,
        }
      : undefined;

  return {
    labels,
    values,
    location: data.data.location,
    period: data.data.period,
    summary,
  };
}
