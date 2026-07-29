import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * The `EXCLUSIVE` badge from the Summer Camp card.
 *
 * Measured at 93 × 29 with an 8px inset and a lime-soft fill. Ink on lime-soft
 * is a very high contrast pair, which is why the badge reads at 14px.
 */

export type BadgeTone = "lime" | "surface" | "ink";

const tones: Record<BadgeTone, string> = {
  lime: "bg-lime-soft text-ink",
  surface: "bg-surface text-ink",
  ink: "bg-ink text-surface",
};

export type BadgeProps = ComponentProps<"span"> & { tone?: BadgeTone };

export function Badge({ tone = "lime", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-sm px-2",
        "text-caption font-medium tracking-wider uppercase",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
