import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The one place plugins get registered.
 *
 * ScrollTrigger and ScrollToPlugin load eagerly because the score rail and every
 * reveal need them on first paint. SplitText, DrawSVG and MotionPath do not —
 * they belong to two sections each, so they are behind the loaders below and
 * only arrive when the section that wants them mounts.
 *
 * Since GSAP 3.13 every former Club plugin ships in the public package, so none
 * of this needs a licence or a private registry.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

  // Lenis drives the ticker from Phase 4 on. Lag smoothing would let GSAP
  // invent frames during a stall and fight it.
  gsap.ticker.lagSmoothing(0);

  // The default resize refresh fires on every pixel of a drag. We replace it
  // with one debounced call — see SmoothScrollProvider.
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Tells the inline script in app/layout.tsx to stand down: the motion runtime
  // is here, so the CSS pre-states are safe to keep. If this never runs the
  // script drops them and the page reveals itself unanimated.
  document.documentElement.dataset.motionReady = "";
}

export { gsap, ScrollTrigger, ScrollToPlugin, useGSAP };

/* ------------------------------------------------------------------ lazy */

let splitTextLoader: Promise<typeof import("gsap/SplitText").SplitText> | null = null;
let drawSvgLoader: Promise<typeof import("gsap/DrawSVGPlugin").DrawSVGPlugin> | null =
  null;
let motionPathLoader: Promise<
  typeof import("gsap/MotionPathPlugin").MotionPathPlugin
> | null = null;

/** Line- and word-level splitting. Used by SplitReveal. */
export function loadSplitText() {
  splitTextLoader ??= import("gsap/SplitText").then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return splitTextLoader;
}

/** Stroke drawing. Phase 5 uses it on the method path. */
export function loadDrawSVG() {
  drawSvgLoader ??= import("gsap/DrawSVGPlugin").then(({ DrawSVGPlugin }) => {
    gsap.registerPlugin(DrawSVGPlugin);
    return DrawSVGPlugin;
  });
  return drawSvgLoader;
}

/** Moving an element along a path. Phase 5 sends a ball down the method curve. */
export function loadMotionPath() {
  motionPathLoader ??= import("gsap/MotionPathPlugin").then(({ MotionPathPlugin }) => {
    gsap.registerPlugin(MotionPathPlugin);
    return MotionPathPlugin;
  });
  return motionPathLoader;
}

/* --------------------------------------------------------------- helpers */

/** True when the user has asked for less motion. Safe on the server. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Composites the element for the length of the tween and releases it after.
 * `will-change` left in a stylesheet is a permanent layer, which is the thing
 * it is supposed to avoid.
 */
export function withWillChange(
  element: Element | null,
  properties = "transform, opacity",
) {
  return {
    onStart: () => {
      if (element instanceof HTMLElement) element.style.willChange = properties;
    },
    onComplete: () => {
      if (element instanceof HTMLElement) element.style.willChange = "";
    },
  };
}
