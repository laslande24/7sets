"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";

/**
 * Pulls an element a little way towards the cursor.
 *
 * Deliberately weak. A magnetic button that moves far enough to be obvious is a
 * button people miss when they click, and the whole effect is worth less than
 * one reliable click. `strength` is capped in use, not here, but 0.25 is about
 * where it stops helping.
 *
 * Off entirely on coarse pointers — there is no cursor to be attracted to — and
 * off under reduced motion.
 */

export type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength?: number;
  /** How far outside its own box the element starts reacting, in px. */
  radius?: number;
};

export function Magnetic({
  children,
  className,
  strength = 0.2,
  radius = 40,
}: MagneticProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const { duration, ease } = motionTokens();
        const move = gsap.quickTo(root, "x", {
          duration: duration.base,
          ease: ease.outQuart,
        });
        const lift = gsap.quickTo(root, "y", {
          duration: duration.base,
          ease: ease.outQuart,
        });

        const onPointerMove = (event: PointerEvent) => {
          const box = root.getBoundingClientRect();
          const centreX = box.left + box.width / 2;
          const centreY = box.top + box.height / 2;
          const withinX = Math.abs(event.clientX - centreX) < box.width / 2 + radius;
          const withinY = Math.abs(event.clientY - centreY) < box.height / 2 + radius;

          if (withinX && withinY) {
            root.style.willChange = "transform";
            move((event.clientX - centreX) * strength);
            lift((event.clientY - centreY) * strength);
          } else {
            move(0);
            lift(0);
            root.style.willChange = "";
          }
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          gsap.set(root, { x: 0, y: 0 });
          root.style.willChange = "";
        };
      });
    },
    { scope, dependencies: [strength, radius] },
  );

  return (
    <span ref={scope} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
