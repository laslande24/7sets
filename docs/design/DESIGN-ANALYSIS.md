# DESIGN ANALYSIS — 7SETS hero mockup

Source: `docs/design/hero-mockup.jpeg` — 1080 × 952 px, JPEG.
Everything below was measured programmatically from that file with
`scripts/sample-mockup.ps1` (System.Drawing, `LockBits` pixel access — no
external dependency). Nothing here is an estimate from looking at the image,
except where explicitly marked **judgement**.

Re-run the sampler with:

```bash
powershell -ExecutionPolicy Bypass -File scripts/sample-mockup.ps1 -Path docs/design/hero-mockup.jpeg
```

---

## 1. What the file actually is

It is a **presentation shot**, not a viewport screenshot: the hero is a card
floating on a pale canvas with a soft drop shadow, and the top margin (171 px)
is much larger than the bottom (102 px). The horizontal margins are symmetric
(63 px / 63 px), so **only the horizontal framing is design information** — the
vertical asymmetry is the mockup's own framing and must not be reproduced.

---

## 2. Colours — sampled, not guessed

Method: median of a text-free band inside each region (medians are immune to
JPEG ringing at glyph edges); for solid ink, the 3rd percentile by luminance.

| Token                | Sampled hex   | Where it was sampled                                              |
| -------------------- | ------------- | ----------------------------------------------------------------- |
| `--color-canvas`     | **`#F1F5FF`** | median of every margin pixel around the card                      |
| `--color-ink`        | **`#0E1116`** | logo monogram reads `#000000`; see note below                     |
| `--color-lime`       | **`#84CC16`** | two text-free bands inside the primary CTA (`#84CC19`, `#83CB13`) |
| `--color-lime-soft`  | **`#EBFACC`** | EXCLUSIVE badge top band (`#EBFCCD`), CTA arrow chip (`#EDFBC8`)  |
| `--color-court`      | **`#014C6C`** | median of the mid-court area                                      |
| `--color-court-deep` | **`#023958`** | median of the lower-left court shadow                             |
| `--color-surface`    | **`#FFFFFF`** | nav blocks (`#FFFEFF`), secondary CTA (`#FEFEFE`)                 |

Dominant colour of the whole photo (quantised): `#014969` at 4.7 % — this
confirms `--color-court` as the image's anchor hue.

**Note on `--color-ink`.** Large solid dark areas in the mockup measure
`#000000`; 9-px nav glyphs measure `#252525` (antialiasing floor). JPEG cannot
resolve the difference between `#000000` and `#0E1116` at that size, so the
token is set to `#0E1116` — a cold near-black that is measurably indistinct
from the source and kinder on screen than pure black.

### Contrast — the one place we overrule the mockup

| Combination                     | Ratio        | Verdict           |
| ------------------------------- | ------------ | ----------------- |
| white on `--color-lime`         | **2.0 : 1**  | **fails WCAG AA** |
| `--color-ink` on `--color-lime` | **9.45 : 1** | passes AAA        |

The mockup sets the primary CTA label in **white**. We ship it in
`--color-ink`. This is the only intentional deviation from the mockup's
appearance, and it is non-negotiable.

---

## 3. Geometry — measured

### Hero card

| Property          | Value                                     |
| ----------------- | ----------------------------------------- |
| Bounds            | x 63 → 1016, y 171 → 849                  |
| Size              | 954 × 679 (aspect **1.405**)              |
| Side margins      | 63 px each = **5.83 % of viewport width** |
| **Corner radius** | **0 — sharp corners**                     |

The radius was measured by walking down the left edge and recording the
horizontal inset per row: the inset is `0` for all of the first 34 rows. The
hero card has **square corners**.

> **This corrects the project brief.** The brief describes the hero as a
> rounded container at 24–28 px. It is not. Sharp corners are the mockup's
> actual signature, and they carry the whole layout: a hard-edged plate on a
> pale canvas. Rounding it would soften exactly the thing that makes it read as
> deliberate.

### Navigation — three blocks, not one pill

Row y 198 → 226, **height 29 px**, radius ≈ 1–3 px.

| Block | x range   | Width | Contents                              |
| ----- | --------- | ----- | ------------------------------------- |
| 1     | 97 → 179  | 83    | logo mark + `7SETS` wordmark          |
| —     | gap       | 6     |                                       |
| 2     | 186 → 527 | 342   | `• HOME • ABOUT • PROGRAMS • CONTACT` |
| —     | gap       | 6     |                                       |
| 3     | 534 → 562 | 29    | grip (2 × 3 dots), square             |

Inset from the card: **left 34 px, top 27 px**.

> **This corrects the project brief** on two counts. The nav is not a single
> pill, it is three separate rounded rectangles separated by 6 px gaps. And the
> radius is small (~4 px at design scale), not `999`. Nothing in this mockup is
> a pill.

### CTA row — y 749 → 777, height 29 px

| Element   | x range   | Width | Fill                | Label                              |
| --------- | --------- | ----- | ------------------- | ---------------------------------- |
| Primary   | 96 → 254  | 159   | `--color-lime`      | white in mockup → **ink in build** |
| gap       |           | 10    |                     |                                    |
| Secondary | 264 → 419 | 156   | **solid `#FFFFFF`** | ink                                |

Radius ≈ 2–3 px. The primary CTA carries a **rounded square chip** at its right
end holding the `↗` glyph, filled `#EDFBC8` (pale lime).

