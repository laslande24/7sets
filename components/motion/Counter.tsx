"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { motionTokens, REVEAL_START } from "@/lib/gsap/config";

/**
 * Counts a number up when it enters.
 *
 * Renders the **final** value on the server, so the figure is correct before
 * any JavaScript runs and correct forever if none does. The count only starts
 * once the element is confirmed off-screen at hydration; if it is already
 * visible on load the number simply stays put rather than dropping to zero in
 * front of the reader.
 */

export type CounterProps = {
  to: number;
  /** Appended to the figure, e.g. "+" on 640. Never animated. */
  suffix?: string;
  className?: string;
  /** Seconds. Defaults to `--dur-hero`, which is what makes a count feel deliberate. */
  duration?: number;
  start?: string;
};

export function Counter({
  to,
  suffix = "",
  className,
  duration,
  start = REVEAL_START,
}: CounterProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = scope.current;
      if (!node) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Already on screen: leave the rendered value alone.
        const box = node.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) return;

        const { duration: dur, ease } = motionTokens();
        const state = { value: 0 };
        node.textContent = `0${suffix}`;

        gsap.to(state, {
          value: to,
          duration: duration ?? dur.hero,
          ease: ease.outQuart,
          onUpdate: () => {
            node.textContent = `${Math.round(state.value)}${suffix}`;
          },
          onComplete: () => {
            node.textContent = `${to}${suffix}`;
          },
          scrollTrigger: { trigger: node, start, once: true },
        });

        return () => {
          node.textContent = `${to}${suffix}`;
        };
      });
    },
    { scope, dependencies: [to, suffix, duration, start] },
  );

  return (
    <span ref={scope} className={className} data-count-to={to}>
      {to}
      {suffix}
    </span>
  );
}
