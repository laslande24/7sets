"use client";

import { useCallback, useRef, useState } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * How far an element has travelled through the viewport, 0 → 1.
 *
 * ScrollTrigger fires on every frame; React does not want a render on every
 * frame. The value is therefore quantised — by default to 1/60ths — and state
 * is only set when the quantised value actually changes. At the default that is
 * at most sixty renders across the element's whole pass instead of several
 * hundred.
 *
 * If you need per-frame precision, do not use this: read `progress` inside a
 * ScrollTrigger `onUpdate` and write to the DOM directly, which is what
 * ScoreRail does for its inner counter.
 *
 * Returns 0 on the server and under reduced motion, where nothing scrubs.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(steps = 60) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const lastRef = useRef(0);

  const publish = useCallback(
    (value: number) => {
      const quantised = Math.round(value * steps) / steps;
      if (quantised === lastRef.current) return;
      lastRef.current = quantised;
      setProgress(quantised);
    },
    [steps],
  );

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => publish(self.progress),
        });
        return () => trigger.kill();
      });
    },
    { scope: ref, dependencies: [publish] },
  );

  return { ref, progress };
}
