/**
 * Shared BeyondAQI dev API — matches city-detail curl, e.g.
 *   GET https://dev-api.beyondaqi.com/api/aqi/India/Rajasthan/Jaipur
 *   -H 'user-agent: Dart/3.9 (dart:io)'
 *   -H 'accept-encoding: gzip'
 *   -H 'content-length: 0'
 * Host is implied by the browser for HTTPS (do not set `host` manually in fetch).
 *
 * Public pre-login pages do not send an Authorization header.
 */

export const BEYONDAQI_API_BASE = "https://dev-api.beyondaqi.com";

/** Per-request cap — dev API can be slow; avoids hung map marker loads. */
export const BEYONDAQI_REQUEST_TIMEOUT_MS = 12_000;

export function beyondaqiRequestHeaders(): Record<string, string> {
  return {
    "user-agent": "Dart/3.9 (dart:io)",
    "accept-encoding": "gzip",
    "content-length": "0",
  };
}
