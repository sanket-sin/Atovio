const FEATURED = {
  headline:
    "Delhi-NCR Enters Sixth Consecutive Week of Severe Air — PM2.5 at 4.8× WHO Limit",
  date: "Mar 17, 2026",
  author: "BeyondAQI Desk",
  readTime: "6 min read",
};

const ARTICLES = [
  {
    badge: "Policy",
    color: "#3d9eff",
    date: "Mar 16, 2026",
    headline:
      "CPCB Proposes 72hr AQI Averaging to Replace Outdated 24hr Standard",
    body: "Environmental ministry reviews methodology after BeyondAQI data reveals 3× variance between real-time and declared readings.",
  },
  {
    badge: "Science",
    color: "#00e5aa",
    date: "Mar 15, 2026",
    headline:
      "New IIT Study Links PM2.5 Spikes to 19% Rise in Emergency Cardiac Events in Mumbai",
    body: "Researchers correlate hyperlocal sensor data with hospital admission records across 11 Mumbai districts.",
  },
  {
    badge: "City Report",
    color: "#ffd24d",
    date: "Mar 14, 2026",
    headline:
      "Bengaluru Records Best Air Month Since 2019 — Construction Dust Controls Show Results",
    body: "AQI averaged 87 across city sensors in February, down from 134 same period last year. BBMP credits zoning enforcement.",
  },
];

export function IndiaAqiOverviewSection() {
  return (
    <section
      id="sec-india-overview"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        {/* Section heading with divider */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="shrink-0 font-outfit text-[clamp(1.45rem,5vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text">
            India&apos;s Air Quality, Covered
          </h2>
          <div
            className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent sm:block"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* ── Featured article ── */}
          <div className="relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-[480px]">
            {/* Dusk city background */}
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

            {/* Text content */}
            <div className="relative z-[1] p-6 sm:p-7">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 font-outfit text-[0.62rem] font-bold uppercase tracking-widest text-rose-300">
                <span aria-hidden>⚠</span> Health Alert
              </div>
              <h3 className="mb-4 font-outfit text-xl font-bold leading-snug tracking-[-0.02em] text-white sm:text-[1.4rem]">
                {FEATURED.headline}
              </h3>
              <div className="flex flex-wrap items-center gap-3 font-outfit text-[0.78rem] text-bqa-dim">
                <span>{FEATURED.date}</span>
                <span className="h-3 w-px bg-bqa-dim/40" />
                <span>{FEATURED.author}</span>
                <span className="h-3 w-px bg-bqa-dim/40" />
                <span>{FEATURED.readTime}</span>
              </div>
            </div>
          </div>

          {/* ── Article cards ── */}
          <div className="flex flex-col gap-4">
            {ARTICLES.map(({ badge, color, date, headline, body }) => (
              <div
                key={headline}
                className="flex flex-1 flex-col rounded-2xl border border-sky-400/10 bg-bqa-navy2/70 p-5 backdrop-blur-md"
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 font-outfit text-[0.6rem] font-bold uppercase tracking-widest"
                    style={{
                      color,
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                    }}
                  >
                    {badge}
                  </span>
                  <span className="font-outfit text-[0.72rem] text-bqa-dim">
                    {date}
                  </span>
                </div>
                <h4 className="mb-1.5 font-outfit text-[0.9rem] font-bold leading-snug text-white">
                  {headline}
                </h4>
                <p className="font-outfit text-[0.8rem] leading-relaxed text-bqa-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
