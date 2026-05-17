"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import { AirQualityToolkitSection } from "./AirQualityToolkitSection";
import { ChartHistorySection } from "./ChartHistorySection";
import { FaqSection } from "./FaqSection";
import { HealthGuidanceSection } from "./HealthGuidanceSection";
import { IndiaAqiOverviewSection } from "./IndiaAqiOverviewSection";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingSiteHeader } from "./LandingSiteHeader";
import { LeaderboardSection } from "./LeaderboardSection";
import { PollutantsSection } from "./PollutantsSection";
import { RealtimeAqiMapSection } from "./RealtimeAqiMapSection";
import { StarFieldCanvas } from "./StarFieldCanvas";
import { SubscribeSection } from "./SubscribeSection";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")";

function scrollToRealtimeMap() {
  document
    .getElementById("sec-realtime-map")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingExperience() {
  const [isLight, setIsLight] = useState(false);
  const [heroCity, setHeroCity] = useState<HeroCitySnapshot | null>(null);
  const [locationUnavailable, setLocationUnavailable] = useState(true);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-shimmer]")
    );
    if (nodes.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.dataset.shimmerActive = "true";
          observer.unobserve(target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const shimmerDelayStyle = (delayMs: number): CSSProperties =>
    ({ "--shimmer-delay": `${delayMs}ms` }) as CSSProperties;

  return (
    <div
      className={`${isLight ? "light-theme" : ""} landing-theme min-h-screen bg-bqa-navy font-sans text-[15px] leading-relaxed text-bqa-text antialiased`}
    >
      {!isLight && <StarFieldCanvas />}
      <div
        className="grain-overlay pointer-events-none fixed inset-0 -z-10 bg-[length:256px_256px] opacity-40"
        style={{ backgroundImage: GRAIN }}
        aria-hidden
      />

      <LandingSiteHeader
        isLight={isLight}
        onToggleTheme={() => setIsLight((p) => !p)}
        onCityDataLoaded={(snapshot) => {
          setLocationUnavailable(false);
          setHeroCity(snapshot);
        }}
      />

      <main className="pt-0">
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(0)}
        >
          <LandingHero
            isLight={isLight}
            onScrollToMap={scrollToRealtimeMap}
            citySnapshot={heroCity}
            isLocatingLocation={false}
            locationUnavailable={locationUnavailable}
          />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(40)}
        >
          <AirQualityToolkitSection isLight={isLight} citySnapshot={heroCity} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(80)}
        >
          <ChartHistorySection citySnapshot={heroCity} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(120)}
        >
          <RealtimeAqiMapSection isLight={isLight} selectedCity={heroCity} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(160)}
        >
          <PollutantsSection citySnapshot={heroCity} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(200)}
        >
          <LeaderboardSection isLight={isLight} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(240)}
        >
          <IndiaAqiOverviewSection />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(280)}
        >
          <HealthGuidanceSection isLight={isLight} />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(320)}
        >
          <FaqSection />
        </div>
        <div
          className="section-shimmer"
          data-section-shimmer
          style={shimmerDelayStyle(360)}
        >
          <SubscribeSection />
        </div>
      </main>

      <div
        className="section-shimmer"
        data-section-shimmer
        style={shimmerDelayStyle(400)}
      >
        <LandingFooter />
      </div>
    </div>
  );
}
