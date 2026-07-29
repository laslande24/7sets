# HERO DIFF — build against mockup

Phase 2. Every number below was measured in the browser at **1440 × 900** and
compared against `docs/design/hero-mockup.jpeg`, whose pixels were converted to
design pixels by × 4/3 (the mockup is a 1440px viewport exported at 1080px).

Positions are given as a distance **up from the bottom of the plate**, because
the hero's content is bottom-anchored and the plate itself is a different
height in the build than in the mockup — see deviation 1.

Method: baselines read with a zero-size inline probe, ink extents from
`canvas.measureText().actualBoundingBox*`, box geometry from
`getBoundingClientRect()`. No eyeballing.

---

## 1. Where the build lands

| Measure              |         Mockup |          Build |            Δ |
| -------------------- | -------------: | -------------: | -----------: |
| Plate left / width   |      84 / 1272 |  83.9 / 1272.1 |           ~0 |
| Plate corner radius  |              0 |              0 |            0 |
| Nav left             |          129.3 |          127.9 |         −1.4 |
| Nav height           |           38.7 |             40 |         +1.3 |
| Nav block widths     | 111 / 456 / 39 | 111 / 461 / 40 | +0 / +5 / +1 |
| h1 line 1 width      |          702.7 |            702 |         −0.7 |
| h1 baseline 2        |          282.7 |          287.9 |         +5.2 |
| Paragraph ink top    |          230.7 |          234.7 |         +4.0 |
| Paragraph ink bottom |          158.7 |          160.9 |         +2.2 |
| CTA top              |          133.3 |            136 |         +2.7 |
| **CTA bottom**       |         **96** |         **96** |        **0** |
| Camp card width      |            361 |            360 |           −1 |
| Camp card top gap    |            121 |            120 |           −1 |
| Camp card right gap  |             64 |             64 |            0 |

Largest remaining difference: **5.2px**, on an 812px-tall plate. The vertical
figures all lean positive by 2–5px because the build's plate is 93px shorter
than the mockup's would be, so the bottom-anchored stack sits slightly higher
relative to the plate's own height. The CTA, which the stack is anchored from,
is exact.

## 2. Deliberate deviations

1. **Plate proportion — 1.567, not 1.405.** At 1440 the mockup's ratio wants a
   905px plate; a 900px viewport cannot show one. `--hero-plate-h` takes the
   lesser of `100dvh` less its frame and the mockup's ratio, so the ratio binds
   only on tall or narrow windows. Nothing else in the layout depends on it.
2. **Top margin is the gutter, not the mockup's 228px.** That margin belongs to
   the presentation shot, not the design — the mockup's horizontal margins are
   symmetric at 63px while the vertical ones are 171 / 102. Only the horizontal
   framing is design information.
3. **`--text-display-xl` carries `letter-spacing: 0.034em`.** At a matched cap
   height (50 against 49.3) Jost sets "Every Champion Starts" 7.2% narrower
   than the mockup's face. The advance is the measurement worth keeping, so the
   shortfall is spread across the line rather than fixed by enlarging the type.
   With it, line 1 is within 0.7px of the mockup.
4. **`--text-display-xl` floor lowered to 2.125rem from 2.5rem.** 2.5rem was an
   assumption in the brief, never a measurement. At 375px it breaks the title
   onto three lines; 2.125rem is the largest floor that holds two, which the
   brief requires.
5. **Paragraph line-height 1.55, measured 1.48.** Carried over from Phase 0 as a
   readability decision. Costs 1.2px per line, 3.6px across the block.
6. **Primary CTA label is ink, not the mockup's white.** White on lime is 2.0:1.
   Rule 2 in CLAUDE.md.
7. **Mobile keeps the grip, it is not swapped for a burger.** The brief asks for
   a burger under 768px; the grip is the control the mockup actually draws, and
   rule 1 gives the mockup the decision. It opens the same menu in Phase 6.
8. **Nav is `fixed`, not `sticky`.** The plate clips its own overflow, so a
   sticky child inside it never sticks. The offsets are built from
   `--spacing-nav-x` / `--spacing-nav-y`, so at scroll-top it lands where the
   mockup draws it, to 1.4px.
9. **"from first swing", not the mockup's "rom".** Typo in the mockup.
10. **Nav links stretch to the full 40px block height.** Their text is 18px
    tall, which fails WCAG 2.2 SC 2.5.8 (24px minimum, AA). Hit area only — the
    nav is visually unchanged and its block width still measures 461.

## 3. Carried into later phases

- **Target size.** The project's own rule is 44 × 44, but the mockup's control
  height is 40 and rule 1 keeps it. 40 clears the AA minimum of 24; it does not
  clear the AAA 44. Phase 6 has to state which bar the project is holding.
- **Hero image is served at 1126px into a 1272px box** — a 12% upscale. The
  `sizes` string is correct; the optimizer is picking the 1200w candidate.
  Phase 8.
- **Lighthouse has not been run.** There is no Chrome binary on this machine and
  Playwright's browsers do not arrive until Phase 6. What was verified instead,
  in-browser: **CLS 0.0000 across 0 layout shifts**, one `h1`, heading order
  `h1 → h2`, `lang="en"`, header / nav / main landmarks present, every image
  carrying an `alt`, every interactive element carrying an accessible name, no
  target under 24px, and the 19-pair contrast audit still passing. LCP could not
  be sampled because the browser pane does not composite frames.
- **The photograph is not the mockup's.** Composition differs — top-down rather
  than side-on. See `docs/ASSETS.md`.

## 4. Responsive, measured

| Viewport   | Plate      | % of dvh | h1 size | h1 lines | Page scrolls | Overflow-x |
| ---------- | ---------- | -------: | ------: | -------: | ------------ | ---------: |
| 375 × 812  | 331 × 772  |    95.1% |    34px |        2 | no           |          0 |
| 768 × 1024 | 678 × 977  |    95.4% |  37.6px |        2 | no           |          0 |
| 1280 × 800 | 1131 × 722 |    90.2% |  62.7px |        2 | no           |          0 |
| 1440 × 900 | 1272 × 812 |    90.2% |  70.6px |        2 | no           |          0 |

Nav links appear at 768. The camp card leaves the flow and pins to the top
right at 1280. Nothing renders outside the plate at any of the four.
