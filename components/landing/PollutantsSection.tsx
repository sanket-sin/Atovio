import { AqiBadge, type AqiBadgeVariant } from "./AqiBadge";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionTitle } from "./SectionTitle";

type Pol = {
  accent: string;
  name: string;
  value: string;
  unit: string;
  fillWidth: string;
  fillClass: string;
  thresholdLeft: string;
  scale: [string, string, string];
  badge: AqiBadgeVariant;
  badgeLabel: string;
  who: string;
};

const POLS: Pol[] = [
  {
    accent: "#ffd24d",
    name: "Particulate Matter – PM₂.₅",
    value: "46",
    unit: "µg/m³",
    fillWidth: "37%",
    fillClass: "bg-gradient-to-r from-bqa-good to-bqa-moderate",
    thresholdLeft: "30%",
    scale: ["0", "Safe: 15 µg/m³", "125"],
    badge: "moderate",
    badgeLabel: "Moderate",
    who: "WHO SAFE LIMIT: 15 µg/m³",
  },
  {
    accent: "#ff4d6d",
    name: "Particulate Matter – PM₁₀",
    value: "124",
    unit: "µg/m³",
    fillWidth: "49%",
    fillClass:
      "bg-gradient-to-r from-bqa-good via-bqa-moderate via-bqa-poor to-bqa-unhealthy",
    thresholdLeft: "25%",
    scale: ["0", "Safe: 45 µg/m³", "250"],
    badge: "unhealthy",
    badgeLabel: "Unhealthy",
    who: "WHO SAFE LIMIT: 45 µg/m³",
  },
  {
    accent: "#00e5aa",
    name: "Carbon Monoxide (CO)",
    value: "289",
    unit: "ppm",
    fillWidth: "14%",
    fillClass: "bg-bqa-good",
    thresholdLeft: "40%",
    scale: ["0", "Safe: 700 ppm", "2000"],
    badge: "good",
    badgeLabel: "Good",
    who: "WHO SAFE LIMIT: 700 ppm",
  },
  {
    accent: "#00e5aa",
    name: "Sulfur Dioxide (SO₂)",
    value: "5",
    unit: "ppm",
    fillWidth: "10%",
    fillClass: "bg-bqa-good",
    thresholdLeft: "40%",
    scale: ["0", "Safe: 20 ppm", "50"],
    badge: "good",
    badgeLabel: "Good",
    who: "WHO SAFE LIMIT: 20 ppm",
  },
  {
    accent: "#00e5aa",
    name: "Nitrogen Dioxide (NO₂)",
    value: "18",
    unit: "ppm",
    fillWidth: "9%",
    fillClass: "bg-bqa-good",
    thresholdLeft: "20%",
    scale: ["0", "Safe: 40 ppm", "200"],
    badge: "good",
    badgeLabel: "Good",
    who: "WHO SAFE LIMIT: 40 ppm",
  },
  {
    accent: "#00e5aa",
    name: "Ozone (O₃)",
    value: "7",
    unit: "ppm",
    fillWidth: "7%",
    fillClass: "bg-bqa-good",
    thresholdLeft: "30%",
    scale: ["0", "Safe: 60 ppm", "200"],
    badge: "good",
    badgeLabel: "Good",
    who: "WHO SAFE LIMIT: 60 ppm",
  },
];

function PollutantCard({ p }: { p: Pol }) {
  return (
    <div className="group relative cursor-default overflow-hidden rounded-[20px] border border-sky-400/10 bg-bqa-navy2/70 p-5 pb-5 pl-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-sky-400/20 sm:p-6">
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[20px]"
        style={{ background: p.accent }}
        aria-hidden
      />
      <div className="pl-2.5 text-[0.8rem] font-semibold text-bqa-muted">
        {p.name}
      </div>
      <div className="pl-2.5 font-mono text-[1.8rem] font-bold text-bqa-text">
        {p.value}{" "}
        <span className="text-[0.75rem] font-normal text-bqa-dim">{p.unit}</span>
      </div>
      <div className="mt-3.5 pl-2.5">
        <div className="relative mb-1.5 h-[7px] rounded bg-bqa-slate2">
          <div
            className={`absolute left-0 top-0 h-full rounded ${p.fillClass}`}
            style={{ width: p.fillWidth }}
          />
          <div
            className="absolute -top-1 bottom-0 w-0.5 rounded-sm bg-white/45"
            style={{ left: p.thresholdLeft }}
          />
        </div>
        <div className="flex justify-between text-[0.65rem] text-bqa-dim">
          <span>{p.scale[0]}</span>
          <span>{p.scale[1]}</span>
          <span>{p.scale[2]}</span>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pl-2.5">
        <AqiBadge variant={p.badge}>{p.badgeLabel}</AqiBadge>
        <span className="text-[0.68rem] text-bqa-dim">{p.who}</span>
      </div>
    </div>
  );
}

export function PollutantsSection() {
  return (
    <section
      id="sec-pollutants"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionEyebrow>Signal Breakdown</SectionEyebrow>
        <SectionTitle>Raw Pollutant Readings</SectionTitle>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {POLS.map((p) => (
            <PollutantCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
