"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Ties a vertical offset to scroll position.
 *
 * `speed` is a fraction of the element's own height: 0.2 moves it a fifth of
 * its height across the whole pass, positive meaning it lags the page and
 * negative meaning it leads. Keeping it relative is what stops a parallax from
 * looking right at 1440 and absurd at 390.
 *
 * No CSS pre-state — the element starts where the layout puts it, so nothing to
 * undo when JavaScript is off or reduced motion is on.
 */

export type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the element's height. Keep it under 0.3 or it reads as a glitch. */
  speed?: number;
};

export function Parallax({ children, className, speed = 0.15 }: ParallaxProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The layer is created when the element enters and dropped when it
        // leaves. A permanent `will-change` in the stylesheet is a permanent
        // compositor layer, which is the cost it exists to avoid.
        const compositeWhileVisible = {
          onEnter: () => (root.style.willChange = "transform"),
          onEnterBack: () => (root.style.willChange = "transform"),
          onLeave: () => (root.style.willChange = ""),
          onLeaveBack: () => (root.style.willChange = ""),
        };

        gsap.fromTo(
          root,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              ...compositeWhileVisible,
            },
          },
        );

        return () => {
          root.style.willChange = "";
        };
      });
    },
    { scope, dependencies: [speed] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
