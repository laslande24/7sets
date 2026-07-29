import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * The section label — `SET 03 — PROGRAMS`.
 *
 * The set number is zero-padded and set in tabular figures so the label does
 * not shift width between sets, which matters once the score rail in Phase 4
 * mirrors these numbers.
 */

export type EyebrowProps = Omit<ComponentProps<"p">, "children"> & {
  /** 1–7. Omit for the blocks that sit outside the seven sets — Voices, FAQ, Match Point. */
  set?: number;
  children: React.ReactNode;
  onDark?: boolean;
};

export function Eyebrow({
  set,
  children,
  onDark = false,
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-caption font-medium tracking-wider uppercase",
        onDark ? "text-surface/70" : "text-ink/60",
        className,
      )}
      {...props}
    >
      {set !== undefined ? (
        <>
          <span className="tabular-nums">SET {String(set).padStart(2, "0")}</span>
          <span aria-hidden="true"> — </span>
        </>
      ) : null}
      {children}
    </p>
  );
}
