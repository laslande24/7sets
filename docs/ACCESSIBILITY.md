# Accessibility — WCAG 2.2 AA

Audited in Phase 6, section by section. The automated half runs on every
`npm test` (`tests/a11y.spec.ts`, axe-core, four page states, zero critical or
serious violations). The half a machine cannot do is written down here.

axe finds roughly a third of what is wrong with a page. Everything below the
first table it did not find.

## What the audit changed

| Finding                                                                                                                                                                                                                                                                                                                                                                   | Where                                   | Fix                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **The full-screen menu was 90 × 40 pixels.** `position: fixed` resolves against the nearest transformed ancestor, and the header carries two transforms — its entrance tween leaves `translate(0px, 0%)`, and the condensed nav is a `scale(0.94)`. `inset-0` therefore meant "the nav pill": the dark background painted in the corner and the links hung over the hero. | `NavMenu`                               | Portalled to `<body>`. Guarded by a screenshot, `menu-open.png`.                                                                        |
| **Opening the menu did not move focus.** The items arrive on a GSAP timeline that starts them at `autoAlpha: 0`, and `visibility: hidden` cannot take focus — so `focusables()[0].focus()` was a no-op and focus stayed on the page behind an `aria-modal` dialog.                                                                                                        | `NavMenu`                               | The panel takes focus itself (`tabindex="-1"`), which also announces "Menu, dialog" first. Shift+Tab from it wraps to the last item.    |
| **The skip link was not the first tab stop.** It was rendered after the nav, so Tab landed on the logo.                                                                                                                                                                                                                                                                   | `app/page.tsx`                          | Moved above `<FloatingNav>`.                                                                                                            |
| **The page had no `contentinfo` landmark.** `<footer>` is only one when its nearest sectioning ancestor is `<body>`; this one is inside the plate's `<section>`.                                                                                                                                                                                                          | `Footer`                                | Explicit `role="contentinfo"`.                                                                                                          |
| **Both primary CTAs did nothing.** "Book free trial" in the hero and at Match Point were `<button>` elements with no handler, and Match Point's configured `href` pointed at its own section.                                                                                                                                                                             | `Hero`, `MatchPoint`, `content/site.ts` | Links to `#book`. A test asserts every "Book free trial" on the page resolves there.                                                    |
| **The testimonial marquee could not be stopped.** It paused on hover only, which is not a mechanism a keyboard has (SC 2.2.2).                                                                                                                                                                                                                                            | `Voices`, `SignatureMotion`             | Focusable band, and focus pauses the loop on the same terms as hover.                                                                   |
| **Three scroll containers were unreachable.** The programmes rail, the coaches rail and the marquee scroll horizontally; a keyboard could reach none of them, and on load the programmes rail holds nothing focusable at all because its links are still hidden by their own reveal.                                                                                      | `RailKeyboard`                          | A tab stop while they scroll, plus arrow keys on the programmes rail.                                                                   |
| **Focus could land off-screen in the pinned rail.** SET 03 is pinned and moved by `x`, so the browser's scroll-into-view has nothing to scroll.                                                                                                                                                                                                                           | `RailKeyboard`                          | The page scroll is computed from the pin's own trigger and set by hand.                                                                 |
| **The carousel announced nothing, then announced too much.** No live region at all; a naive `aria-live="polite"` would have interrupted the reader every six seconds.                                                                                                                                                                                                     | `SummerCampCard`                        | `aria-live` is `off` while it advances itself and `polite` once a reader presses an arrow — and that press stops the autoplay for good. |
| Five contrast failures (below).                                                                                                                                                                                                                                                                                                                                           | see table                               | Opacity raised.                                                                                                                         |
| A hydration mismatch logged on every load (`data-js` on `<html>`).                                                                                                                                                                                                                                                                                                        | `app/layout.tsx`                        | `suppressHydrationWarning`, which is what it is for.                                                                                    |

## Contrast

Measured against the token values in `app/globals.css`. `/styleguide` re-runs
this audit against the live cascade on load.

