import { parseRgb, type Rgb } from "@/lib/color";

/**
 * Reads tokens back out of the live cascade.
 *
 * The styleguide never stores values, it asks the browser. Aliases such as
 * `--color-lime: var(--color-lime-500)` resolve on the way through, and a
 * token deleted from globals.css shows up as blank instead of as a stale
 * number. Browser-only — every function returns null on the server.
 */

function withProbe<T>(
  apply: (el: HTMLElement) => void,
  read: (el: HTMLElement) => T,
): T | null {
  if (typeof document === "undefined") return null;
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  el.style.pointerEvents = "none";
  apply(el);
  document.body.appendChild(el);
  try {
    return read(el);
  } finally {
    el.remove();
  }
}

/** Resolved paint colour, aliases followed. */
export function resolveColor(cssVar: string): Rgb | null {
  const computed = withProbe(
    (el) => {
      el.style.color = `var(${cssVar})`;
    },
    (el) => getComputedStyle(el).color,
  );
  return computed ? parseRgb(computed) : null;
}

/** Resolved length in px at the current viewport — `min(5.83vw, 84px)` becomes a number. */
export function resolveLengthPx(cssVar: string): number | null {
  return withProbe(
    (el) => {
      el.style.width = `var(${cssVar})`;
    },
    (el) => el.getBoundingClientRect().width,
  );
}

/** The declaration as authored, e.g. `clamp(2.5rem, 4.9vw, 5rem)`. */
export function resolveRaw(cssVar: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
}
