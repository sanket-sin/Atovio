import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { isShopifyConfigured } from "@/lib/config/shopify";
import { fetchShopifyArticles } from "@/lib/shopify/blog";

/** Rebuilt on the same cadence as the blog data itself. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
  ];

  if (!isShopifyConfigured()) return staticRoutes;

  try {
    // 250 is Shopify's per-connection ceiling, and comfortably above the current post count.
    const { articles } = await fetchShopifyArticles({ first: 250 });

    return [
      ...staticRoutes,
      ...articles.map((article) => ({
        url: `${SITE_URL}/blog/${article.handle}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (err) {
    // A Shopify outage must not fail the build or serve a broken sitemap.
    console.error("[BeyondAQI] sitemap: Shopify fetch failed:", err);
    return staticRoutes;
  }
}
