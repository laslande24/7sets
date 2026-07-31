# MOTION

Every animation on the site: what it does, when it fires, how long it takes.

Durations and easings are **not** written here as numbers to be kept in sync.
They are CSS tokens in `app/globals.css`, parsed at runtime by
`lib/gsap/config.ts`, which turns each `cubic-bezier()` into a CustomEase. GSAP
and the CSS transitions therefore animate on the same values, and changing a
token moves both.

| Token        | Value  | Where it is spent                |
| ------------ | ------ | -------------------------------- |
| `--dur-fast` | 200ms  | hover, focus, press              |
| `--dur-base` | 400ms  | reveals, card swaps              |
| `--dur-slow` | 800ms  | masked line reveals, plate clips |
| `--dur-hero` | 1400ms | the hero entrance, counters      |

Nothing on the page exceeds `--dur-hero`. Past that it is waiting, not pleasure.

---

## Where the code lives

| File                                      | Owns                                                          |
| ----------------------------------------- | ------------------------------------------------------------- |
| `lib/gsap/index.ts`                       | plugin registration, lazy loaders, `will-change` helper       |
| `lib/gsap/config.ts`                      | tokens → GSAP durations and CustomEase curves                 |
| `components/motion/SmoothScrollProvider`  | Lenis, the GSAP ticker, anchors, the single debounced refresh |
| `components/motion/SectionMotion`         | the baseline rhythm — rise, lines, parallax, counters         |
| `components/motion/SignatureMotion`       | the Phase 5 moments below                                     |
| `components/layout/ScoreRail`             | the scoreboard rail                                           |
| `components/sections/hero/SummerCampCard` | the stacked-card carousel                                     |

Sections stay Server Components throughout. They declare motion with data
attributes; the two orchestrators read them.

---

## The baseline — `SectionMotion`

| Hook                      | Effect                                       | Trigger                     | Duration     | Ease      |
| ------------------------- | -------------------------------------------- | --------------------------- | ------------ | --------- |
| `data-animate="rise"`     | fade + 24px rise, batched and staggered 0.08 | `top 82%`, once             | `--dur-base` | out-expo  |
| `data-animate="lines"`    | masked line-by-line SplitText                | `top 82%`, once             | `--dur-slow` | out-expo  |
| `data-animate="parallax"` | scrubbed offset, `data-parallax-speed`       | `top bottom` → `bottom top` | scrub        | none      |
| `data-count-to`           | counts up from zero                          | `top 82%`, once             | `--dur-hero` | out-quart |
| `data-animate="expand"`   | hero plate scales to full bleed              | `top top` → `bottom top`    | scrub        | none      |

57 rise targets, 9 headings, 6 parallax layers, 4 counters.

`rise` uses `autoAlpha`, not `opacity`: an element waiting to be revealed is
`visibility: hidden`, so it cannot swallow a click or hold a tab stop.

---

## The signature moments — `SignatureMotion`

### Hero — entrance

One timeline, played once on load, ~1.4s end to end. Waits on
`document.fonts.ready`: splitting the title before the webfont resolves measures
line breaks in the fallback face and every line lands wrong.

| Step | Target        | From                          | Ease            |
| ---- | ------------- | ----------------------------- | --------------- |
| 1    | plate         | `clip-path: inset(12% 18%)`   | out-expo        |
| 2    | photograph    | `scale: 1.08`                 | out-expo        |
| 3    | nav           | `yPercent: -180`              | `back.out(1.7)` |
| 4    | title lines   | `yPercent: 110`, stagger 0.08 | out-expo        |
| 5    | copy and CTAs | `y: 24`, faded, stagger 0.06  | out-expo        |
| 6    | camp card     | `xPercent: 18`, faded         | `back.out(1.4)` |

### Hero — parallax and expand

Two planes on the same scroll range: the photograph trails at +10%, the title
leads at −14%. Both under the brief's 15% ceiling — past that it reads as a
glitch rather than depth. The plate is scaling to full bleed underneath them, and
the next plate paints over it simply by being later in the document.

### Nav — contraction

