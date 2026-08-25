# Shopify Blog Integration

Blog posts are pulled live from Shopify with the **Storefront API** (GraphQL, read-only).
Nothing is copied into this repo — publish in Shopify, and the post appears on the site
within the cache window (5 minutes) without a redeploy.

---

## Step 0 — Know which "app" you need

There are two different things called an app in Shopify, and only one of them is relevant here:

| | Where it lives | What it's for |
| --- | --- | --- |
| **Partner app** | `dev.shopify.com/dashboard` → **Apps** | Distributable apps installed by many merchants, via OAuth. Needs a server-side install flow and session storage. |
| **Custom app** ← *this one* | Store admin → **Settings → Apps and sales channels → Develop apps** | One store, one token, no OAuth. Exactly what a website reading its own blog needs. |

If the app you already created is a **Partner app**, it does not give you a Storefront token
directly — skip it and create a custom app in the store admin as below. Nothing is lost;
the two can coexist.

## Step 1 — Get into the Atovio store admin

From the **dev dashboard → Stores → Collaborations** tab, click the **Atovio** row. That
opens the store admin at `https://admin.shopify.com/store/<store-handle>`.

Note the `<store-handle>` in that URL — you need it in Step 7. It is *not* `atovio.in`;
that is the public custom domain, and the Storefront API does not answer on it.

### If you are a collaborator (not the store owner)

Creating a custom app needs the **Develop apps** permission, and the very first custom app
on a store can only be unlocked by the **store owner**. If **Develop apps** is greyed out or
missing, send the store owner this:

> Please go to Settings → Apps and sales channels → Develop apps → click **Allow custom app
> development** (twice, to confirm). Then under Collaborators, grant my account the **Develop
> apps** permission. I need a read-only Storefront API token to show our blog posts on the
> new website — scope `unauthenticated_read_content` only, no access to orders or customers.

Alternatively, the owner can run Steps 2–4 themselves and send you just the token. That is
often the faster path — it is four clicks for them, and the token is all this project needs.

## Step 2 — Create (or open) the custom app

1. In the store admin: bottom-left **Settings**
2. **Apps and sales channels**
3. **Develop apps** (top of the page)
4. **Create an app** → name it `BeyondAQI Website` → **Create app**
   - If one already exists for this purpose, just click it to open

## Step 3 — Turn on Storefront API access

This is the step that actually exposes blog content. Do not skip it — without the scope, the token authenticates fine but returns "access denied" on every blog query.

1. Inside the app, open the **Configuration** tab
2. Scroll to **Storefront API integration** → click **Configure**
3. Under **Storefront API access scopes**, tick:
   - ☑ **`unauthenticated_read_content`** ← blogs, articles, pages
4. Leave everything else unticked. Nothing about products, customers or orders is needed.
5. Click **Save** (top right)

## Step 4 — Install the app and copy the token

1. Open the **API credentials** tab
2. If a button says **Install app**, click it → **Install**. A token is only issued after installation.
3. Scroll to **Storefront API access token**
4. Click **Reveal token once** (or the copy icon) and copy the value

**What you're copying:** a 32-character lowercase hex string, e.g. `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`.

⚠️ Higher on the same page is the **Admin API access token**, which starts with `shpat_`. That is the wrong one — it grants write access to orders and customers. The checker in Step 8 will reject it if you paste it by mistake.

> Shopify shows the Storefront token as often as you like, unlike the Admin token which is one-time-reveal. If you lose it, come back to this tab.

## Step 5 — Find your blog handle

1. Shopify admin → left sidebar → **Content** → **Blog posts**
2. Top right → **Manage blogs**
3. Click the blog you want to pull from
4. Read the handle from the URL preview on that page — it's the segment after `/blogs/`

A store's default blog is called *News* with the handle `news`. If you renamed it, the handle probably did **not** change with it.

Don't want to pick one? Leave `SHOPIFY_BLOG_HANDLE` blank and the site pulls posts from every blog on the store, newest first.

## Step 6 — Make sure the posts are actually publishable

The Storefront API only returns posts that are published **and** available to the Online Store sales channel. A post that looks fine in admin can still be invisible to the API.

For each post: **Content** → **Blog posts** → open it → right-hand **Visibility** panel → set to **Visible** (not *Hidden*, not a future date).

If your store is password-protected (**Settings → Preferences → Password protection**), that blocks the storefront but *not* the Storefront API, so you can leave it on during development.

## Step 7 — Put the values in your env file

Open `.env.local` in the project root and fill in the three keys that are already stubbed there:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
SHOPIFY_BLOG_HANDLE=news
```

Notes on each:
- **`SHOPIFY_STORE_DOMAIN`** — the `*.myshopify.com` domain, **not** your public custom domain. Find it in the browser address bar of your admin, or under **Settings → Domains** as the one labelled *(this is your permanent domain)*. No `https://`, no trailing slash.
- **`SHOPIFY_STOREFRONT_ACCESS_TOKEN`** — the value from Step 4.
- **`SHOPIFY_BLOG_HANDLE`** — from Step 5, or blank for all blogs.

