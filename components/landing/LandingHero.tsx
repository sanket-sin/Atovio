"use client";

import { useId } from "react";
import { AqiBadge } from "./AqiBadge";

const HERO_BG = "/images/hero-bg.png";

type LandingHeroProps = {
  onScrollToMap: () => void;
};

export function LandingHero({ onScrollToMap }: LandingHeroProps) {
  const whoRingGradId = useId().replace(/:/g, "");
  const ringR = 42;
  const ringC = 2 * Math.PI * ringR;
  const whoHours = 19;
  const whoDash = (whoHours / 24) * ringC;

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-sky-400/10 pt-[7.75rem] sm:pt-[8rem]">
      <div
        className="absolute inset-0 z-0 scale-105 animate-hero-drift bg-cover bg-[center_20%]"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-bqa-navy via-bqa-navy/50 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-bqa-navy/95 via-bqa-navy/70 to-bqa-navy/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_60%_at_10%_40%,rgba(0,229,170,0.07),transparent_50%),radial-gradient(ellipse_50%_50%_at_90%_20%,rgba(61,158,255,0.09),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-container px-4 sm:px-7">
        <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-2 md:gap-5 lg:grid-cols-[1fr_1fr_1fr] lg:items-stretch">

          {/* Left: headline text */}
          <div className="max-lg:order-1 lg:self-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-rose-200">
              <span
                className="h-1.5 w-1.5 animate-blink rounded-full bg-bqa-unhealthy shadow-[0_0_8px_#ff4d6d]"
                aria-hidden
              />
              Live · Updated 09:00 IST
            </div>
            <h1 className="mb-3.5 font-outfit text-4xl font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:text-5xl lg:text-[48px] lg:leading-[52.8px]">
              Mumbai Air Quality
              <br />
              Index —{" "}
              <em className="not-italic font-numeric tracking-normal text-bqa-poor">
                160
              </em>
            </h1>
            <p className="mb-6 max-w-[380px] text-[0.95rem] leading-relaxed text-bqa-muted">
              Real-time PM₂.₅, PM₁₀, O₃, NO₂, SO₂, CO from BeyondAQI&apos;s
              hyperlocal sensor network. Zero API smoothing. Zero delay.
            </p>
          </div>

          {/* Center: AQI card */}
          <div className="max-lg:order-3 md:max-lg:col-span-2 lg:order-none lg:max-w-none lg:flex lg:flex-col">
            <div className="relative flex flex-col flex-1 overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/80 p-6 shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(255,140,66,0.08)]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-[20px] bg-[linear-gradient(90deg,#00e5aa,#ffd24d,#ff8c42,#ff4d6d,#c77dff,#9b2dff)]"
                aria-hidden
              />

              {/* Label */}
              <div className="mb-1 font-outfit text-[10.9px] font-normal uppercase leading-[17.4px] tracking-[2px] text-bqa-dim">
                Outdoor AQI • Mumbai
              </div>

              {/* Big number left, buttons right */}
              <div className="flex items-start justify-between gap-3">
                <div className="font-numeric text-[clamp(3.5rem,10vw,5.5rem)] font-bold leading-[1] tracking-normal text-bqa-poor drop-shadow-[0_0_40px_rgba(255,140,66,0.3)]">
                  160
                </div>
                <div className="flex shrink-0 flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onScrollToMap}
                    className="rounded-[10px] bg-bqa-accent px-5 py-2.5 text-center text-[0.78rem] font-semibold text-white shadow-[0_4px_16px_rgba(61,158,255,0.25)] transition-all hover:brightness-110 min-w-[10.5rem]"
                  >
                    AQI Sensor Map
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-sky-400/10 bg-transparent px-5 py-2.5 text-[0.78rem] font-semibold text-bqa-muted backdrop-blur-sm transition-all hover:border-sky-400/20 hover:bg-bqa-slate hover:text-bqa-text min-w-[10.5rem]"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-bqa-unhealthy shadow-[0_0_6px_#ff4d6d]"
                      aria-hidden
                    />
                    Ping Location
                  </button>
                </div>
              </div>

              {/* POOR badge */}
              <div className="mt-3 inline-flex items-center rounded-full border border-orange-400/35 bg-orange-400/10 px-3 py-1">
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-bqa-poor">
                  Poor
                </span>
              </div>

              {/* PM2.5 / PM10 */}
              <div className="my-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border-l-[3px] border-bqa-moderate bg-bqa-slate/60 p-3">
                  <div className="mb-0.5 text-[0.68rem] font-semibold tracking-wide text-bqa-dim">
                    PM2.5
                  </div>
                  <div className="font-numeric text-xl font-bold tracking-normal text-bqa-text">
                    46{" "}
                    <span className="text-[0.7rem] font-normal text-bqa-dim">
                      µg/m³
                    </span>
                  </div>
                  <AqiBadge variant="moderate" className="mt-1.5">
                    Moderate
                  </AqiBadge>
                </div>
                <div className="rounded-lg border-l-[3px] border-bqa-unhealthy bg-bqa-slate/60 p-3">
                  <div className="mb-0.5 text-[0.68rem] font-semibold tracking-wide text-bqa-dim">
                    PM10
                  </div>
                  <div className="font-numeric text-xl font-bold tracking-normal text-bqa-text">
                    124{" "}
                    <span className="text-[0.7rem] font-normal text-bqa-dim">
                      µg/m³
                    </span>
                  </div>
                  <AqiBadge variant="unhealthy" className="mt-1.5">
                    Unhealthy
                  </AqiBadge>
                </div>
              </div>

              {/* AQI gradient bar */}
              <div className="mt-4">
                <div className="relative mb-1.5 h-2.5 rounded-md bg-gradient-to-r from-bqa-good via-bqa-moderate via-bqa-poor via-bqa-unhealthy via-bqa-severe to-bqa-hazardous shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                  <div
                    className="absolute -top-1.5 h-6 w-0.5 -translate-x-1/2 rounded-sm bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                    style={{ left: "32%" }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 py-0.5 font-numeric text-[0.65rem] font-bold tracking-normal text-[#0a0a1a]">
                      160
                    </span>
                  </div>
                </div>
                <div className="flex justify-between font-mono text-[0.62rem] font-semibold">
                  <span className="text-bqa-good">Good</span>
                  <span className="text-bqa-moderate">Moderate</span>
                  <span className="text-bqa-poor">Poor</span>
                  <span className="text-bqa-unhealthy">Unhealthy</span>
                  <span className="text-bqa-severe">Severe</span>
                  <span className="text-bqa-hazardous">Hazardous</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: weather card */}
          <div className="max-lg:order-2 md:max-lg:col-span-1 lg:order-none lg:flex lg:flex-col">
            <div className="flex flex-col flex-1 rounded-[20px] border border-sky-400/10 bg-bqa-navy2/80 p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 font-outfit text-[10.9px] font-normal uppercase leading-[17.4px] tracking-[2px] text-bqa-dim">
                Weather Conditions
              </div>

              {/* Temperature row */}
              <div className="mb-4 flex items-center gap-3.5">
                <svg
                  width="38"
                  height="38"
                  fill="none"
                  stroke="#ffd24d"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <div>
                  <div className="font-numeric text-4xl font-bold tracking-normal text-bqa-text">
                    30°C
                  </div>
                  <div className="text-sm text-bqa-muted">Sunny · Clear Skies</div>
                </div>
              </div>

              {/* 2×2 weather grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    ["FEELS LIKE", "30.3°C"],
                    ["WIND", "6 km/h SE"],
                    ["HUMIDITY", "58%"],
                    ["WIND DISP.", "Improving"],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-bqa-slate px-3 py-2.5">
                    <div className="mb-0.5 text-[0.65rem] font-semibold tracking-wide text-bqa-dim">
                      {k}
                    </div>
                    <div className="font-numeric text-[0.95rem] font-semibold tracking-normal text-bqa-text">
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {/* WHO ring — horizontal: ring left, text right */}
              <div
                className="mt-5 flex items-center gap-4"
                aria-label="19 of 24 hours above WHO PM2.5 guideline today"
              >
                <div className="relative h-[90px] w-[90px] shrink-0">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 100 100"
                    aria-hidden
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={ringR}
                      fill="none"
                      stroke={`url(#${whoRingGradId})`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${whoDash} ${ringC}`}
                    />
                    <defs>
                      <linearGradient
                        id={whoRingGradId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-numeric text-2xl font-bold tracking-normal text-bqa-text">
                      19
                    </span>
                  </div>
                </div>
                <p className="text-[0.72rem] leading-snug text-bqa-dim">
                  /24 hours above WHO PM 2.5 guideline today
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
