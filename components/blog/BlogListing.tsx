"use client";

import { useState } from "react";
import { fetchBlogArticles, type ShopifyArticle } from "@/lib/api/shopify-blog";
import { BlogCard } from "./BlogCard";

const PAGE_SIZE = 9;

/**
 * Paginated grid for /blog.
 *
 * The first page is fetched on the server and handed in as `initialArticles`, so the list
 * is present in the HTML for crawlers and the first paint. Only "Load more" pages go over
 * the wire, through /api/shopify/blog with Shopify's opaque cursor.
 */
export function BlogListing({
  initialArticles,
  initialHasNextPage,
  initialCursor,
}: {
  initialArticles: ShopifyArticle[];
  initialHasNextPage: boolean;
  initialCursor: string | null;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    if (loading || !hasNextPage) return;
    setLoading(true);
    setError(null);

    try {
      const page = await fetchBlogArticles({ first: PAGE_SIZE, after: cursor });
      // Shopify can repeat a node if a post is published mid-pagination; key off id.
      setArticles((prev) => {
        const seen = new Set(prev.map((a) => a.id));
        return [...prev, ...page.articles.filter((a) => !seen.has(a.id))];
      });
      setCursor(page.endCursor);
      setHasNextPage(page.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more posts.");
    } finally {
      setLoading(false);
    }
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-[18px] border border-sky-400/10 bg-bqa-navy2/60 p-10 text-center">
        <p className="text-base font-semibold text-bqa-text">No posts yet</p>
        <p className="mt-2 text-sm text-bqa-muted">
          Once posts are published in Shopify they will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article.id} article={article} layout="grid" />
        ))}
      </div>

      {error ? (
        <p className="mt-6 text-center text-sm text-rose-300">{error}</p>
      ) : null}

      {hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-bqa-slate/80 px-6 py-3 text-sm font-semibold text-bqa-text backdrop-blur-sm transition-all hover:border-sky-400/30 hover:bg-bqa-slate disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more posts"}
          </button>
        </div>
      ) : null}
    </>
  );
}
