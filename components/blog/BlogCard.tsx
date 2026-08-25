import Image from "next/image";
import Link from "next/link";
import { formatArticleDate, type ShopifyArticle } from "@/lib/shopify/blog";

/** Placeholder for posts published without a featured image. */
function CardImageFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bqa-navy2 to-bqa-slate"
      aria-hidden
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="text-sky-400/40"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    </div>
  );
}

function ArticleMeta({ article }: { article: ShopifyArticle }) {
  const date = formatArticleDate(article.publishedAt);

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans text-[0.7rem] text-bqa-dim sm:text-xs">
      {date ? <span>{date}</span> : null}
      {date && article.author ? <span className="text-bqa-dim/60">|</span> : null}
      {article.author ? <span>{article.author}</span> : null}
      <span className="text-bqa-dim/60">|</span>
      <span>{article.readingMinutes} min read</span>
    </div>
  );
}

/**
 * Large lead card for the newest post. Mirrors the featured article treatment used by
 * NewsSection so the blog block sits naturally among the landing page sections.
 */
export function FeaturedBlogCard({
  article,
  priority = false,
}: {
  article: ShopifyArticle;
  /** Only set on an above-the-fold placement — it preloads the image. */
  priority?: boolean;
}) {
  return (
    <Link
      href={`/blog/${article.handle}`}
      className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[20px] sm:min-h-[460px]"
    >
      {article.image ? (
        <Image
          src={article.image.url}
          alt={article.image.alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-105"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0">
          <CardImageFallback />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bqa-navy/97 via-bqa-navy/55 to-bqa-navy/10" />

      <div className="relative z-[2] p-6 sm:p-8">
        {article.tags[0] ? (
          <div className="mb-3.5 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-wider text-sky-200">
            {article.tags[0]}
          </div>
        ) : null}
        <h3 className="mb-3 font-sans text-2xl font-normal leading-tight tracking-tight text-white sm:text-3xl">
          {article.title}
        </h3>
        {article.excerpt ? (
          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-bqa-muted">
            {article.excerpt}
          </p>
        ) : null}
        <ArticleMeta article={article} />
      </div>
    </Link>
  );
}

/**
 * Compact side/grid card.
 * `layout="row"` is the landing-page rail; `layout="grid"` is the /blog listing tile.
 */
export function BlogCard({
  article,
  layout = "row",
  accentClass = "border-l-sky-400",
}: {
  article: ShopifyArticle;
  layout?: "row" | "grid";
  accentClass?: string;
}) {
  if (layout === "grid") {
    return (
      <Link
        href={`/blog/${article.handle}`}
        className="group flex flex-col overflow-hidden rounded-[18px] border border-sky-400/10 bg-bqa-navy2/70 backdrop-blur-md transition-colors hover:border-sky-400/25"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <CardImageFallback />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {article.tags[0] ? (
            <span className="mb-2 w-fit rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-wide text-sky-300">
              {article.tags[0]}
            </span>
          ) : null}
          <h3 className="mb-2 text-base font-semibold leading-snug text-bqa-text">
            {article.title}
          </h3>
          {article.excerpt ? (
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-bqa-muted">
              {article.excerpt}
            </p>
          ) : null}
          <div className="mt-auto">
            <ArticleMeta article={article} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.handle}`}
      className={`block rounded-[14px] border border-sky-400/10 border-l-[3px] ${accentClass} bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/25`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {article.tags[0] ? (
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-wide text-sky-300">
            {article.tags[0]}
          </span>
        ) : null}
        <span className="font-sans text-[0.65rem] text-bqa-dim">
          {formatArticleDate(article.publishedAt)}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold leading-snug text-bqa-text">
        {article.title}
      </h3>
      {article.excerpt ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-bqa-muted">
          {article.excerpt}
        </p>
      ) : null}
    </Link>
  );
}
