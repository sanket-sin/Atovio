import { NextResponse, type NextRequest } from "next/server";
import { isShopifyConfigured } from "@/lib/config/shopify";
import { fetchShopifyArticles } from "@/lib/shopify/blog";

export const dynamic = "force-dynamic";

/**
 * Same-origin proxy for Shopify blog posts — GET /api/shopify/blog?first=4&after=<cursor>
 *
 * The Storefront token lives only on the server, so browser-side components (the landing
 * page BlogSection, "Load more" on /blog) read posts through here instead of calling
 * Shopify directly. Server components should call fetchShopifyArticles() straight.
 *
 * Query params:
 *   first  — page size, 1..50 (default 6)
 *   after  — opaque Shopify cursor from a previous response's `endCursor`
 *   blog   — override the configured blog handle
 */
export async function GET(request: NextRequest) {
  if (!isShopifyConfigured()) {
    // Not an error state for the UI: the section just renders nothing.
    return NextResponse.json(
      {
        success: false,
        message:
          "Shopify is not configured — set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
        data: { articles: [], hasNextPage: false, endCursor: null },
      },
      { status: 200 }
    );
  }

  const params = request.nextUrl.searchParams;
  const parsedFirst = Number.parseInt(params.get("first") ?? "", 10);
  const first = Number.isFinite(parsedFirst)
    ? Math.min(Math.max(parsedFirst, 1), 50)
    : 6;

  try {
    const page = await fetchShopifyArticles({
      first,
      after: params.get("after"),
      ...(params.get("blog") ? { blogHandle: params.get("blog") as string } : {}),
    });

    return NextResponse.json({ success: true, message: "OK", data: page });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Shopify blog request failed",
        data: { articles: [], hasNextPage: false, endCursor: null },
      },
      { status: 502 }
    );
  }
}
