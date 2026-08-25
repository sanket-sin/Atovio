import { SHOPIFY_BLOG_HANDLE, SHOPIFY_STORE_DOMAIN } from "@/lib/config/shopify";
import { shopifyStorefrontFetch } from "./storefront";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/** Raw Article node as selected by ARTICLE_FIELDS below. */
type RawArticle = {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  onlineStoreUrl: string | null;
  tags: string[] | null;
  contentHtml?: string | null;
  image: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  authorV2: { name: string | null } | null;
  blog: { handle: string; title: string } | null;
  seo?: { title: string | null; description: string | null } | null;
};

/** Normalized article used by every component in this app. */
export type ShopifyArticle = {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  /** Canonical URL of the post on the Shopify storefront. */
  storeUrl: string | null;
  tags: string[];
  author: string | null;
  image: { url: string; alt: string; width: number; height: number } | null;
  blogHandle: string | null;
  blogTitle: string | null;
  /** Rendered post body — only populated by fetchShopifyArticle(). */
  contentHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  /** Rough reading time in minutes, derived from contentHtml or excerpt. */
  readingMinutes: number;
};

export type ShopifyArticlePage = {
  articles: ShopifyArticle[];
  hasNextPage: boolean;
  endCursor: string | null;
};

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */

const ARTICLE_FIELDS = /* GraphQL */ `
  id
  handle
  title
  excerpt
  publishedAt
  onlineStoreUrl
  tags
  image {
    url
    altText
    width
    height
  }
  authorV2 {
    name
  }
  blog {
    handle
    title
  }
`;

/** Articles inside one named blog (Content → Blog posts → Manage blogs → handle). */
const BLOG_ARTICLES_QUERY = /* GraphQL */ `
  query BlogArticles($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      handle
      title
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ${ARTICLE_FIELDS}
        }
      }
    }
  }
`;

/** Articles across every blog on the store — used when no blog handle is configured. */
const ALL_ARTICLES_QUERY = /* GraphQL */ `
  query AllArticles($first: Int!, $after: String) {
    articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${ARTICLE_FIELDS}
      }
    }
  }
`;

const ARTICLE_BY_HANDLE_QUERY = /* GraphQL */ `
  query ArticleByHandle($blogHandle: String!, $handle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $handle) {
        ${ARTICLE_FIELDS}
        contentHtml
        seo {
          title
          description
        }
      }
    }
  }
`;

/* ------------------------------------------------------------------ *
 * Normalization
 * ------------------------------------------------------------------ */

const WORDS_PER_MINUTE = 220;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadingMinutes(source: string): number {
  const words = stripHtml(source).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * `onlineStoreUrl` is null while a blog post is hidden from the online store sales
 * channel, so fall back to the conventional /blogs/<blog>/<article> path.
 */
function resolveStoreUrl(raw: RawArticle): string | null {
  if (raw.onlineStoreUrl) return raw.onlineStoreUrl;
  if (!SHOPIFY_STORE_DOMAIN || !raw.blog?.handle) return null;
  return `https://${SHOPIFY_STORE_DOMAIN}/blogs/${raw.blog.handle}/${raw.handle}`;
}

function normalizeArticle(raw: RawArticle): ShopifyArticle {
  const contentHtml = raw.contentHtml ?? null;
  const excerpt = raw.excerpt?.trim()
    ? raw.excerpt.trim()
    : contentHtml
      ? `${stripHtml(contentHtml).slice(0, 180).trim()}…`
      : "";

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    excerpt,
    publishedAt: raw.publishedAt,
    storeUrl: resolveStoreUrl(raw),
    tags: raw.tags ?? [],
    author: raw.authorV2?.name ?? null,
    image: raw.image
      ? {
          url: raw.image.url,
          alt: raw.image.altText ?? raw.title,
          width: raw.image.width ?? 1200,
          height: raw.image.height ?? 675,
        }
      : null,
    blogHandle: raw.blog?.handle ?? null,
    blogTitle: raw.blog?.title ?? null,
    contentHtml,
    seoTitle: raw.seo?.title ?? null,
    seoDescription: raw.seo?.description ?? null,
    readingMinutes: estimateReadingMinutes(contentHtml ?? excerpt ?? raw.title),
  };
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

/**
 * Newest-first page of blog posts. Reads the blog named by SHOPIFY_BLOG_HANDLE, or every
 * blog on the store when that variable is blank.
 *
 * Server-only: it carries the Storefront token. From the browser, call the same-origin
 * proxy at /api/shopify/blog instead.
 */
export async function fetchShopifyArticles({
  first = 12,
  after = null,
  blogHandle = SHOPIFY_BLOG_HANDLE,
  noStore = false,
}: {
  first?: number;
  after?: string | null;
  blogHandle?: string;
  noStore?: boolean;
} = {}): Promise<ShopifyArticlePage> {
  // Shopify rejects connection sizes above 250.
  const pageSize = Math.min(Math.max(first, 1), 250);

  if (blogHandle) {
    const data = await shopifyStorefrontFetch<{
      blog: {
        articles: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: RawArticle[];
        };
      } | null;
    }>({
      query: BLOG_ARTICLES_QUERY,
      variables: { handle: blogHandle, first: pageSize, after },
      noStore,
    });

    // A wrong handle resolves to null rather than erroring — treat it as "no posts".
    if (!data.blog) return { articles: [], hasNextPage: false, endCursor: null };

    return {
      articles: data.blog.articles.nodes.map(normalizeArticle),
      hasNextPage: data.blog.articles.pageInfo.hasNextPage,
      endCursor: data.blog.articles.pageInfo.endCursor,
    };
  }

  const data = await shopifyStorefrontFetch<{
    articles: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: RawArticle[];
    };
  }>({
    query: ALL_ARTICLES_QUERY,
    variables: { first: pageSize, after },
    noStore,
  });

  return {
    articles: data.articles.nodes.map(normalizeArticle),
    hasNextPage: data.articles.pageInfo.hasNextPage,
    endCursor: data.articles.pageInfo.endCursor,
  };
}

/** One post with its rendered body, or null when the handle does not exist. */
export async function fetchShopifyArticle(
  handle: string,
  blogHandle: string = SHOPIFY_BLOG_HANDLE
): Promise<ShopifyArticle | null> {
  // articleByHandle hangs off Blog, so an all-blogs configuration has no single blog to
  // ask; fall back to scanning the newest posts for a matching handle.
  if (!blogHandle) {
    const { articles } = await fetchShopifyArticles({ first: 250, blogHandle: "" });
    const match = articles.find((a) => a.handle === handle);
    if (!match?.blogHandle) return null;
    return fetchShopifyArticle(handle, match.blogHandle);
  }

  const data = await shopifyStorefrontFetch<{
    blog: { articleByHandle: RawArticle | null } | null;
  }>({
    query: ARTICLE_BY_HANDLE_QUERY,
    variables: { blogHandle, handle },
  });

  const raw = data.blog?.articleByHandle;
  return raw ? normalizeArticle(raw) : null;
}

/** "17 Mar 2026" — stable across server and client, so it cannot cause a hydration diff. */
export function formatArticleDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}
