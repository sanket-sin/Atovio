/** Dark map theme aligned with BeyondAQI landing map (screenshot reference). */
export const BEYONDAQI_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0d1117" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1117" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7a90" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e2a3d" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8b9bb5" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c6b82" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a5568" }],
  },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#101820" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a2332" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#141c28" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#243044" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a2332" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#141c28" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#060a10" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2a3a52" }],
  },
] as google.maps.MapTypeStyle[];

export const INDIA_MAP_DEFAULT_CENTER = { lat: 22.8, lng: 79.2 };
export const INDIA_MAP_DEFAULT_ZOOM = 5;
