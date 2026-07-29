"use client";

import { useEasePoints } from "./useTokens";

/**
 * Plots an easing token as its cubic-bezier curve. The four control numbers are
 * parsed out of the resolved token rather than restated here, so the drawing
 * cannot disagree with the stylesheet.
 */
export function EaseCurve({ cssVar }: { cssVar: string }) {
  const points = useEasePoints(cssVar);

  return (
    <svg
      viewBox="0 0 1 1"
      aria-hidden="true"
      className="size-16 shrink-0 rounded-sm bg-canvas text-ink"
      preserveAspectRatio="none"
    >
      {points ? (
        <path
          d={`M0,1 C${points[0]},${1 - points[1]} ${points[2]},${1 - points[3]} 1,0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </svg>
  );
}
