import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * The floating nav block.
 *
 * Named `Pill` because that is the vocabulary the brief and the later phases
 * use — but in this design system a pill is a 40px-tall block with a 4px
 * radius, not a 999px capsule. The mockup's nav is three of these separated by
 * 6px gaps, not one rounded bar. See docs/design/DESIGN-ANALYSIS.md §3.
 */

export type PillTone = "surface" | "ink" | "glass";

const tones: Record<PillTone, string> = {
  surface: "bg-surface text-ink",
  ink: "bg-ink text-surface",
  glass: "bg-surface/15 text-surface backdrop-blur-md",
};

export type PillProps = ComponentProps<"div"> & {
  tone?: PillTone;
  /** Off when the child controls its own inset, e.g. an icon-only block. */
  padded?: boolean;
};

export function Pill({
  tone = "surface",
  padded = true,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <div
      className={cn(
        "inline-flex h-control items-center rounded-sm",
        tones[tone],
        padded && "px-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
