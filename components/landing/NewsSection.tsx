import Image from "next/image";
import Link from "next/link";
const NEWS_BG =
  "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1600&q=80";
const FEATURED_IMG =
  "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=1200&q=80";

export function NewsSection() {
  return (
    <section id="sec-news" className="sec-fx relative overflow-hidden border-t border-sky-400/10">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${NEWS_BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-bqa-navy/94 via-bqa-navy/88 to-bqa-navy/97"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-display text-[1.65rem] font-normal leading-tight tracking-tight text-bqa-text sm:text-[2rem]">
            India&apos;s Air Quality, Covered.
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/25 to-transparent sm:block"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <article className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[20px] sm:min-h-[480px]">
            <Image
              src={FEATURED_IMG}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bqa-navy/97 via-bqa-navy/50 to-bqa-navy/10" />
            <div className="relative z-[2] p-6 sm:p-8">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-rose-200">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Health Alert
              </div>
              <h2 className="mb-3 font-display text-2xl font-normal leading-tight tracking-tight text-white sm:text-3xl">
                Delhi-NCR Enters Sixth Consecutive Week of Severe Air — PM2.5 at
                4.8× WHO Limit
              </h2>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-bqa-dim">
                <span>Mar 17, 2026</span>
                <span className="text-bqa-dim/60">|</span>
                <span>BeyondAQI Desk</span>
                <span className="text-bqa-dim/60">|</span>
                <span>6 min read</span>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-4">
            <article className="rounded-[14px] border border-sky-400/10 border-l-[3px] border-l-sky-400 bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/20">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wide text-sky-300">
                  Policy
                </span>
                <span className="font-mono text-[0.65rem] text-bqa-dim">
                  Mar 16, 2026
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-bqa-text">
                CPCB Proposes 72hr AQI Averaging to Replace Outdated 24hr
                Standard
              </h3>
              <p className="text-sm leading-relaxed text-bqa-muted">
                Environmental ministry reviews methodology after BeyondAQI data
                reveals 3× variance between real-time and declared readings.
              </p>
            </article>

            <article className="rounded-[14px] border border-sky-400/10 border-l-[3px] border-l-emerald-400 bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/20">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wide text-emerald-300">
                  Science
                </span>
                <span className="font-mono text-[0.65rem] text-bqa-dim">
                  Mar 15, 2026
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-bqa-text">
                New IIT Study Links PM2.5 Spikes to 19% Rise in Emergency
                Cardiac Events in Mumbai
              </h3>
              <p className="text-sm leading-relaxed text-bqa-muted">
                Researchers correlate hyperlocal sensor data with hospital
                admission records across 11 Mumbai districts.
              </p>
            </article>

            <article className="rounded-[14px] border border-sky-400/10 border-l-[3px] border-l-amber-400 bg-bqa-navy2/70 p-5 backdrop-blur-md transition-colors hover:border-sky-400/20">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wide text-amber-200">
                  City Report
                </span>
                <span className="font-mono text-[0.65rem] text-bqa-dim">
                  Mar 14, 2026
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-bqa-text">
                Bengaluru Records Best Air Month Since 2019 — Construction Dust
                Controls Show Results
              </h3>
              <p className="text-sm leading-relaxed text-bqa-muted">
                AQI averaged 87 across city sensors in February, down from 134
                same period last year. BBMP credits zoning enforcement.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-bqa-slate/80 px-6 py-3 text-sm font-semibold text-bqa-text backdrop-blur-sm transition-all hover:border-sky-400/30 hover:bg-bqa-slate"
          >
            <span>View All AQI News Stories</span>
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
