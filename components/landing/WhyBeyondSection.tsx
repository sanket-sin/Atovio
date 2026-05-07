"use client";

import { useEffect, useRef, useState } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";
import { SensorMapVisual } from "./SensorMapVisual";

function useCountUp(target: number, enabled: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const dur = 1200;
    const step = 16;
    const t = setInterval(() => {
      start = Math.min(start + Math.ceil(target / (dur / step)), target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [target, enabled]);
  return val;
}

function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove}>
      {children}
    </div>
  );
}

export function WhyBeyondSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(500, visible);

  return (
    <section id="sec-why" className="sec-fx py-14 sm:py-[72px]">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionEyebrow className="mb-2">Why BeyondAQI</SectionEyebrow>
        <div className="mb-9 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <SectionTitle className="mb-0 sm:max-w-[min(100%,520px)]">
            Built Different.
            <br />
            Trusted by Those Who Need Real Data.
          </SectionTitle>
          <p className="max-w-[320px] text-[0.85rem] leading-relaxed text-bqa-muted">
            BeyondAQI is built on physical infrastructure and editorial
            integrity — not estimates, not press releases.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[2fr_1fr] lg:grid-rows-[auto_auto]">
          <SpotlightCard className="why-spotlight relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl border border-sky-400/15 bg-gradient-to-br from-[rgba(10,22,44,0.92)] to-[rgba(6,14,30,0.95)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow] duration-300 sm:min-h-[380px] sm:p-10 lg:row-span-2">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_110%_0%,rgba(61,158,255,0.18),transparent_60%)]"
              aria-hidden
            />
            <SensorMapVisual />
            <div className="relative z-[2]">
              <div className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-bqa-accent">
                <span className="h-px w-[18px] bg-bqa-accent" aria-hidden />
                Live Hardware Network
              </div>
              <div
                ref={heroRef}
                className="mb-1 font-sans text-[clamp(3rem,10vw,5.5rem)] font-black leading-[0.9] tracking-tight text-white"
              >
                {count}
                <sup className="align-super text-[2.2rem] font-bold text-bqa-accent">
                  +
                </sup>
              </div>
              <div className="mb-3.5 text-[1.35rem] font-bold tracking-tight text-bqa-text">
                Hyperlocal IoT Sensors Across India
              </div>
              <p className="mb-6 max-w-[420px] text-[0.9rem] leading-relaxed text-bqa-muted">
                Ground-deployed sensors at street level — not interpolated from
                satellites, not averaged across districts. Every number you see
                on BeyondAQI is a direct hardware measurement from a physical
                station near you.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "star", label: "200+ Cities" },
                  { icon: "check", label: "Hardware Verified" },
                  { icon: "shield", label: "No Satellite Estimates" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/[0.08] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wide text-bqa-accent2"
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="why-spotlight relative flex flex-col overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[rgba(10,22,44,0.92)] to-[rgba(6,14,30,0.95)] p-7 shadow-[0_12px_36px_rgba(0,0,0,0.35)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-3xl before:bg-gradient-to-r before:from-bqa-good before:to-transparent lg:col-start-2 lg:row-start-1">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-emerald-400/20 bg-emerald-400/[0.08] text-bqa-good">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="font-sans text-[3.8rem] font-black leading-none tracking-tight text-bqa-good">
              0<sub className="text-[1.4rem] font-bold">×</sub>
            </div>
            <div className="mb-2.5 text-base font-bold tracking-tight text-bqa-text">
              Zero Data Smoothing
            </div>
            <p className="flex-1 text-[0.8rem] leading-relaxed text-bqa-muted">
              Direct Raw Readings. No averaging, no interpolation, no rounding.
              What you see is exactly what the sensor transmitted at that moment
              — not a model&apos;s best guess.
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-emerald-400/10 pt-3.5 font-mono text-[0.68rem] uppercase tracking-wider text-bqa-good opacity-80">
              <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
              Pure Raw Signal Feed
            </div>
          </SpotlightCard>

          <SpotlightCard className="why-spotlight relative flex flex-col overflow-hidden rounded-3xl border border-amber-300/15 bg-gradient-to-br from-[rgba(10,22,44,0.92)] to-[rgba(6,14,30,0.95)] p-7 shadow-[0_12px_36px_rgba(0,0,0,0.35)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-3xl before:bg-gradient-to-r before:from-bqa-moderate before:to-transparent after:pointer-events-none after:absolute after:-bottom-[60px] after:-right-[60px] after:h-[180px] after:w-[180px] after:rounded-full after:bg-[radial-gradient(circle,rgba(255,210,77,0.08),transparent_70%)] lg:col-start-2 lg:row-start-2">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-amber-300/20 bg-amber-300/[0.08] text-bqa-moderate">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div className="mb-2.5 text-base font-bold tracking-tight text-bqa-text">
              Latest AQI News, Always Live
            </div>
            <p className="mb-4 flex-1 text-[0.8rem] leading-relaxed text-bqa-muted">
              Every story on BeyondAQI is cross-referenced with real sensor
              readings. No press release reprints — just data-verified reporting
              on India&apos;s air quality, policy, and health impact.
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                ["Health Alerts", "border-rose-400/40 bg-rose-500/10 text-rose-200"],
                ["Policy", "border-sky-400/40 bg-sky-400/10 text-sky-200"],
                ["Research", "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"],
                ["City Reports", "border-amber-400/40 bg-amber-400/10 text-amber-100"],
              ].map(([label, c]) => (
                <span
                  key={label}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[0.64rem] font-bold uppercase tracking-wide ${c}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 border-t border-amber-300/10 pt-3.5 font-mono text-[0.68rem] uppercase tracking-wider text-bqa-moderate opacity-80">
              <span className="h-1.5 w-1.5 rounded-full bg-bqa-moderate shadow-[0_0_6px_#ffd24d]" />
              Sensor-Verified Journalism
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
