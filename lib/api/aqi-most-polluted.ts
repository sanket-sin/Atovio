import axios from "axios";
import {
  BEYONDAQI_API_BASE,
  BEYONDAQI_REQUEST_TIMEOUT_MS,
  beyondaqiRequestHeaders,
} from "@/lib/config/beyondaqi-api";

/** One row from `data.cities` — matches BeyondAQI `most-polluted` leaderboard. */
export type MostPollutedCityRow = {
  rank: number;
  city: string;
  state: string;
  country: string;
  aqi: number;
  aqi_scale: number;
  aqi_status: string;
  puff_score: number;
  timestamp: string;
};

export type MostPollutedPagination = {
  total: number;
  page: number;
  rowPerPage: number;
  totalPages: number;
};

export type MostPollutedData = {
  country: string;
  cities: MostPollutedCityRow[];
  pagination: MostPollutedPagination;
};

/** Full envelope — useful for debugging or future UI (page controls). */
export type MostPollutedApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: MostPollutedData;
  error: string | null;
};

export type FetchMostPollutedOptions = {
  /** 1-based page index when the API supports `?page=` (default 1). */
  page?: number;
};

async function getMostPollutedResponse(
  options: FetchMostPollutedOptions = {}
): Promise<MostPollutedData> {
  const page = options.page ?? 1;
  const url =
    page <= 1
      ? `${BEYONDAQI_API_BASE}/api/aqi/leaderboard/most-polluted`
      : `${BEYONDAQI_API_BASE}/api/aqi/leaderboard/most-polluted?page=${page}`;

  const { data } = await axios.get<MostPollutedApiResponse>(url, {
    headers: beyondaqiRequestHeaders(),
    timeout: BEYONDAQI_REQUEST_TIMEOUT_MS,
  });

  if (data.error || data.status?.toLowerCase() !== "success" || data.statusCode !== 200) {
    throw new Error(data.error ?? data.message ?? "Most polluted leaderboard request failed");
  }

  if (!data.data) {
    throw new Error("Most polluted leaderboard returned no data");
  }

  return data.data;
}

export type MostPollutedLeaderboardResult = {
  cities: MostPollutedCityRow[];
  pagination: MostPollutedPagination;
};

export type MostAndLeastPollutedResult = {
  most: MostPollutedCityRow | null;
  least: MostPollutedCityRow | null;
};

/**
 * Same endpoint as {@link fetchMostPollutedCities} but returns `pagination` for list UI.
 */
export async function fetchMostPollutedLeaderboard(
  options: FetchMostPollutedOptions = {}
): Promise<MostPollutedLeaderboardResult> {
  const d = await getMostPollutedResponse(options);
  return {
    cities: d.cities ?? [],
    pagination: d.pagination,
  };
}

/**
 * GET /api/aqi/leaderboard/most-polluted — India’s highest-AQI cities (same auth as other BeyondAQI routes).
 * Response includes `pagination` (e.g. 50 rows per page); use `page` for additional pages if supported.
 */
export async function fetchMostPollutedCities(
  options: FetchMostPollutedOptions = {}
): Promise<MostPollutedCityRow[]> {
  const d = await getMostPollutedResponse(options);
  return d.cities ?? [];
}

/**
 * Returns both extremes for the "Most Polluted" and "Cleanest" cards.
 * We read page 1 (top ranks) and the last page (tail ranks) to avoid fetching all pages.
 */
export async function fetchMostAndLeastPollutedCities(): Promise<MostAndLeastPollutedResult> {
  const firstPage = await getMostPollutedResponse({ page: 1 });
  const firstRows = firstPage.cities ?? [];

  if (firstRows.length === 0) {
    return { most: null, least: null };
  }

  const totalPages = Math.max(1, firstPage.pagination?.totalPages ?? 1);
  const lastRows =
    totalPages > 1
      ? (await getMostPollutedResponse({ page: totalPages })).cities ?? []
      : [];

  const candidateRows = [...firstRows, ...lastRows];

  let most: MostPollutedCityRow | null = null;
  let least: MostPollutedCityRow | null = null;

  for (const row of candidateRows) {
    if (!most || row.aqi > most.aqi) most = row;
    if (!least || row.aqi < least.aqi) least = row;
  }

  return { most, least };
}
