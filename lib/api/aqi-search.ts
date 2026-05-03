import axios from "axios";

const SEARCH_BASE = "https://dev-api.beyondaqi.com";
const SEARCH_TOKEN =
  "Token bee92bf6ed5bfc67f5006e82b6b4b9c1951d69a69f26317d3883cd3e67bf593a";

export type AqiSearchResult = {
  type: string;
  name: string;
  city: string;
  state: string;
  country: string;
  aqi: number;
  url: string;
};

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
    `${SEARCH_BASE}/api/aqi/search`,
    {
      params: { query, limit },
      headers: {
        authorization: SEARCH_TOKEN,
        "user-agent": "Dart/3.9 (dart:io)",
        "accept-encoding": "gzip",
        "content-length": "0",
      },
    }
  );
  return data?.data?.results ?? [];
}
