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
9. **A new `--text-*` token must also be registered in `lib/cn.ts`.**
   tailwind-merge only knows Tailwind's stock scales; an unrecognised `text-*`
   lands in its _colour_ group and silently cancels a real colour class.

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

Measured facts that contradict the brief, and that the build follows: the hero
plate has **square corners**; the nav is **three separate blocks** with 8px
gaps, not one pill; the secondary CTA is **solid white**, not a transparent
outline; the CTA arrow sits in a **rounded square** chip, not a circle.

### Type — one family, not a pairing

`Jost` (variable, self-hosted via `next/font`). The mockup's `a` is
single-storey geometric; General Sans, Switzer and Outfit are double-storey and
were rejected on that measurement. Display and body are the same face in the
mockup, so they are here too.

`display-xl` (h1) is `clamp(2.5rem, 4.9vw, 5rem)` / 1.25 / weight 300 — the
measured ratio, not the 88px the brief assumed, and tracking is normal, not
tight. Body and label are 18px, caption 14px. Full scale on `/styleguide`.

Spacing base 4, plus `--spacing-plate` (side margin, `min(5.83vw, 84px)`),
`--spacing-gutter` (plate edge to content, ~44px at 1440) and
`--spacing-control` (40px — nav block, button, grip).

Easings `--ease-out-expo|out-quart|in-out-quint`; durations `--dur-fast` 200 /
`--dur-base` 400 / `--dur-slow` 800 / `--dur-hero` 1400ms. Nothing may exceed
`--dur-hero`.

## Layout signature

Every section is a **square-cornered plate on the pale canvas**, built with
`<SectionShell>`, which owns the margin and the radius. That stack of
hard-edged plates is the site's identity — it belongs on every section, not
just the hero.

## Design system

Tokens live in `app/globals.css` and nowhere else. Primitives are in
`components/ui/` — Button, ButtonLink, Pill, Badge, Card, SectionShell,
Eyebrow, ArrowButton, IconGrip — and every one is demonstrated at
[`/styleguide`](app/styleguide/page.tsx), which reads values back out of the
live cascade and re-runs the contrast audit on every load. Check it after any
token change. Interactive states are paired with a `data-force` variant so the
styleguide documents them without restating the styling.

## Commands

`npm run dev` (Turbopack) · `build` · `lint` · `typecheck` (strict) ·
`format` (Prettier). `npm test` is Playwright and lands in Phase 6.

Next.js 16 has breaking changes versus 15. Before writing framework code, read
the relevant guide in `node_modules/next/dist/docs/` — see `AGENTS.md`.

## Phases

- [x] **0** — Scoping & foundations
- [x] **1** — Design system & UI primitives (`/styleguide`)
- [ ] **2** — Pixel-perfect hero, static
- [ ] **3** — Content & sections, static
- [ ] **4** — GSAP engine, Lenis, score rail
- [ ] **5** — Signature scroll animations
- [ ] **6** — Micro-interactions, booking form, a11y
- [ ] **7** — SEO, structured data, GEO
- [ ] **8** — Core Web Vitals
- [ ] **9** — QA, documentation, release

One phase = one session = one commit. `/clear` between phases.
