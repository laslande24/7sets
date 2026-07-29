import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import type { ForceState } from "./forceState";

/**
 * The third nav block — a 2 × 3 dot grid in a square.
 *
 * Measured at 29 × 29 in the export, so 40px at design scale: square, not
 * round, and the same height as the other two nav blocks. It is a control, so
 * it carries a label; the dots themselves are decorative.
 */

export type IconGripProps = Omit<ComponentProps<"button">, "children"> &
  ForceState & {
    onDark?: boolean;
  };

const dots = [0, 1, 2, 3, 4, 5];

export function IconGrip({
  onDark = false,
  className,
  type = "button",
  "aria-label": ariaLabel = "Open menu",
  ...props
}: IconGripProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "grid size-control shrink-0 place-items-center rounded-sm bg-surface text-ink",
        "transition-colors duration-(--dur-fast) ease-out-quart",
        "hover:bg-canvas active:bg-court-50",
        "data-[force=active]:bg-court-50 data-[force=hover]:bg-canvas",
        onDark
          ? "focus-visible:focus-ring-invert data-[force=focus]:focus-ring-invert"
          : "focus-visible:focus-ring data-[force=focus]:focus-ring",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="grid grid-cols-2 gap-1">
        {dots.map((dot) => (
          <span key={dot} className="size-1 rounded-full bg-current" />
        ))}
      </span>
    </button>
  );
}
