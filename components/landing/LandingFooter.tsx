import Image from "next/image";
import Link from "next/link";

const EXPLORE_LINKS = [
  "My Country",
  "My State",
  "My City",
  "Sensor Map",
  "National Leaderboard",
] as const;

const RESOURCE_LINKS = [
  "Developer API",
  "Methodology",
  "Research Papers",
  "About BeyondAQI",
  "Contact",
] as const;

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly string[];
}) {
  return (
    <div>
      <h5 className="mb-3 font-sans text-[0.68rem] uppercase tracking-widest text-bqa-text sm:mb-4">
        {title}
      </h5>
      <ul className="flex flex-col gap-2 sm:gap-2.5">
        {links.map((l) => (
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
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-sky-400/10 bg-bqa-navy2 py-10 pb-6 sm:py-12">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:mb-10 sm:gap-x-10 lg:grid-cols-[2fr_1fr_1fr] lg:gap-12">
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <Image
              src="/images/white-Logo.svg"
              alt="BeyondAQI by atovio"
              width={135}
              height={43}
              unoptimized
              className="mb-3 h-8 w-auto sm:h-9"
            />
            <p className="max-w-[300px] text-[0.85rem] leading-relaxed text-bqa-muted">
              India&apos;s most granular real-time air quality intelligence. Powered by 200+ IoT
              sensor nodes. Zero API smoothing.
            </p>
          </div>

          <FooterLinkColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterLinkColumn title="Resources" links={RESOURCE_LINKS} />
        </div>

        <div className="border-t border-sky-400/10 pt-5 text-center text-[0.78rem] text-bqa-dim sm:pt-6 lg:text-left">
          <span>© 2026 BeyondAQI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
