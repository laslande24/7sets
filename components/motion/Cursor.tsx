"use client";

import { useEffect, useRef, useState } from "react";

import { labels } from "@/content/copy";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";

/**
 * The desktop cursor: a small disc that follows the pointer and grows into a
 * label over the things that do something.
 *
 * Three conditions before it exists at all — a hover-capable fine pointer, no
 * reduced-motion preference, and JavaScript. Fail any of them and this renders
 * nothing and the system cursor is never touched, which is the only acceptable
 * failure mode: a page with no cursor is a page you cannot use.
 *
 * Over a text field the system cursor comes back. An I-beam tells you the text
 * is editable and where the caret will land; a disc tells you neither, and
 * replacing one with the other is a downgrade dressed as a flourish.
 *
 * Elements opt in with `data-cursor="view" | "play" | "drag"`. The label is
 * decorative — it is `aria-hidden`, and nothing on the page relies on it to say
 * what a control does.
 */

/** Diameter of the expanded disc. The idle dot is this scaled down. */
const SIZE = 72;
const IDLE_SCALE = 12 / SIZE;

const CURSOR_LABELS: Record<string, string> = {
  view: labels.cursor.view,
  play: labels.cursor.play,
  drag: labels.cursor.drag,
};

/** Where the system cursor is the better cursor. */
const TEXT_ENTRY = "input, textarea, select, [contenteditable]";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  // Read inside listeners that must not re-subscribe when the label changes.
  const labelRef = useRef<string | null>(null);

  // Decided after mount: the server cannot know what kind of pointer this is,
  // and guessing would mean a hydration mismatch on every phone.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches && !prefersReducedMotion());

    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  // The native cursor is hidden by a class on <html> rather than by this
  // element's own styles, so it is removed by the same code that decides the
  // custom one is unavailable — including on unmount.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.cursorOn = "";
    return () => {
      delete document.documentElement.dataset.cursorOn;
    };
  }, [enabled]);

  useGSAP(
    () => {
      const element = dot.current;
      if (!enabled || !element) return;

      const { duration, ease } = motionTokens();

      // Centring and the idle size are set through GSAP, not CSS: Tailwind's
      // `translate` and `scale` utilities write the individual properties,
      // which the browser applies *on top of* the `transform` GSAP is about to
      // write — so the disc would end up scaled twice and offset twice.
      gsap.set(element, { xPercent: -50, yPercent: -50, scale: IDLE_SCALE });

      // quickTo keeps one tween per axis alive rather than creating one per
      // pointermove. The lag is the point: a disc pinned exactly to the pointer
      // reads as a broken cursor, one that trails slightly reads as weight.
      const moveX = gsap.quickTo(element, "x", {
        duration: duration.fast,
        ease: ease.outQuart,
      });
      const moveY = gsap.quickTo(element, "y", {
        duration: duration.fast,
        ease: ease.outQuart,
      });

      let visible = false;
      const show = (next: boolean) => {
        if (next === visible) return;
        visible = next;
        gsap.to(element, {
          autoAlpha: next ? 1 : 0,
          duration: duration.fast,
          ease: ease.outQuart,
        });
      };

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);

        const target = event.target instanceof Element ? event.target : null;
        // Over a field the disc goes away entirely and the I-beam takes over.
        if (target?.closest(TEXT_ENTRY)) {
          show(false);
          return;
        }
        show(true);

        const named = target?.closest<HTMLElement>("[data-cursor]");
        const next = named ? (CURSOR_LABELS[named.dataset.cursor ?? ""] ?? null) : null;
        if (next === labelRef.current) return;
        labelRef.current = next;
        setLabel(next);

        gsap.to(element, {
          scale: next ? 1 : IDLE_SCALE,
          duration: duration.base,
          ease: ease.outExpo,
        });
      };

      const onLeave = () => show(false);

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("blur", onLeave);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      style={{ width: SIZE, height: SIZE }}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-100 grid place-items-center",
        // `will-change` is permanent here on purpose. The usual objection is
        // that it leaves a compositor layer behind for an animation that has
        // finished; this one never finishes.
        "rounded-full bg-lime text-ink opacity-0 will-change-transform",
      )}
    >
      <span
        className={cn(
          "text-caption tracking-wider uppercase transition-opacity duration-(--dur-fast)",
          label ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </div>
  );
}
