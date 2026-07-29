import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import type { ForceState } from "./forceState";

/**
 * The `←` / `→` carousel control.
 *
 * The mockup draws these as white rounded squares of about 28px, outside and
 * below the Summer Camp panel — not as circles. 28px fails WCAG 2.2's 44px
 * target size, so the visible chip stays at the measured size and the button
 * itself is 44px of transparent hit area around it. The focus ring is drawn on
 * the chip rather than the hit box so it tracks what the eye sees.
 */

export type ArrowDirection = "prev" | "next";
export type ArrowButtonSize = "sm" | "md" | "lg";

const hitAreas: Record<ArrowButtonSize, string> = {
  sm: "size-10",
  md: "size-11",
  lg: "size-12",
};

const chips: Record<ArrowButtonSize, string> = {
  sm: "size-6",
  md: "size-7",
  lg: "size-9",
};

export type ArrowButtonProps = Omit<ComponentProps<"button">, "children"> &
  ForceState & {
    direction: ArrowDirection;
    size?: ArrowButtonSize;
    onDark?: boolean;
  };

export function ArrowButton({
  direction,
  size = "md",
  onDark = false,
  className,
  type = "button",
  ...props
}: ArrowButtonProps) {
  return (
    <button
      type={type}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "group grid shrink-0 place-items-center rounded-sm",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hitAreas[size],
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "grid place-items-center rounded-sm bg-surface text-ink",
          "transition-colors duration-(--dur-fast) ease-out-quart",
          "group-hover:bg-canvas group-active:bg-court-50",
          "group-data-[force=active]:bg-court-50 group-data-[force=hover]:bg-canvas",
          onDark
            ? "group-focus-visible:focus-ring-invert group-data-[force=focus]:focus-ring-invert"
            : "group-focus-visible:focus-ring group-data-[force=focus]:focus-ring",
          chips[size],
        )}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
          <path
            d={
              direction === "prev"
                ? "M9.5 3.5 5 8l4.5 4.5M5 8h6.5"
                : "M6.5 3.5 11 8l-4.5 4.5M11 8H4.5"
            }
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
