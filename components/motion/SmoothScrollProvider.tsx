"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { registerScroller } from "@/lib/scroll";

/**
 * Smooth scroll, and the one place ScrollTrigger is told when to refresh.
 *
 * Lenis 1.x scrolls the window natively rather than transforming a wrapper, so
 * `ScrollTrigger.scrollerProxy` is not needed and would in fact be wrong here —
 * `lenis.on("scroll", ScrollTrigger.update)` is the whole integration. The
 * brief names scrollerProxy; that instruction predates Lenis dropping the
 * transform approach.
 *
 * `autoRaf: false` because GSAP's ticker owns the frame loop. Two raf loops
 * driving the same scroll is how you get jitter that only shows up on slow
 * machines.
 *
 * Under `prefers-reduced-motion: reduce` no Lenis instance is created at all —
 * native scrolling, native anchor jumps, nothing to undo.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      smoothWheel: true,
      // Touch devices already scroll well and syncTouch fights the OS.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // Anything that scrolls the window itself goes through this instance while
    // it exists — see lib/scroll.ts.
    registerScroller(lenis);

    // GSAP's ticker is a requestAnimationFrame loop, and rAF does not run in a
    // page the browser is not painting — a background tab, a hidden pane, a
    // throttled renderer. When that happens Lenis cannot animate, so anything
    // that hands it control has to know.
    let lastTickAt = 0;
    const tick = (time: number) => {
      lastTickAt = performance.now();
      lenis.raf(time * 1000);
    };
    const lenisIsLive = () => performance.now() - lastTickAt < 500;
    gsap.ticker.add(tick);

    // Dev-only handle. Scroll behaviour is the one thing that cannot be
    // debugged from the DOM alone.
    if (process.env.NODE_ENV !== "production") {
      Object.assign(window, { __sets: { lenis, ScrollTrigger, gsap, lenisIsLive } });
    }

    // Anchors. Lenis owns the scroll position, so the browser's native jump
    // would land in one place and Lenis would immediately animate back.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey)
        return;
      // If Lenis is not being ticked, preventing the default would leave a dead
      // link. Let the browser's own jump handle it instead.
      if (!lenisIsLive()) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
      // Keep the keyboard where the click sent it. Without this the focus ring
      // stays behind on the link and the next Tab resumes from the wrong place.
      if (target instanceof HTMLElement) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    // One debounced refresh, replacing ScrollTrigger's per-pixel resize refresh
    // (disabled in lib/gsap/index.ts).
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);

    // Web fonts change every line box, so measure again once they land.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
