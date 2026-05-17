"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { getMapCities } from "@/lib/api/aqi-map-cities";
import {
  heroSnapshotToMapPoint,
  type CityAqiMapPoint,
  type HeroCitySnapshot,
} from "@/lib/api/aqi-city";
import { buildAqiMapInfoWindowHtml } from "@/lib/map/aqi-map-info-window";
import { aqiMarkerIconUrl } from "@/lib/map/aqi-marker-icon";
import {
  BEYONDAQI_MAP_STYLES,
  INDIA_MAP_DEFAULT_CENTER,
  INDIA_MAP_DEFAULT_ZOOM,
} from "@/lib/map/google-maps-dark-style";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

function cityMarkerKey(point: Pick<CityAqiMapPoint, "city" | "state">): string {
  return `${point.city}|${point.state}`.toLowerCase();
}

type RealtimeAqiGoogleMapProps = {
  className?: string;
  /** Set when user picks a city from header search (single city AQI GET). */
  selectedCity?: HeroCitySnapshot | null;
};

export function RealtimeAqiGoogleMap({
  className = "",
  selectedCity = null,
}: RealtimeAqiGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const markerKeysRef = useRef([] as string[]);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapCities, setMapCities] = useState([] as CityAqiMapPoint[]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        setCitiesLoading(true);
        setCitiesError(null);
        const cities = await getMapCities();
        if (!cancelled) setMapCities(cities);
      } catch {
        if (!cancelled) setCitiesError("Failed to load city AQI data.");
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!MAPS_API_KEY || !containerRef.current) return;

    let cancelled = false;

    void (async () => {
      try {
        setOptions({ key: MAPS_API_KEY, v: "weekly" });
        await importLibrary("maps");
        if (cancelled || !containerRef.current) return;

        const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

        const map = new google.maps.Map(containerRef.current, {
          center: INDIA_MAP_DEFAULT_CENTER,
          zoom: INDIA_MAP_DEFAULT_ZOOM,
          styles: BEYONDAQI_MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: !isMobile,
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
      markerKeysRef.current = [];
      mapRef.current = null;
      infoWindowRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!mapReady || !map || !infoWindow) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    markerKeysRef.current = [];

    if (mapCities.length === 0) {
      map.setCenter(INDIA_MAP_DEFAULT_CENTER);
      map.setZoom(INDIA_MAP_DEFAULT_ZOOM);
      return;
    }

    for (const point of mapCities) {
      const position = { lat: point.lat, lng: point.lng };

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
        infoWindow.setContent(buildAqiMapInfoWindowHtml(point));
        infoWindow.open({ map, anchor: marker });
      });

      markersRef.current.push(marker);
      markerKeysRef.current.push(cityMarkerKey(point));
    }
  }, [mapReady, mapCities]);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!mapReady || !map || !infoWindow) return;

    const selectedPoint = selectedCity ? heroSnapshotToMapPoint(selectedCity) : null;
    if (!selectedPoint) return;

    map.panTo({ lat: selectedPoint.lat, lng: selectedPoint.lng });
    map.setZoom(8);

    const key = cityMarkerKey(selectedPoint);
    const markerIndex = markerKeysRef.current.indexOf(key);
    const marker = markerIndex >= 0 ? markersRef.current[markerIndex] : undefined;

    if (marker) {
      infoWindow.setContent(buildAqiMapInfoWindowHtml(selectedPoint));
      infoWindow.open({ map, anchor: marker });
      return;
    }

    infoWindow.setContent(buildAqiMapInfoWindowHtml(selectedPoint));
    infoWindow.setPosition({ lat: selectedPoint.lat, lng: selectedPoint.lng });
    infoWindow.open({ map });
  }, [mapReady, selectedCity]);

  if (!MAPS_API_KEY) {
    return (
      <div
        className={`flex h-full min-h-[320px] flex-col items-center justify-center bg-[#0a0c10] px-6 text-center ${className}`}
      >
        <p className="mb-2 font-sans text-sm font-semibold text-bqa-text">
          Google Maps API key required
        </p>
        <p className="max-w-md font-sans text-xs leading-relaxed text-bqa-muted">
          Add{" "}
          <code className="rounded bg-bqa-slate px-1.5 py-0.5 text-bqa-accent2">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to <code className="text-bqa-dim">.env.local</code> and enable the Maps JavaScript API.
        </p>
      </div>
    );
  }

  const showLoadingOverlay =
    !loadError && (!mapReady || (citiesLoading && mapCities.length === 0));

  return (
    <div className={`bqa-google-map relative h-full w-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-label="Real-time AQI map" />

      {loadError && (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0a0c10]/70 backdrop-blur-[2px]">
          <p className="max-w-xs px-4 text-center font-sans text-sm text-rose-300">{loadError}</p>
        </div>
      )}

      {!loadError && citiesError && (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-rose-400/30 bg-black/60 px-3 py-1.5 backdrop-blur-md">
          <p className="font-sans text-xs text-rose-300">{citiesError}</p>
        </div>
      )}

      {showLoadingOverlay && (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-[#0a0c10]/70 backdrop-blur-[2px]">
          <p className="font-sans text-sm text-bqa-muted">Loading map…</p>
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-3 right-3 z-[2] flex items-center gap-2 rounded-lg border border-white/10 bg-black/45 px-2.5 py-1.5 backdrop-blur-md md:hidden"
        aria-hidden
      >
        <div
          className="h-2 w-[4.5rem] shrink-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #00e5aa 0%, #ffd24d 35%, #ff8c42 55%, #ff4d6d 75%, #9b2dff 100%)",
          }}
        />
        <span className="font-sans text-[0.62rem] font-semibold text-white">Low → High</span>
      </div>

      <div
        className="pointer-events-none absolute bottom-4 right-4 z-[2] hidden flex-col items-end gap-1 md:flex"
        aria-hidden
      >
        <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-wider text-bqa-dim">
          Low
        </span>
        <div
          className="h-2 w-28 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #00e5aa 0%, #ffd24d 35%, #ff8c42 55%, #ff4d6d 75%, #9b2dff 100%)",
          }}
        />
        <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-wider text-bqa-dim">
          High
        </span>
      </div>
    </div>
  );
}
