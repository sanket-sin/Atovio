import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, BlogCard, BlogPageShell } from "@/components/blog";
import { isShopifyConfigured } from "@/lib/config/shopify";
import { SITE_URL } from "@/lib/config/site";
import {
  fetchShopifyArticle,
  fetchShopifyArticles,
  formatArticleDate,
  type ShopifyArticle,
} from "@/lib/shopify/blog";

export const revalidate = 300;

/**
 * Handles not pre-rendered at build time (or published later) are rendered on first
 * request and then cached, so new Shopify posts go live without a redeploy.
 */
export const dynamicParams = true;

type PageProps = { params: { handle: string } };

/** Pre-render the newest posts; the rest are generated on demand. */
export async function generateStaticParams() {
  if (!isShopifyConfigured()) return [];

  try {
    const { articles } = await fetchShopifyArticles({ first: 20 });
    return articles.map((article) => ({ handle: article.handle }));
  } catch {
    return [];
  }
}

async function loadArticle(handle: string): Promise<ShopifyArticle | null> {
  if (!isShopifyConfigured()) return null;

  try {
    return await fetchShopifyArticle(handle);
  } catch (err) {
    console.error(`[BeyondAQI] /blog/${handle} fetch failed:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await loadArticle(params.handle);
  if (!article) return { title: "Post not found · BeyondAQI" };

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || undefined;

  return {
    title: `${title} · BeyondAQI`,
    description,
    /**
     * Self-referencing, so this copy is the one Google indexes and ranks.
     *
     * The same post is also live on the Shopify storefront at atovio.in/blogs/news/<handle>,
     * which self-canonicalises — the two are genuine duplicates competing for the same
     * queries. Pointing this canonical at the store instead would hand all ranking to
     * atovio.in and contradict app/sitemap.ts, which submits these URLs for indexing.
     */
    alternates: { canonical: `${SITE_URL}/blog/${article.handle}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      authors: article.author ? [article.author] : undefined,
      images: article.image ? [{ url: article.image.url }] : undefined,
    },
    twitter: {
      card: article.image ? "summary_large_image" : "summary",
      title,
      description,
      images: article.image ? [article.image.url] : undefined,
    },
  };
}

/** Newest posts other than the one being read. */
async function loadRelated(currentHandle: string): Promise<ShopifyArticle[]> {
  if (!isShopifyConfigured()) return [];

  try {
    const { articles } = await fetchShopifyArticles({ first: 4 });
    return articles.filter((a) => a.handle !== currentHandle).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const article = await loadArticle(params.handle);
  if (!article) notFound();

  const related = await loadRelated(article.handle);
  const publishedLabel = formatArticleDate(article.publishedAt);

  return (
    <BlogPageShell>
      <article className="sec-fx border-t border-sky-400/10 py-12 sm:py-[72px]">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-3xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-bqa-dim transition-colors hover:text-bqa-text"
            >
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
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              All posts
            </Link>

            <header className="mb-8">
              {article.tags.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {article.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-wide text-sky-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <h1 className="font-sans text-[clamp(1.8rem,5vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text">
                {article.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 font-sans text-sm text-bqa-dim">
                {publishedLabel ? (
                  <time dateTime={article.publishedAt ?? undefined}>
                    {publishedLabel}
                  </time>
                ) : null}
                {publishedLabel && article.author ? (
                  <span className="text-bqa-dim/60">|</span>
                ) : null}
                {article.author ? <span>{article.author}</span> : null}
                <span className="text-bqa-dim/60">|</span>
                <span>{article.readingMinutes} min read</span>
              </div>
            </header>

            {article.image ? (
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-[20px]">
                <Image
                  src={article.image.url}
                  alt={article.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 768px"
                  priority
                />
              </div>
            ) : null}

            {article.contentHtml ? (
              <ArticleBody html={article.contentHtml} />
            ) : (
              <p className="text-bqa-muted">{article.excerpt}</p>
            )}

            {article.storeUrl ? (
              <p className="mt-12 border-t border-sky-400/10 pt-6 text-sm text-bqa-dim">
                Originally published on the{" "}
                <a
                  href={article.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bqa-accent2 underline underline-offset-2 hover:text-bqa-accent"
                >
                  BeyondAQI store
                </a>
                .
              </p>
            ) : null}
          </div>

          {related.length > 0 ? (
            <section className="mx-auto mt-16 w-full max-w-container border-t border-sky-400/10 pt-12">
              <h2 className="mb-8 font-sans text-[1.4rem] font-normal tracking-tight text-bqa-text">
                More from the blog
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.id} article={item} layout="grid" />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </BlogPageShell>
  );
}
