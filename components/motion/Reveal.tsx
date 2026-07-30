"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP, withWillChange } from "@/lib/gsap";
import { motionTokens, REVEAL_START } from "@/lib/gsap/config";

/**
 * Fade and rise as the element enters.
 *
 * The hidden starting state is CSS (`[data-reveal]` in globals.css), not a
 * `gsap.set` in an effect — otherwise the element paints at full opacity and
 * then jumps, which is the flash this phase is meant to avoid. That also means
 * a page with JavaScript off, or a reader who has asked for reduced motion,
 * gets the finished state and no JavaScript is required to reach it.
 *
 * With `stagger`, the direct children animate one after another instead of the
 * wrapper moving as a block.
 */

export type RevealTag =
  "div" | "span" | "section" | "ul" | "ol" | "p" | "h2" | "h3" | "figure";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
  /** Seconds before the tween starts. */
  delay?: number;
  /** How far it travels, in px. */
  distance?: number;
  /** Seconds. Defaults to `--dur-base`. */
  duration?: number;
  /** Seconds between children. Switches the target from the wrapper to its children. */
  stagger?: number;
  /** ScrollTrigger start. Defaults to the shared page rhythm. */
  start?: string;
};

export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  distance = 24,
  duration,
  stagger,
  start = REVEAL_START,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // matchMedia rather than an early return: GSAP tears the context down
      // again if the preference changes mid-session.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const { duration: dur, ease } = motionTokens();
        const targets = stagger === undefined ? root : Array.from(root.children);

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: duration ?? dur.base,
          delay,
          stagger,
          ease: ease.outExpo,
          ...withWillChange(root),
          scrollTrigger: { trigger: root, start, once: true },
        });
      });
    },
    { scope, dependencies: [delay, distance, duration, stagger, start] },
  );

  return (
    <Tag
      ref={scope as React.Ref<never>}
      className={className}
      style={{ "--reveal-distance": `${distance}px` } as React.CSSProperties}
      {...(stagger === undefined ? { "data-reveal": "" } : { "data-reveal-group": "" })}
    >
      {children}
    </Tag>
  );
}
