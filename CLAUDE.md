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

| Token         | Value | Used by                                     |
| ------------- | ----- | ------------------------------------------- |
| `--radius-sm` | `4px` | nav blocks, buttons, badges, arrow chips    |
| `--radius-md` | `8px` | inner cards, image thumbnails               |
| `--radius-lg` | `0`   | **section shells — the corners are square** |

Measured facts that contradict the original brief, and that the build must
follow: the hero plate has **square corners** (inset 0 across 34 rows); the nav
is **three separate blocks** (83 / 342 / 29 px with 6 px gaps), not one pill;
the secondary CTA is **solid white**, not a transparent outline; the CTA arrow
sits in a **rounded square** chip, not a circle.

### Type — one family, not a pairing

`Jost` (variable, self-hosted via `next/font`). The mockup's `a` is
single-storey geometric; General Sans, Switzer and Outfit are double-storey and
were rejected on that measurement. Display and body are the same face in the
mockup, so they are here too.

| Role              | Size                         | Line-height |
| ----------------- | ---------------------------- | ----------- |
| `display-xl` (h1) | `clamp(2.5rem, 4.9vw, 5rem)` | 1.25        |
| body              | 18px                         | 1.55        |
| label / nav       | 18px, uppercase              | —           |

Spacing base 4. Plate side margin `5.83vw` (cap 84px). Content gutter 44px.
Nav and button height 40px.

## Layout signature

Every section is a **square-cornered plate on the pale canvas**. That stack of
hard-edged plates is the site's identity — it belongs on every section, not
just the hero.

## Commands

|                     |                               |
| ------------------- | ----------------------------- |
| `npm run dev`       | dev server (Turbopack)        |
| `npm run build`     | production build              |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | `tsc --noEmit`, strict        |
| `npm run format`    | Prettier, write               |
| `npm test`          | Playwright — lands in Phase 6 |

Next.js 16 has breaking changes versus 15. Before writing framework code, read
the relevant guide in `node_modules/next/dist/docs/` — see `AGENTS.md`.

## Phases

- [x] **0** — Scoping & foundations
- [ ] **1** — Design system & UI primitives (`/styleguide`)
- [ ] **2** — Pixel-perfect hero, static
- [ ] **3** — Content & sections, static
- [ ] **4** — GSAP engine, Lenis, score rail
- [ ] **5** — Signature scroll animations
- [ ] **6** — Micro-interactions, booking form, a11y
- [ ] **7** — SEO, structured data, GEO
- [ ] **8** — Core Web Vitals
- [ ] **9** — QA, documentation, release

One phase = one session = one commit. `/clear` between phases.
