export type DetectedCity = {
  city: string;
  state: string;
  country: string;
  source: "browser-geolocation" | "ip";
};

type ReverseGeocodeResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

type IpGeocodeResponse = {
  city?: string;
  region?: string;
  country_name?: string;
};

function compactCity(city: Partial<DetectedCity>): DetectedCity | null {
  if (!city.city || !city.state || !city.country || !city.source) return null;
  return {
    city: city.city.trim(),
    state: city.state.trim(),
    country: city.country.trim(),
    source: city.source,
  };
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Browser geolocation is not available"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 8000,
    });
  });
}

async function cityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<DetectedCity | null> {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = (await res.json()) as ReverseGeocodeResponse;
  return compactCity({
    city: data.city || data.locality,
    state: data.principalSubdivision,
    country: data.countryName,
    source: "browser-geolocation",
  });
}

async function cityFromIp(): Promise<DetectedCity | null> {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) return null;

  const data = (await res.json()) as IpGeocodeResponse;
  return compactCity({
    city: data.city,
    state: data.region,
    country: data.country_name,
    source: "ip",
  });
}

/**
 * Browser permission prompt only happens after calling this (e.g. from a click handler).
 * Does not fall back to IP — use that separately if needed.
 */
export async function detectCityFromGeolocationOnly(): Promise<DetectedCity | null> {
  const pos = await getCurrentPosition();
  return cityFromCoordinates(pos.coords.latitude, pos.coords.longitude);
}

/** Same as before: GPS first, then IP fallback (not used for explicit consent flows). */
export async function detectUserCity(): Promise<DetectedCity | null> {
  try {
    const pos = await getCurrentPosition();
    const detected = await cityFromCoordinates(
      pos.coords.latitude,
      pos.coords.longitude
    );
    if (detected) return detected;
  } catch {
    // Permission denied, timeout, or unsupported browser: use coarse IP fallback.
  }

  try {
    return await cityFromIp();
  } catch {
    return null;
  }
}

export async function detectCityFromIpOnly(): Promise<DetectedCity | null> {
  try {
    return await cityFromIp();
  } catch {
    return null;
  }
}
