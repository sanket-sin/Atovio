"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useInViewOnce<T extends HTMLElement>(
  deps: unknown[] = []
): [(node: T | null) => void, boolean] {
  const [element, setElement] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const setRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    setInView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls re-trigger via deps
  }, deps);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls re-trigger via deps
  }, [element, ...deps]);

  return [setRef, inView];
}

type AnimatedProgressBarProps = {
  targetWidth: string;
  className?: string;
  durationMs?: number;
  delayMs?: number;
  active: boolean;
};

export function AnimatedProgressBar({
  targetWidth,
  className = "",
  durationMs = 1000,
  delayMs = 0,
  active,
}: AnimatedProgressBarProps) {
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    if (!active) {
      setWidth("0%");
      return;
    }

    setWidth("0%");
    const timer = window.setTimeout(() => {
      requestAnimationFrame(() => setWidth(targetWidth));
    }, delayMs);

    return () => clearTimeout(timer);
  }, [active, targetWidth, delayMs]);

  return (
    <div
      className={`absolute left-0 top-0 h-full rounded transition-[width] ease-out ${className}`}
      style={{ width, transitionDuration: `${durationMs}ms` }}
    />
  );
}

type AnimatedReadingValueProps = {
  value: number;
  format: (n: number) => string;
  active: boolean;
  durationMs?: number;
  delayMs?: number;
  className?: string;
};

export function AnimatedReadingValue({
  value,
  format,
  active,
  durationMs = 900,
  delayMs = 0,
  className,
}: AnimatedReadingValueProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }

    let raf = 0;
    let startTimer = 0;

    const run = (now: number, startAt: number) => {
      const elapsed = now - startAt;
      const t = Math.min(1, elapsed / durationMs);
      setDisplay(value * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame((t2) => run(t2, startAt));
    };

    setDisplay(0);
    startTimer = window.setTimeout(() => {
      raf = requestAnimationFrame((now) => run(now, now));
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [value, active, durationMs, delayMs]);

  return <span className={className}>{format(display)}</span>;
}

export function useAnimatedProgress(
  active: boolean,
  durationMs = 1000,
  delayMs = 0
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let raf = 0;
    let timer = 0;
    setProgress(0);
    timer = window.setTimeout(() => {
      const start = performance.now();
      const run = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setProgress(easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(run);
      };
      raf = requestAnimationFrame(run);
    }, delayMs);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, durationMs, delayMs]);

  return progress;
}

type AnimatedHorizontalMarkerProps = {
  targetPercent: number;
  active: boolean;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  children?: ReactNode;
};

export function AnimatedHorizontalMarker({
  targetPercent,
  active,
  durationMs = 1000,
  delayMs = 0,
  className = "",
  children,
}: AnimatedHorizontalMarkerProps) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!active) {
      setLeft(0);
      return;
    }

    setLeft(0);
    const timer = window.setTimeout(() => {
      requestAnimationFrame(() => setLeft(targetPercent));
    }, delayMs);

    return () => clearTimeout(timer);
  }, [active, targetPercent, delayMs]);

  return (
    <div
      className={className}
      style={{
        left: `${left}%`,
        transition: `left ${durationMs}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}

type AnimatedStrokeRingProps = {
  radius: number;
  cx?: number;
  cy?: number;
  strokeWidth: number;
  /** Fraction of the circle to draw (0–1). */
  progress: number;
  stroke: string;
  active: boolean;
  durationMs?: number;
  delayMs?: number;
};

export function AnimatedStrokeRing({
  radius,
  cx = 50,
  cy = 50,
  strokeWidth,
  progress,
  stroke,
  active,
  durationMs = 1000,
  delayMs = 0,
}: AnimatedStrokeRingProps) {
  const circumference = 2 * Math.PI * radius;
  const targetDash = Math.max(0, progress) * circumference;
  const [dash, setDash] = useState(0);

  useEffect(() => {
    if (!active) {
      setDash(0);
      return;
    }

    setDash(0);
    const timer = window.setTimeout(() => {
      requestAnimationFrame(() => setDash(targetDash));
    }, delayMs);

    return () => clearTimeout(timer);
  }, [active, targetDash, delayMs]);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${dash} ${circumference}`}
      style={{ transition: `stroke-dasharray ${durationMs}ms ease-out` }}
    />
  );
}
