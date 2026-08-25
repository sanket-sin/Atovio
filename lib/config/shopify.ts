/**
 * Shopify Storefront API configuration.
 *
 * Blog content is pulled with the **Storefront** API (GraphQL, read-only), not the Admin
 * API — it only needs the `unauthenticated_read_content` scope and never touches orders,
 * customers or products. See lib/shopify/storefront.ts for the request layer.
 *
 * Even though a Storefront token is publishable, nothing here is prefixed `NEXT_PUBLIC_`:
 * every call runs on the server (server components + app/api/shopify/blog/route.ts), so
 * the token and shop domain stay out of the client bundle.
 */

/** e.g. "atovio.myshopify.com" — the *.myshopify.com domain, not a custom domain. */
export const SHOPIFY_STORE_DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN ?? "")
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

/** Public Storefront access token from the custom app (starts with `shpat_`-style hex). */
export const SHOPIFY_STOREFRONT_TOKEN = (
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? ""
).trim();

/** Pin an API version so a Shopify release never silently changes the schema. */
export const SHOPIFY_API_VERSION = (
  process.env.SHOPIFY_API_VERSION ?? "2025-01"
).trim();

/**
 * Handle of the blog to read, as it appears in Shopify admin under
 * Content → Blog posts → Manage blogs. A fresh store's default blog is "news".
 * Set to an empty string to read articles across *all* blogs.
 */
export const SHOPIFY_BLOG_HANDLE = (
  process.env.SHOPIFY_BLOG_HANDLE ?? "news"
).trim();

/** Per-request cap — a hung Shopify call must not hold a page render open. */
export const SHOPIFY_REQUEST_TIMEOUT_MS = 10_000;

/** How long fetched articles stay fresh in the Next data cache (seconds). */
export const SHOPIFY_REVALIDATE_SECONDS = 300;

export const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

/**
 * True when there is at least a store domain to talk to.
 *
 * The token is deliberately *not* required: this store's Storefront API currently serves
 * blog reads unauthenticated, so the site works with the domain alone. That is undocumented
 * Shopify behaviour and could be tightened at any time, so
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN should still be set for production — see
 * SHOPIFY_BLOG_SETUP.md. When present it is sent, and the request is then guaranteed.
 *
 * Callers use this to degrade gracefully: no domain renders an empty blog section rather
 * than crashing the landing page.
 */
export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_STORE_DOMAIN);
}
