"use client";

import {
  AnimatedProgressBar,
  AnimatedStrokeRing,
  useAnimatedProgress,
  useInViewOnce,
} from "./ReadingAnimation";

const WHO_SAFE_DAYS = 5;
const WHO_TOTAL_DAYS = 30;
const CPCB_SAFE_DAYS = 18;
const CPCB_SAFE_PCT = 60;
const WHO_GUIDELINE_PCT = (WHO_SAFE_DAYS / WHO_TOTAL_DAYS) * 100;

export function WhoComplianceScorecard({ active: activeProp }: { active?: boolean }) {
  const [cardRef, inView] = useInViewOnce<HTMLDivElement>([]);
  const active = activeProp ?? inView;
  const daysProgress = useAnimatedProgress(active, 900);

  return (
    <div ref={activeProp === undefined ? cardRef : undefined}>
      <p className="mb-4 font-sans text-[0.8rem] text-bqa-dim">Last 30 days · Mumbai</p>

      <div className="relative mx-auto h-[160px] w-[160px]">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="90" cy="90" r="60" fill="none" stroke="#1a2d4a" strokeWidth="14" />
          <AnimatedStrokeRing
            radius={60}
            cx={90}
            cy={90}
            strokeWidth={14}
            progress={WHO_SAFE_DAYS / WHO_TOTAL_DAYS}
            stroke="#c77dff"
            active={active}
            durationMs={1100}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-[30px] font-bold leading-none text-[#c77dff]">
            {Math.round(WHO_SAFE_DAYS * daysProgress)}
          </span>
          <span className="mt-0.5 font-sans text-[11px] text-[#4a728a]">/30</span>
        </div>
      </div>

      <div className="mt-1 text-center">
        <p className="font-sans text-[1rem] font-bold text-white">
          {Math.round(WHO_SAFE_DAYS * daysProgress)} days within WHO Limits
        </p>
        <p className="font-sans text-[0.82rem] text-bqa-dim">
          {Math.round((WHO_TOTAL_DAYS - WHO_SAFE_DAYS) * Math.min(1, daysProgress + 0.2))} days over
          WHO threshold
        </p>
      </div>

      <div className="mt-5 space-y-4 rounded-[14px] border border-sky-400/10 bg-bqa-slate/40 p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between font-sans text-[0.78rem]">
            <span className="text-bqa-muted">CPCB Standard</span>
            <span className="font-semibold text-bqa-good">
              {Math.round(CPCB_SAFE_DAYS * daysProgress)} Days Safe
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bqa-navy">
            <AnimatedProgressBar
              targetWidth={`${CPCB_SAFE_PCT}%`}
              className="bg-bqa-good"
              active={active}
              delayMs={120}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between font-sans text-[0.78rem]">
            <span className="text-bqa-muted">WHO Guideline</span>
            <span className="font-semibold text-bqa-compare">
              {Math.round(WHO_SAFE_DAYS * daysProgress)} Days Safe
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bqa-navy">
            <AnimatedProgressBar
              targetWidth={`${WHO_GUIDELINE_PCT}%`}
              className="bg-bqa-compare"
              active={active}
              delayMs={220}
            />
          </div>
        </div>
      </div>
      <p className="mt-3 font-sans text-[0.78rem] text-bqa-dim">
        • Govt &ldquo;safe&rdquo; ≠ WHO &ldquo;safe&rdquo; — big gap
      </p>
    </div>
  );
}
