import axios from "axios";
import { normalizeBeyondAqiSlug } from "@/lib/api/aqi-city";
import { BEYONDAQI_API_BASE, beyondaqiRequestHeaders } from "@/lib/config/beyondaqi-api";

export type AqiSearchResult = {
  type: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  aqi: number;
  /** Legacy / alternate id from search API */
  url?: string;
  /** Path segments for `GET /api/aqi/{Country}/{State}/{City}` */
  slug?: string;
  location_id?: number;
  location_name?: string;
};

/** Parse search `url` (e.g. `/api/India//Naharlagun`) preserving empty state segments. */
function parseSearchResultUrl(url?: string | null): string | undefined {
  const raw = url?.trim();
  if (!raw || /^https?:\/\//i.test(raw)) return undefined;

  let path = raw.replace(/^\/+/, "");
  if (path.toLowerCase().startsWith("api/")) {
    path = path.slice(4);
  }
  if (!path.includes("/")) return undefined;
  return path;
}

/**
 * Resolve slug/path for `GET /api/aqi/{Country}/{State}/{City}` from a search row.
 * Handles empty state (`India//Naharlagun`) and rows that only expose country + city.
 */
export function resolveSearchResultSlug(result: AqiSearchResult): string | undefined {
  const fromSlug = result.slug?.trim();
  if (fromSlug) return fromSlug;

  const fromUrl = parseSearchResultUrl(result.url);
  if (fromUrl) return fromUrl;

  const country = result.country?.trim();
  const city = result.city?.trim();
  if (!country || !city) return undefined;

  const state = result.state?.trim() ?? "";
  return `${country}/${state}/${city}`;
}

/** Slug or path from a search row (e.g. `slug` or `/api/India/Rajasthan/Jaipur`). */
export function citySlugFromSearchResult(
  result: AqiSearchResult
): string | undefined {
  return resolveSearchResultSlug(result);
}

/** True when the row can attempt `GET /api/aqi/Country/State/City` (incl. empty state). */
export function isFetchableCitySearchResult(result: AqiSearchResult): boolean {
  const slug = resolveSearchResultSlug(result);
  if (!slug) return false;
  const normalized = normalizeBeyondAqiSlug(slug);
  const nonEmpty = normalized.split("/").filter(Boolean);
  return nonEmpty.length >= 2 && Boolean(nonEmpty[0]);
}

type SearchApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: {
    query: string;
    results: AqiSearchResult[];
    total_count: number;
  };
  error: string | null;
};

export async function searchAqi(
  query: string,
  limit = 10
): Promise<AqiSearchResult[]> {
  const { data } = await axios.get<SearchApiResponse>(
    `${BEYONDAQI_API_BASE}/api/aqi/search`,
    {
      params: { query, limit },
      headers: beyondaqiRequestHeaders(),
    }
  );
  return data?.data?.results ?? [];
}
