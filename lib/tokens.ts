/**
 * The token registry the styleguide renders from.
 *
 * It deliberately stores **no values** — only names. `app/globals.css` is the
 * single source of truth, and `/styleguide` reads the resolved value out of the
 * cascade at runtime. That way the page can never drift from the stylesheet,
 * and a token deleted from CSS shows up as blank instead of as a stale hex.
 */

export type Token = {
  /** CSS custom property, e.g. `--color-lime-500`. */
  readonly cssVar: string;
  /** Tailwind utility suffix, e.g. `lime-500` in `bg-lime-500`. */
  readonly utility: string;
  /** Why this token exists, and where it was measured from. */
  readonly note?: string;
};

export type TokenGroup = {
  readonly title: string;
  readonly blurb: string;
  readonly tokens: readonly Token[];
};

const ramp = (name: string, steps: readonly number[]): Token[] =>
  steps.map((step) => ({
    cssVar: `--color-${name}-${step}`,
    utility: `${name}-${step}`,
  }));

export const colourGroups: readonly TokenGroup[] = [
  {
    title: "Core",
    blurb: "Sampled directly from the mockup. These three carry the whole page.",
    tokens: [
      {
        cssVar: "--color-canvas",
        utility: "canvas",
        note: "Page background, measured around the hero plate.",
      },
      {
        cssVar: "--color-ink",
        utility: "ink",
        note: "Body copy, logo mark, and every label on a light surface.",
      },
      {
        cssVar: "--color-surface",
        utility: "surface",
        note: "Nav blocks, secondary CTA, cards.",
      },
    ],
  },
  {
    title: "Lime",
    blurb:
      "The sampled CTA green is #84CC16 and the sampled badge #EBFACC — Tailwind's lime-500 and lime-100 to within JPEG noise. The mockup was built on this ramp, so we adopt it whole.",
    tokens: [
      ...ramp("lime", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
      {
        cssVar: "--color-lime",
        utility: "lime",
        note: "Alias of lime-500 — the primary CTA fill.",
      },
      {
        cssVar: "--color-lime-soft",
        utility: "lime-soft",
        note: "Alias of lime-100 — EXCLUSIVE badge and the CTA arrow chip.",
      },
    ],
  },
  {
    title: "Court",
    blurb:
      "700 and 800 are the two sampled anchors (mid-court and the lower-left shadow). The rest is a constant-hue ramp built around them.",
    tokens: [
      ...ramp("court", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
      {
        cssVar: "--color-court",
        utility: "court",
        note: "Alias of court-700 — the photograph's dominant hue.",
      },
      {
        cssVar: "--color-court-deep",
        utility: "court-deep",
        note: "Alias of court-800 — dark sections, Match Point.",
      },
    ],
  },
];

export const radii: readonly Token[] = [
  {
    cssVar: "--radius-plate",
    utility: "plate",
    note: "0. Section shells. Measured: inset 0 across 34 rows of the hero's left edge.",
  },
  { cssVar: "--radius-xs", utility: "xs", note: "Arrow chip inside the primary CTA." },
  { cssVar: "--radius-sm", utility: "sm", note: "Buttons, nav blocks, badges." },
  { cssVar: "--radius-md", utility: "md", note: "Thumbnails and inner cards." },
  { cssVar: "--radius-lg", utility: "lg", note: "Glass panels." },
  {
    cssVar: "--radius-full",
    utility: "full",
    note: "Circular markers only. Nothing in this mockup is a pill — never use it on a button.",
  },
];

export const spacing: readonly Token[] = [
  {
    cssVar: "--spacing-plate",
    utility: "plate",
    note: "Side margin of every section shell. Measured 5.83vw, capped at 84px.",
  },
  {
    cssVar: "--spacing-gutter",
    utility: "gutter",
    note: "Plate edge to content. Measured 3.06vw, ~44px at 1440.",
  },
  {
    cssVar: "--spacing-control",
    utility: "control",
    note: "Height of a nav block, a button, a grip. Measured 29px at export scale, 40px at 1440.",
  },
];

export type TypeToken = Token & { readonly sample: string };

export const typeScale: readonly TypeToken[] = [
  {
    cssVar: "--text-display-xl",
    utility: "display-xl",
    sample: "Every Champion Starts Somewhere",
    note: "h1. clamp(2.5rem, 4.9vw, 5rem) / 1.25 / weight 300.",
  },
  {
    cssVar: "--text-display-lg",
    utility: "display-lg",
    sample: "Seven sets, one academy",
    note: "Section headings.",
  },
  {
    cssVar: "--text-display-md",
    utility: "display-md",
    sample: "Teens Performance",
    note: "Card titles.",
  },
  {
    cssVar: "--text-body-lg",
    utility: "body-lg",
    sample: "Build confidence, master every shot.",
    note: "Lead paragraphs.",
  },
  {
    cssVar: "--text-body",
    utility: "body",
    sample:
      "Expert coaching for kids, teens, and adults from first swing to tournament play.",
    note: "Default. 18px measured.",
  },
  {
    cssVar: "--text-label",
    utility: "label",
    sample: "BOOK FREE TRIAL",
    note: "Nav links and button labels. Always uppercase in use.",
  },
  {
    cssVar: "--text-caption",
    utility: "caption",
    sample: "Ages 7–16 · Starts July 15",
    note: "Meta lines, badges, eyebrows.",
  },
];

export const easings: readonly Token[] = [
  {
    cssVar: "--ease-out-expo",
    utility: "out-expo",
    note: "Entrances. The Phase 5 default.",
  },
  {
    cssVar: "--ease-out-quart",
    utility: "out-quart",
    note: "Hover and small state changes.",
  },
  {
    cssVar: "--ease-in-out-quint",
    utility: "in-out-quint",
    note: "Two-way transitions.",
  },
];

export const durations: readonly Token[] = [
  { cssVar: "--dur-fast", utility: "fast", note: "Hover, focus, press." },
  { cssVar: "--dur-base", utility: "base", note: "Reveals." },
  { cssVar: "--dur-slow", utility: "slow", note: "Parallax and long scroll ties." },
  {
    cssVar: "--dur-hero",
    utility: "hero",
    note: "The hero entrance timeline, end to end.",
  },
];
