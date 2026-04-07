"use client";

import { useMemo, type CSSProperties } from "react";

type DotSpec = { cls: string; x: number; y: number; dur: string; delay: string };

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildDots(seed: number): DotSpec[] {
  const rnd = seededRandom(seed);
  const cols = [
    { cls: "good", count: 6 },
    { cls: "warn", count: 8 },
    { cls: "poor", count: 5 },
    { cls: "", count: 3 },
  ];
  const out: DotSpec[] = [];
  cols.forEach(({ cls, count }) => {
    for (let i = 0; i < count; i++) {
      const x = 5 + rnd() * 90;
      const y = 5 + rnd() * 90;
      const dur = `${(2.5 + rnd() * 3).toFixed(1)}s`;
      const delay = `${(rnd() * 3).toFixed(1)}s`;
      out.push({ cls, x, y, dur, delay });
    }
  });
  return out;
}

export function SensorMapVisual() {
  const dots = useMemo(() => buildDots(42), []);

  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-[55%]"
      aria-hidden
    >
      {dots.map((d, i) => (
        <span key={`d-${i}`}>
          <span
            className={`sensor-dot absolute ${d.cls}`.trim()}
            style={
              {
                left: `${d.x}%`,
                top: `${d.y}%`,
                ["--dur" as string]: d.dur,
                ["--delay" as string]: d.delay,
              } as CSSProperties
            }
          />
          <span
            className="sensor-ring absolute"
            style={
              {
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: 14,
                height: 14,
                ["--dur" as string]: `${(parseFloat(d.dur) + 1).toFixed(1)}s`,
                ["--delay" as string]: d.delay,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
