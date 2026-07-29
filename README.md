# 7SETS

Landing page for a tennis academy, built from a designer mockup.
Next.js 16 · TypeScript strict · Tailwind CSS v4 · GSAP · Lenis.

> **Status: Phase 0 of 9 — foundations.** There is no UI yet. The full README,
> with screenshots, feature tour and Lighthouse scores, is written in Phase 9.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script              | Does                            |
| ------------------- | ------------------------------- |
| `npm run dev`       | dev server (Turbopack)          |
| `npm run build`     | production build                |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | `tsc --noEmit`                  |
| `npm run format`    | Prettier, write                 |
| `npm test`          | Playwright — arrives in Phase 6 |

## Where things are

| Path                                               | What                                                   |
| -------------------------------------------------- | ------------------------------------------------------ |
| `CLAUDE.md`                                        | the working brief: concept, tokens, rules, phase state |
| `docs/design/hero-mockup.jpeg`                     | the source mockup — the spec                           |
| `docs/design/DESIGN-ANALYSIS.md`                   | every measurement taken from it, and the method        |
| `docs/CONTENT-ARCHITECTURE.md`                     | the seven sets and the four framing blocks             |
| `scripts/sample-mockup.ps1`                        | the pixel sampler that produced the tokens             |
| `components/ui` · `sections` · `layout` · `motion` | Phases 1 → 5                                           |
| `content/`                                         | typed content layer, Phase 3                           |

## Credits

Design mockup by the original designer. Implementation notes, deviations and
the one deliberate accessibility override are documented in
`docs/design/DESIGN-ANALYSIS.md`.
