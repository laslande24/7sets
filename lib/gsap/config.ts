import { CustomEase } from "gsap/CustomEase";

import { gsap } from "./index";

/**
 * Motion values, read out of the cascade rather than restated here.
 *
 * `--dur-*` and `--ease-*` live in app/globals.css because the design system
 * owns them. This module parses them once and hands GSAP the same numbers the
 * CSS transitions use, so a token change moves both at once and the two can
 * never drift.
 *
 * The eases are cubic-beziers in CSS. GSAP has no cubic-bezier parser, but a
 * CSS `cubic-bezier(x1,y1,x2,y2)` is exactly the SVG path
 * `M0,0 C x1,y1 x2,y2 1,1`, which is what CustomEase takes.
 */

export type MotionTokens = {
  readonly duration: Readonly<Record<"fast" | "base" | "slow" | "hero", number>>;
  readonly ease: Readonly<Record<"outExpo" | "outQuart" | "inOutQuint", string>>;
};

/** Used on the server and if a token is ever missing. Mirrors globals.css. */
const FALLBACK: MotionTokens = {
  duration: { fast: 0.2, base: 0.4, slow: 0.8, hero: 1.4 },
  ease: { outExpo: "power4.out", outQuart: "power2.out", inOutQuint: "power4.inOut" },
};

let cached: MotionTokens | null = null;

function readSeconds(styles: CSSStyleDeclaration, name: string, fallback: number) {
  const raw = styles.getPropertyValue(name).trim();
  if (!raw) return fallback;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value / 1000 : value;
}

/** Turns `cubic-bezier(a,b,c,d)` into a registered CustomEase id. */
function readEase(
  styles: CSSStyleDeclaration,
  name: string,
  id: string,
  fallback: string,
) {
  const numbers = styles.getPropertyValue(name).match(/-?\d*\.?\d+/g);
  if (numbers?.length !== 4) return fallback;
  const [x1, y1, x2, y2] = numbers;
  CustomEase.create(id, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
  return id;
}

/** Cached after the first call. Returns the fallback on the server. */
export function motionTokens(): MotionTokens {
  if (cached) return cached;
  if (typeof document === "undefined") return FALLBACK;

  gsap.registerPlugin(CustomEase);
  const styles = getComputedStyle(document.documentElement);

  cached = {
    duration: {
      fast: readSeconds(styles, "--dur-fast", FALLBACK.duration.fast),
      base: readSeconds(styles, "--dur-base", FALLBACK.duration.base),
      slow: readSeconds(styles, "--dur-slow", FALLBACK.duration.slow),
      hero: readSeconds(styles, "--dur-hero", FALLBACK.duration.hero),
    },
    ease: {
      outExpo: readEase(
        styles,
        "--ease-out-expo",
        "sets-out-expo",
        FALLBACK.ease.outExpo,
      ),
      outQuart: readEase(
        styles,
        "--ease-out-quart",
        "sets-out-quart",
        FALLBACK.ease.outQuart,
      ),
      inOutQuint: readEase(
        styles,
        "--ease-in-out-quint",
        "sets-in-out-quint",
        FALLBACK.ease.inOutQuint,
      ),
    },
  };

  return cached;
}

/** Where a section starts animating. One value, so the page has a rhythm. */
export const REVEAL_START = "top 82%";
