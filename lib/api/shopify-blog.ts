import axios from "axios";
import type { ShopifyArticle, ShopifyArticlePage } from "@/lib/shopify/blog";

export type { ShopifyArticle, ShopifyArticlePage };

type ShopifyBlogApiResponse = {
  success: boolean;
  message: string;
  data: ShopifyArticlePage;
};

/**
 * Browser-side blog fetch — goes through the same-origin proxy in
 * app/api/shopify/blog/route.ts so the Storefront token never reaches the client.
 *
 * Server components should import fetchShopifyArticles from "@/lib/shopify/blog" instead
 * and skip the extra hop.
 */
export async function fetchBlogArticles({
  first = 6,
  after = null,
  signal,
}: {
  first?: number;
  after?: string | null;
  signal?: AbortSignal;
} = {}): Promise<ShopifyArticlePage> {
  const params = new URLSearchParams({ first: String(first) });
  if (after) params.set("after", after);

  const { data } = await axios.get<ShopifyBlogApiResponse>(
    `/api/shopify/blog?${params.toString()}`,
    { signal }
  );

  if (!data.success) throw new Error(data.message ?? "Shopify blog request failed");

  return data.data;
}
