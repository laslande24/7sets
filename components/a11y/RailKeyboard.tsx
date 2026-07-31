"use client";

import { useEffect } from "react";

import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollWindowTo } from "@/lib/scroll";

/**
 * Keyboard access for the horizontal rails.
 *
 * Three separate problems, one component, because they are the same problem
 * seen from different sides:
 *
 * 1. **A scroll container with nothing focusable inside it is unreachable.** A
 *    mouse can drag the coaches rail; a keyboard cannot reach it at all. The fix
 *    is a tab stop — but only while the element is actually scrolling, because
 *    above 640px that same rail is a grid and a tab stop there is furniture.
 *    That is a measurement, not a media query the markup can state, so it is
 *    made here and re-made whenever the element resizes.
 *
 * 2. **Arrow keys.** With `data-rail-item` on each card, Left and Right move
 *    focus between them and Home and End jump to the ends. Rails without those
 *    markers keep the browser's own behaviour, which for a focused scroller is
 *    already arrow-key scrolling — there is nothing to improve on.
 *
 * 3. **The pinned rail does not scroll, it translates.** On desktop SET 03 is
 *    pinned and moved by `x`, so its horizontal position is a function of the
 *    page's *vertical* scroll. Tab into a card that is off to the right and the
 *    browser tries to reveal it by scrolling an ancestor, finds a pinned element
 *    and gets nowhere: focus is somewhere the reader cannot see. Every path in
 *    here therefore ends in `reveal`, which knows both geometries.
 *
 * The sections stay Server Components and declare themselves with attributes —
 * the same arrangement `SectionMotion` uses.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Gap left between the rail's leading edge and the card being revealed. */
const LEAD = 24;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function RailKeyboard() {
  useEffect(() => {
    const rails = Array.from(document.querySelectorAll<HTMLElement>("[data-rail]"));
    const cleanups: Array<() => void> = [];

    for (const rail of rails) {
      const itemsOf = () =>
        Array.from(rail.querySelectorAll<HTMLElement>("[data-rail-item]"));

      /* ------------------------------------------------------- tab stop */
      // `always` is for the testimonial marquee: on desktop it is not a
      // scroller at all — the loop runs and the overflow is hidden — but WCAG
      // 2.2.2 wants a way to stop moving content, and focus is that way for a
      // keyboard. Focus cannot pause what it cannot reach.
      const alwaysFocusable = rail.dataset.railFocus === "always";

      /**
       * Overflowing is not the same as scrolling.
       *
       * `scrollWidth > clientWidth` is true for the programmes rail on desktop
       * as well, where `overflow-x` is `visible` and the content simply hangs
       * out of the box for the pin to move. Asking the width alone put a tab
       * stop on an element that cannot scroll, and sent `reveal` down the
       * scroller branch where `scrollBy` is a no-op — which is to say the
       * pinned rail, the one case this component exists for, was the one case
       * it did nothing about.
       */
      const canScroll = () => {
        const overflow = getComputedStyle(rail).overflowX;
        return (
          (overflow === "auto" || overflow === "scroll") &&
          rail.scrollWidth > rail.clientWidth + 1
        );
      };

      // A tab stop whenever it scrolls, regardless of what is inside it. The
      // links in these cards are hidden by their own reveal until the reader
      // reaches them, so "does it contain something focusable" answers `false`
      // exactly when it matters — and a tab stop on a scroller that also holds
      // links is the accepted pattern anyway: the region scrolls, its links
      // do not.
      const syncTabStop = () => {
        if (alwaysFocusable || canScroll()) rail.tabIndex = 0;
        else rail.removeAttribute("tabindex");
      };

      syncTabStop();
      const observer = new ResizeObserver(syncTabStop);
      observer.observe(rail);
      cleanups.push(() => observer.disconnect());

      /* --------------------------------------------------------- reveal */
      const reveal = (card: HTMLElement) => {
        const railBox = rail.getBoundingClientRect();
        const cardBox = card.getBoundingClientRect();
        const alreadyVisible =
          cardBox.left >= railBox.left - 1 && cardBox.right <= railBox.right + 1;
        if (alreadyVisible) return;

        // The ordinary case: a real scroller, which is every rail on a phone.
        if (canScroll()) {
          rail.scrollBy({
            left: cardBox.left - railBox.left - LEAD,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
          return;
        }

        // The pinned case. `pin.end - pin.start` is the tween's travel by
        // construction, so translation and page scroll are 1:1 and the whole
        // job is working out how much translation this card needs.
        const pin = rail.dataset.railPin
          ? ScrollTrigger.getById(rail.dataset.railPin)
          : undefined;
        const track = rail.querySelector<HTMLElement>("[data-rail-track]");
        if (!pin || !track) return;

        const travel = pin.end - pin.start;
        if (travel <= 0) return;

        const trackBox = track.getBoundingClientRect();
        // Where the track would sit with no translation applied, and where the
        // card sits inside it. Both are stable while the section is pinned.
        const restingLeft = trackBox.left + pin.progress * travel;
        const offsetInTrack = cardBox.left - trackBox.left;
        const needed = restingLeft + offsetInTrack - (railBox.left + LEAD);

        scrollWindowTo(pin.start + clamp(needed, 0, travel));
      };

      /* ----------------------------------------------------- focus & keys */
      // Tab lands focus wherever it lands; this is what makes it visible.
      const onFocusIn = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const card = target.closest<HTMLElement>("[data-rail-item]");
        if (card) reveal(card);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        const items = itemsOf();
        if (items.length === 0) return;

        const active = document.activeElement;
        const from =
          active instanceof HTMLElement
            ? items.findIndex((item) => item.contains(active))
            : -1;

        let next: number;
        switch (event.key) {
          case "ArrowRight":
            next = from + 1;
            break;
          case "ArrowLeft":
            next = from === -1 ? items.length - 1 : from - 1;
            break;
          case "Home":
            next = 0;
            break;
          case "End":
            next = items.length - 1;
            break;
          default:
            return;
        }

        // Off either end: leave the key alone rather than swallow it, so the
        // reader can arrow out of the rail the way they arrowed in.
        if (next < 0 || next >= items.length) return;

        const card = items[next];
        const stop = card.querySelector<HTMLElement>(FOCUSABLE);
        if (!stop) return;

        event.preventDefault();
        // `preventScroll`, then reveal by hand: the browser's own attempt is
        // the thing that fails on the pinned rail.
        stop.focus({ preventScroll: true });
        reveal(card);
      };

      rail.addEventListener("focusin", onFocusIn);
      rail.addEventListener("keydown", onKeyDown);
      cleanups.push(() => {
        rail.removeEventListener("focusin", onFocusIn);
        rail.removeEventListener("keydown", onKeyDown);
        rail.removeAttribute("tabindex");
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
