import axios from "axios";
import type { CityAqiMapPoint } from "@/lib/api/aqi-city";
import { getAqiLevel } from "@/lib/air-quality/aqi-levels";
import {
  BEYONDAQI_API_BASE,
  BEYONDAQI_REQUEST_TIMEOUT_MS,
  beyondaqiRequestHeaders,
} from "@/lib/config/beyondaqi-api";

type MapCityRow = {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  aqi: number;
  temperature?: number;
};

type MapCitiesApiResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: { cities: MapCityRow[] };
};

function mapCityRowToPoint(row: MapCityRow): CityAqiMapPoint | null {
  const { lat, lon: lng } = row;
  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return {
    city: row.city,
    state: row.state,
    country: row.country,
    lat,
    lng,
    aqi: row.aqi,
    aqiStatus: getAqiLevel(row.aqi).labelUppercase,
    temperature: row.temperature,
    temperatureUnit: "C",
  };
}

/**
 * GET /api/map — bulk lat/lng + AQI for all map markers.
 * curl -H 'authorization: Token …' https://dev-api.beyondaqi.com/api/map
 */
export async function getMapCities(): Promise<CityAqiMapPoint[]> {
  const { data } = await axios.get<MapCitiesApiResponse>(
    `${BEYONDAQI_API_BASE}/api/map`,
    {
      headers: beyondaqiRequestHeaders(),
      timeout: BEYONDAQI_REQUEST_TIMEOUT_MS,
    }
  );

  if (data.statusCode !== 200 || data.status?.toLowerCase() !== "success") {
    throw new Error(data.message ?? "Map cities request failed");
  }

  const cities = data.data?.cities;
  if (!Array.isArray(cities)) {
    throw new Error("Map cities response missing data.cities");
  }

  return cities
    .map(mapCityRowToPoint)
    .filter((point): point is CityAqiMapPoint => point != null);
}
