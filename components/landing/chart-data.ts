import { aqiIndexToColorHex } from "@/lib/air-quality/aqi-levels";

export const rawData = {
  aqi30: [
    148, 122, 89, 78, 134, 156, 210, 189, 164, 142, 118, 95, 87, 104, 131, 155, 178,
    201, 241, 301, 267, 234, 182, 163, 155, 146, 141, 138, 148, 160,
  ],
  pm25_30: [
    54, 44, 32, 28, 49, 57, 76, 68, 59, 51, 42, 33, 30, 37, 48, 56, 65, 73, 88, 110,
    96, 83, 65, 58, 55, 52, 49, 47, 50, 46,
  ],
  pm10_30: [
    98, 82, 60, 52, 90, 104, 140, 124, 112, 96, 78, 62, 56, 70, 91, 106, 122, 138,
    168, 210, 182, 156, 124, 112, 106, 100, 96, 92, 98, 124,
  ],
};

export const prevAqi30 = [
  110, 98, 75, 70, 102, 118, 148, 138, 126, 112, 94, 80, 74, 88, 108, 126, 142, 158,
  190, 234, 208, 182, 146, 130, 122, 118, 112, 108, 118, 130,
];

export const prevPm25 = [
  38, 34, 26, 24, 36, 42, 54, 50, 46, 40, 34, 28, 26, 32, 38, 46, 52, 58, 70, 86, 76,
  66, 52, 46, 42, 40, 37, 36, 40, 40,
];

export function aqiColor(v: number): string {
  return aqiIndexToColorHex(v);
}

export function genDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() - n + 1);
  for (let i = 0; i < n; i++) {
    days.push(
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    );
    d.setDate(d.getDate() + 1);
  }
  return days;
}