## Step 8 — Verify before you touch the UI

```bash
npm run check:shopify
```

This runs the exact same Storefront calls the site makes and tells you which step is wrong. It checks, in order: the env vars are present and the token isn't an Admin token → the token is accepted by your store → the content scope is granted, and lists every blog with its handle → the posts that will render.

A healthy run ends with `All checks passed.` and a list of your post titles.

Common failures and what they mean:

| Output | Fix |
| --- | --- |
| `That is an ADMIN API token` | You copied the `shpat_…` one. Go back to Step 4, scroll further down. |
| `HTTP 401/403 — token rejected` | The app isn't installed, or the token was regenerated. Step 4, click **Install app**, re-copy. |
| `HTTP 404 — no Storefront API at that URL` | `SHOPIFY_STORE_DOMAIN` is misspelled, or it's your custom domain instead of the myshopify one. |
| `access denied` / `not approved` on blogs | The `unauthenticated_read_content` scope is missing. Redo Step 3 — and remember to hit **Save**. |
| `matches none of the blogs above` | `SHOPIFY_BLOG_HANDLE` is wrong; the script prints the valid handles — copy one. |
| `no published posts were returned` | Connection is fine; the posts are drafts or hidden. See Step 6. |

## Step 9 — Run it

```bash
npm run dev
```

Next reads `.env.local` only at boot, so **restart the dev server** if it was already running — this is the single most common reason a correct token appears not to work.

Then check the three surfaces:
- `http://localhost:3000/` — the **From the BeyondAQI Blog** section, sitting above the newsletter block
- `http://localhost:3000/blog` — the full listing with **Load more**
- `http://localhost:3000/blog/<handle>` — click any card

## Step 10 — Deploy

Add the same three variables to your hosting provider — they are **not** in git (`.env*.local` is gitignored), so the build will render an empty blog until you do.

This repo has an `amplify.yml`, so for AWS Amplify: **App settings → Environment variables → Manage variables → Add variable** for each of the three, then **Redeploy this version**.

On Vercel: **Project → Settings → Environment Variables**, add all three to *Production*, *Preview* and *Development*, then redeploy.

## Step 11 (optional) — Publish instantly instead of within 5 minutes

By default a new Shopify post appears on the site within 5 minutes (the `revalidate: 300` cache window). To make it instant, add a route that calls `revalidateTag("shopify-blog")` and point a Shopify webhook at it:

**Settings → Notifications → Webhooks → Create webhook** → event **Article creation** (and again for **Article update**) → your URL → format JSON.

Tell me if you want this wired up and I'll add the route with signature verification.

---

## What was added

| File | Role |
| --- | --- |
| `lib/config/shopify.ts` | Env vars, API version, endpoint, `isShopifyConfigured()` |
| `lib/shopify/storefront.ts` | GraphQL client — auth header, timeout, cache, error types |
| `lib/shopify/blog.ts` | Queries + normalizer → `ShopifyArticle`, `fetchShopifyArticles()`, `fetchShopifyArticle()` |
| `lib/api/shopify-blog.ts` | Browser-side fetch against the proxy |
| `app/api/shopify/blog/route.ts` | Same-origin proxy so the token stays server-side |
| `components/blog/BlogCard.tsx` | `FeaturedBlogCard` + `BlogCard` (`row` / `grid` layouts) |
| `components/blog/ArticleBody.tsx` + `article-body.css` | Post body rendering and typography |
| `components/blog/BlogListing.tsx` | Cursor-paginated grid with **Load more** |
| `components/blog/BlogPageShell.tsx` | Landing header/footer/theme chrome for blog routes |
| `components/landing/BlogSection.tsx` | Landing-page section (4 newest posts) |
| `app/blog/page.tsx` | Listing page — SSG, revalidates every 300s |
| `app/blog/[handle]/page.tsx` | Post page — SSG for the 20 newest, on-demand beyond that |
| `scripts/check-shopify.js` | `npm run check:shopify` connection diagnostics |

## Caching

Storefront responses go through the Next data cache with `revalidate: 300` and the tag
`shopify-blog`. To publish instantly instead of waiting out the window, add a route that
calls `revalidateTag("shopify-blog")` and point a Shopify **article create/update** webhook
at it.

## Notes

- `cdn.shopify.com` is registered in `next.config.js` → `images.remotePatterns`, which is
  what allows `next/image` to optimize featured images.
- Post bodies are injected with `dangerouslySetInnerHTML`. This is safe here because the
  HTML can only be authored by a staff account in Shopify admin — do not reuse
  `ArticleBody` for user-submitted content.
- Every fetch fails soft: a missing token, a wrong blog handle, or a Shopify outage renders
  an empty state, never a 500.
