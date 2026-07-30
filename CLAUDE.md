# 7SETS — landing page for a tennis academy

## The idea

The brand is **7SETS**. The site is therefore built as **7 sets**. A fixed
vertical score rail on the right tracks scroll progress like a tennis
scoreboard — `SET 03 / 07`, with an inner counter stepping
`0 → 15 → 30 → 40 → GAME` across each section.

## Non-negotiable rules

1. **The mockup is the spec** — `docs/design/hero-mockup.jpeg`. When a "best
   practice" disagrees with the mockup, the mockup wins.
2. **The primary CTA label is `--color-ink` on lime, never white.** White
   measures 2.0:1 — a WCAG failure. Ink measures 9.45:1. This is the only place
   we overrule the mockup.
3. **Animate `transform` and `opacity` only** — never `width`/`height`/`top`/`left`.
4. **`prefers-reduced-motion: reduce` is honoured everywhere**, no exceptions.
   Reduced motion means the element lands in its final state immediately — never
   invisible.
5. **Initial JS budget: 130 kB gzip.**
6. **No third-party UI libraries** — no shadcn, MUI, framer-motion. We build our
   own primitives.
7. **No hard-coded colours, sizes or radii in components.** Tokens only.
8. **No `any`, no `@ts-ignore`.**
9. **A new `--text-*` token must also be registered in `lib/cn.ts`** —
   tailwind-merge files an unknown `text-*` as a colour and cancels real ones.

## Design tokens

Sampled from the mockup with `scripts/sample-mockup.ps1`. Method and full
measurements: `docs/design/DESIGN-ANALYSIS.md`.

### Colour

| Token                | Hex       | Sampled from                               |
| -------------------- | --------- | ------------------------------------------ |
| `--color-canvas`     | `#F1F5FF` | page background around the plate           |
| `--color-ink`        | `#0E1116` | logo monogram (solid areas read `#000000`) |
| `--color-lime`       | `#84CC16` | primary CTA, text-free bands               |
| `--color-lime-soft`  | `#EBFACC` | `EXCLUSIVE` badge, CTA arrow chip          |
| `--color-court`      | `#014C6C` | mid-court; also the photo's dominant hue   |
| `--color-court-deep` | `#023958` | lower-left court shadow                    |
| `--color-surface`    | `#FFFFFF` | nav blocks, secondary CTA                  |

### Shape — this mockup has no pills and no large radii

| Token            | Value    | Used by                                     |
| ---------------- | -------- | ------------------------------------------- |
| `--radius-plate` | `0`      | **section shells — the corners are square** |
| `--radius-xs`    | `2px`    | the CTA arrow chip                          |
| `--radius-sm`    | `4px`    | nav blocks, buttons, badges                 |
| `--radius-md`    | `8px`    | thumbnails, inner cards                     |
| `--radius-lg`    | `12px`   | glass panels                                |
| `--radius-full`  | `9999px` | circular markers only — never a button      |

Measured facts that contradict the brief: the hero plate has **square corners**;
the nav is **three blocks** with 8px gaps, not one pill; the secondary CTA is
**solid white**; the CTA arrow sits in a **rounded square**, not a circle.

### Type — one family, not a pairing

`Jost` (variable, `next/font`). The mockup's `a` is single-storey geometric,
which ruled out General Sans, Switzer and Outfit. One face for display and body.

`display-xl` (h1) `clamp(2.125rem, 4.9vw, 5rem)` / 1.25 / 300 / tracking
`0.034em` — the tracking offsets Jost setting 7.2% narrower than the mockup's
face. Body and label 18px, caption 14px. Full scale on `/styleguide`.

Spacing base 4, plus `--spacing-plate` (side margin, `min(5.83vw, 84px)`),
`--spacing-gutter` (plate edge to content, ~44px at 1440) and
`--spacing-control` (40px — nav block, button, grip).

Easings `--ease-out-expo|out-quart|in-out-quint`; durations `--dur-fast` 200 /
`--dur-base` 400 / `--dur-slow` 800 / `--dur-hero` 1400ms. Nothing may exceed
`--dur-hero`.

## Layout signature

Every section is a **square-cornered plate on the pale canvas**, built with
`<SectionShell>`, which owns the margin and the radius. That stack is the site's
identity — it belongs on every section, not just the hero.

## Design system

Tokens live in `app/globals.css` and nowhere else. The nine primitives in
`components/ui/` are all demonstrated at
[`/styleguide`](app/styleguide/page.tsx), which reads values back out of the live
cascade and re-runs the contrast audit on load — check it after any token
change. Interactive states pair with a `data-force` variant.

## Content

All user-visible strings live in `content/*.ts`, never inline in JSX. `site.ts`
holds the NAP Phase 7's `LocalBusiness` must mirror exactly; `faq.ts` is the only
source for `FAQPage`. **7SETS is fictional** — address, phone (an Ofcom drama
range), prices and coach records are invented but internally consistent, and the
coaches render as monograms on purpose. See `docs/ASSETS.md`.

## Motion

Lenis + ScrollTrigger via `components/motion/SmoothScrollProvider.tsx`; plugins
registered once in `lib/gsap/`, SplitText/DrawSVG/MotionPath lazy. Durations and
easings are read from the CSS tokens by `lib/gsap/config.ts`, so motion cannot
drift from design. Pre-animation states are CSS behind `[data-js]`, never a
`gsap.set`; an inline script drops them if the runtime never arrives. The six
primitives are in `components/motion/`, demonstrated on `/styleguide`.

## Commands

`npm run dev` (Turbopack) · `build` · `lint` · `typecheck` (strict) ·
`format` (Prettier). `npm test` is Playwright and lands in Phase 6.

Next.js 16 has breaking changes versus 15. Before writing framework code, read
the relevant guide in `node_modules/next/dist/docs/` — see `AGENTS.md`.

## Phases

Done — **0** scoping · **1** design system · **2** hero · **3** content ·
**4** GSAP engine, Lenis, score rail.
Next — **5** signature animations · **6** micro-interactions, form, a11y ·
**7** SEO & structured data · **8** Core Web Vitals · **9** QA & release.

One phase = one session = one commit. `/clear` between phases.
