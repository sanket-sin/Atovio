import axios from "axios";
import { BEYONDAQI_API_BASE, beyondaqiRequestHeaders } from "@/lib/config/beyondaqi-api";

/** Matches `AqiBadge` variants — kept here so `lib/api` does not import from `components`. */
export type HeroAqiBadgeVariant =
  | "good"
  | "moderate"
  | "poor"
  | "unhealthy"
  | "severe"
  | "hazardous";

export type HeroCitySnapshot = {
  cityName: string;
  stateName?: string;
  aqi: number;
  statusLabel: string;
  badgeVariant: HeroAqiBadgeVariant;
  pm25: number;
  pm10: number;
  pm25BadgeVariant: HeroAqiBadgeVariant;
  pm10BadgeVariant: HeroAqiBadgeVariant;
  updatedAt?: string;
  weather?: {
    temperature?: number;
    temperatureUnit?: string;
    weatherType?: string;
    weatherStatus?: string;
    humidity?: number;
    windSpeed?: number;
    windSpeedUnit?: string;
  };
};

type CityAqiApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: {
    aqi: number;
    aqi_status: string;
    timestamp?: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    pollutants: {
      pm2_5: number;
      pm10: number;
    };
    basic_weather?: {
      temperature?: number;
      temperature_unit?: string;
      weather_type?: string;
      weather_status?: string;
      humidity?: number;
      wind_speed?: number;
      wind_speed_unit?: string;
    };
  };
};

function slugSegmentToPathSegment(segment: string): string {
  return segment
    .trim()
    .replace(/\s+/g, "-")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("-");
}

/**
 * Search sometimes returns slugs like `api/india/rajasthan/jaipur`. The first segment was
 * title-cased to `Api`, producing broken URLs: `/api/aqi/Api/India/Rajasthan`.
 * Strip one leading `api` segment (case-insensitive) before building the path.
 */
export function normalizeBeyondAqiSlug(slug: string): string {
  const parts = slug
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 0 && parts[0].toLowerCase() === "api") {
    parts.shift();
  }
  return parts.join("/");
}

/** Converts `india/tamil-nadu/dindigul` → `India/Tamil-Nadu/Dindigul` for the REST path. */
export function slugToAqiPath(slug: string): string {
  const normalized = normalizeBeyondAqiSlug(slug);
  return normalized
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(slugSegmentToPathSegment)
    .join("/");
}

export function statusTextToBadgeVariant(status: string): HeroAqiBadgeVariant {
  const k = status.trim().toLowerCase();
  if (k.includes("good") && !k.includes("moderate")) return "good";
  if (k.includes("satisfactory") || k.includes("moderate")) return "moderate";
  if (k.includes("poor")) return "poor";
  if (k.includes("unhealthy") || k.includes("very poor")) return "unhealthy";
  if (k.includes("severe")) return "severe";
  if (k.includes("hazard")) return "hazardous";
  return "moderate";
}

/** CPCB-like bucket for PM2.5 µg/m³ (rolling approximations for badge styling). */
export function pm25ToBadgeVariant(ug: number): HeroAqiBadgeVariant {
  if (ug <= 30) return "good";
  if (ug <= 60) return "moderate";
  if (ug <= 90) return "poor";
  if (ug <= 120) return "unhealthy";
  if (ug <= 250) return "severe";
  return "hazardous";
}

export function pm10ToBadgeVariant(ug: number): HeroAqiBadgeVariant {
  if (ug <= 50) return "good";
  if (ug <= 100) return "moderate";
  if (ug <= 250) return "poor";
  if (ug <= 350) return "unhealthy";
  if (ug <= 430) return "severe";
  return "hazardous";
}

export function cityApiToHeroSnapshot(res: CityAqiApiResponse): HeroCitySnapshot {
  const d = res.data;
  const pm25 = d.pollutants.pm2_5;
  const pm10 = d.pollutants.pm10;
  return {
    cityName: d.location.city,
    stateName: d.location.state,
    aqi: d.aqi,
    statusLabel: d.aqi_status,
    badgeVariant: statusTextToBadgeVariant(d.aqi_status),
    pm25,
    pm10,
    pm25BadgeVariant: pm25ToBadgeVariant(pm25),
    pm10BadgeVariant: pm10ToBadgeVariant(pm10),
    updatedAt: d.timestamp,
    weather: d.basic_weather
      ? {
          temperature: d.basic_weather.temperature,
          temperatureUnit: d.basic_weather.temperature_unit,
          weatherType: d.basic_weather.weather_type,
          weatherStatus: d.basic_weather.weather_status,
          humidity: d.basic_weather.humidity,
          windSpeed: d.basic_weather.wind_speed,
          windSpeedUnit: d.basic_weather.wind_speed_unit,
        }
      : undefined,
  };
}

/**
 * GET /api/aqi/{Country}/{State}/{City} — same contract as:
 * curl -H 'authorization: Token …' https://dev-api.beyondaqi.com/api/aqi/India/Rajasthan/Jaipur
 * (`host` is set by the browser; other headers match `beyondaqiRequestHeaders()`.)
 */
export async function fetchCityAqiBySlug(slug: string): Promise<HeroCitySnapshot> {
  const path = slugToAqiPath(slug);
  const depth = path.split("/").filter(Boolean).length;
  if (depth < 3) {
    throw new Error(
      `BeyondAQI city AQI expects GET .../api/aqi/Country/State/City — got ${depth} segment(s): "${path}"`
    );
  }
  const { data } = await axios.get<CityAqiApiResponse>(
    `${BEYONDAQI_API_BASE}/api/aqi/${path}`,
    {
      headers: beyondaqiRequestHeaders(),
    }
  );
  return cityApiToHeroSnapshot(data);
}

export async function fetchCityAqiByLocationParts({
  country,
  state,
  city,
}: {
  country: string;
  state: string;
  city: string;
}): Promise<HeroCitySnapshot> {
  return fetchCityAqiBySlug(`${country}/${state}/${city}`);
}
