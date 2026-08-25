import type { Metadata } from "next";
import { BlogListing, BlogPageShell } from "@/components/blog";
import { isShopifyConfigured } from "@/lib/config/shopify";
import { fetchShopifyArticles, type ShopifyArticlePage } from "@/lib/shopify/blog";

export const metadata: Metadata = {
  title: "Blog · BeyondAQI — Air Quality Insights, Research & Guides",
  description:
    "Long-form air quality reporting from BeyondAQI: pollution research, city deep-dives, health guidance and product notes.",
};

/** Posts are cached for SHOPIFY_REVALIDATE_SECONDS, so this page can be statically served. */
export const revalidate = 300;

const EMPTY_PAGE: ShopifyArticlePage = {
  articles: [],
  hasNextPage: false,
  endCursor: null,
};

async function loadFirstPage(): Promise<ShopifyArticlePage> {
  if (!isShopifyConfigured()) return EMPTY_PAGE;

  try {
    return await fetchShopifyArticles({ first: 9 });
  } catch (err) {
    // A Shopify outage renders the empty state rather than a 500.
    console.error("[BeyondAQI] /blog listing fetch failed:", err);
    return EMPTY_PAGE;
  }
}

export default async function BlogIndexPage() {
  const page = await loadFirstPage();

  return (
    <BlogPageShell>
      <section className="sec-fx border-t border-sky-400/10 py-12 sm:py-[72px]">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
          <header className="mb-10 sm:mb-12">
            <p className="mb-3 font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em] text-sky-300">
              BeyondAQI Blog
            </p>
            <h1 className="max-w-3xl font-sans text-[clamp(1.9rem,5vw,2.6rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text">
              Air quality, explained properly.
            </h1>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-bqa-muted">
              Research notes, city deep-dives and practical health guidance from the team
              building India&apos;s hyperlocal sensor network.
            </p>
          </header>

          <BlogListing
            initialArticles={page.articles}
            initialHasNextPage={page.hasNextPage}
            initialCursor={page.endCursor}
          />
        </div>
      </section>
    </BlogPageShell>
  );
}
