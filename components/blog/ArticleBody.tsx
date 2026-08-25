import "./article-body.css";

/**
 * Renders a Shopify post body.
 *
 * `contentHtml` is trusted first-party content — it can only be authored by a staff
 * account inside Shopify admin, and the Storefront API already sanitizes it — so
 * injecting it directly is safe here. Never route arbitrary user HTML through this.
 */
export function ArticleBody({ html }: { html: string }) {
  return (
    <div className="shopify-article" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
