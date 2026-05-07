import axios from "axios";
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
    `${BEYONDAQI_API_BASE}/api/aqi/search`,
    {
      params: { query, limit },
      headers: beyondaqiRequestHeaders(),
    }
  );
  return data?.data?.results ?? [];
}
