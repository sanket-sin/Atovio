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

/** Slug or path from a search row (e.g. `slug` or `/api/India/Rajasthan/Jaipur`). */
export function citySlugFromSearchResult(
  result: AqiSearchResult
): string | undefined {
  const fromSlug = result.slug?.trim();
  if (fromSlug) return fromSlug;
  const u = result.url?.trim();
  if (u && !/^https?:\/\//i.test(u) && u.includes("/")) return u;
  return undefined;
}

/** True when the row resolves to `GET /api/aqi/{Country}/{State}/{City}`. */
export function isFetchableCitySearchResult(result: AqiSearchResult): boolean {
  const slug = citySlugFromSearchResult(result);
  if (!slug) return false;
  const normalized = normalizeBeyondAqiSlug(slug);
  return normalized.split("/").filter(Boolean).length >= 3;
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
