import type { CityAqiMapPoint } from "@/lib/api/aqi-city";

function formatTemperature(point: CityAqiMapPoint): string | null {
  if (point.temperature == null || !Number.isFinite(point.temperature)) return null;
  const unit = point.temperatureUnit?.replace("°", "") ?? "C";
  return `${point.temperature.toFixed(1)}°${unit}`;
}

export function buildAqiMapInfoWindowHtml(point: CityAqiMapPoint): string {
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