> **This corrects the project brief** twice more. The secondary CTA is a
> **solid white** button, not a transparent outline. And the arrow sits in a
> **rounded square**, not a white circle.

The CTA row sits **72 px above the bottom of the card**.

### Summer Camp card (top right)

A translucent glass panel (backdrop blur over the photo), roughly x 680 → 1000.
Thumbnail on the left, near-square corners. `EXCLUSIVE` badge in
`--color-lime-soft`. The `←` `→` controls are **white rounded squares
(~21 × 21) placed outside and below the panel**, not circles. A second card is
visible peeking behind — the stacked-carousel reading in the brief is correct.

---

## 4. Typography — measured

| Measurement                       | Image px                                        |
| --------------------------------- | ----------------------------------------------- |
| h1 cap height                     | **37**                                          |
| h1 x-height                       | **26** (x-height / cap = **0.70**)              |
| h1 descender                      | 14                                              |
| h1 baseline → baseline            | **66**                                          |
| h1 derived font-size (cap ÷ 0.70) | **≈ 53**                                        |
| h1 line-height ratio              | **1.25**                                        |
| h1 average advance                | 527 px / 21 chars = 0.47 em → tracking ≈ normal |
| body cap height                   | 10 → font-size **≈ 14.3**                       |
| body line-height                  | **20** (ratio 1.40)                             |
| nav link cap height               | 9 → font-size ≈ 12.9                            |
| button label cap height           | 10 → font-size ≈ 14.3                           |
| `EXCLUSIVE` cap height            | 8 → font-size ≈ 11.4                            |
| `Summer Camp 2026` cap height     | 11 → font-size ≈ 16                             |

### The typeface

Reading the glyphs at 1.6× zoom, the decisive features are:

- **single-storey `a`** — a circle with a stem, in `Champion`, `Starts`,
  `master`, `adults`. No upper bowl.
- circular `o` `p` `C`, monolinear strokes, straight-tailed `y`, angled cut on
  the `t` — a **geometric grotesque of the Futura lineage**.
- x-height / cap = **0.70** — larger than Futura (0.63), smaller than Poppins
  (~0.74).
- **display and body are the same family.** The body copy shows the same
  single-storey `a`. This is a one-typeface design.

### The choice — and why the brief's three candidates all lose

The brief proposes General Sans, Outfit or Switzer. The measured criterion —
single-storey geometric `a` — rules out General Sans and Switzer, which are
double-storey neo-grotesques, and Outfit is a poor match on the same axis. They
would produce a competent page that is visibly not this mockup.

**Chosen: `Jost` (Google Fonts, variable 100–900, self-hosted via `next/font`).**
It is the Futura-lineage geometric with a single-storey `a`, it is variable so
the Light display weight and the Regular UI weight cost one file, and its
x-height sits within a few percent of the measured 0.70. `Poppins` is the
fallback if Jost's narrower proportions prove wrong in Phase 2 — it matches on
the `a` but runs wider and taller in the x-height.

**One family, not a pairing.** The brief asks for a display + UI pairing; the
mockup uses a single face throughout, so that is what we ship. A tabular face
for the score rail digits will be reconsidered in Phase 4, against the 130 kB
JS / 2-family budget — not before it has a job to do.

---

## 5. Scale mapping

The mockup's absolute scale is not recoverable from the file; only ratios are.
We read it as a **1440 px viewport exported at 1080 px (× 4/3)** and round to
the 4 px grid. Ratios are the source of truth; the px column is the reference
rendering.

| Element                           | Image px  | × 4/3 | Adopted  | As a ratio    |
| --------------------------------- | --------- | ----- | -------- | ------------- |
| Card width                        | 954       | 1272  | 1272     | 88.3 vw       |
| Card side margin                  | 63        | 84    | 84       | **5.83 vw**   |
| Card radius                       | 0         | 0     | **0**    | —             |
| Nav / button height               | 29        | 38.7  | **40**   | —             |
| Nav / button radius               | ~2        | ~3    | **4**    | —             |
| Content gutter (card edge → text) | 34        | 45    | **44**   | 3.5 % of card |
| h1 font-size                      | 53        | 70.7  | **72**   | **4.9 vw**    |
| h1 line-height                    | 66        | 88    | **1.25** | —             |
| Body font-size                    | 14.3      | 19.1  | **18**   | —             |
| Body line-height                  | 20        | 26.7  | **1.55** | —             |
| Nav / label font-size             | 12.9–14.3 | 17–19 | **18**   | —             |

The h1 therefore lands at ~71 px on a 1440 px screen, not the 88 px the brief
assumed. `clamp(2.5rem, 4.9vw, 5rem)` reproduces the measured ratio and reaches
80 px on very wide screens.

---

## 6. Copy fixes

- The mockup reads `…and adults **rom** first swing…`. Confirmed at 1.6× zoom.
  Ship `from`.

---

## 7. Open questions carried into later phases

1. **Final imagery** (Phase 2). The mockup uses stock. ~15 images with one
   colour temperature and one court blue are needed. Decide sourced-vs-generated
   in Phase 2 — it carries most of the perceived quality.
2. **Is 7SETS real?** (before Phase 3). If fictional, tariffs / address /
   coaches are free but must stay internally consistent, because the Phase 7
   `LocalBusiness` JSON-LD has to mirror the visible content exactly. If it is a
   real client, the real NAP is required before Phase 3.
