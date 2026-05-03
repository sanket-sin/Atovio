"use client";

/**
 * Screenshot 1: city names light gray; AQI red/deep orange (160, 143), orange (116–118, 102), yellow (94, 88, 74).
 */
const LIVE_CITIES = [
  { city: "Delhi", aqi: 160, color: "text-red-500" },
  { city: "Mumbai", aqi: 160, color: "text-red-500" },
  { city: "Chennai", aqi: 94, color: "text-amber-300" },
  { city: "Bengaluru", aqi: 116, color: "text-orange-400" },
  { city: "Hyderabad", aqi: 88, color: "text-amber-300" },
  { city: "Kolkata", aqi: 74, color: "text-amber-300" },
  { city: "Pune", aqi: 102, color: "text-orange-400" },
  { city: "Gurugram", aqi: 118, color: "text-orange-400" },
  { city: "Ahmedabad", aqi: 143, color: "text-orange-600" },
];

type LiveAQITickerProps = {
  rowPad?: string;
  isLight?: boolean;
};

export function LiveAQITicker({
  rowPad = "px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12",
  isLight = false,
}: LiveAQITickerProps) {
  const items = [...LIVE_CITIES, ...LIVE_CITIES];

  const barClass = isLight
    ? "border-b border-black/[0.07] bg-white"
    : "border-b border-white/[0.06] bg-[#020617]";
  const labelClass = isLight
    ? "font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gray-800"
    : "font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white";
  const tickerBorderClass = isLight
    ? "border-l border-gray-300"
    : "border-l border-slate-600/70";
  const cityClass = isLight ? "text-gray-600" : "text-slate-400";
  const sepClass = isLight ? "px-2 text-gray-300 sm:px-2.5" : "px-2 text-slate-600 sm:px-2.5";

  return (
    <div className={`w-full min-w-0 transition-colors ${barClass}`}>
      <div
        className={`flex w-full min-w-0 items-stretch overflow-hidden py-2.5 ${rowPad}`}
      >
        <div className="flex shrink-0 items-center gap-2.5 pr-3 sm:pr-4">
          <span
            className="h-1.5 w-1.5 shrink-0 animate-blink rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
            aria-hidden
          />
          <span className={labelClass}>Live AQI</span>
        </div>
        <div
          className={`min-h-[1.25rem] min-w-0 flex-1 self-center overflow-hidden pl-3 sm:pl-4 ${tickerBorderClass}`}
        >
          <div className="flex w-max animate-ticker gap-0 pr-8">
            {items.map((c, i) => (
              <span
                key={`${c.city}-${i}`}
                className="inline-flex items-baseline whitespace-nowrap font-mono text-[0.78rem] sm:text-[0.8rem]"
              >
                <span className={cityClass}>{c.city}</span>
                <span className="ml-1.5 font-bold tabular-nums sm:ml-2">
                  <span className={c.color}>{c.aqi}</span>
                </span>
                <span className={sepClass} aria-hidden>
                  |
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
