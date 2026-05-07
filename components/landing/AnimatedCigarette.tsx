"use client";

import "./animated-cigarette.css";

const BURNT_ASH_SPANS = 32;
const FILTER_TEXTURE_SPANS = 10;

type AnimatedCigaretteProps = {
  /** Light leaderboard theme — adjusts smoke contrast */
  isLight?: boolean;
  /** Shorter on-screen cigarette (e.g. toolkit card header) */
  compact?: boolean;
  className?: string;
  title?: string;
};

/**
 * Pure-CSS animated cigarette for small UI accents (e.g. leaderboard “Puff Score”).
 */
export function AnimatedCigarette({
  isLight = false,
  compact = false,
  className = "",
  title = "Approximate cigarettes inhaled per day",
}: AnimatedCigaretteProps) {
  return (
    <span
      className={`puff-score-cigarette ${compact ? "puff-score-cigarette--compact" : ""} ${isLight ? "puff-score-cigarette--light" : ""} ${className}`.trim()}
      data-scale="sm"
      title={title}
      aria-hidden
    >
      <span className="cigarette-holder-scale">
        <span className="cigarette-holder">
          <span className="burnt">
            <span className="burnt-core" />
            {Array.from({ length: BURNT_ASH_SPANS }, (_, i) => (
              <span key={i} />
            ))}
          </span>
          <span className="ciggi-body">
            <span className="smoke" />
            <span className="smoke-2" />
            <span className="smoke-3" />
            <span className="smoke-4" />
            <span className="smoke-5" />
          </span>
          <span className="filter">
            {Array.from({ length: FILTER_TEXTURE_SPANS }, (_, i) => (
              <span key={i} />
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}
