import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-sky-400/10 bg-bqa-navy2 py-12 pb-6">
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-12">
          <div>
            <div className="mb-3.5 text-lg font-bold text-white">
              Beyond<span className="text-bqa-accent2">AQI</span>
            </div>
            <p className="max-w-[280px] text-[0.85rem] leading-relaxed text-bqa-muted">
              India&apos;s most granular real-time air quality intelligence.
              Powered by 200+ IoT sensor nodes. Zero API smoothing.
            </p>
          </div>
          <div>
            <h5 className="mb-4 font-mono text-[0.68rem] uppercase tracking-widest text-bqa-text">
              Explore
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                "My Country",
                "My State",
                "My City",
                "Sensor Map",
                "National Leaderboard",
              ].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-[0.87rem] text-bqa-muted transition-colors hover:text-bqa-accent2"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="mb-4 font-mono text-[0.68rem] uppercase tracking-widest text-bqa-text">
              Resources
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                "Developer API",
                "Methodology",
                "Research Papers",
                "About BeyondAQI",
                "Contact",
              ].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-[0.87rem] text-bqa-muted transition-colors hover:text-bqa-accent2"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-sky-400/10 pt-6 text-[0.78rem] text-bqa-dim sm:flex-row sm:items-center">
          <span>© 2026 BeyondAQI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
