import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Card surfaces.
 *
 * `glass` reproduces the Summer Camp panel: a white wash at low alpha over the
 * photograph with a backdrop blur. Sampling that panel returns #8D999D, which
 * is the court blue read through roughly 15% white — hence `bg-surface/15`.
 */

export type CardVariant = "solid" | "glass" | "outline";

const variants: Record<CardVariant, string> = {
  solid: "bg-surface text-ink",
  glass: "bg-surface/15 text-surface backdrop-blur-md ring-1 ring-surface/20 ring-inset",
  outline: "bg-transparent text-ink ring-1 ring-ink/12 ring-inset",
};

export type CardProps = ComponentProps<"div"> & {
  variant?: CardVariant;
  /** `md` for thumbnails and inner cards, `lg` for floating panels. */
  radius?: "md" | "lg";
};

export function Card({
  variant = "solid",
  radius = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        radius === "lg" ? "rounded-lg" : "rounded-md",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
