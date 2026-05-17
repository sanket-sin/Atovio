import { aqiIndexToColorHex } from "@/lib/air-quality/aqi-levels";

/** SVG circle marker with AQI value — matches live map design. */
export function aqiMarkerIconUrl(aqi: number, size = 40): string {
  const color = aqiIndexToColorHex(aqi);
  const label = String(Math.round(aqi));
  const fontSize = label.length >= 3 ? 11 : 13;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="17" fill="${color}" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <text x="20" y="20" text-anchor="middle" dominant-baseline="central"
    fill="#fff" font-family="system-ui,sans-serif" font-size="${fontSize}" font-weight="700">${label}</text>
</svg>`.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
