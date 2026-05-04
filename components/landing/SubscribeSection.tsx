import { SectionEyebrow } from "./SectionEyebrow";

export function SubscribeSection() {
  return (
    <section
      id="sec-subscribe"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-[72px]"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <div className="grid grid-cols-1 items-center gap-10 rounded-[20px] border border-sky-400/10 bg-bqa-navy2/80 p-8 backdrop-blur-md sm:gap-12 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionEyebrow className="sr-only">Newsletter</SectionEyebrow>
            <h2 className="mb-3.5 font-outfit text-[clamp(1.75rem,5vw,2.2rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text">
              Get Daily Air Quality
              <br />
              <em className="not-italic text-bqa-accent2">Intelligence</em> for
              Your City
            </h2>
            <p className="text-[0.9rem] leading-relaxed text-bqa-muted">
              Join 50,000+ Indians who receive BeyondAQI&apos;s morning air
              quality briefing — hyperlocal, sensor-verified, zero fluff.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-4">
              {[
                "Daily 7am briefing",
                "Spike alerts in real-time",
                "Weekly trend reports",
                "No spam, ever",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-1.5 text-[0.8rem] text-bqa-dim"
                >
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="#00e5aa"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-sky-400/10 bg-bqa-slate px-[18px] py-3.5 text-[0.95rem] text-bqa-text outline-none transition-shadow focus:border-bqa-accent focus:shadow-[0_0_0_3px_rgba(61,158,255,0.25)]"
            />
            <input
              type="email"
              placeholder="yourname@gmail.com"
              className="w-full rounded-xl border border-sky-400/10 bg-bqa-slate px-[18px] py-3.5 text-[0.95rem] text-bqa-text outline-none transition-shadow focus:border-bqa-accent focus:shadow-[0_0_0_3px_rgba(61,158,255,0.25)]"
            />
            <select className="w-full cursor-pointer rounded-xl border border-sky-400/10 bg-bqa-slate px-[18px] py-3.5 text-[0.95rem] text-bqa-text outline-none focus:border-bqa-accent">
              <option value="">Select your city</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bengaluru</option>
              <option>Hyderabad</option>
              <option>Chennai</option>
              <option>Kolkata</option>
              <option>Other</option>
            </select>
            <button
              type="submit"
              className="rounded-xl border-0 bg-bqa-accent py-3.5 text-[0.95rem] font-bold text-white shadow-[0_4px_16px_rgba(61,158,255,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Subscribe to Daily Briefing →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
