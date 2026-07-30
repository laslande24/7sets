"use client";

import { useRef, type ReactNode } from "react";

import { gsap, loadSplitText, useGSAP, withWillChange } from "@/lib/gsap";
import { motionTokens, REVEAL_START } from "@/lib/gsap/config";

/**
 * Reveals text line by line or word by word from behind a mask.
 *
 * Three things this has to get right and most implementations do not:
 *
 * 1. Split after the webfont has loaded. Splitting first measures line breaks
 *    in the fallback face and every line lands in the wrong place.
 * 2. Never leave the text invisible. The block starts at opacity 0 from CSS so
 *    the unsplit text is not seen; if SplitText fails to load, or the reader
 *    has asked for reduced motion, the block is shown as-is instead.
 * 3. Revert the split on unmount, so the DOM goes back to plain text and screen
 *    readers are not left reading a hundred one-character spans.
 */

export type SplitRevealTag = "h1" | "h2" | "h3" | "p" | "div" | "span";

export type SplitRevealProps = {
  children: ReactNode;
  className?: string;
  as?: SplitRevealTag;
  /** Masked lines by default; words for shorter, punchier headings. */
  by?: "lines" | "words";
  delay?: number;
  /** Seconds between lines or words. */
  stagger?: number;
  start?: string;
};

export function SplitReveal({
  children,
  className,
  as: Tag = "div",
  by = "lines",
  delay = 0,
  stagger = 0.08,
  start = REVEAL_START,
}: SplitRevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const show = () => gsap.set(root, { opacity: 1 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", show);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let cleanup: (() => void) | undefined;
        let cancelled = false;

        void Promise.all([loadSplitText(), document.fonts?.ready])
          .then(([SplitText]) => {
            if (cancelled || !scope.current) return;

            const split = new SplitText(root, { type: by, mask: by });
            const parts = by === "lines" ? split.lines : split.words;
            const { duration, ease } = motionTokens();

            show();
            const tween = gsap.from(parts, {
              yPercent: 110,
              duration: duration.slow,
              delay,
              stagger,
              ease: ease.outExpo,
              ...withWillChange(root, "transform"),
              scrollTrigger: { trigger: root, start, once: true },
            });

            cleanup = () => {
              tween.scrollTrigger?.kill();
              tween.kill();
              split.revert();
            };
          })
          .catch(show);

        return () => {
          cancelled = true;
          cleanup?.();
        };
      });
    },
    { scope, dependencies: [by, delay, stagger, start] },
  );

  return (
    <Tag ref={scope as React.Ref<never>} className={className} data-split-reveal="">
      {children}
    </Tag>
  );
}
