# ASSETS

What is in `public/images/`, where it came from, and what has to replace it.

## Current images

All are **placeholders under the free Unsplash License** (commercial use
permitted, attribution not required — we credit anyway). Where possible they
come from one photographer, because a single colour temperature and a single
court blue across the set is what carries perceived quality.

| File                   | Dimensions  |   Size | Photographer                | Source                                                                                                            |
| ---------------------- | ----------- | -----: | --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `hero-court.jpg`       | 2400 × 1500 | 450 kB | Ahmed (@mutecevvil)         | [Oip1nwclZ8A](https://unsplash.com/photos/a-woman-sitting-on-a-tennis-court-holding-a-tennis-racquet-Oip1nwclZ8A) |
| `camp-summer.jpg`      | 900 × 600   |  92 kB | Ahmed (@mutecevvil)         | [8iZbdNevfhY](https://unsplash.com/photos/several-tennis-balls-on-a-blue-tennis-court-8iZbdNevfhY)                |
| `camp-junior.jpg`      | 900 × 600   |  92 kB | Ahmed (@mutecevvil)         | [sdUfSvDL4e4](https://unsplash.com/photos/three-tennis-balls-on-a-blue-tennis-court-sdUfSvDL4e4)                  |
| `camp-adult.jpg`       | 900 × 600   |  33 kB | Ahmed (@mutecevvil)         | crop of `hero-court.jpg`                                                                                          |
| `camp-feature.jpg`     | 1600 × 1067 | 158 kB | Renith R                    | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |
| `facility-lines.jpg`   | 1000 × 662  |  55 kB | Aleksandar Kyng             | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |
| `facility-outdoor.jpg` | 1400 × 1750 | 764 kB | Ryan Searle                 | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |
| `facility-texture.jpg` | 1000 × 1778 | 393 kB | Maurits Bausenhart          | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |
| `facility-clay.jpg`    | 1000 × 1500 | 441 kB | Aleksandr Galichkin (@axga) | [msx3rGYfOEc](https://unsplash.com/photos/a-clay-tennis-court-with-lines-msx3rGYfOEc)                             |
| `facility-ball.jpg`    | 1000 × 1333 | 163 kB | Mario Gogh                  | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |
| `facility-play.jpg`    | 1400 × 2100 | 260 kB | Renith R                    | [tennis-court](https://unsplash.com/s/photos/tennis-court)                                                        |

`hero-court.jpg` was downloaded portrait at 2400 × 3600 and cropped locally to
landscape; `camp-adult.jpg` is a second crop of the same frame. Total 2.9 MB —
well over what Phase 8 will allow, and the first thing that phase looks at.

## Deliberately not photographed: the coaches

SET 05 renders **initial monograms**, not portraits. The six coaches in
`content/coaches.ts` are invented, and so are their playing records and their
safeguarding roles. Putting a fabricated record and a fabricated child-welfare
responsibility onto a real, identifiable photographed person is not a thing to
do in a demo, so the section is built to work without a face and the markup is
already the shape real portraits will need.

Replace with commissioned photography: **six portraits, 4:5, ≥ 800px wide, one
lighting setup**, and swap the monogram block in
`components/sections/Coaches.tsx` for an `Image`.

## What else has to be replaced before launch

The hero placeholder is a **top-down** shot. The mockup's is **side-on**, with
the subject centre-right and the copy reading over dark court at the lower
left. The current frame puts the player's legs where the title sits, which is
why `hero-scrim` has to work as hard as it does.

| Slot           | Needed                                                                                       | Minimum size |
| -------------- | -------------------------------------------------------------------------------------------- | ------------ |
| Hero           | Side-on, subject centre-right, dark court across the lower left, blue hard court, dusk light | 2560 × 1600  |
| Camp card × 3  | One per programme, 3:2, readable at 141 × 93                                                 | 900 × 600    |
| Coaches × 6    | Portraits, 4:5, one lighting setup                                                           | 800 × 1000   |
| Facilities × 6 | The real site, not stock. Captions in `content/facilities.ts` are binding.                   | 1600 wide    |
| Camp feature   | Wide frame of the camp itself                                                                | 1600 × 1067  |

## Rules for whatever replaces these

- One colour temperature and one court blue across the whole set.
- **The caption and the `alt` must describe the photograph that is actually
  there.** Three of the facility captions were rewritten in Phase 3 once the
  downloaded frames turned out not to match what had been assumed.
- Descriptive filenames — `facility-clay.jpg`, never `IMG_2934.jpg`. Phase 7
  reads them.
- Feed `next/image` a static import wherever the path is known at build time,
  so dimensions and the blur placeholder come for free and CLS stays at 0.
- Quality is set per-image and must appear in `images.qualities` in
  `next.config.ts` — Next 16 silently falls back to 75 otherwise. Currently
  `[85]`.

## Provenance

`scripts/sample-hero.ps1 -Crop` cuts reference crops out of the mockup itself.
Those are for measurement only and must never ship: the mockup has its own UI
composited into the photograph, so any crop of the plate carries the nav, the
title and the buttons baked in.
