"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  fetchCityAqiBySlug,
  fetchCityAqiByLocationParts,
  normalizeBeyondAqiSlug,
  type HeroCitySnapshot,
} from "@/lib/api/aqi-city";
import {
  isFetchableCitySearchResult,
  resolveSearchResultSlug,
  searchAqi,
} from "@/lib/api/aqi-search";
import type { DetectedCity } from "@/lib/location/detect-city";
import { detectUserCity } from "@/lib/location/detect-city";
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

async function fetchDetectedCityAqi(
  detected: DetectedCity
): Promise<HeroCitySnapshot> {
  try {
    return await fetchCityAqiByLocationParts(detected);
  } catch (directErr) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[BeyondAQI] direct detected-city AQI failed; trying search fallback:", {
        detected,
        directErr,
      });
    }
  }

  const queries = [
    `${detected.city}, ${detected.state}, ${detected.country}`,
    `${detected.city}, ${detected.country}`,
    detected.city,
  ];

  for (const q of queries) {
    const results = await searchAqi(q);
    const city = results.find(isFetchableCitySearchResult);

    const slug = city ? resolveSearchResultSlug(city) : undefined;
    if (slug) return fetchCityAqiBySlug(normalizeBeyondAqiSlug(slug));
  }

  throw new Error(
    `Unable to resolve AQI city from detected location: ${detected.city}, ${detected.state}, ${detected.country}`
  );
}

export function LandingExperience() {
  const [isLight, setIsLight] = useState(false);
  const [heroCity, setHeroCity] = useState<HeroCitySnapshot | null>(null);
  const [isLocatingCity, setIsLocatingCity] = useState(true);
  const [locationUnavailable, setLocationUnavailable] = useState(false);
  const locationBootstrapStarted = useRef(false);
  const userSelectedCity = useRef(false);

  /**
   * Point the tab icon at the brand mark drawn for whichever theme the toggle is on: `_LT`
   * has a dark glyph for a light tab strip, `_DT` a light one for a dark strip. The static
   * <link> in app/layout.tsx only covers the dark theme the page boots into.
   *
   * The node is replaced rather than having its href reassigned — several browsers cache
   * the icon per element and ignore a bare href change, but re-read it for a fresh link.
   */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = isLight ? "/beyondaqi_LT.ico" : "/beyondaqi_DT.ico";
    document.querySelectorAll('link[rel~="icon"]').forEach((old) => old.remove());
    document.head.appendChild(link);
  }, [isLight]);

  useEffect(() => {
    if (locationBootstrapStarted.current) return;
    locationBootstrapStarted.current = true;

    let cancelled = false;

    (async () => {
      const detected = await detectUserCity();
      if (!detected || cancelled || userSelectedCity.current) {
        if (!cancelled) {
          setIsLocatingCity(false);
          if (!userSelectedCity.current) setLocationUnavailable(true);
        }
        return;
      }

      try {
        const snapshot = await fetchDetectedCityAqi(detected);
        if (!cancelled && !userSelectedCity.current) {
          setHeroCity(snapshot);
          setLocationUnavailable(false);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[BeyondAQI] initial location AQI failed:", {
            detected,
            err,
          });
        }
        if (!cancelled && !userSelectedCity.current) setLocationUnavailable(true);
      } finally {
        if (!cancelled) setIsLocatingCity(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
          userSelectedCity.current = true;
          setIsLocatingCity(false);
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
            isLocatingLocation={isLocatingCity}
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
