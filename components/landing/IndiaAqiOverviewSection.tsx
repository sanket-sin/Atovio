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

const FALLBACK_CARDS = [
  {
    badge: "Policy",
    color: "#3d9eff",
    date: "Mar 16, 2026",
    headline:
      "CPCB Proposes 72hr AQI Averaging to Replace Outdated 24hr Standard",
    body: "Environmental ministry reviews methodology after BeyondAQI data reveals 3× variance between real-time and declared readings.",
    link: "#",
    author: "BeyondAQI Desk",
    readTime: "6 min read",
    image: null as string | null,
  },
  {
    badge: "Science",
    color: "#00e5aa",
    date: "Mar 15, 2026",
    headline:
      "New IIT Study Links PM2.5 Spikes to 19% Rise in Emergency Cardiac Events in Mumbai",
    body: "Researchers correlate hyperlocal sensor data with hospital admission records across 11 Mumbai districts.",
    link: "#",
    author: "BeyondAQI Desk",
    readTime: "5 min read",
    image: null as string | null,
  },
  {
    badge: "City Report",
    color: "#ffd24d",
    date: "Mar 14, 2026",
    headline:
      "Bengaluru Records Best Air Month Since 2019 — Construction Dust Controls Show Results",
    body: "AQI averaged 87 across city sensors in February, down from 134 same period last year. BBMP credits zoning enforcement.",
    link: "#",
    author: "BeyondAQI Desk",
    readTime: "4 min read",
    image: null as string | null,
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

function newsToCard(item: FeedNewsItem, index: number) {
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
    author: "BeyondAQI Desk",
    readTime: estimateReadTime(item.title, item.description),
    image: item.thumbnail || null,
  };
}

type NewsCardView = (typeof FALLBACK_CARDS)[number];

const FEATURED_ROTATE_MS = 5000;
const SIDEBAR_CARD_COUNT = 3;

export function IndiaAqiOverviewSection() {
  const [cards, setCards] = useState<NewsCardView[]>(FALLBACK_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = cards[activeIndex] ?? cards[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const news = await fetchFeedNews();
        if (cancelled || news.length === 0) return;

        const pool = news
          .slice(0, SIDEBAR_CARD_COUNT)
          .map((item, index) => newsToCard(item, index));
        if (pool.length > 0) {
          setCards(pool);
          setActiveIndex(0);
        }
      } catch {
        /* keep fallback content */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (cards.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, FEATURED_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [cards.length]);

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
            href={active.link}
            target={active.link.startsWith("http") ? "_blank" : undefined}
            rel={active.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-[480px]"
            aria-live="polite"
          >
            {active.image ? (
              <Image
                key={active.link}
                src={active.image}
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

            <div key={activeIndex} className="relative z-[1] p-6 sm:p-7">
              <div
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-widest text-white backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(5, 11, 24, 0.78)",
                  borderColor: active.color,
                  boxShadow: `0 0 0 1px ${active.color}55 inset`,
                }}
              >
                {active.badge}
              </div>
              <h3 className="mb-4 font-sans text-xl font-bold leading-snug tracking-[-0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] transition-colors group-hover:text-sky-100 sm:text-[1.4rem]">
                {active.headline}
              </h3>
              <div className="flex flex-wrap items-center gap-3 font-sans text-[0.78rem] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
                <span>{active.date}</span>
                <span className="h-3 w-px bg-white/35" />
                <span>{active.author}</span>
                <span className="h-3 w-px bg-white/35" />
                <span>{active.readTime}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {cards.map(({ badge, color, date, headline, body, link }, index) => (
              <Link
                key={`${headline}-${date}`}
                href={link}
                target={link.startsWith("http") ? "_blank" : undefined}
                rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group flex flex-1 flex-col rounded-2xl border bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/25 hover:bg-bqa-navy2/90 ${
                  index === activeIndex
                    ? "border-sky-400/35 bg-bqa-navy2/95 ring-1 ring-sky-400/15"
                    : "border-sky-400/10"
                }`}
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-widest"
                    style={{
                      color,
                      background: `${color}30`,
                      border: `1px solid ${color}55`,
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