Past 100px the nav takes `.is-condensed`: `scale(0.94)` and a heavier
`backdrop-filter`. Scale rather than padding, so nothing reflows. The blur is
affordable because the nav is fixed — the one place it does not repaint on
scroll.

### SET 03 — pin and horizontal scroll

The bravura piece, and the only place the document height changes.

- Viewport pins at `top top`; the track translates `x: -(scrollWidth - 100vw + 96)`.
- **`ease: "none"` is required.** Any other ease and horizontal position stops
  matching scroll position.
- `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`.
- Cards off centre sit at `scale 0.94` / `opacity 0.55`, tied to the horizontal
  tween through `containerAnimation` — not to vertical scroll.
- Measured at 1440: 728px of travel across a 2072px track.
- **Below 1024 there is no pin.** The track stays the native snap scroller from
  Phase 3. Pinning a phone is a bad trade.

### SET 04 — the method path

`DrawSVGPlugin` draws `#method-path` on scrub while `MotionPathPlugin` runs a
ball along it and each step brightens as the ball reaches it. Both plugins load
only because this section exists. DrawSVG owns `stroke-dasharray`, so the dotted
rest state is cleared first. Desktop only — the path is hidden below `lg`.

### SET 07 — membership fan

The three plans arrive stacked (`xPercent` ±30, `rotate` ±3, `y` 40) and open
out, stagger 0.08, once at `top 85%`. On narrow screens the offsets and the
rotation drop to zero and it becomes a plain rise — three overlapping cards on a
phone is just a mess.

They carry `data-animate="fan"`, **not** `"rise"`, and this owns them outright.
When both orchestrators had them, the rise batch's `overwrite` killed this tween
mid-flight and left `xPercent` and `rotate` frozen at their start values: the
cards read as permanently static because the only animation still running could
not undo the other's transform. One owner per element is the rule; the batch now
uses `overwrite: "auto"` so it clears only the properties it actually sets.

### SET 03 — no per-card focus effect

There was one — off-centre cards scaled and dimmed against `containerAnimation`
— and it is deliberately gone. Same clash: the cards already carry
`data-animate="rise"` for their entrance, and a second owner animating `opacity`
on them was killed by the batch in exactly the same way. The pin and the
horizontal travel are the moment; the section does not need a second one.

### Voices — the marquee

A continuous `xPercent: -50` loop over the duplicated track, so it repeats
seamlessly. Scroll velocity drives `timeScale`, clamped to ±6; scrolling up runs
it backwards. Paused on pointer enter.

**Desktop only.** On a phone it cannot be hovered to pause and, with its overflow
taken away, cannot be swiped either — a swipeable list is the better control.

### Match Point — the ball

Crosses the plate in 1.25s at `ease: none` while two arcs carry it up and down,
the second shorter than the first: a ball that loses energy. The CTA takes one
pulse on the second impact. Desktop only.

### Every plate — the breath

`clip-path: inset(0% 0% 5% 0%)` opening once at `top 88%`, identical everywhere,
so the page has one rhythm rather than ten arrivals. The clip is cleared on
completion — left behind it would be a permanent containing block for any fixed
descendant.

Excluded: the hero, which owns its own clip and scale, and SET 03, where a clip
would fight the pin's spacer.

### Summer Camp card — the stack

On `←` / `→` the top card leaves sideways with a 4° rotation while the one behind
steps up into its place, then the new front card arrives from the opposite side.
A `busy` latch makes it unspammable. Autoplay every 6s, paused on pointer enter
and on focus, and stopped for good the first time a reader presses an arrow.

---

## Phase 6 additions

### The cursor

A 12px disc that follows the pointer with `quickTo` and a `--dur-fast` lag,
growing to 72px with a label over anything carrying
`data-cursor="view" | "play" | "drag"`. Three conditions before it exists at
all — a hover-capable fine pointer, no reduced-motion preference, and
JavaScript. The native cursor is hidden by a `data-cursor-on` attribute on
`<html>` which the component removes on unmount, so there is no path that leaves
a page with no cursor; and over an input, a textarea or a select the system
cursor comes back, because an I-beam says where the caret will land and a disc
does not.

