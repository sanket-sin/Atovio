import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated areas hold nothing indexable and would only waste crawl budget.
      disallow: ["/api/", "/dashboard", "/login", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
