"use client";

import { useState, type ReactNode } from "react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingSiteHeader } from "@/components/landing/LandingSiteHeader";
import { StarFieldCanvas } from "@/components/landing/StarFieldCanvas";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")";

/**
 * Chrome for the /blog routes — same header, footer, grain and theme toggle as the landing
 * page, so a post does not read as a different site.
 *
 * A thin client wrapper: it only owns the light/dark toggle the header needs. The pages it
 * wraps stay server components, since `children` is passed through untouched.
 *
 * `onCityDataLoaded` is deliberately not supplied — the header's city search has no AQI
 * panel to update on these routes, so a selection simply resolves and stops there.
 */
export function BlogPageShell({ children }: { children: ReactNode }) {
  const [isLight, setIsLight] = useState(false);

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
      />

      <main className="pt-0">{children}</main>

      <LandingFooter />
    </div>
  );
}