Centring and the idle size go through `gsap.set`, not Tailwind's `translate` and
`scale` utilities: those write the individual CSS properties, which the browser
applies on top of the `transform` GSAP is about to write, so the disc would be
offset twice and scaled twice.

### The FAQ accordion

The one place the site animates `height`, and rule 3 in `CLAUDE.md` names it as
the single exception: the layout below the panel is the thing that has to move,
and no transform can push it. Click-driven, one element, never scroll-linked.

Every panel stays in the DOM and is collapsed to `height: 0` rather than
unmounted — which is what makes the open animate, and also means the server
sends ten answers, all open, for a reader with no JavaScript. The closed ones
are marked `inert` from JavaScript in a layout effect, never in the markup, so
that fallback stays readable and there is no frame where the page shows all ten
and then folds.

### The rails

`components/a11y/RailKeyboard.tsx` is not motion, but it exists because of it.
The pinned rail moves by `x`, so a card that receives focus off to the right
cannot be scrolled into view by the browser — there is nothing to scroll. The
component reads the pin's own ScrollTrigger by id (`lib/rails.ts`) and sets the
page scroll itself. Its one subtlety: `scrollWidth > clientWidth` is true on the
desktop rail as well, where the overflow is `visible` and the content simply
hangs out of the box, so "does it scroll" has to ask the computed `overflow-x`
too.

---

## Rules this all obeys

1. **`transform` and `opacity` only.** Two of the three exceptions are paint, not
   layout, and both one-shot: `clip-path` on the plates, `stroke-dasharray` under
   DrawSVG. The third is the FAQ's `height`, argued above and in `CLAUDE.md`.
2. **`will-change` is applied when a tween starts and removed when it ends.**
   Never in a stylesheet — a permanent hint is a permanent compositor layer.
3. **Reduced motion.** Every block above lives inside one
   `prefers-reduced-motion: no-preference` match, and every CSS pre-state is
   inside the same query. A reader who asks for less motion gets the static
   Phase 3 page: the rail is a snap scroller, the marquee is a scroller, the path
   is a drawn line, and nothing is ever hidden waiting for a tween.
4. **No JavaScript, no problem.** Pre-animation states hang off `[data-js]`,
   which an inline script sets before first paint, and a 3s timeout drops them if
   the GSAP runtime never arrives.
5. **Cleanup.** Every ScrollTrigger, timeline and SplitText instance is killed or
   reverted on unmount, through `useGSAP` and explicit teardown.

---

## Verified

Measured in-browser at 1440 × 900 and 390 × 844, driving `gsap.ticker.tick()` by
hand because `requestAnimationFrame` does not run in a hidden pane.

| Check                                | Result                                 |
| ------------------------------------ | -------------------------------------- |
| Hero entrance completes              | title, copy, card all at opacity 1     |
| Title split                          | 4 line wrappers, masked                |
| Pin travel                           | 728px across a 2072px track            |
| Track translation                    | 0 → −710px, linear across the range    |
| Nav contraction                      | off at 0, on at 400                    |
| DrawSVG                              | dasharray `0, 999999` → `644, 269`     |
| MotionPath ball                      | follows the path                       |
| Match Point ball                     | crosses to x 1031                      |
| Membership fan, at load              | stacked ±113px, tilted ±3°, y +40      |
| Membership fan, after trigger        | all three opacity 1, `transform: none` |
| Full scroll-through, elements hidden | **0 of 66**                            |
| Frozen transforms after full pass    | **0**                                  |
| Leftover clip-paths                  | **0**                                  |
| Once-triggers self-killed            | 106 → 23                               |
| Horizontal overflow                  | **0** at both widths                   |
| Mobile pin count                     | **0**                                  |

**Not verified here:** perceived smoothness, 60fps under 4× CPU throttling, and
the reduced-motion pass. The pane does not composite frames, so no animation can
be watched or profiled in this environment — only proved to reach its end state.
Those three need a real browser.
