"use client";

import { useId, useState } from "react";

import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { labels, sectionCopy } from "@/content/copy";
import {
  annualNote,
  billingLabels,
  memberships,
  type BillingPeriod,
} from "@/content/memberships";
import { cn } from "@/lib/cn";

const PERIODS: readonly BillingPeriod[] = ["monthly", "annual"];

/**
 * SET 07 — three plans.
 *
 * The toggle is a real radiogroup rather than two styled buttons, so arrow keys
 * move between the options and a screen reader announces which is selected. The
 * fan-out animation is Phase 5; the state is what this phase owes.
 */
export function Membership() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const groupId = useId();

  return (
    <SectionShell id="membership">
      <div data-animate="rise">
        <Eyebrow set={7}>{sectionCopy.membership.eyebrow}</Eyebrow>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-gutter gap-y-6">
        <h2 data-animate="lines" className="max-w-[16ch] text-display-lg">
          {sectionCopy.membership.heading}
        </h2>

        <div>
          <div
            role="radiogroup"
            aria-label={labels.membership.billingLegend}
            className="inline-flex rounded-sm bg-canvas p-1 ring-1 ring-ink/12 ring-inset"
          >
            {PERIODS.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={period === option}
                id={`${groupId}-${option}`}
                onClick={() => setPeriod(option)}
                className={cn(
                  "h-9 rounded-xs px-4 text-label transition-colors duration-(--dur-fast) ease-out-quart",
                  "focus-visible:focus-ring",
                  period === option
                    ? "bg-ink text-surface"
                    : "text-ink/70 hover:text-ink",
                )}
              >
                {billingLabels[option]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-caption text-ink/60">{annualNote}</p>
        </div>
      </div>

      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {memberships.map((plan) => (
          <li
            key={plan.id}
            data-membership-card
            data-animate="rise"
            className={cn(
              "flex flex-col rounded-md p-8",
              plan.featured
                ? "bg-ink text-surface"
                : "bg-canvas text-ink ring-1 ring-ink/10 ring-inset",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-display-md">{plan.name}</h3>
              {plan.featured ? (
                <span className="rounded-xs bg-lime px-2 py-0.5 text-caption tracking-wider text-ink uppercase">
                  {labels.membership.featured}
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-2 text-body",
                plan.featured ? "text-surface/70" : "text-ink/70",
              )}
            >
              {plan.forWhom}
            </p>

            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-display-lg tabular-nums">
                {plan.price[period] === 0
                  ? labels.membership.free
                  : `£${plan.price[period]}`}
              </span>
              {plan.price[period] === 0 ? null : (
                <span
                  className={cn(
                    "text-caption",
                    plan.featured ? "text-surface/60" : "text-ink/60",
                  )}
                >
                  {period === "monthly"
                    ? labels.membership.perMonth
                    : labels.membership.perYear}
                </span>
              )}
            </p>

            <ul
              className={cn(
                "mt-8 space-y-2.5 border-t pt-6 text-body",
                plan.featured
                  ? "border-surface/20 text-surface/80"
                  : "border-ink/12 text-ink/70",
              )}
            >
              {plan.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-2.5 size-1 shrink-0 rounded-full",
                      plan.featured ? "bg-lime" : "bg-lime-600",
                    )}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <ButtonLink
                href="#match-point"
                variant={plan.featured ? "primary" : "secondary"}
                arrow={plan.featured}
                className={cn(
                  "w-full",
                  plan.featured ? "" : "ring-1 ring-ink/12 ring-inset",
                )}
              >
                {plan.cta}
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
