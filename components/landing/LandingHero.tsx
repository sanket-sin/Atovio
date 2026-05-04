"use client";

import { useId, useState } from "react";
import { AqiBadge } from "./AqiBadge";

const HERO_BG = "/images/hero-bg.png";

type LandingHeroProps = {
  isLight?: boolean;
  onScrollToMap: () => void;
};

/** Phone + magnifying glass with “AQI” — matches product tab artwork */
function TabAqiIcon({ active, isLight }: { active: boolean; isLight: boolean }) {
  const blue = active ? (isLight ? "#2563eb" : "#38bdf8") : isLight ? "#64748b" : "#64748b";
  const phoneStroke = active ? (isLight ? "#3b82f6" : "#60a5fa") : isLight ? "#94a3b8" : "#64748b";
  const lensFill = active ? (isLight ? "rgba(59,130,246,0.12)" : "rgba(56,189,248,0.14)") : "transparent";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect
        x="3.5"
        y="4"
        width="9.5"
        height="16"
        rx="2"
        stroke={phoneStroke}
        strokeWidth="1.35"
        fill={isLight ? (active ? "rgba(241,245,249,0.95)" : "rgba(226,232,240,0.75)") : "rgba(15,23,42,0.35)"}
      />
      <line x1="6" y1="7.5" x2="11" y2="7.5" stroke={phoneStroke} strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
      <circle cx="15.8" cy="9.8" r="4.1" stroke={blue} strokeWidth="1.35" fill={lensFill} />
      <path d="M18.8 12.8l2.7 2.7" stroke={blue} strokeWidth="1.35" strokeLinecap="round" />
      <text
        x="15.8"
        y="11.3"
        textAnchor="middle"
        fill={blue}
        style={{ fontFamily: "system-ui, sans-serif", fontSize: "4.5px", fontWeight: 700 }}
      >
        AQI
      </text>
    </svg>
  );
}

/** Sun behind cloud — colorful inactive/active weather glyph */
function TabWeatherIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="17.5" cy="7.2" r="3.6" fill="#fbbf24" opacity={active ? 1 : 0.88} />
      <path
        stroke="#f59e0b"
        strokeWidth="1.15"
        strokeLinecap="round"
        d="M17.5 3.4v1.1M17.5 10v1.1M21.3 7.2h1.1M13.7 7.2h1.1"
      />
      <path
        fill="#f1f5f9"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeLinejoin="round"
        d="M5.8 17.6h11.4a3.15 3.15 0 10-.2-6.25 3.55 3.55 0 00-6.85-.95 2.85 2.85 0 00-4.35 7.2z"
      />
    </svg>
  );
}

function WhoHoursRing({
  whoRingGradId,
  ringR,
  ringC,
  whoDash,
  isLight,
}: {
  whoRingGradId: string;
  ringR: number;
  ringC: number;
  whoDash: number;
  isLight?: boolean;
}) {
  return (
    <div
      className="mt-5 flex items-center gap-4"
      aria-label="19 of 24 hours above WHO PM2.5 guideline today"
    >
      <div className="relative h-[90px] w-[90px] shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.08)"}
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
            <linearGradient id={whoRingGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-numeric text-2xl font-bold tracking-normal text-bqa-text">19</span>
        </div>
      </div>
      <p className={`text-[0.72rem] leading-snug ${isLight ? "text-slate-600" : "text-bqa-dim"}`}>
        <span className={`font-semibold ${isLight ? "text-slate-800" : "text-bqa-text"}`}>/</span>
        24 hours above WHO PM 2.5 guideline today
      </p>
    </div>
  );
}

