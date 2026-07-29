"use client";

import { useContrastRows, type ContrastPair } from "./useTokens";

/**
 * The contrast audit. Every text-on-background pair the site ships, measured
 * against the live cascade rather than against a table of hexes someone typed.
 *
 * Thresholds: 4.5:1 for text under 24px, 3:1 for large text and for non-text UI
 * components — WCAG 2.2 SC 1.4.3 and 1.4.11.
 */
const PAIRS: readonly ContrastPair[] = [
  {
    label: "ink on canvas",
    fg: "--color-ink",
    bg: "--color-canvas",
    min: 4.5,
    where: "Body copy on the page",
  },
  {
    label: "ink on surface",
    fg: "--color-ink",
    bg: "--color-surface",
    min: 4.5,
    where: "Copy on cards and nav blocks",
  },
  {
    label: "ink on lime",
    fg: "--color-ink",
    bg: "--color-lime",
    min: 4.5,
    where: "Primary CTA label — the mockup's white is 2.0:1",
  },
  {
    label: "ink on lime-400",
    fg: "--color-ink",
    bg: "--color-lime-400",
    min: 4.5,
    where: "Primary CTA, hover",
  },
  {
    label: "ink on lime-600",
    fg: "--color-ink",
    bg: "--color-lime-600",
    min: 4.5,
    where: "Primary CTA, active",
  },
  {
    label: "ink on lime-soft",
    fg: "--color-ink",
    bg: "--color-lime-soft",
    min: 4.5,
    where: "EXCLUSIVE badge, CTA arrow chip",
  },
  {
    label: "ink on court-50",
    fg: "--color-ink",
    bg: "--color-court-50",
    min: 4.5,
    where: "Secondary CTA, active",
  },
  {
    label: "ink 60% on surface",
    fg: "--color-ink",
    fgAlpha: 0.6,
    bg: "--color-surface",
    min: 4.5,
    where: "Eyebrow on a light plate",
  },
  {
    label: "ink 60% on canvas",
    fg: "--color-ink",
    fgAlpha: 0.6,
    bg: "--color-canvas",
    min: 4.5,
    where: "Eyebrow on the canvas",
  },
  {
    label: "ink 70% on surface",
    fg: "--color-ink",
    fgAlpha: 0.7,
    bg: "--color-surface",
    min: 4.5,
    where: "Secondary copy in cards",
  },
  {
    label: "surface on court",
    fg: "--color-surface",
    bg: "--color-court",
    min: 4.5,
    where: "Copy on a court plate",
  },
  {
    label: "surface on court-deep",
    fg: "--color-surface",
    bg: "--color-court-deep",
    min: 4.5,
    where: "Copy on a deep plate — Match Point",
  },
  {
    label: "surface on ink",
    fg: "--color-surface",
    bg: "--color-ink",
    min: 4.5,
    where: "Copy on an ink plate",
  },
  {
    label: "surface 70% on court",
    fg: "--color-surface",
    fgAlpha: 0.7,
    bg: "--color-court",
    min: 4.5,
    where: "Eyebrow on a dark plate",
  },
  {
    label: "surface 80% on court",
    fg: "--color-surface",
    fgAlpha: 0.8,
    bg: "--color-court",
    min: 4.5,
    where: "Meta line on the glass card",
  },
  {
    label: "ink ring on canvas",
    fg: "--color-ink",
    bg: "--color-canvas",
    min: 3,
    where: "Focus ring, light surfaces",
  },
  {
    label: "ink ring on lime",
    fg: "--color-ink",
    bg: "--color-lime",
    min: 3,
    where: "Focus ring on the primary CTA",
  },
  {
    label: "surface ring on court",
    fg: "--color-surface",
    bg: "--color-court",
    min: 3,
    where: "Focus ring, dark surfaces",
  },
  {
    label: "lime on court-deep",
    fg: "--color-lime",
    bg: "--color-court-deep",
    min: 3,
    where: "Score rail active marker — Phase 4",
  },
];

export function ContrastTable() {
  const rows = useContrastRows(PAIRS);
  const failures = rows?.filter((row) => row.ratio < row.min).length ?? 0;

  return (
    <div>
      <p className="mb-5 text-body" aria-live="polite">
        {rows === null ? (
          "Measuring…"
        ) : failures === 0 ? (
          <>
            <strong className="font-medium">{rows.length} pairs, 0 failures.</strong>{" "}
            Measured in this browser, from the stylesheet, at load.
          </>
        ) : (
          <strong className="font-medium">
            {failures} of {rows.length} pairs fail. Fix before shipping.
          </strong>
        )}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/20 text-caption tracking-wider uppercase">
              <th scope="col" className="py-2 pr-4 font-medium">
                Combination
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Where
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">
                Ratio
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">
                Needs
              </th>
              <th scope="col" className="py-2 font-medium">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((pair) => {
              const row = rows?.find((candidate) => candidate.label === pair.label);
              const passes = row !== undefined && row.ratio >= row.min;
              return (
                <tr key={pair.label} className="border-b border-ink/10 align-top">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-xs text-caption ring-1 ring-ink/15 ring-inset"
                        style={{ backgroundColor: row?.bgHex, color: row?.fgHex }}
                      >
                        Aa
                      </span>
                      <code className="font-mono text-caption">{pair.label}</code>
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-caption text-ink/70">{pair.where}</td>
                  <td className="py-3 pr-4 text-right font-mono text-caption tabular-nums">
                    {row ? `${row.ratio.toFixed(2)}:1` : "…"}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-caption tabular-nums">
                    {pair.min.toFixed(1)}:1
                  </td>
                  <td className="py-3 text-caption font-medium">
                    {row ? (passes ? "Pass" : "FAIL") : "…"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
