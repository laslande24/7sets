/**
 * Colour maths for the contrast audit on /styleguide.
 *
 * Pure functions on purpose: the styleguide resolves tokens out of the live
 * cascade and pipes them through here, so the audit measures what the browser
 * actually paints rather than a hex someone typed into a table.
 */

export type Rgb = { r: number; g: number; b: number };

/** Parses the `rgb(r g b)` / `rgb(r, g, b)` / `rgba(...)` forms `getComputedStyle` returns. */
export function parseRgb(input: string): Rgb | null {
  const numbers = input.match(/-?\d*\.?\d+/g);
  if (!numbers || numbers.length < 3) return null;
  const [r, g, b] = numbers.map(Number);
  if ([r, g, b].some((channel) => !Number.isFinite(channel))) return null;
  return { r, g, b };
}

export function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

/** Flattens a translucent foreground onto its backdrop, which is what the eye sees. */
export function composite(fg: Rgb, backdrop: Rgb, alpha: number): Rgb {
  return {
    r: fg.r * alpha + backdrop.r * (1 - alpha),
    g: fg.g * alpha + backdrop.g * (1 - alpha),
    b: fg.b * alpha + backdrop.b * (1 - alpha),
  };
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const linear = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
