import { SectionTitle } from "./SectionTitle";

const BREAKDOWN = [
  { n: 8, label: "Good", color: "text-emerald-400" },
  { n: 9, label: "Moderate", color: "text-amber-300" },
  { n: 10, label: "Poor", color: "text-orange-400" },
  { n: 11, label: "Unhealthy", color: "text-rose-400" },
  { n: 12, label: "Severe", color: "text-purple-400" },
  { n: 13, label: "Hazardous", color: "text-fuchsia-400" },
];

export function IndiaAqiOverviewSection() {
  return (
    <section
      id="sec-india-overview"
      className="sec-fx border-t border-sky-400/10 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-container px-4 sm:px-7">
        <SectionTitle className="mb-8 sm:mb-10">
          Air Quality Across India
        </SectionTitle>

        <div className="overflow-hidden rounded-3xl border border-sky-400/10 bg-bqa-navy2/60 p-4 backdrop-blur-md sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border border-sky-400/10 bg-[#0a0f18] lg:min-h-[360px] lg:basis-[58%]">
              <div className="absolute left-4 top-4 z-[2] flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span className="text-sm font-semibold text-bqa-text">
                  Live AQI by State
                </span>
              </div>
              <p className="absolute right-4 top-4 z-[2] text-xs text-bqa-dim">
                Hover state for details
              </p>
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(239,68,68,0.25),transparent_50%),radial-gradient(ellipse_at_70%_35%,rgba(168,85,247,0.2),transparent_45%),radial-gradient(ellipse_at_55%_70%,rgba(34,197,94,0.12),transparent_40%)]"
                aria-hidden
              />
              <svg
                viewBox="0 0 400 420"
                className="h-full w-full opacity-90"
                aria-hidden
              >
                <rect width="400" height="420" fill="#0c1220" />
                <path
                  d="M120 80 L200 60 L280 100 L300 180 L260 280 L180 320 L100 260 L80 160 Z"
                  fill="rgba(168,85,247,0.35)"
                  stroke="rgba(96,165,250,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M200 200 L320 220 L300 320 L160 340 Z"
                  fill="rgba(239,68,68,0.25)"
                  stroke="rgba(96,165,250,0.15)"
                />
                <path
                  d="M40 200 L140 180 L160 280 L60 300 Z"
                  fill="rgba(34,197,94,0.2)"
                  stroke="rgba(96,165,250,0.15)"
                />
                <text
                  x="200"
                  y="200"
                  textAnchor="middle"
                  fill="rgba(125,165,201,0.35)"
                  fontSize="11"
                >
                  India (illustrative)
                </text>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 border-t border-sky-400/10 bg-bqa-navy/90 px-4 py-3">
                <div className="mb-1 h-2 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-orange-400 via-rose-500 to-rose-700" />
                <div className="flex justify-between font-mono text-[0.65rem] text-bqa-dim">
                  <span className="text-emerald-400">Good 0</span>
                  <span className="text-rose-400">400+ Hazardous</span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 lg:basis-[42%]">
              <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-bqa-navy2/80 p-5 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]">
                <p className="mb-2 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-purple-300">
                  Most polluted state today
                </p>
                <p className="text-xl font-bold text-white">Uttar Pradesh</p>
                <p className="mt-1">
                  <span className="font-mono text-3xl font-black text-purple-400">
                    287
                  </span>{" "}
                  <span className="text-sm font-semibold text-purple-300/90">
                    Severe
                  </span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-bqa-slate2">
                  <div className="h-full w-[75%] rounded-full bg-purple-500" />
                </div>
              </div>

              <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/30 to-bqa-navy2/80 p-5 shadow-[0_0_40px_-10px_rgba(45,212,191,0.4)]">
                <p className="mb-2 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-teal-300">
                  Cleanest state today
                </p>
                <p className="text-xl font-bold text-white">Kerala</p>
                <p className="mt-1">
                  <span className="font-mono text-3xl font-black text-teal-400">
                    38
                  </span>{" "}
                  <span className="text-sm font-semibold text-teal-200/90">
                    Good
                  </span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-bqa-slate2">
                  <div className="h-full w-[10%] rounded-full bg-teal-400" />
                </div>
              </div>

              <div className="rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-950/30 to-bqa-navy2/80 p-5 shadow-[0_0_40px_-10px_rgba(56,189,248,0.35)]">
                <p className="mb-4 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-sky-300">
                  National AQI breakdown
                </p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {BREAKDOWN.map((b) => (
                    <div key={b.label} className="text-center">
                      <div
                        className={`font-mono text-xl font-black sm:text-2xl ${b.color}`}
                      >
                        {b.n}
                      </div>
                      <div className="mt-0.5 text-[0.65rem] text-bqa-dim">
                        {b.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
