"use client";

import { useId } from "react";
import type { HeroCitySnapshot } from "@/lib/api/aqi-city";
import { AqiBadge, type AqiBadgeVariant } from "./AqiBadge";
import { AnimatedCigarette } from "./AnimatedCigarette";
import type { AqiLevelVariant } from "@/lib/air-quality/aqi-levels";
import { aqiVariantToHeroBackground } from "@/lib/air-quality/aqi-levels";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AqiHeroLottie } from "./AqiHeroLottie";
import {
  AnimatedHorizontalMarker,
  AnimatedReadingValue,
  AnimatedStrokeRing,
  useAnimatedProgress,
  useInViewOnce,
} from "./ReadingAnimation";

const HERO_DEFAULT_BG = "/images/heroSec_bgImg.png";

const DEFAULT_HERO: HeroCitySnapshot = {
  cityName: "Mumbai",
  stateName: "Maharashtra",
  countryName: "India",
  locationName: "Mumbai",
  aqi: 160,
  statusLabel: "Poor",
  badgeVariant: "poor",
  puffScore: 2.1,
  pm25: 46,
  pm10: 124,
  pm25BadgeVariant: "moderate",
  pm10BadgeVariant: "unhealthy",
  updatedAt: "2026-05-06T03:30:00+00:00",
  weather: {
    temperature: 30,
    temperatureUnit: "CELSIUS",
    weatherType: "Sunny",
    weatherStatus: "Clear Skies",
    humidity: 58,
    windSpeed: 6,
    windSpeedUnit: "KILOMETERS_PER_HOUR",
  },
};

function headlineNumberTone(
  v: HeroCitySnapshot["badgeVariant"],
  isLight: boolean
): string {
  switch (v) {
    case "good":
      return isLight ? "text-emerald-600" : "text-bqa-good";
    case "moderate":
      return isLight ? "text-amber-600" : "text-bqa-moderate";
    case "poor":
      return isLight ? "text-orange-600" : "text-bqa-poor";
    case "unhealthy":
      return isLight ? "text-red-600" : "text-bqa-unhealthy";
    case "severe":
      return isLight ? "text-fuchsia-700" : "text-bqa-severe";
    case "hazardous":
      return isLight ? "text-purple-900" : "text-bqa-hazardous";
    default:
      return isLight ? "text-orange-600" : "text-bqa-poor";
  }
}

function variantLabel(v: AqiBadgeVariant): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function formatOneDecimal(n?: number): string {
  if (n == null || !Number.isFinite(n)) return "--";
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function temperatureUnitSymbol(unit?: string): string {
  return unit?.toUpperCase() === "FAHRENHEIT" ? "°F" : "°C";
}

function windSpeedUnitLabel(unit?: string): string {
  const u = unit?.toUpperCase();
  if (u === "MILES_PER_HOUR") return "mph";
  if (u === "METERS_PER_SECOND") return "m/s";
  return "km/h";
}

function formatUpdatedAt(timestamp?: string): string {
  if (!timestamp) return "09:00 IST";
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "09:00 IST";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(d);
}

function heroLocationTitle(snapshot: HeroCitySnapshot, fallback: string): string {
  const raw = snapshot.locationName?.trim();
  if (raw) {
    const first = raw.split(",")[0]?.trim();
    if (first) return first;
  }
  return snapshot.cityName || fallback;
}

function heroLocationSubtitle(snapshot: HeroCitySnapshot): string {
  const city = snapshot.cityName?.trim();
  const country = snapshot.countryName?.trim() || "India";
  if (city && city.toLowerCase() !== country.toLowerCase()) {
    return `${city}, ${country}`;
  }
  return country;
}

function solidStatusBadgeClass(variant: AqiBadgeVariant): string {
  switch (variant) {
    case "good":
      return "bg-emerald-600 text-white";
    case "moderate":
      return "bg-amber-500 text-[#1a1a1a]";
    case "poor":
      return "bg-orange-500 text-white";
    case "unhealthy":
      return "bg-rose-600 text-white";
    case "severe":
      return "bg-purple-700 text-white";
    case "hazardous":
      return "bg-[#8b1538] text-white";
    default:
      return "bg-orange-500 text-white";
  }
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v6M12 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 21s-6-5.14-6-10a6 6 0 1112 0c0 4.86-6 10-6 10z"
        fill="#e11d48"
        stroke="#e11d48"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="11" r="2.2" fill="white" />
    </svg>
  );
}

