/**
 * Shared BeyondAQI dev API — matches city-detail curl, e.g.
 *   GET https://dev-api.beyondaqi.com/api/aqi/India/Rajasthan/Jaipur
 *   -H 'user-agent: Dart/3.9 (dart:io)'
 *   -H 'accept-encoding: gzip'
 *   -H 'content-length: 0'
 *   -H 'authorization: Token …'
 * Host is implied by the browser for HTTPS (do not set `host` manually in fetch).
 *
 * Override token: NEXT_PUBLIC_BEYONDAQI_API_TOKEN (optional `Token ` prefix).
 */

export const BEYONDAQI_API_BASE = "https://dev-api.beyondaqi.com";

function beyondaqiAuthHeader(): string {
  const raw =
    process.env.NEXT_PUBLIC_BEYONDAQI_API_TOKEN?.trim() ||
    "0164a035c63d490ff1dc3d8e1686e95d170de3d000d842ec53c7f9900b9f8ec2";
  return raw.startsWith("Token ") ? raw : `Token ${raw}`;
}

export function beyondaqiRequestHeaders(): Record<string, string> {
  return {
    authorization: beyondaqiAuthHeader(),
    "user-agent": "Dart/3.9 (dart:io)",
    "accept-encoding": "gzip",
    "content-length": "0",
  };
}
