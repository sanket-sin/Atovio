"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFeedNews, type FeedNewsItem } from "@/lib/api/feed-news";

const SIDEBAR_ACCENTS = [
  { badge: "Policy", color: "#3d9eff" },
  { badge: "Science", color: "#00e5aa" },
  { badge: "City Report", color: "#ffd24d" },
] as const;

const FALLBACK_FEATURED = {
  headline:
    "Delhi-NCR Enters Sixth Consecutive Week of Severe Air — PM2.5 at 4.8× WHO Limit",
  date: "Mar 17, 2026",
  author: "BeyondAQI Desk",
  readTime: "6 min read",
  link: "#",
  image: null as string | null,
};

const FALLBACK_ARTICLES = [
  {
    badge: "Policy",
    color: "#3d9eff",
    date: "Mar 16, 2026",
    headline:
      "CPCB Proposes 72hr AQI Averaging to Replace Outdated 24hr Standard",
    body: "Environmental ministry reviews methodology after BeyondAQI data reveals 3× variance between real-time and declared readings.",
    link: "#",
  },
  {
    badge: "Science",
    color: "#00e5aa",
    date: "Mar 15, 2026",
    headline:
      "New IIT Study Links PM2.5 Spikes to 19% Rise in Emergency Cardiac Events in Mumbai",
    body: "Researchers correlate hyperlocal sensor data with hospital admission records across 11 Mumbai districts.",
    link: "#",
  },
  {
    badge: "City Report",
    color: "#ffd24d",
    date: "Mar 14, 2026",
    headline:
      "Bengaluru Records Best Air Month Since 2019 — Construction Dust Controls Show Results",
    body: "AQI averaged 87 across city sensors in February, down from 134 same period last year. BBMP credits zoning enforcement.",
    link: "#",
  },
];

function formatNewsDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function estimateReadTime(title: string, description: string): string {
  const words = `${title} ${description}`.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function newsToFeatured(item: FeedNewsItem) {
  return {
    headline: item.title,
    date: formatNewsDate(item.pub_date),
    author: "BeyondAQI Desk",
    readTime: estimateReadTime(item.title, item.description),
    link: item.link,
    image: item.thumbnail || null,
  };
}

function newsToSidebarItem(item: FeedNewsItem, index: number) {
  const accent = SIDEBAR_ACCENTS[index % SIDEBAR_ACCENTS.length];
  return {
    badge: accent.badge,
    color: accent.color,
    date: formatNewsDate(item.pub_date),
    headline: item.title,
    body:
      item.description.trim() ||
      "Read the full story for details on air quality and environmental impact.",
    link: item.link,
  };
}

type FeaturedView = typeof FALLBACK_FEATURED;
type SidebarView = (typeof FALLBACK_ARTICLES)[number];

export function IndiaAqiOverviewSection() {
  const [featured, setFeatured] = useState<FeaturedView>(FALLBACK_FEATURED);
  const [articles, setArticles] = useState<SidebarView[]>(FALLBACK_ARTICLES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const news = await fetchFeedNews();
        if (cancelled || news.length === 0) return;

        const [first, ...rest] = news;
        setFeatured(newsToFeatured(first));
        const sidebar = rest.slice(0, 3).map(newsToSidebarItem);
        if (sidebar.length > 0) {
          setArticles(sidebar);
        }
      } catch {
        /* keep fallback content */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="sec-india-overview"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div
        className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-sans text-[clamp(1.45rem,5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text">
            India&apos;s Air Quality, Covered
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent sm:block"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Link
            href={featured.link}
            target={featured.link.startsWith("http") ? "_blank" : undefined}
            rel={featured.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-[480px]"
          >
            {featured.image ? (
              <Image
                src={featured.image}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02] group-hover:brightness-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                  linear-gradient(to bottom, rgba(5,11,24,0.2) 0%, transparent 28%, rgba(5,11,24,0.65) 62%, rgba(5,11,24,0.97) 100%),
                  radial-gradient(ellipse at 50% 38%, rgba(190,95,20,0.5) 0%, rgba(110,40,60,0.28) 42%, transparent 68%),
                  linear-gradient(155deg, #0d0a1e 0%, #1c0f18 45%, #0e1220 100%)
                `,
                  }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: "url('/images/hero-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom",
                    filter: "saturate(0.25) brightness(0.35)",
                  }}
                  aria-hidden
                />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bqa-navy/97 via-bqa-navy/50 to-bqa-navy/10" />

            <div className="relative z-[1] p-6 sm:p-7">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-widest text-rose-300">
                <span aria-hidden>⚠</span> Health Alert
              </div>
              <h3 className="mb-4 font-sans text-xl font-bold leading-snug tracking-[-0.02em] text-white transition-colors group-hover:text-sky-100 sm:text-[1.4rem]">
                {featured.headline}
              </h3>
              <div className="flex flex-wrap items-center gap-3 font-sans text-[0.78rem] text-bqa-dim">
                <span>{featured.date}</span>
                <span className="h-3 w-px bg-bqa-dim/40" />
                <span>{featured.author}</span>
                <span className="h-3 w-px bg-bqa-dim/40" />
                <span>{featured.readTime}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {articles.map(({ badge, color, date, headline, body, link }) => (
              <Link
                key={`${headline}-${date}`}
                href={link}
                target={link.startsWith("http") ? "_blank" : undefined}
                rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex flex-1 flex-col rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/25 hover:bg-bqa-navy2/90"
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-widest"
                    style={{
                      color,
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                    }}
                  >
                    {badge}
                  </span>
                  <span className="font-sans text-[0.72rem] text-bqa-dim">
                    {date}
                  </span>
                </div>
                <h4 className="mb-1.5 font-sans text-[0.9rem] font-bold leading-snug text-white group-hover:text-sky-100">
                  {headline}
                </h4>
                <p className="font-sans text-[0.8rem] leading-relaxed text-bqa-muted line-clamp-3">
                  {body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
