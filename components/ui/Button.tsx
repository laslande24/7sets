import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import type { ForceState } from "./forceState";

/**
 * Buttons, measured from the mockup.
 *
 * Geometry: 40px tall, 4px radius, uppercase label at 18px. The mockup has no
 * pills — see docs/design/DESIGN-ANALYSIS.md §3.
 *
 * The primary label ships in `--color-ink`, not the white the mockup uses.
 * White on lime is 2.0:1 and fails WCAG AA; ink is 9.45:1. This is the one
 * place we overrule the mockup, and it is rule 2 in CLAUDE.md.
 *
 * `data-force` renders a state statically so `/styleguide` can show hover,
 * active and focus side by side. It is a documentation hook, not an API —
 * nothing outside the styleguide should set it.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonShape = ForceState & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing `↗` chip. Defaults on for `primary`, which is how the mockup draws it. */
  arrow?: boolean;
  /** Switches the focus ring and the ghost palette for use over the photo. */
  onDark?: boolean;
};

const base = cn(
  "inline-flex select-none items-center justify-center whitespace-nowrap uppercase",
  "rounded-sm font-normal transition-colors duration-(--dur-fast) ease-out-quart",
  "focus-visible:focus-ring data-[force=focus]:focus-ring",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-lime text-ink",
    "hover:bg-lime-400 data-[force=hover]:bg-lime-400",
    "active:bg-lime-600 data-[force=active]:bg-lime-600",
  ),
  secondary: cn(
    "bg-surface text-ink",
    "hover:bg-canvas data-[force=hover]:bg-canvas",
    "active:bg-court-50 data-[force=active]:bg-court-50",
  ),
  ghost: cn(
    "bg-transparent text-ink",
    "hover:bg-ink/8 data-[force=hover]:bg-ink/8",
    "active:bg-ink/14 data-[force=active]:bg-ink/14",
  ),
};

const ghostOnDark = cn(
  "text-surface",
  "hover:bg-surface/14 data-[force=hover]:bg-surface/14",
  "active:bg-surface/22 data-[force=active]:bg-surface/22",
);

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 text-caption tracking-wider",
  md: "h-control gap-3 text-label",
  lg: "h-12 gap-3 text-label",
};

/** Right padding tightens when the chip is present — the chip supplies the mass. */
const padding: Record<ButtonSize, { withArrow: string; plain: string }> = {
  sm: { withArrow: "pl-3 pr-1.5", plain: "px-3" },
  md: { withArrow: "pl-4 pr-2", plain: "px-4" },
  lg: { withArrow: "pl-5 pr-2.5", plain: "px-5" },
};

const chipSizes: Record<ButtonSize, string> = {
  sm: "size-6",
  md: "size-7",
  lg: "size-8",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  arrow = variant === "primary",
  onDark = false,
  className,
}: ButtonShape & { className?: string } = {}) {
  return cn(
    base,
    variants[variant],
    variant === "ghost" && onDark && ghostOnDark,
    sizes[size],
    arrow ? padding[size].withArrow : padding[size].plain,
    onDark && "focus-visible:focus-ring-invert data-[force=focus]:focus-ring-invert",
    className,
  );
}

function ArrowChip({ size }: { size: ButtonSize }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-xs bg-lime-soft text-ink",
        chipSizes[size],
      )}
    >
      <svg viewBox="0 0 12 12" fill="none" className="size-3">
        <path
          d="M3.25 8.75 8.75 3.25M8.75 3.25H4.5M8.75 3.25V7.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export type ButtonProps = ComponentProps<"button"> & ButtonShape;

export function Button({
  variant = "primary",
  size = "md",
  arrow = variant === "primary",
  onDark = false,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, arrow, onDark, className })}
      {...props}
    >
      <span>{children}</span>
      {arrow ? <ArrowChip size={size} /> : null}
    </button>
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonShape;

/** Same shape as `Button`, for the CTAs that navigate rather than act. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = variant === "primary",
  onDark = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, arrow, onDark, className })}
      {...props}
    >
      <span>{children}</span>
      {arrow ? <ArrowChip size={size} /> : null}
    </Link>
  );
}
