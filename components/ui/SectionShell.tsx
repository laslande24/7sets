import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * The plate. Every section of this site is one.
 *
 * A hard-edged rectangle inset from the page edges by `--spacing-plate`,
 * sitting on the pale canvas. The corners are square — measured, not assumed:
 * the hero's left edge has an inset of 0 across its first 34 rows. The stack of
 * square plates on canvas is the layout signature, so this component owns it
 * and no section should re-implement the margin or the radius.
 */

export type SectionTone = "surface" | "canvas" | "court" | "deep" | "ink" | "bare";

const tones: Record<SectionTone, string> = {
  surface: "bg-surface text-ink",
  canvas: "bg-canvas text-ink",
  court: "bg-court text-surface",
  deep: "bg-court-deep text-surface",
  ink: "bg-ink text-surface",
  /** No background of its own — for plates whose child supplies one, like the hero photo. */
  bare: "",
};

export type SectionShellProps = ComponentProps<"section"> & {
  tone?: SectionTone;
  /** Applies the measured content gutter and a vertical rhythm. Off for the hero, which places its own content. */
  padded?: boolean;
};

export function SectionShell({
  tone = "surface",
  padded = true,
  className,
  children,
  ...props
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative mx-plate overflow-hidden rounded-plate",
        tones[tone],
        padded && "px-gutter py-16 md:py-24",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