/** Sun, cloud, or rain cloud, picked from the API's free-text `weather_type`. */
function WeatherGlyph({ type }: { type?: string }) {
  const kind = (type ?? "").toLowerCase();
  const rainy = /rain|drizzle|shower|storm|thunder/.test(kind);
  const cloudy = rainy || /cloud|overcast|haze|fog|mist|smoke/.test(kind);

  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden className="shrink-0">
      <circle cx={cloudy ? 18 : 24} cy={cloudy ? 17 : 24} r={cloudy ? 8 : 10} fill="#ffc43d" />
      {cloudy && (
        <path
          d="M16 32a7 7 0 010-14 9 9 0 0117.2-2.2A6.4 6.4 0 1134 32H16z"
          fill="#cfd8e3"
        />
      )}
      {rainy && (
        <g stroke="#5aa9ff" strokeWidth="2.4" strokeLinecap="round">
          <line x1="19" y1="36" x2="17" y2="41" />
          <line x1="26" y1="36" x2="24" y2="41" />
          <line x1="33" y1="36" x2="31" y2="41" />
        </g>
      )}
    </svg>
  );
}

function HeartOutlineIcon({ isLight }: { isLight: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 ${isLight ? "text-rose-500" : "text-rose-400"}`}
    >
      <path
        d="M12 20.5l-1.1-1C5.4 14.8 2 11.8 2 8.5A4.5 4.5 0 016.5 4 5.2 5.2 0 0112 6.1 5.2 5.2 0 0117.5 4 4.5 4.5 0 0122 8.5c0 3.3-3.4 6.3-8.9 11L12 20.5z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * The mobile scale draws as six hard-edged blocks of equal width rather than one gradient.
 * Equal width is what the design asks for even though the bands are not equal in AQI terms
 * (Severe covers 100 points, Good only 50) — the evenly spaced tick row below the bar was
 * already drawn that way, so the blocks line up with the ticks.
 *
 * Colours are per-scale on purpose and deliberately not the `--bqa-*` tokens: those drive
 * badges and label text app-wide, and repainting them to match this bar would change far
 * more than the scale.
 */
const AQI_SCALE_BANDS = [
  { label: "Good", from: 0, to: 50, color: "#7CB342" },
  { label: "Moderate", from: 50, to: 100, color: "#F2C55C" },
  { label: "Poor", from: 100, to: 150, color: "#E2912E" },
  { label: "Unhealthy", from: 150, to: 200, color: "#D75A72" },
  { label: "Severe", from: 200, to: 300, color: "#9B4FB8" },
  { label: "Hazardous", from: 300, to: 500, color: "#B93034" },
] as const;

/* Derived from the bands so the ticks can never drift out of step with the blocks. */
const AQI_SCALE_TICKS = [
  ...AQI_SCALE_BANDS.map((band) => String(band.from)),
  "301+",
];

/**
 * Position along the bar — which is not the same as `aqi / 500`. The blocks are equal
 * sixths, so a linear percentage lands the marker in the wrong colour: AQI 250 is halfway
 * through Severe but only 50% of 500, which would park it on the Unhealthy/Severe seam.
 * Find the band that contains the reading and interpolate inside that block instead.
 */
function aqiToScalePercent(aqi: number): number {
  if (!Number.isFinite(aqi) || aqi <= 0) return 0;
  const index = AQI_SCALE_BANDS.findIndex((band) => aqi <= band.to);
  if (index === -1) return 100;
  const band = AQI_SCALE_BANDS[index];
  const withinBand = (aqi - band.from) / (band.to - band.from);
  const clamped = Math.min(1, Math.max(0, withinBand));
  return ((index + clamped) / AQI_SCALE_BANDS.length) * 100;
}

type LandingHeroProps = {
  isLight?: boolean;
  onScrollToMap: () => void;
  /** When set (after picking a city from search), hero reflects API city AQI. */
  citySnapshot?: HeroCitySnapshot | null;
  isLocatingLocation?: boolean;
  locationUnavailable?: boolean;
};

function WhoHoursRing({
  whoRingGradId,
  ringR,
  whoHours,
  active,
  isLight,
}: {
  whoRingGradId: string;
  ringR: number;
  whoHours: number;
  active: boolean;
  isLight?: boolean;
}) {
  const hoursProgress = useAnimatedProgress(active, 1000, 150);
  const displayHours = Math.round(whoHours * hoursProgress);

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
          <AnimatedStrokeRing
            radius={ringR}
            cx={50}
            cy={50}
            strokeWidth={10}
            progress={whoHours / 24}
            stroke={`url(#${whoRingGradId})`}
            active={active}
            durationMs={1000}
            delayMs={150}
          />
          <defs>
            <linearGradient id={whoRingGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-sans text-2xl font-bold tracking-normal text-bqa-text">{displayHours}</span>
        </div>
      </div>
      <p className={`text-[0.72rem] leading-snug ${isLight ? "text-slate-600" : "text-bqa-dim"}`}>
        <span className={`font-semibold ${isLight ? "text-slate-800" : "text-bqa-text"}`}>/</span>
        24 hours above WHO PM 2.5 guideline today
      </p>
    </div>
  );
}

export function LandingHero({
  isLight = false,
  onScrollToMap,
  citySnapshot = null,
  isLocatingLocation = false,
  locationUnavailable = false,
}: LandingHeroProps) {
  const whoRingGradId = useId().replace(/:/g, "");
  const ringR = 42;
  const whoHours = 19;

  const [heroRef, heroActive] = useInViewOnce<HTMLElement>([citySnapshot?.cityName, citySnapshot?.aqi]);

  const isDetectingCity = isLocatingLocation && !citySnapshot;
  const needsManualCity = locationUnavailable && !citySnapshot;
  const d = citySnapshot ?? DEFAULT_HERO;
  const showPlaceholder = isDetectingCity || needsManualCity;
  const cityNameDisplay = isDetectingCity
    ? "Detecting your city"
    : needsManualCity
    ? "Search your city"
    : d.cityName;
  const aqiDisplay = showPlaceholder ? "--" : String(d.aqi);
  const statusDisplay = isDetectingCity
    ? "Loading"
    : needsManualCity
    ? "Select city"
    : d.statusLabel;
  const badgeVariant = (showPlaceholder ? "moderate" : d.badgeVariant) as AqiBadgeVariant;
  const hasCityData = Boolean(citySnapshot);
  const heroShowsCharacter = hasCityData;
  const heroAqiVariant = hasCityData ? d.badgeVariant : "default";
  const heroLottieVariant = (hasCityData ? d.badgeVariant : "moderate") as AqiLevelVariant;
  /* Below lg the AQI character animates (Lottie); lg and up keeps the static illustration,
     so the animation files are never fetched on desktop. */
  const useLottieCharacter = useMediaQuery("(max-width: 1023.98px)");
  /* The character art belongs to the section backdrop on desktop, but to the AQI card on
     mobile — so below lg the section falls back to the plain cityscape. */
  const showCharacterBackdrop = hasCityData && !useLottieCharacter;
  const heroBg = showCharacterBackdrop
    ? aqiVariantToHeroBackground(d.badgeVariant)
    : HERO_DEFAULT_BG;
  const pm25Display = showPlaceholder ? "--" : String(d.pm25);
  const pm10Display = showPlaceholder ? "--" : String(d.pm10);
  const pm25Variant = (showPlaceholder ? "moderate" : d.pm25BadgeVariant) as AqiBadgeVariant;
  const pm10Variant = (showPlaceholder ? "moderate" : d.pm10BadgeVariant) as AqiBadgeVariant;
  const markerPct = showPlaceholder
    ? 0
    : Math.min(100, Math.max(0, (d.aqi / 500) * 100));
  /* Mobile's banded scale needs the per-block position; the desktop bar is still a smooth
     gradient and keeps the plain linear `markerPct`. */
  const scaleMarkerPct = showPlaceholder ? 0 : aqiToScalePercent(d.aqi);
  const readingsActive = heroActive && !showPlaceholder;
  const numTone = headlineNumberTone(badgeVariant, isLight);
  const locationTitle = isDetectingCity
    ? "Detecting location"
    : needsManualCity
    ? "Search your city"
    : heroLocationTitle(d, cityNameDisplay);
  const locationSubtitle = isDetectingCity
    ? "Finding nearest sensor"
    : needsManualCity
    ? "Use the search bar above"
    : heroLocationSubtitle(d);
  const puffScoreDisplay = showPlaceholder
    ? "--"
    : d.puffScore != null
      ? d.puffScore.toFixed(1)
      : d.pm25 > 0
        ? (d.pm25 / 22).toFixed(1)
        : "--";
  const tempUnit = temperatureUnitSymbol(d.weather?.temperatureUnit);
  const temperatureDisplay = showPlaceholder
    ? "--"
    : `${formatOneDecimal(d.weather?.temperature)}${tempUnit}`;
  /* The API often repeats itself here (`weather_type: "Cloudy"`, `weather_status:
     "Cloudy"`), which reads as "Cloudy · Cloudy" — keep one of each. */
  const weatherSummary = Array.from(
    new Set([d.weather?.weatherType, d.weather?.weatherStatus].filter(Boolean))
  ).join(" · ");
  const weatherSummaryDisplay = isDetectingCity
    ? "Finding local conditions"
    : needsManualCity
    ? "Search a city in the header"
    : weatherSummary || "--";
  const windDisplay =
    d.weather?.windSpeed == null
      ? "--"
      : `${formatOneDecimal(d.weather.windSpeed)} ${windSpeedUnitLabel(
          d.weather.windSpeedUnit
        )}`;
  const humidityDisplay =
    d.weather?.humidity == null ? "--" : `${formatOneDecimal(d.weather.humidity)}%`;
  const weatherRows = [
    ["TEMP", temperatureDisplay],
    ["WIND", showPlaceholder ? "--" : windDisplay],
    ["HUMIDITY", showPlaceholder ? "--" : humidityDisplay],
    [
      "WEATHER",
      isDetectingCity
        ? "Detecting"
        : needsManualCity
        ? "Search city"
        : d.weather?.weatherStatus ?? d.weather?.weatherType ?? "--",
    ],
  ] as const;

  const liveLabel = isDetectingCity
    ? "Live · Detecting location"
    : needsManualCity
    ? "Live · Search a city"
    : `Live · Updated ${formatUpdatedAt(d.updatedAt)}`;

  const headlineBlock = (
    <>
      <p
        className={`mb-1 inline-flex items-center gap-2 font-sans text-[0.82rem] font-semibold tracking-normal ${
          isLight ? "text-rose-700" : "text-rose-200"
        }`}
      >
        <span
          className="h-1.5 w-1.5 animate-blink rounded-full bg-bqa-unhealthy shadow-[0_0_8px_#ff4d6d]"
          aria-hidden
        />
        {liveLabel}
      </p>
      <h1 className="mb-1.5 font-sans text-[clamp(1.65rem,5.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.03em] text-bqa-text sm:text-[2.35rem] lg:text-[2.15rem] lg:whitespace-nowrap xl:text-[2.35rem]">
        {cityNameDisplay} Air Quality Index —{" "}
        <em className={`not-italic font-sans tracking-normal ${numTone}`}>
          {showPlaceholder ? (
            aqiDisplay
          ) : (
            <AnimatedReadingValue
              value={d.aqi}
              format={(n) => String(Math.round(n))}
              active={readingsActive}
            />
          )}
        </em>
      </h1>
      <p
        className={`mb-0 max-w-[520px] text-[0.92rem] leading-snug sm:text-[0.95rem] lg:max-w-[680px] ${
          isLight ? "text-slate-600" : "text-bqa-muted"
        }`}
      >
        Real-time PM₂.₅, PM₁₀, O₃, NO₂, SO₂, CO from BeyondAQI&apos;s hyperlocal sensor network. Zero API
        smoothing. Zero delay.
      </p>
    </>
  );

  return (
    <section
      ref={heroRef}
      id="sec-hero"
      data-aqi-variant={heroAqiVariant}
      /* Full-viewport hero is a desktop composition; on mobile the section is only as tall
         as the card, so the next section follows it directly instead of after a dead gap. */
      className="relative flex items-start overflow-hidden border-b border-sky-400/10 pt-[7rem] sm:pt-[8rem] md:pt-[7.75rem] lg:min-h-[100dvh]"
    >
      {/* Section backdrop stays a still image at every width — below lg the character
          animates inside the AQI card instead, so it is never doubled up behind the copy. */}
      <div
        className={`hero-bg absolute inset-0 z-0 bg-cover bg-no-repeat ${
          showCharacterBackdrop ? "hero-bg-character" : "bg-[center_38%]"
        }`}
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden
      />
      <div className="hero-overlay-base absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-overlay-t absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-overlay-r absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-[2] mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Mobile — the AQI card leads on its own; the headline copy is desktop-only, so the
            card follows straight on from the header search and the live AQI ticker. */}
        <div className="pb-10 pt-1 lg:hidden">
          {/* No border, background or shadow on the group: the design has no card frame —
              the scene is a rounded image and the weather row sits on the page itself. */}
          <div className="hero-mobile-aqi-card relative" data-aqi-variant={heroAqiVariant}>
            <div className="hero-mobile-aqi-card-scene relative overflow-hidden rounded-[18px]">
            {heroShowsCharacter && useLottieCharacter ? (
              <AqiHeroLottie
                variant={heroLottieVariant}
                className="hero-mobile-aqi-card-lottie pointer-events-none absolute inset-0"
              />
            ) : (
              <div
                className="hero-mobile-aqi-card-bg absolute inset-0 bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
                aria-hidden
              />
            )}
            <div
              className={`hero-mobile-aqi-card-overlay absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-r from-white via-white/92 to-white/35"
                  : "bg-gradient-to-r from-[#0a1220] via-[#0a1220]/92 to-[#0a1220]/35"
              }`}
              aria-hidden
            />

            <div className="relative z-[1] p-5 sm:p-6">
              <div className="mb-4 max-w-[68%]">
                <div className="mb-1 flex items-center gap-2">
                  <LocationPinIcon />
                  <h2
                    className={`min-w-0 flex-1 truncate font-sans text-[1.35rem] font-bold leading-tight tracking-[-0.02em] sm:text-[1.5rem] ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {locationTitle}
                  </h2>
                  <button
                    type="button"
                    className="shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-80"
                    aria-label="Save location to favorites"
                  >
                    <HeartOutlineIcon isLight={isLight} />
                  </button>
                </div>
                <p className={`font-sans text-[0.88rem] ${isLight ? "text-slate-600" : "text-bqa-muted"}`}>
                  {locationSubtitle}
                </p>
              </div>

              <div className="mb-3 max-w-[68%]">
                <p
                  className={`mb-2 inline-flex items-center gap-1.5 font-sans text-[0.78rem] font-semibold ${
                    isLight ? "text-rose-600" : "text-rose-300"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 animate-blink rounded-full bg-bqa-unhealthy shadow-[0_0_8px_#ff4d6d]"
                    aria-hidden
                  />
                  Live AQI
                  <InfoIcon className={isLight ? "text-slate-400" : "text-bqa-dim"} />
                </p>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span
                    className={`font-sans text-[clamp(2.75rem,14vw,3.75rem)] font-bold leading-none tracking-tight ${numTone}`}
                  >
                    {showPlaceholder ? (
                      aqiDisplay
                    ) : (
                      <AnimatedReadingValue
                        value={d.aqi}
                        format={(n) => String(Math.round(n))}
                        active={readingsActive}
                      />
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg px-3 py-1 font-sans text-[0.72rem] font-bold uppercase tracking-wide sm:text-[0.78rem] ${solidStatusBadgeClass(
                      badgeVariant
                    )}`}
                  >
                    {statusDisplay}
                  </span>
                </div>
              </div>

              <div className="mb-5 max-w-[72%]">
                <div className="flex items-start gap-2.5">
                  <AnimatedCigarette compact isLight={isLight} className="mt-0.5 shrink-0" />
                  <p
                    className={`font-sans text-[0.82rem] leading-snug sm:text-[0.88rem] ${
                      isLight ? "text-slate-700" : "text-bqa-muted"
                    }`}
                  >
                    Equivalent to{" "}
                    <strong className={`text-[1.05rem] font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                      {showPlaceholder ? (
                        puffScoreDisplay
                      ) : (
                        <AnimatedReadingValue
                          value={d.puffScore ?? d.pm25 / 22}
                          format={(n) => n.toFixed(1)}
                          active={readingsActive}
                          delayMs={120}
                        />
                      )}
                    </strong>{" "}
                    cigarettes per day
                    <InfoIcon className={`ml-1 inline align-[-2px] ${isLight ? "text-slate-400" : "text-bqa-dim"}`} />
                  </p>
                </div>
              </div>

              <div>
                {/* Band names sit above the bar and the numeric ticks below it, per the
                    design — the two rows read as labels for the gradient between them. */}
                <div
                  className={`-mx-0.5 mb-1 flex justify-between gap-0.5 overflow-x-auto font-sans text-[0.52rem] font-semibold sm:text-[0.58rem] ${
                    isLight ? "text-slate-900" : "text-bqa-text"
                  }`}
                >
                  {AQI_SCALE_BANDS.map((band) => (
                    <span key={band.label} className="shrink-0">
                      {band.label}
                    </span>
                  ))}
                </div>
                <div className="relative mb-1.5 h-2.5">
                  {/* The blocks live in their own clipped layer so the rounded ends cut the
                      colour bands without also clipping the marker, which overhangs the bar. */}
                  <div
                    className={`absolute inset-0 flex overflow-hidden rounded-full ${
                      isLight ? "shadow-inner" : "shadow-[inset_0_2px_4px_rgba(0,0,0,0.45)]"
                    }`}
                    aria-hidden
                  >
                    {AQI_SCALE_BANDS.map((band) => (
                      <div
                        key={band.label}
                        className="h-full flex-1"
                        style={{ backgroundColor: band.color }}
                      />
                    ))}
                  </div>
                  <AnimatedHorizontalMarker
                    targetPercent={scaleMarkerPct}
                    active={readingsActive}
                    durationMs={1000}
                    delayMs={200}
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange-400 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
                  />
                </div>
                <div
                  className={`mb-1 flex justify-between gap-0.5 font-sans text-[0.52rem] font-semibold sm:text-[0.58rem] ${
                    isLight ? "text-slate-700" : "text-bqa-dim"
                  }`}
                >
                  {AQI_SCALE_TICKS.map((tick) => (
                    <span key={tick} className="shrink-0">
                      {tick}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* Weather row — no panel of its own; it reads as page content below the scene. */}
            <div
              className={`flex items-center justify-between gap-3 px-1 pt-4 sm:px-2 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <WeatherGlyph type={d.weather?.weatherType} />
                <div className="min-w-0">
                  <div className="font-sans text-[1.6rem] font-bold leading-none tracking-tight">
                    {temperatureDisplay}
                  </div>
                  <div
                    className={`mt-1 truncate font-sans text-[0.78rem] ${
                      isLight ? "text-slate-600" : "text-bqa-muted"
                    }`}
                  >
                    {weatherSummaryDisplay}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-start gap-5 text-right">
                <div>
                  <div className="font-sans text-[1rem] font-bold leading-none">
                    {showPlaceholder ? "--" : humidityDisplay}
                  </div>
                  <div
                    className={`mt-1 font-sans text-[0.68rem] ${
                      isLight ? "text-slate-500" : "text-bqa-dim"
                    }`}
                  >
                    Humidity
                  </div>
                </div>
                <div>
                  <div className="font-sans text-[1rem] font-bold leading-none">
                    {showPlaceholder ? "--" : windDisplay}
                  </div>
                  <div
                    className={`mt-1 font-sans text-[0.68rem] ${
                      isLight ? "text-slate-500" : "text-bqa-dim"
                    }`}
                  >
                    Wind
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop — heading + compact cards on the left, character space on the right */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,70%)_minmax(0,30%)] lg:items-start lg:gap-5 lg:py-4 lg:pb-6">
          <div className="flex flex-col gap-3">
            {headlineBlock}

            <div className="grid w-full max-w-[820px] grid-cols-2 gap-4 xl:max-w-[880px]">
              <div className="relative flex flex-col overflow-hidden rounded-[16px] border border-sky-400/10 bg-bqa-navy2/80 p-[1.125rem] shadow-[0_16px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-[16px] bg-[linear-gradient(90deg,#00e5aa,#ffd24d,#ff8c42,#ff4d6d,#c77dff,#9b2dff)]"
                  aria-hidden
                />

                <div
                  className={`mb-2 font-sans text-[9px] font-normal uppercase leading-[14px] tracking-[1.6px] ${
                    isLight ? "text-sky-800/70" : "text-bqa-dim"
                  }`}
                >
                  Outdoor AQI · {cityNameDisplay}
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="min-w-0">
                    <div
                      className={`font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-bold leading-none tracking-normal ${
                        isLight ? numTone : `${numTone} drop-shadow-[0_0_24px_rgba(255,140,66,0.22)]`
                      }`}
                    >
                      {showPlaceholder ? (
                        aqiDisplay
                      ) : (
                        <AnimatedReadingValue
                          value={d.aqi}
                          format={(n) => String(Math.round(n))}
                          active={readingsActive}
                        />
                      )}
                    </div>
                    <AqiBadge variant={badgeVariant} className="mt-2 px-2.5 py-0.5 text-[0.62rem] tracking-[0.06em]">
                      {statusDisplay}
                    </AqiBadge>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={onScrollToMap}
                      className="rounded-[8px] bg-bqa-accent px-3 py-2 text-center text-[0.72rem] font-semibold text-white shadow-[0_4px_12px_rgba(61,158,255,0.22)] transition-all hover:brightness-110"
                    >
                      AQI Sensor Map
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center justify-center gap-1.5 rounded-[8px] border bg-transparent px-3 py-2 text-[0.72rem] font-semibold backdrop-blur-sm transition-all ${
                        isLight
                          ? "border-sky-400/80 text-slate-800 hover:border-bqa-accent hover:bg-sky-50"
                          : "border-bqa-accent/45 text-white hover:border-bqa-accent hover:bg-bqa-accent/10"
                      }`}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-bqa-unhealthy shadow-[0_0_6px_#ff4d6d]"
                        aria-hidden
                      />
                      Ping Location
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border-l-[3px] border-bqa-moderate bg-bqa-slate/60 p-2.5">
                    <div className="mb-0.5 text-[0.62rem] font-semibold tracking-wide text-bqa-dim">PM2.5</div>
                    <div className="font-sans text-base font-bold tracking-normal text-bqa-text">
                      {showPlaceholder ? (
                        pm25Display
                      ) : (
                        <AnimatedReadingValue
                          value={d.pm25}
                          format={formatOneDecimal}
                          active={readingsActive}
                          delayMs={80}
                        />
                      )}{" "}
                      <span className="text-[0.62rem] font-normal text-bqa-dim">µg/m³</span>
                    </div>
                    <AqiBadge variant={pm25Variant} className="mt-1 text-[0.58rem]">
                      {variantLabel(pm25Variant)}
                    </AqiBadge>
                  </div>
                  <div className="rounded-lg border-l-[3px] border-bqa-unhealthy bg-bqa-slate/60 p-2.5">
                    <div className="mb-0.5 text-[0.62rem] font-semibold tracking-wide text-bqa-dim">PM10</div>
                    <div className="font-sans text-base font-bold tracking-normal text-bqa-text">
                      {showPlaceholder ? (
                        pm10Display
                      ) : (
                        <AnimatedReadingValue
                          value={d.pm10}
                          format={formatOneDecimal}
                          active={readingsActive}
                          delayMs={160}
                        />
                      )}{" "}
                      <span className="text-[0.62rem] font-normal text-bqa-dim">µg/m³</span>
                    </div>
                    <AqiBadge variant={pm10Variant} className="mt-1 text-[0.58rem]">
                      {variantLabel(pm10Variant)}
                    </AqiBadge>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="relative mb-1 h-2 rounded-md bg-gradient-to-r from-bqa-good via-bqa-moderate via-bqa-poor via-bqa-unhealthy via-bqa-severe to-bqa-hazardous shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <AnimatedHorizontalMarker
                      targetPercent={markerPct}
                      active={readingsActive}
                      durationMs={1000}
                      delayMs={200}
                      className="absolute -top-1 h-5 w-0.5 -translate-x-1/2 rounded-sm bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1 py-0.5 font-sans text-[0.58rem] font-bold tracking-normal text-[#0a0a1a]">
                        {showPlaceholder ? (
                          aqiDisplay
                        ) : (
                          <AnimatedReadingValue
                            value={d.aqi}
                            format={(n) => String(Math.round(n))}
                            active={readingsActive}
                            delayMs={200}
                          />
                        )}
                      </span>
                    </AnimatedHorizontalMarker>
                  </div>
                  <div className="flex justify-between font-sans text-[0.52rem] font-semibold">
                    <span className="text-bqa-good">Good</span>
                    <span className="text-bqa-moderate">Moderate</span>
                    <span className="text-bqa-poor">Poor</span>
                    <span className="text-bqa-unhealthy">Unhealthy</span>
                    <span className="text-bqa-severe">Severe</span>
                    <span className="text-bqa-hazardous">Hazardous</span>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col rounded-[16px] border p-[1.125rem] backdrop-blur-xl ${
                  heroShowsCharacter
                    ? "border-white/10 bg-bqa-navy2/35 shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
                    : "border-sky-400/10 bg-bqa-navy2/80 shadow-[0_16px_36px_rgba(0,0,0,0.35)]"
                }`}
              >
                <div
                  className={`mb-3 font-sans text-[9px] font-normal uppercase leading-[14px] tracking-[1.6px] ${
                    isLight ? "text-sky-800/70" : "text-bqa-dim"
                  }`}
                >
                  Weather Conditions
                </div>

                <div className="mb-3 flex items-center gap-2.5">
                  <svg
                    width="30"
                    height="30"
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
                    <div className="font-sans text-2xl font-bold tracking-normal text-bqa-text">{temperatureDisplay}</div>
                    <div className={`text-[0.78rem] leading-snug ${isLight ? "text-slate-600" : "text-bqa-muted"}`}>
                      {weatherSummaryDisplay}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {weatherRows.map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-bqa-slate px-2.5 py-2">
                      <div className="mb-0.5 text-[0.58rem] font-semibold tracking-wide text-bqa-dim">{k}</div>
                      <div className="font-sans text-[0.82rem] font-semibold tracking-normal text-bqa-text">{v}</div>
                    </div>
                  ))}
                </div>

                <WhoHoursRing
                  whoRingGradId={whoRingGradId}
                  ringR={ringR}
                  whoHours={whoHours}
                  active={readingsActive}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>

          <div aria-hidden className="min-h-[420px]" />
        </div>
      </div>
    </section>
  );
}
