"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { IconGrip } from "@/components/ui";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";

/**
 * The grip, and the full-screen menu behind it.
 *
 * The panel is a `dialog`-role overlay rather than a real `<dialog>`: the native
 * element's top-layer behaviour ignores the page's own stacking, and this needs
 * to sit under nothing except itself. What it borrows from `<dialog>` is the
 * behaviour that matters — focus moves in on open, Tab cycles inside, Escape and
 * an outside click close it, the body cannot scroll behind it, and focus returns
 * to the grip afterwards. Losing your place in the page because a menu opened is
 * the failure this exists to avoid.
 *
 * The panel is not rendered at all when closed, so nothing inside it is
 * reachable by Tab or readable by a screen reader while it is shut.
 *
 * It is also portalled to `<body>`, and that is not tidiness. `position: fixed`
 * resolves against the nearest transformed ancestor rather than the viewport,
 * and this component's own header carries two transforms: the entrance tween
 * leaves `translate(0px, 0%)` behind, and the condensed nav is a `scale(0.94)`.
 * Rendered in place, `inset-0` therefore meant "the nav pill", so a full-screen
 * menu painted its background across about 90 × 40 pixels in the top-left
 * corner and let its own links hang out over the hero.
 */

export function NavMenu({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Escape, focus trap, scroll lock, focus restore.
  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    // Captured now, not read in the cleanup: by then the ref may point
    // somewhere else, and focus would be restored to the wrong element.
    const grip = trigger.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // The panel itself, not its first link. The links arrive on a GSAP
    // timeline that starts them at `autoAlpha: 0`, and `visibility: hidden` is
    // not focusable — calling `.focus()` on one at this moment does nothing at
    // all, which is how focus was being left outside an open modal. Focusing
    // the container also means the reader hears "Menu, dialog" before the list.
    panel.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      // The panel counts as "before the first item": that is where focus starts,
      // and Shift+Tab from there has to wrap rather than escape the dialog.
      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      // Back where they were — but `body` is not a place. If focus was nowhere
      // in particular when the menu opened (a click rather than a keypress),
      // restoring to `body` would drop the reader at the top of the document,
      // so it goes to the grip instead.
      const restoreTo = previous && previous !== document.body ? previous : grip;
      restoreTo?.focus();
    };
  }, [open]);

  // The circular opening, from the grip. Reduced motion gets the panel outright.
  useGSAP(
    () => {
      if (!open || !panel.current || prefersReducedMotion()) return;
      const { duration, ease } = motionTokens();
      const box = trigger.current?.getBoundingClientRect();
      const originX = box ? box.left + box.width / 2 : window.innerWidth - 40;
      const originY = box ? box.top + box.height / 2 : 40;
      const radius = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY),
      );

      gsap
        .timeline()
        .fromTo(
          panel.current,
          { clipPath: `circle(0px at ${originX}px ${originY}px)` },
          {
            clipPath: `circle(${radius}px at ${originX}px ${originY}px)`,
            duration: duration.slow,
            ease: ease.outExpo,
            // Cleared once it has opened. A clip-path left on the panel is a
            // permanent paint clip and a containing block for anything fixed
            // inside it, and it stops assistive tooling working out what is
            // behind the menu links — axe read their background as the page's
            // canvas and called white-on-white a contrast failure.
            clearProps: "clipPath",
          },
        )
        .from(
          panel.current.querySelectorAll("[data-menu-item]"),
          {
            y: 48,
            autoAlpha: 0,
            stagger: 0.06,
            duration: duration.base,
            ease: ease.outExpo,
          },
          "-=0.45",
        );
    },
    { dependencies: [open] },
  );

  return (
    <>
      <IconGrip
        ref={trigger}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
      />

      {open
        ? createPortal(
            <div
              ref={panel}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              tabIndex={-1}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
              /* Opaque, not 95%: at 95% the contrast of a menu link depends on
             whatever the page happens to have behind it, and over the lime CTA
             one of them measured below 4.5:1. */
              className="fixed inset-0 z-90 flex flex-col justify-center bg-court-950 px-plate"
            >
              <nav aria-label="Menu">
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.href} data-menu-item>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="inline-block rounded-xs py-2 text-display-lg text-surface focus-visible:focus-ring-invert"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <p data-menu-item className="mt-12">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-sm bg-surface px-4 py-3 text-label text-ink uppercase focus-visible:focus-ring-invert"
                >
                  Close
                </button>
              </p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
