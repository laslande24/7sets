# ASSETS

What is in `public/images/`, where it came from, and what has to replace it.

## Current images

All four are **placeholders under the Unsplash License** (free, commercial use
permitted, attribution not required — we credit anyway). They were chosen from
one photographer where possible so the colour temperature and the court blue
stay consistent, which is the thing that carries perceived quality.

| File              | Dimensions  |   Size | Source                                                                                                                                 | Photographer        |
| ----------------- | ----------- | -----: | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `hero-court.jpg`  | 2400 × 1500 | 450 kB | [unsplash.com/photos/…Oip1nwclZ8A](https://unsplash.com/photos/a-woman-sitting-on-a-tennis-court-holding-a-tennis-racquet-Oip1nwclZ8A) | Ahmed (@mutecevvil) |
| `camp-summer.jpg` | 900 × 600   |  92 kB | [unsplash.com/photos/…8iZbdNevfhY](https://unsplash.com/photos/several-tennis-balls-on-a-blue-tennis-court-8iZbdNevfhY)                | Ahmed (@mutecevvil) |
| `camp-junior.jpg` | 900 × 600   |  92 kB | [unsplash.com/photos/…sdUfSvDL4e4](https://unsplash.com/photos/three-tennis-balls-on-a-blue-tennis-court-sdUfSvDL4e4)                  | Ahmed (@mutecevvil) |
| `camp-adult.jpg`  | 900 × 600   |  33 kB | crop of `hero-court.jpg`                                                                                                               | Ahmed (@mutecevvil) |

`hero-court.jpg` was downloaded portrait at 2400 × 3600 and cropped locally to
landscape; `camp-adult.jpg` is a second crop of the same frame.

## What has to be replaced before launch

The hero placeholder is a **top-down** shot. The mockup's is **side-on**, with
the subject centre-right and the copy reading over dark court at the lower
left. The current frame puts the player's legs where the title sits, which is
why `hero-scrim` has to work as hard as it does.

| Slot          | Needed                                                                                       | Minimum size |
| ------------- | -------------------------------------------------------------------------------------------- | ------------ |
| Hero          | Side-on, subject centre-right, dark court across the lower left, blue hard court, dusk light | 2560 × 1600  |
| Camp card × 3 | One per programme, 3:2, readable at 141 × 93                                                 | 900 × 600    |

Everything Phase 3 adds is still outstanding: six coach portraits (4:5, ≥ 800px
wide, one lighting setup), six facility shots for SET 06 at deliberately uneven
sizes, and one wide frame for the Summer Camp feature block.

## Rules for whatever replaces these

- One colour temperature and one court blue across the whole set. This is the
  single biggest lever on how finished the site looks.
- Descriptive filenames — `hero-court.jpg`, never `IMG_2934.jpg`. Phase 7 reads
  them.
- Feed `next/image` a static import so the build derives dimensions and the
  blur placeholder, and CLS stays at 0.
- Non-decorative images need a real `alt`; decorative ones need `alt=""`.
- Quality is set per-image and must appear in `images.qualities` in
  `next.config.ts` — Next 16 silently falls back to 75 otherwise. Currently
  `[85]`.

## Provenance

`scripts/sample-hero.ps1 -Crop` cuts reference crops out of the mockup itself.
Those are for measurement only and must never ship: the mockup has its own UI
composited into the photograph, so any crop of the plate carries the nav, the
title and the buttons baked in.