export function LandingHero({ isLight = false, onScrollToMap }: LandingHeroProps) {
  const whoRingGradId = useId().replace(/:/g, "");
  const ringR = 42;
  const ringC = 2 * Math.PI * ringR;
  const whoHours = 19;
  const whoDash = (whoHours / 24) * ringC;

  const [heroTab, setHeroTab] = useState<"aqi" | "weather">("aqi");

  const headlineBlock = (
    <>
      <div
        className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-wider ${
          isLight
            ? "border-rose-400 bg-rose-50 text-rose-700"
            : "border-rose-400/30 bg-rose-500/10 text-rose-200"
        }`}
      >
        <span
          className="h-1.5 w-1.5 animate-blink rounded-full bg-bqa-unhealthy shadow-[0_0_8px_#ff4d6d]"
          aria-hidden
        />
        Live · Updated 09:00 IST
      </div>
      <h1 className="mb-3.5 font-outfit text-[clamp(1.65rem,5.5vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-bqa-text sm:text-5xl lg:text-[48px] lg:leading-[52.8px]">
        Mumbai Air Quality
        <br />
        Index —{" "}
        <em
          className={`not-italic font-numeric tracking-normal ${
            isLight ? "text-orange-600" : "text-bqa-poor"
          }`}
        >
          160
        </em>
      </h1>
      <p
        className={`mb-0 max-w-[380px] text-[0.92rem] leading-relaxed sm:text-[0.95rem] ${
          isLight ? "text-slate-600" : "text-bqa-muted"
        }`}
      >
        Real-time PM₂.₅, PM₁₀, O₃, NO₂, SO₂, CO from BeyondAQI&apos;s hyperlocal sensor network. Zero API
        smoothing. Zero delay.
      </p>
    </>
  );

  const tabBtnBase =
    "relative flex flex-1 items-center justify-center gap-2 py-3 text-center text-[0.83rem] font-bold transition-colors";

  function tabClass(which: "aqi" | "weather") {
    const on = heroTab === which;
    const rounded =
      which === "aqi" ? "rounded-tl-[14px]" : "rounded-tr-[14px]";
    if (isLight) {
      if (on) {
        return `${rounded} border-t-[3px] border-blue-600 bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)]`;
      }
      return `${rounded} border-t-[3px] border-transparent bg-slate-200/95 text-slate-500 hover:bg-slate-200 hover:text-slate-700`;
    }
    if (on) {
      return `${rounded} border-t-[3px] border-sky-400 bg-[#152238] text-white`;
    }
    return `${rounded} border-t-[3px] border-transparent bg-[#050a14] text-white/55 hover:bg-[#0a1220] hover:text-white/85`;
  }

  return (
    <section
      id="sec-hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-sky-400/10 pt-[7rem] sm:pt-[8rem] md:pt-[7.75rem]"
    >
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

      <div className="relative z-[2] mx-auto w-full max-w-container px-4 sm:px-6 lg:px-7">
        {/* Narrow screens: headline + tabbed dashboard */}
        <div className="pb-10 pt-4 lg:hidden">
          <div className="mb-6">{headlineBlock}</div>

          <div
            className={`overflow-hidden rounded-[18px] border backdrop-blur-xl ${
              isLight
                ? "border-slate-200/90 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
                : "border-sky-400/10 bg-bqa-navy2/85 shadow-[0_24px_48px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]"
            }`}
          >
            <div
              className="pointer-events-none h-[3px] rounded-t-[18px] bg-[linear-gradient(90deg,#00e5aa,#ffd24d,#ff8c42,#ff4d6d,#c77dff,#9b2dff)]"
              aria-hidden
            />

            <div
              className={`flex overflow-hidden pt-0 ${isLight ? "border-b border-slate-200 bg-slate-100" : "border-b border-white/[0.06] bg-[#060b14]"}`}
            >
              <button
                type="button"
                onClick={() => setHeroTab("aqi")}
                className={`${tabBtnBase} ${tabClass("aqi")}`}
              >
                <TabAqiIcon active={heroTab === "aqi"} isLight={isLight} />
                AQI
              </button>
              <button
                type="button"
                onClick={() => setHeroTab("weather")}
                className={`${tabBtnBase} ${tabClass("weather")}`}
              >
                <TabWeatherIcon active={heroTab === "weather"} />
                Weather
              </button>
            </div>

            <div className={`p-5 sm:p-6 ${isLight ? "bg-white" : ""}`}>
              {heroTab === "aqi" ? (
                <>
                  <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
                    <p
                      className={`min-w-0 flex-1 font-outfit text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] sm:text-[10.5px] sm:tracking-[0.18em] ${
                        isLight ? "text-sky-700/75" : "text-bqa-dim"
                      }`}
                    >
                      Outdoor AQI · Mumbai
                    </p>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                      <span
                        className={`font-numeric text-[clamp(2rem,11vw,3.25rem)] font-bold leading-none tracking-tight ${
                          isLight ? "text-orange-600" : "text-bqa-poor drop-shadow-[0_0_40px_rgba(255,140,66,0.28)]"
                        }`}
                      >
                        160
                      </span>
                      <AqiBadge variant="poor" className="px-2.5 py-0.5 text-[0.62rem] tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[0.68rem]">
                        Poor
                      </AqiBadge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`rounded-xl border-l-[3px] border-bqa-moderate p-3 ${
                        isLight
                          ? "bg-slate-50 ring-1 ring-slate-200/90"
                          : "border border-sky-400/10 bg-bqa-slate/60"
                      }`}
                    >
                      <div
                        className={`mb-1 text-[0.68rem] font-semibold tracking-wide ${
                          isLight ? "text-slate-500" : "text-bqa-dim"
                        }`}
                      >
                        PM2.5
                      </div>
                      <div
                        className={`font-numeric text-xl font-bold tracking-normal ${
                          isLight ? "text-slate-800" : "text-bqa-text"
                        }`}
                      >
                        46{" "}
                        <span className={`text-[0.7rem] font-normal ${isLight ? "text-slate-500" : "text-bqa-dim"}`}>
                          µg/m³
                        </span>
                      </div>
                      <AqiBadge variant="moderate" className="mt-2">
                        Moderate
                      </AqiBadge>
                    </div>
                    <div
                      className={`rounded-xl border-l-[3px] border-bqa-unhealthy p-3 ${
                        isLight
                          ? "bg-slate-50 ring-1 ring-slate-200/90"
                          : "border border-sky-400/10 bg-bqa-slate/60"
                      }`}
                    >
                      <div
                        className={`mb-1 text-[0.68rem] font-semibold tracking-wide ${
                          isLight ? "text-slate-500" : "text-bqa-dim"
                        }`}
                      >
                        PM10
                      </div>
                      <div
                        className={`font-numeric text-xl font-bold tracking-normal ${
                          isLight ? "text-slate-800" : "text-bqa-text"
                        }`}
                      >
                        124{" "}
                        <span className={`text-[0.7rem] font-normal ${isLight ? "text-slate-500" : "text-bqa-dim"}`}>
                          µg/m³
                        </span>
                      </div>
                      <AqiBadge variant="unhealthy" className="mt-2">
                        Unhealthy
                      </AqiBadge>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div
                      className={`relative mb-2 h-2.5 rounded-md bg-gradient-to-r from-bqa-good via-bqa-moderate via-bqa-poor via-bqa-unhealthy via-bqa-severe to-bqa-hazardous ${
                        isLight ? "shadow-inner" : "shadow-[inset_0_2px_4px_rgba(0,0,0,0.45)]"
                      }`}
                    >
                      <div
                        className="absolute -top-1.5 h-6 w-0.5 -translate-x-1/2 rounded-sm bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]"
                        style={{ left: "32%" }}
                      >
                        <span
                          className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-numeric text-[0.65rem] font-bold tracking-normal shadow-sm ${
                            isLight ? "bg-white text-[#0f172a] ring-1 ring-slate-200" : "bg-white text-[#0a0a1a]"
                          }`}
                        >
                          160
                        </span>
                      </div>
                    </div>
                    <div className="-mx-0.5 flex justify-between gap-1 overflow-x-auto pb-0.5 font-mono text-[0.52rem] font-semibold sm:text-[0.6rem]">
                      <span className="shrink-0 text-bqa-good">Good</span>
                      <span className="shrink-0 text-bqa-moderate">Moderate</span>
                      <span className="shrink-0 text-bqa-poor">Poor</span>
                      <span className="shrink-0 text-bqa-unhealthy">Unhealthy</span>
                      <span className="shrink-0 text-bqa-severe">Severe</span>
                      <span className="shrink-0 text-bqa-hazardous">Hazardous</span>
                    </div>
                  </div>

                  <WhoHoursRing
                    whoRingGradId={`${whoRingGradId}-mob`}
                    ringR={ringR}
                    ringC={ringC}
                    whoDash={whoDash}
                    isLight={isLight}
                  />
                </>
              ) : (
                <div
                  className={`flex flex-col flex-1 rounded-[14px] border p-4 sm:p-5 ${
                    isLight ? "border-slate-200 bg-slate-50/90" : "border-sky-400/10 bg-bqa-navy2/50"
                  }`}
                >
                  <div
                    className={`mb-4 font-outfit text-[10.9px] font-normal uppercase leading-[17.4px] tracking-[2px] ${
                      isLight ? "text-sky-800/70" : "text-bqa-dim"
                    }`}
                  >
                    Weather Conditions
                  </div>
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
                      <div className="font-numeric text-4xl font-bold tracking-normal text-bqa-text">30°C</div>
                      <div className={`text-sm ${isLight ? "text-slate-600" : "text-bqa-muted"}`}>
                        Sunny · Clear Skies
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        ["FEELS LIKE", "30.3°C"],
                        ["WIND", "6 km/h SE"],
                        ["HUMIDITY", "58%"],
                        ["WIND DISP.", "Improving"],
                      ] as const
                    ).map(([k, v]) => (
                      <div
                        key={k}
                        className={`rounded-lg px-3 py-2.5 ${
                          isLight ? "bg-white ring-1 ring-slate-200/90" : "bg-bqa-slate"
                        }`}
                      >
                        <div
                          className={`mb-0.5 text-[0.65rem] font-semibold tracking-wide ${
                            isLight ? "text-slate-500" : "text-bqa-dim"
                          }`}
                        >
                          {k}
                        </div>
                        <div
                          className={`font-numeric text-[0.95rem] font-semibold tracking-normal ${
                            isLight ? "text-slate-900" : "text-bqa-text"
                          }`}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop three-column layout */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1fr] lg:items-stretch lg:gap-5 lg:py-8">
          <div className="lg:self-center">{headlineBlock}</div>

          <div className="lg:flex lg:flex-col">
            <div className="relative flex flex-col flex-1 overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/80 p-6 shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(255,140,66,0.08)]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-[20px] bg-[linear-gradient(90deg,#00e5aa,#ffd24d,#ff8c42,#ff4d6d,#c77dff,#9b2dff)]"
                aria-hidden
              />

              <div
                className={`mb-1 font-outfit text-[10.9px] font-normal uppercase leading-[17.4px] tracking-[2px] ${
                  isLight ? "text-sky-800/70" : "text-bqa-dim"
                }`}
              >
                Outdoor AQI · Mumbai
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className={`font-numeric text-[clamp(3.5rem,10vw,5.5rem)] font-bold leading-[1] tracking-normal ${
                      isLight ? "text-orange-600" : "text-bqa-poor drop-shadow-[0_0_40px_rgba(255,140,66,0.3)]"
                    }`}
                  >
                    160
                  </div>
                  <AqiBadge variant="poor" className="mt-3 px-4 py-1.5 font-outfit tracking-[0.06em]">
                    Poor
                  </AqiBadge>
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
                    className={`inline-flex items-center justify-center gap-2 rounded-[10px] border bg-transparent px-5 py-2.5 text-[0.78rem] font-semibold backdrop-blur-sm transition-all min-w-[10.5rem] ${
                      isLight
                        ? "border-sky-400/80 text-slate-800 hover:border-bqa-accent hover:bg-sky-50"
                        : "border-bqa-accent/45 text-white hover:border-bqa-accent hover:bg-bqa-accent/10"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-bqa-unhealthy shadow-[0_0_6px_#ff4d6d]"
                      aria-hidden
                    />
                    Ping Location
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border-l-[3px] border-bqa-moderate bg-bqa-slate/60 p-3">
                  <div className="mb-0.5 text-[0.68rem] font-semibold tracking-wide text-bqa-dim">PM2.5</div>
                  <div className="font-numeric text-xl font-bold tracking-normal text-bqa-text">
                    46 <span className="text-[0.7rem] font-normal text-bqa-dim">µg/m³</span>
                  </div>
                  <AqiBadge variant="moderate" className="mt-1.5">
                    Moderate
                  </AqiBadge>
                </div>
                <div className="rounded-lg border-l-[3px] border-bqa-unhealthy bg-bqa-slate/60 p-3">
                  <div className="mb-0.5 text-[0.68rem] font-semibold tracking-wide text-bqa-dim">PM10</div>
                  <div className="font-numeric text-xl font-bold tracking-normal text-bqa-text">
                    124 <span className="text-[0.7rem] font-normal text-bqa-dim">µg/m³</span>
                  </div>
                  <AqiBadge variant="unhealthy" className="mt-1.5">
                    Unhealthy
                  </AqiBadge>
                </div>
              </div>

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

          <div className="lg:flex lg:flex-col">
            <div className="flex flex-col flex-1 rounded-[20px] border border-sky-400/10 bg-bqa-navy2/80 p-5 backdrop-blur-xl sm:p-6">
              <div
                className={`mb-4 font-outfit text-[10.9px] font-normal uppercase leading-[17.4px] tracking-[2px] ${
                  isLight ? "text-sky-800/70" : "text-bqa-dim"
                }`}
              >
                Weather Conditions
              </div>

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
                  <div className="font-numeric text-4xl font-bold tracking-normal text-bqa-text">30°C</div>
                  <div className={`text-sm ${isLight ? "text-slate-600" : "text-bqa-muted"}`}>
                    Sunny · Clear Skies
                  </div>
                </div>
              </div>

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
                    <div className="mb-0.5 text-[0.65rem] font-semibold tracking-wide text-bqa-dim">{k}</div>
                    <div className="font-numeric text-[0.95rem] font-semibold tracking-normal text-bqa-text">{v}</div>
                  </div>
                ))}
              </div>

              <WhoHoursRing
                whoRingGradId={whoRingGradId}
                ringR={ringR}
                ringC={ringC}
                whoDash={whoDash}
                isLight={isLight}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
