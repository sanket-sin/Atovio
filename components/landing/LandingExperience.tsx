"use client";

import { useRef, useState } from "react";
import {
  fetchCityAqiBySlug,
  fetchCityAqiByLocationParts,
  normalizeBeyondAqiSlug,
  type HeroCitySnapshot,
} from "@/lib/api/aqi-city";
import { searchAqi, type AqiSearchResult } from "@/lib/api/aqi-search";
import type { DetectedCity } from "@/lib/location/detect-city";
import { detectCityFromGeolocationOnly } from "@/lib/location/detect-city";
import { DM_Serif_Display, JetBrains_Mono, Outfit, Sora } from "next/font/google";
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

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")";

function scrollToRealtimeMap() {
  document
    .getElementById("sec-realtime-map")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function citySlugFromSearchResult(result: AqiSearchResult): string | undefined {
  const fromSlug = result.slug?.trim();
  if (fromSlug) return fromSlug;
  const u = result.url?.trim();
  if (u && !/^https?:\/\//i.test(u) && u.includes("/")) return u;
  return undefined;
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
    const city = results.find((r) => {
      const slug = citySlugFromSearchResult(r);
      const normalized = slug ? normalizeBeyondAqiSlug(slug) : "";
      return (
        r.type?.toLowerCase() === "city" &&
        normalized.split("/").filter(Boolean).length >= 3
      );
    });

    const slug = city ? citySlugFromSearchResult(city) : undefined;
    if (slug) return fetchCityAqiBySlug(normalizeBeyondAqiSlug(slug));
  }

  throw new Error(
    `Unable to resolve AQI city from detected location: ${detected.city}, ${detected.state}, ${detected.country}`
  );
}

export function LandingExperience() {
  const [isLight, setIsLight] = useState(false);
  const [heroCity, setHeroCity] = useState<HeroCitySnapshot | null>(null);
  const [isLocatingCity, setIsLocatingCity] = useState(false);
  const [locationUnavailable, setLocationUnavailable] = useState(false);
  const userSelectedCity = useRef(false);

  const showLocationPrompt =
    !heroCity && !isLocatingCity && !locationUnavailable;

  async function handleEnableLocation() {
    setIsLocatingCity(true);
    try {
      const detected = await detectCityFromGeolocationOnly();
      if (!detected || userSelectedCity.current) {
        if (!userSelectedCity.current) setLocationUnavailable(true);
        return;
      }
      const snapshot = await fetchDetectedCityAqi(detected);
      if (!userSelectedCity.current) {
        setHeroCity(snapshot);
        setLocationUnavailable(false);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[BeyondAQI] location AQI failed:", err);
      }
      if (!userSelectedCity.current) setLocationUnavailable(true);
    } finally {
      setIsLocatingCity(false);
    }
  }

  function handleDismissLocationPrompt() {
    setLocationUnavailable(true);
  }

  return (
    <div
      className={`${isLight ? "light-theme" : ""} landing-theme ${dmSerif.variable} ${jetbrains.variable} ${sora.variable} ${outfit.variable} min-h-screen bg-bqa-navy font-outfit text-[15px] leading-relaxed text-bqa-text antialiased`}
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

      {showLocationPrompt && (
        <div
          className={`fixed left-0 right-0 top-14 z-[210] border-b px-4 py-3 shadow-lg sm:px-6 ${
            isLight
              ? "border-slate-200 bg-white/95 text-slate-800 backdrop-blur-md"
              : "border-sky-400/20 bg-[#0b1428]/95 text-bqa-text backdrop-blur-md"
          }`}
          role="region"
          aria-label="Location for local air quality"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-[0.92rem] leading-snug sm:text-[0.95rem]">
              <span className="font-semibold">See air quality for where you are.</span>{" "}
              Enable location — your browser will ask for permission, then we load live AQI for
              that area.
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleEnableLocation}
                className={`rounded-full px-4 py-2 text-[0.85rem] font-bold transition-colors ${
                  isLight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-sky-500 text-slate-950 hover:bg-sky-400"
                }`}
              >
                Enable location
              </button>
              <button
                type="button"
                onClick={handleDismissLocationPrompt}
                className={`rounded-full px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                  isLight
                    ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    : "border border-white/15 bg-white/5 text-bqa-muted hover:bg-white/10"
                }`}
              >
                Not now — search city
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pt-0">
        <LandingHero
          isLight={isLight}
          onScrollToMap={scrollToRealtimeMap}
          citySnapshot={heroCity}
          isLocatingLocation={isLocatingCity}
          locationUnavailable={locationUnavailable}
          locationConsentBannerVisible={showLocationPrompt}
        />
        <AirQualityToolkitSection isLight={isLight} />
        <ChartHistorySection />
        <RealtimeAqiMapSection isLight={isLight} />
        <PollutantsSection />
        <LeaderboardSection isLight={isLight} />
        <IndiaAqiOverviewSection />
        <HealthGuidanceSection isLight={isLight} />
        <FaqSection />
        <SubscribeSection />
      </main>

      <LandingFooter />
    </div>
  );
}
