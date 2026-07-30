"use client";

import { useScrollProgress } from "@/components/motion";

/** Shows `useScrollProgress` reporting its own element's pass through the viewport. */
export function ScrollProgressDemo() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={ref} className="rounded-md bg-canvas p-6 ring-1 ring-ink/10 ring-inset">
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-caption">progress</span>
        <span className="text-display-md tabular-nums">{progress.toFixed(2)}</span>
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-lime-600"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-3 text-caption text-ink/60">
        0 when the top of this box meets the bottom of the window, 1 when its bottom meets
        the top. Quantised to 1/60ths so scrolling does not re-render on every frame.
      </p>
    </div>
  );
}
