"use client";

import { useState } from "react";
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

export function LandingExperience() {
  const [isLight, setIsLight] = useState(false);

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

      <LandingSiteHeader isLight={isLight} onToggleTheme={() => setIsLight((p) => !p)} />

      <main className="pt-0">
        <LandingHero isLight={isLight} onScrollToMap={scrollToRealtimeMap} />
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
