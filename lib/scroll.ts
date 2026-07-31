import { prefersReducedMotion } from "@/lib/gsap";

/**
 * One way to move the window, for the code that has to move it itself.
 *
 * Lenis owns the scroll position whenever it is running. Calling
 * `window.scrollTo` behind its back sets `scrollY` while Lenis still believes
 * the old value, and the next wheel event snaps the page back — so anything
 * that scrolls programmatically has to go through the instance if there is one.
 * `SmoothScrollProvider` registers it here on mount and clears it on unmount;
 * under reduced motion it never creates one, and the native path below runs
 * instead.
 */

type Scroller = {
  scrollTo: (target: number, options?: { immediate?: boolean }) => void;
};

let scroller: Scroller | null = null;

export function registerScroller(instance: Scroller | null) {
  scroller = instance;
}

/** Scroll the window to `y`. Instant when the reader has asked for less motion. */
export function scrollWindowTo(y: number) {
  const target = Math.max(0, Math.round(y));
  const immediate = prefersReducedMotion();

  if (scroller) {
    scroller.scrollTo(target, { immediate });
    return;
  }
  // `behavior: "smooth"` beats the `scroll-behavior: auto !important` that
  // globals.css sets under reduced motion, so it is chosen here, not there.
  window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
}