| Pair                            | Ratio    | Needs | Note                         |
| ------------------------------- | -------- | ----- | ---------------------------- |
| `ink` on `canvas`               | 17.3 : 1 | 4.5   | body copy                    |
| `ink/70` on `canvas`            | 6.8 : 1  | 4.5   | standfirsts                  |
| `ink/60` on `canvas`            | 4.8 : 1  | 4.5   | captions — the floor we use  |
| ~~`ink/55` on `canvas`~~        | 4.1 : 1  | 4.5   | **failed**, now `ink/60`     |
| ~~`ink/50` on `surface`~~       | 3.6 : 1  | 4.5   | **failed**, now `ink/60`     |
| ~~`surface/60` on `court-700`~~ | 4.4 : 1  | 4.5   | **failed**, now `surface/70` |
| `surface/70` on `court-700`     | 5.4 : 1  | 4.5   | method step durations        |
| `surface/60` on `court-800`     | 5.4 : 1  | 4.5   | camp card labels             |
| `surface/60` on `ink`           | 7.2 : 1  | 4.5   | footer captions              |
| `ink` on `lime-500`             | 9.5 : 1  | 4.5   | the primary CTA — see rule 2 |
| ink focus ring on `canvas`      | 17.3 : 1 | 3.0   | SC 2.4.11                    |

The menu panel is opaque rather than 95%: at 95% a link's contrast depended on
whatever the page happened to have behind it, and over the lime CTA one measured
below 4.5.

Two things axe reports as _incomplete_ rather than passing, because it cannot
evaluate them: white text over the hero photograph, and the coach records over a
gradient. Both were checked by eye against the darkest and lightest pixels under
the text. The hero carries a two-gradient scrim for exactly this reason — see
`hero-scrim` in `app/globals.css`.

## Keyboard

| Where                 | Keys                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Page                  | Tab first reaches **Skip to content**, which lands focus on `<main>`.                             |
| Menu                  | Escape closes. Tab cycles inside. Focus returns to the grip.                                      |
| Programmes rail       | ← → between cards, Home / End to the ends. Arrowing past either end falls through to the browser. |
| Coaches, testimonials | The band is a tab stop while it scrolls; arrow keys scroll it natively.                           |
| FAQ                   | Enter or Space toggles; `aria-expanded` and `aria-controls` follow.                               |
| Carousel              | Two labelled buttons. Focus anywhere on the card pauses the autoplay.                             |
| Booking form          | Native controls throughout; errors are `aria-describedby` on their field.                         |

Focus is never removed, never invisible, and never trapped anywhere except the
modal menu. The pre-animation states in `app/globals.css` use `visibility`
alongside `opacity` precisely so that an element waiting to be revealed cannot
hold a tab stop while it is invisible.

## Target size (SC 2.5.8, 24 × 24)

Everything meets 24 × 24. The two closest calls are deliberate: the score rail
markers are 24px tall, and the footer's legal links are given `min-h-6` because
at caption size the text box alone is only 20px. Both are pointer-only surfaces
on desktop.

The brief asked for 44 × 44 (that is SC 2.5.5, level AAA). The buttons, the
arrow controls and the grip all meet it — `ArrowButton` draws a 28px chip inside
a 40–48px hit area for this reason. The score rail does not, and raising it
would change the rail's rhythm for a control that exists only on a pointer
device. Recorded here as a considered exception rather than an oversight.

## Motion

`prefers-reduced-motion: reduce` is honoured everywhere and always lands the
element in its final state — never hidden. Under it: no hero timeline, no pin,
no marquee, no carousel autoplay, no custom cursor, and the FAQ opens instantly.
`tests/visual.spec.ts` runs entirely in that mode, so the reduced-motion page is
photographed on every run.

## Known limitations

- **The FAQ needs JavaScript to open more than one answer.** The panels are all
  in the served HTML and only the closed ones are collapsed — by JavaScript, in
  a layout effect, so with scripting off the page is a plain list of ten
  questions and ten answers. Nothing is hidden from a reader without JS; what
  they lose is the accordion, not the content.
- **Client-side validation runs on blur, which moves the submit button.** A
  reader who presses the button immediately after answering the last field can
  have it move by a line height as the message above it appears. The tests work
  around it by blurring first (`clickWhenStill`); the page should reserve the
  space instead. Phase 9.
- **The rate limiter is per-instance and in memory** (`app/actions.ts`), so the
  suite may submit the booking form at most five times per ten minutes.
- No screen-reader pass with a real assistive technology yet. NVDA and VoiceOver
  runs belong in Phase 9 alongside the Lighthouse run.
