import axios from "axios";
import { BEYONDAQI_API_BASE, beyondaqiRequestHeaders } from "@/lib/config/beyondaqi-api";

/** One item from `data.news` — GET /api/accounts/feed-news/ */
export type FeedNewsItem = {
  id: number;
  title: string;
  pub_date: string;
  link: string;
  description: string;
  thumbnail: string;
  is_favt: boolean;
  created_at: string;
  updated_at: string;
};

export type FeedNewsData = {
  news: FeedNewsItem[];
  count: number;
};

export type FeedNewsApiResponse = {
  success: boolean;
  message: string;
  data: FeedNewsData;
};

/**
 * GET /api/accounts/feed-news/ — curated AQI / environment news feed.
 */
export async function fetchFeedNews(): Promise<FeedNewsItem[]> {
  const { data } = await axios.get<FeedNewsApiResponse>(
    `${BEYONDAQI_API_BASE}/api/accounts/feed-news/`,
    { headers: beyondaqiRequestHeaders() }
  );

  if (!data.success || !data.data?.news) {
    throw new Error(data.message ?? "Feed news request failed");
  }

  return data.data.news;
}
