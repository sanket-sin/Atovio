/**
 * Canonical public origin, used for sitemap/robots absolute URLs.
 *
 * Must be the origin that actually serves the site, with no redirect in front of it:
 * beyondaqi.in returns a 301 to beyondaqi.atovio.in, so the subdomain is the canonical host.
 * Sitemap entries that redirect are treated as invalid. Set NEXT_PUBLIC_SITE_URL in the
 * hosting environment.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://beyondaqi.atovio.in"
)
  .trim()
  .replace(/\/+$/, "");
