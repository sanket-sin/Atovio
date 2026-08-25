#!/usr/bin/env node
/**
 * Shopify blog connection checker — `npm run check:shopify`
 *
 * Runs the same Storefront calls the app does and reports exactly which step failed, so a
 * misconfiguration is diagnosed here rather than as an empty section on the page.
 * Plain Node (no deps, no bundler) so it works before/independently of `next dev`.
 */

const fs = require("fs");
const path = require("path");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const ok = (m) => console.log(`${GREEN}✓${RESET} ${m}`);
const bad = (m) => console.log(`${RED}✗${RESET} ${m}`);
const warn = (m) => console.log(`${YELLOW}!${RESET} ${m}`);
const dim = (m) => console.log(`${DIM}  ${m}${RESET}`);

/** Minimal .env parser — Next loads these itself at runtime, this script does not. */
function loadEnvFile(file) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) return {};

  return fs.readFileSync(full, "utf8").split("\n").reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return acc;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return acc;
    const key = trimmed.slice(0, eq).trim();
    // Strip surrounding quotes and any trailing inline comment.
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    acc[key] = value;
    return acc;
  }, {});
}

const fileEnv = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const read = (key) => (process.env[key] ?? fileEnv[key] ?? "").trim();

const domain = read("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/+$/, "");
const token = read("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
const version = read("SHOPIFY_API_VERSION") || "2025-01";
const blogHandle = read("SHOPIFY_BLOG_HANDLE") || "news";

console.log(`\n${BOLD}Shopify blog connection check${RESET}\n`);

/* ---- Step 1: env vars present and well-formed --------------------------- */

console.log(`${BOLD}1. Environment variables${RESET}`);

let fatal = false;

if (!domain) {
  bad("SHOPIFY_STORE_DOMAIN is missing");
  dim("Add it to .env.local, e.g. SHOPIFY_STORE_DOMAIN=your-store.myshopify.com");
  fatal = true;
} else if (!domain.endsWith(".myshopify.com")) {
  warn(`SHOPIFY_STORE_DOMAIN = ${domain}`);
  dim("Expected the *.myshopify.com admin domain, not your public custom domain.");
  dim("The Storefront API only answers on the myshopify.com host.");
} else {
  ok(`SHOPIFY_STORE_DOMAIN = ${domain}`);
}

if (!token) {
  warn("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set — trying unauthenticated");
  dim("This store currently serves blog reads without a token, so the site will work.");
  dim("Set one anyway before production: that behaviour is undocumented and can be revoked.");
  dim("Shopify admin → Develop apps → your app → API credentials → Storefront API access token");
} else if (token.startsWith("shpat_") || token.startsWith("shpca_")) {
  bad("That is an ADMIN API token, not a Storefront token");
  dim("Admin tokens start with shpat_ / shpca_ and must never be used here.");
  dim("Use Configuration → Storefront API integration → the token shown under API credentials.");
  fatal = true;
} else if (!/^[0-9a-f]{32}$/i.test(token)) {
  warn(`Token does not look like a Storefront token (expected 32 hex chars, got ${token.length} chars)`);
} else {
  ok(`SHOPIFY_STOREFRONT_ACCESS_TOKEN = ${token.slice(0, 6)}…${token.slice(-4)}`);
}

ok(`SHOPIFY_API_VERSION = ${version}`);
ok(`SHOPIFY_BLOG_HANDLE = ${blogHandle || "(all blogs)"}`);

if (fatal) {
  console.log(`\n${RED}Stopped — fix the errors above and re-run.${RESET}\n`);
  process.exit(1);
}

const endpoint = `https://${domain}/api/${version}/graphql.json`;

async function storefront(query, variables) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${res.status} — non-JSON response: ${text.slice(0, 200)}`);
  }
  return { status: res.status, json };
}

(async () => {
  /* ---- Step 2: token is accepted ---------------------------------------- */

  console.log(`\n${BOLD}2. Token / endpoint${RESET}`);
  dim(endpoint);

  let probe;
  try {
    // Deliberately NOT `{ shop { ... } }` — that field needs
    // unauthenticated_read_product_listings, which a correctly least-privileged
    // content-only token does not carry. `blogs` exercises the scope we actually need.
    probe = await storefront("{ blogs(first: 1) { nodes { handle } } }");
  } catch (err) {
    bad(err.message);
    dim("A 404 here means the URL itself is wrong: check the store domain spelling, and that");
    dim(`API version "${version}" is still supported (Shopify retires versions after ~1 year).`);
    dim("A network error means the store is unreachable or password-locked to the API.");
    process.exit(1);
  }

  if (probe.status === 401 || probe.status === 403) {
    bad(`HTTP ${probe.status} — request rejected`);
    if (!token) {
      dim("This store requires a Storefront access token; set SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
    } else {
      dim("Either the token is wrong, or the app is not installed. In Shopify admin:");
      dim("Develop apps → your app → API credentials → Install app, then re-copy the token.");
    }
    process.exit(1);
  }

  if (probe.status === 404) {
    bad(`HTTP 404 — no Storefront API at that URL`);
    dim(`API version "${version}" may be retired, or the domain is wrong.`);
    process.exit(1);
  }

  if (probe.json.errors?.length) {
    bad(probe.json.errors.map((e) => e.message).join("; "));
    process.exit(1);
  }

  if (probe.json.errors?.length) {
    const message = probe.json.errors.map((e) => e.message).join("; ");
    bad(message);
    if (/access denied|scope/i.test(message)) {
      dim("The token lacks unauthenticated_read_content. In Shopify admin → Settings → Apps");
      dim("→ App development → your app → Configuration → Storefront API → tick that scope.");
    }
    process.exit(1);
  }

  ok(`Connected to ${domain}`);

  /* ---- Step 3: content scope + available blogs -------------------------- */

  console.log(`\n${BOLD}3. Blogs (needs scope: unauthenticated_read_content)${RESET}`);

  const blogsRes = await storefront(`
    { blogs(first: 20) { nodes { handle title articles(first: 1) { nodes { id } } } } }
  `);

  if (blogsRes.json.errors?.length) {
    const message = blogsRes.json.errors.map((e) => e.message).join("; ");
    bad(message);
    if (/access denied|not approved|scope/i.test(message)) {
      dim("The app is missing the content scope. Shopify admin → Develop apps → your app →");
      dim("Configuration → Storefront API integration → Configure → tick unauthenticated_read_content → Save.");
    }
    process.exit(1);
  }

  const blogs = blogsRes.json.data.blogs.nodes;

  if (blogs.length === 0) {
    bad("The store has no blogs");
    dim("Shopify admin → Content → Blog posts → Manage blogs → Add blog.");
    process.exit(1);
  }

  ok(`${blogs.length} blog(s) visible:`);
  blogs.forEach((b) => {
    const marker = b.handle === blogHandle ? `${GREEN} ← configured${RESET}` : "";
    const empty = b.articles.nodes.length === 0 ? `${DIM} (no published posts)${RESET}` : "";
    console.log(`    • ${BOLD}${b.handle}${RESET} — "${b.title}"${empty}${marker}`);
  });

  if (blogHandle && !blogs.some((b) => b.handle === blogHandle)) {
    bad(`SHOPIFY_BLOG_HANDLE="${blogHandle}" matches none of the blogs above`);
    dim("Set it to one of the handles listed, or leave it blank to read every blog.");
    process.exit(1);
  }

  /* ---- Step 4: the articles the site will actually render ---------------- */

  console.log(`\n${BOLD}4. Published posts${RESET}`);

  const articlesRes = blogHandle
    ? await storefront(
        `query($handle:String!){ blog(handle:$handle){ articles(first:5, sortKey:PUBLISHED_AT, reverse:true){
           nodes { title handle publishedAt onlineStoreUrl image{url} authorV2{name} } } } }`,
        { handle: blogHandle }
      )
    : await storefront(
        `{ articles(first:5, sortKey:PUBLISHED_AT, reverse:true){
           nodes { title handle publishedAt onlineStoreUrl image{url} authorV2{name} } } }`
      );

  if (articlesRes.json.errors?.length) {
    bad(articlesRes.json.errors.map((e) => e.message).join("; "));
    process.exit(1);
  }

  const articles = blogHandle
    ? (articlesRes.json.data.blog?.articles.nodes ?? [])
    : articlesRes.json.data.articles.nodes;

  if (articles.length === 0) {
    warn("Connection works, but no published posts were returned");
    dim("A post must be Visible (not draft) AND the blog must be available to the");
    dim("Online Store sales channel. Content → Blog posts → open the post → set Visibility.");
    process.exit(0);
  }

  ok(`${articles.length} post(s) ready to render:`);
  articles.forEach((a) => {
    const date = a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : "unpublished";
    console.log(`    • ${a.title}`);
    dim(`  /blog/${a.handle}  ·  ${date}  ·  ${a.authorV2?.name ?? "no author"}  ·  ${a.image ? "has image" : `${YELLOW}no image${RESET}`}`);
  });

  console.log(`\n${GREEN}${BOLD}All checks passed.${RESET} Restart the dev server and open /blog\n`);
})().catch((err) => {
  bad(err.message);
  process.exit(1);
});
