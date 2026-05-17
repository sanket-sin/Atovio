"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import type { CityAqiMapPoint } from "@/lib/api/aqi-city";
import { fetchAqiMapMarkers } from "@/lib/api/aqi-map-markers";
import { aqiMarkerIconUrl } from "@/lib/map/aqi-marker-icon";
import {
  BEYONDAQI_MAP_STYLES,
  INDIA_MAP_DEFAULT_CENTER,
  INDIA_MAP_DEFAULT_ZOOM,
} from "@/lib/map/google-maps-dark-style";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

function formatTemperature(point: CityAqiMapPoint): string | null {
  if (point.temperature == null || !Number.isFinite(point.temperature)) return null;
  const unit = point.temperatureUnit?.replace("°", "") ?? "C";
  return `${point.temperature.toFixed(1)}°${unit}`;
}

function buildInfoWindowHtml(point: CityAqiMapPoint): string {
  const temp = formatTemperature(point);
  const city = point.city.replace(/</g, "&lt;");
  const tempRow = temp
    ? `<div style="margin:4px 0 0;font-size:13px;color:#64748b">Temperature: ${temp}</div>`
    : "";
  return `<div style="padding:2px 4px;font-family:system-ui,sans-serif;min-width:140px">
      <div style="font-weight:700;font-size:15px;color:#0f172a;margin-bottom:4px">${city}</div>
      <div style="font-size:13px;color:#334155">AQI: <strong>${Math.round(point.aqi)}</strong></div>
      ${tempRow}
    </div>`;
}

type RealtimeAqiGoogleMapProps = {
  className?: string;
};

export function RealtimeAqiGoogleMap({ className = "" }: RealtimeAqiGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [markers, setMarkers] = useState<CityAqiMapPoint[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingMarkers(true);
      setLoadError(null);
      setMarkers([]);
      try {
        const points = await fetchAqiMapMarkers({
          pages: 1,
          maxMarkers: 24,
          onProgress: (partial) => {
            if (!cancelled) setMarkers(partial);
          },
        });
        if (!cancelled) setMarkers(points);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Could not load city data.");
          setMarkers([]);
        }
      } finally {
        if (!cancelled) setLoadingMarkers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!MAPS_API_KEY || !containerRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        setOptions({ key: MAPS_API_KEY, v: "weekly" });
        await importLibrary("maps");
        if (cancelled || !containerRef.current) return;

        const map = new google.maps.Map(containerRef.current, {
          center: INDIA_MAP_DEFAULT_CENTER,
          zoom: INDIA_MAP_DEFAULT_ZOOM,
          styles: BEYONDAQI_MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          backgroundColor: "#0a0c10",
          minZoom: 4,
          maxZoom: 12,
          restriction: {
            latLngBounds: { north: 37.5, south: 6, west: 68, east: 98 },
            strictBounds: false,
          },
        });

        mapRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapReady(true);
      } catch {
        if (!cancelled) setLoadError("Google Maps failed to load. Check your API key.");
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
      infoWindowRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    const infoWindow = infoWindowRef.current;

    for (const point of markers) {
      const position = { lat: point.lat, lng: point.lng };
      bounds.extend(position);

      const marker = new google.maps.Marker({
        map,
        position,
        title: point.city,
        icon: {
          url: aqiMarkerIconUrl(point.aqi),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        },
        optimized: false,
      });

      marker.addListener("click", () => {
        if (!infoWindow) return;
        infoWindow.setContent(buildInfoWindowHtml(point));
        infoWindow.open({ map, anchor: marker });
      });

      markersRef.current.push(marker);
    }

    if (markers.length > 1) {
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    } else if (markers.length === 1) {
      map.setCenter({ lat: markers[0]!.lat, lng: markers[0]!.lng });
      map.setZoom(8);
    }
  }, [mapReady, markers]);

  if (!MAPS_API_KEY) {
    return (
      <div
        className={`flex h-full min-h-[320px] flex-col items-center justify-center bg-[#0a0c10] px-6 text-center ${className}`}
      >
        <p className="mb-2 font-outfit text-sm font-semibold text-bqa-text">
          Google Maps API key required
        </p>
        <p className="max-w-md font-outfit text-xs leading-relaxed text-bqa-muted">
          Add{" "}
          <code className="rounded bg-bqa-slate px-1.5 py-0.5 text-bqa-accent2">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to <code className="text-bqa-dim">.env.local</code> and enable the Maps JavaScript API.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {loadError && (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0a0c10]/70 backdrop-blur-[2px]">
          <p className="max-w-xs px-4 text-center font-outfit text-sm text-rose-300">{loadError}</p>
        </div>
      )}

      {!loadError && !mapReady && (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0a0c10]/70 backdrop-blur-[2px]">
          <p className="font-outfit text-sm text-bqa-muted">Loading map…</p>
        </div>
      )}

      {!loadError && mapReady && loadingMarkers && markers.length === 0 && (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-sky-400/20 bg-black/60 px-3 py-1.5 backdrop-blur-md">
          <p className="font-outfit text-xs text-bqa-muted">Loading live AQI cities…</p>
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-4 right-4 z-[2] hidden flex-col items-end gap-1 sm:flex"
        aria-hidden
      >
        <span className="font-outfit text-[0.62rem] font-semibold uppercase tracking-wider text-bqa-dim">
          Low
        </span>
        <div
          className="h-2 w-28 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #00e5aa 0%, #ffd24d 35%, #ff8c42 55%, #ff4d6d 75%, #9b2dff 100%)",
          }}
        />
        <span className="font-outfit text-[0.62rem] font-semibold uppercase tracking-wider text-bqa-dim">
          High
        </span>
      </div>
    </div>
  );
}
