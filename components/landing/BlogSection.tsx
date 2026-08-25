"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogCard, FeaturedBlogCard } from "@/components/blog";
import { fetchBlogArticles, type ShopifyArticle } from "@/lib/api/shopify-blog";

/** Left-border accents cycled across the rail cards, matching NewsSection's palette. */
const RAIL_ACCENTS = [
  "border-l-sky-400",
  "border-l-emerald-400",
  "border-l-amber-400",
] as const;

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[14px] border border-sky-400/10 bg-bqa-navy2/50 ${className ?? ""}`}
      aria-hidden
    />
  );
}

/**
 * Landing-page blog block — the four newest Shopify posts.
 *
 * Fetches client-side through /api/shopify/blog because LandingExperience (its parent) is
 * a client component. If Shopify is unconfigured or unreachable the section removes
 * itself rather than showing an error, so the landing page never degrades.
 */
export function BlogSection() {
  const [articles, setArticles] = useState<ShopifyArticle[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchBlogArticles({ first: 4, signal: controller.signal })
      .then((page) => setArticles(page.articles))
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (process.env.NODE_ENV === "development") {
          console.debug("[BeyondAQI] Shopify blog fetch failed:", err);
        }
        setFailed(true);
      });

    return () => controller.abort();
  }, []);

  // Nothing to show — hide the section entirely instead of leaving an empty band.
  if (failed || articles?.length === 0) return null;

  const [featured, ...rail] = articles ?? [];

  return (
    <section
      id="sec-blog"
      className="sec-fx relative overflow-hidden border-t border-sky-400/10 py-12 sm:py-[72px]"
    >
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-sans text-[1.65rem] font-normal leading-tight tracking-tight text-bqa-text sm:text-[2rem]">
            From the BeyondAQI Blog
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/25 to-transparent sm:block"
            aria-hidden
          />
        </div>

        {articles === null ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            <CardSkeleton className="min-h-[380px] rounded-[20px] sm:min-h-[460px]" />
            <div className="flex flex-col gap-4">
              <CardSkeleton className="h-[150px]" />
              <CardSkeleton className="h-[150px]" />
              <CardSkeleton className="h-[150px]" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            <FeaturedBlogCard article={featured} />
            <div className="flex flex-col gap-4">
              {rail.map((article, i) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  accentClass={RAIL_ACCENTS[i % RAIL_ACCENTS.length]}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-bqa-slate/80 px-6 py-3 text-sm font-semibold text-bqa-text backdrop-blur-sm transition-all hover:border-sky-400/30 hover:bg-bqa-slate"
          >
            <span>Read all blog posts</span>
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
