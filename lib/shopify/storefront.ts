import {
  SHOPIFY_GRAPHQL_ENDPOINT,
  SHOPIFY_REQUEST_TIMEOUT_MS,
  SHOPIFY_REVALIDATE_SECONDS,
  SHOPIFY_STOREFRONT_TOKEN,
  isShopifyConfigured,
} from "@/lib/config/shopify";

/** Shape Shopify returns for a partially-failed GraphQL request. */
type StorefrontUserError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
};

type StorefrontResponse<T> = {
  data?: T;
  errors?: StorefrontUserError[];
};

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super(
      "Shopify is not configured — set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
    this.name = "ShopifyNotConfiguredError";
  }
}

export class ShopifyStorefrontError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

/**
 * Executes one Storefront GraphQL query. Server-only — the access token must never be
 * shipped to the browser, so every caller is a server component or a route handler.
 *
 * Results go through the Next data cache (`revalidate`) so a burst of page views costs
 * Shopify one request per window rather than one per visitor; pass `noStore` to opt out.
 */
export async function shopifyStorefrontFetch<T>({
  query,
  variables,
  noStore = false,
}: {
  query: string;
  variables?: Record<string, unknown>;
  noStore?: boolean;
}): Promise<T> {
  if (!isShopifyConfigured()) throw new ShopifyNotConfiguredError();

  let response: Response;
  try {
    response = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Omitted entirely when unset — Shopify rejects a blank token header outright,
        // whereas no header at all still resolves for stores that allow public reads.
        ...(SHOPIFY_STOREFRONT_TOKEN
          ? { "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(SHOPIFY_REQUEST_TIMEOUT_MS),
      ...(noStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: SHOPIFY_REVALIDATE_SECONDS, tags: ["shopify-blog"] } }),
    });
  } catch (err) {
    throw new ShopifyStorefrontError(
      err instanceof Error ? err.message : "Shopify Storefront request failed"
    );
  }

  if (!response.ok) {
    // 401/403 means a wrong token, a missing unauthenticated_read_content scope, or a store
    // that has stopped serving public reads and now needs a token set.
    const body = await response.text().catch(() => "");
    throw new ShopifyStorefrontError(
      `Shopify Storefront responded ${response.status}${body ? `: ${body.slice(0, 300)}` : ""}`,
      response.status
    );
  }

  const payload = (await response.json()) as StorefrontResponse<T>;

  if (payload.errors?.length) {
    throw new ShopifyStorefrontError(
      payload.errors.map((e) => e.message).join("; ")
    );
  }

  if (!payload.data) {
    throw new ShopifyStorefrontError("Shopify Storefront returned no data");
  }

  return payload.data;
}
