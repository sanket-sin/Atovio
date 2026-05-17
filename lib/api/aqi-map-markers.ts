import type { MostPollutedCityRow } from "@/lib/api/aqi-most-polluted";
import { fetchMostPollutedCities } from "@/lib/api/aqi-most-polluted";
import { fetchCityAqiMapPoint, type CityAqiMapPoint } from "@/lib/api/aqi-city";

export type { CityAqiMapPoint };

const DEFAULT_CONCURRENCY = 6;

async function mapWithConcurrency<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R | null>,
  concurrency: number,
  onResult?: (value: R) => void
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      const value = await mapper(items[i]!);
      if (value) {
        results.push(value);
        onResult?.(value);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

function rowToMapPoint(row: MostPollutedCityRow): Promise<CityAqiMapPoint | null> {
  return fetchCityAqiMapPoint({
    country: row.country || "India",
    state: row.state,
    city: row.city,
  }).then((point) => {
    if (!point) return null;
    return { ...point, aqi: row.aqi, aqiStatus: row.aqi_status };
  });
}

export type FetchAqiMapMarkersOptions = {
  /** Leaderboard pages to load (default 1). */
  pages?: number;
  /** Max cities to resolve coordinates for (default 24). */
  maxMarkers?: number;
  concurrency?: number;
  /** Called as each marker resolves — for progressive map rendering. */
  onProgress?: (points: CityAqiMapPoint[]) => void;
};

/**
 * Loads leaderboard cities, then resolves lat/lng from per-city AQI endpoints.
 * Dev API is slow (~10s/city); keep `maxMarkers` modest and use `onProgress` in the UI.
 */
export async function fetchAqiMapMarkers(
  options: FetchAqiMapMarkersOptions = {}
): Promise<CityAqiMapPoint[]> {
  const pages = options.pages ?? 1;
  const maxMarkers = options.maxMarkers ?? 24;
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const onProgress = options.onProgress;

  const pageResults = await Promise.all(
    Array.from({ length: pages }, (_, i) => fetchMostPollutedCities({ page: i + 1 }))
  );

  const seen = new Set<string>();
  const rows: MostPollutedCityRow[] = [];
  for (const list of pageResults) {
    for (const row of list) {
      const key = `${row.city}|${row.state}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(row);
      if (rows.length >= maxMarkers) break;
    }
    if (rows.length >= maxMarkers) break;
  }

  if (rows.length === 0) return [];

  const accumulated: CityAqiMapPoint[] = [];

  return mapWithConcurrency(
    rows,
    rowToMapPoint,
    concurrency,
    (point) => {
      accumulated.push(point);
      onProgress?.([...accumulated]);
    }
  );
}
