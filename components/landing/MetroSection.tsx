import { getAqiLevel } from "@/lib/air-quality/aqi-levels";
import { AqiBadge, type AqiBadgeVariant } from "./AqiBadge";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

type Metro = {
  stripe: string;
  rank: string;
  city: string;
  aqi: string;
  aqiColor: string;
  badge: AqiBadgeVariant;
  status: string;
  pm25: string;
  pm10: string;
  trend: string;
};

const METRO_ROWS: Omit<Metro, "stripe" | "aqiColor" | "badge" | "status">[] = [
  {
    rank: "#1 Worst",
    city: "Delhi",
    aqi: "162",
    pm25: "99",
    pm10: "154",
    trend: "↑ Rising",
  },
  {
    rank: "#2",
    city: "Mumbai",
    aqi: "160",
    pm25: "46",
    pm10: "124",
    trend: "→ Stable",
  },
  {
    rank: "#3",
    city: "Bengaluru",
    aqi: "116",
    pm25: "52",
    pm10: "130",
    trend: "↓ Improving",
  },
  {
    rank: "#4",
    city: "Hyderabad",
    aqi: "105",
    pm25: "54",
    pm10: "103",
    trend: "→ Stable",
  },
  {
    rank: "#5",
    city: "Chennai",
    aqi: "94",
    pm25: "48",
    pm10: "48",
    trend: "↓ Improving",
  },
  {
    rank: "#6 Best",
    city: "Kolkata",
    aqi: "74",
    pm25: "28",
    pm10: "60",
    trend: "↓ Improving",
  },
];

const METROS: Metro[] = METRO_ROWS.map((row) => {
  const n = Number.parseInt(row.aqi, 10);
  const L = getAqiLevel(Number.isFinite(n) ? n : 0);
  return {
    ...row,
    stripe: L.colorHex,
    aqiColor: L.textClass,
    badge: L.variant,
    status: L.label,
  };
});

export function MetroSection() {
  return (
    <section
      id="sec-metro"
      className="sec-fx relative border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(ellipse 300px 300px at 25% 50%, rgba(0,229,170,0.04) 0%, rgba(0,229,170,0.04) 40%, transparent 41%)`,
          maskImage: "linear-gradient(to right, black, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative z-[2] mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 xl:px-10">
        <SectionEyebrow>Network Status</SectionEyebrow>
        <SectionTitle className="mb-2">
          Metro City Signal Feed{" "}
          <span className="font-body text-[0.85rem] font-light text-bqa-dim">
            — ranked by pollution load
          </span>
        </SectionTitle>

        <div className="mt-8 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {METROS.map((m) => (
            <div
              key={m.city}
              className="relative cursor-pointer overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/70 p-5 pb-14 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-sky-400/20"
            >
              <div
                className="absolute bottom-0 left-0 top-0 w-[3px]"
                style={{ background: m.stripe }}
                aria-hidden
              />
              <div className="absolute right-3.5 top-3.5 rounded-full border border-sky-400/10 bg-bqa-slate px-2.5 py-0.5 font-mono text-[0.68rem] text-bqa-dim">
                {m.rank}
              </div>
              <div className="pl-2.5 text-[0.95rem] font-bold text-bqa-text">
                {m.city}
              </div>
              <div
                className={`pl-2.5 font-mono text-[2.2rem] font-bold ${m.aqiColor}`}
              >
                {m.aqi}
              </div>
              <AqiBadge variant={m.badge} className="ml-2.5 mt-1">
                {m.status}
              </AqiBadge>
              <div className="mt-2.5 flex gap-3.5 pl-2.5 text-[0.77rem] text-bqa-dim">
                <span>
                  PM2.5{" "}
                  <span className="font-mono font-bold text-bqa-text">
                    {m.pm25}
                  </span>
                </span>
                <span>
                  PM10{" "}
                  <span className="font-mono font-bold text-bqa-text">
                    {m.pm10}
                  </span>
                </span>
              </div>
              <div className="absolute bottom-4 right-3.5 text-[0.72rem] font-semibold text-bqa-muted">
                {m.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
