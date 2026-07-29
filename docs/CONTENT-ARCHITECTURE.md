# CONTENT ARCHITECTURE — the seven sets

The brand is 7SETS, so the page is seven sets plus four framing blocks. Each
set is a square-cornered plate on the pale canvas (see `CLAUDE.md`), carries one
`h2`, one kebab-case `id` for nav anchoring, and **one** animation intention.
One clear idea per section beats five scattered effects.

Copy is written in Phase 3 and lives in `content/*.ts` — never inline in JSX.
Animation intentions below are a single line each on purpose: they are a brief
for Phase 5, not a specification.

---

## Framing — Floating nav

`components/layout/FloatingNav.tsx` · not a set

Three white blocks on one row: logo mark + `7SETS` wordmark · the four links
separated by `•` · the grip button. 6 px gaps, 40 px tall, 4 px radius.

- **Content** — HOME · ABOUT · PROGRAMS · CONTACT, anchoring to the set ids.
- **Animation** — after 100 px of scroll the blocks contract: less padding, more
  backdrop blur, labels stay legible. On mobile it hides on scroll down and
  returns on scroll up.

---

## SET 01 — Hero

`#hero` · the promise

- **Goal** — say what the academy is and what to do next, in one screen.
- **Content** — `h1` "Every Champion Starts Somewhere" on two lines; a three-line
  paragraph (ship `from first swing`, the mockup's `rom` is a typo); primary CTA
  `BOOK FREE TRIAL` with the arrow chip; secondary CTA `EXPLORE PROGRAMS`; the
  stacked Summer Camp carousel top-right, three slides (Summer Camp 2026, Junior
  Open Day, Adult Bootcamp).
- **Animation** — one orchestrated entry timeline of ~1.4 s, then a three-plane
  parallax on scroll: foreground balls fastest, player mid, sky slowest.

## SET 02 — Manifesto & numbers

`#manifesto` · why this academy

- **Goal** — earn trust in the ten seconds after the hero.
- **Content** — eyebrow `SET 02 — WHY 7SETS`, a short title, two manifesto
  paragraphs, and four statistics (courts, certified coaches, active members,
  years) set in large tabular figures. Final values live in a data attribute so
  Phase 5 can count to them.
- **Animation** — the four numbers count from zero when the section reaches 70 %
  of the viewport; the title reveals word by word.

## SET 03 — Programs

`#programs` · what you can actually join

- **Goal** — let a parent or an adult find themselves in under five seconds.
- **Content** — five programmes: Little Aces (4–7), Juniors (8–13), Teens
  Performance (14–17), Adults (18+), Elite Pathway (by selection). Each card
  carries name, age range, session length, coach-to-player ratio, frequency,
  indicative price, three content bullets, and a link.
- **Structure** — an outer container and an inner translatable track, ready for
  the Phase 5 pin.
- **Animation** — the section pins and the five cards travel horizontally with
  vertical scroll. Below 1024 px there is **no pin**: native horizontal scroll
  with scroll-snap.

## SET 04 — The Method

`#method` · how the coaching works

- **Goal** — turn "we have good coaches" into something a sceptic can follow.
- **Content** — four steps, Assess → Drill → Play → Compete, each with a number,
  a title, two sentences and a typical duration. A single curved SVG path
  (`id="method-path"`) links them.
- **Animation** — the path draws as you scroll and a ball travels along it; each
  step activates as the ball reaches it.

## SET 05 — Coaches

`#coaches` · who you will actually train with

- **Goal** — put credible faces to the method.
- **Content** — six coaches: portrait, name, speciality, one believable line of
  record, years of experience. Three columns on desktop, two on tablet, a
  carousel on mobile. Markup includes a hover overlay.
- **Animation** — masked cascade reveal from the bottom of an overflow-hidden
  frame; on hover the portrait scales slightly and the record surfaces.

## SET 06 — Courts & Summer Camp 2026

`#courts` · where it happens, and the seasonal hook

- **Goal** — sell the place, then sell the camp.
- **Content** — a six-image facilities gallery in a deliberately asymmetric
  editorial layout (not a regular grid), then a large Summer Camp 2026 feature
  that restates the hero card at full size: dates, price, what is included, CTA.
- **Animation** — each gallery image parallaxes at its own speed; the camp block
  reveals through a diagonal clip-path.

## SET 07 — Membership

`#membership` · the commitment

- **Goal** — make choosing obvious, and make the middle tier the easy answer.
- **Content** — three plans: Casual · Member · Performance. Monthly price, what
  is included, one highlighted plan, and a monthly/annual toggle (React state).
- **Animation** — the three cards arrive stacked and fan out to their positions;
  the highlighted plan lands last and sits slightly higher.

---

## Framing — Voices

`#voices` · social proof

Eight short, credible testimonials — a parent, a teenager, an adult beginner, a
ranked player. One horizontal line, marquee structure (duplicated track).

- **Animation** — continuous infinite scroll whose speed and direction follow
  scroll velocity. Pauses on hover.

## Framing — FAQ

`#faq` · objection handling

Ten questions parents and adult beginners genuinely ask. Native accessible
accordion — `<button aria-expanded>` plus a controlled region, no library. This
is the single source for the Phase 7 `FAQPage` JSON-LD, so answers must lead
with the answer in the first sentence.

- **Animation** — animated height on open, icon rotation, one panel at a time.

## Framing — Match Point

`#match-point` · the last CTA

Full-height, `--color-court-deep` ground, one very large title, one CTA. It is
the page's last breath and should carry weight.

- **Animation** — the title reveals line by line; a ball crosses the screen and
  bounces twice with credible physics; the CTA pulses once on impact.

## Framing — Footer

`#footer` · the practical layer

Brand and baseline, navigation, programmes, contact with the **full NAP** (name,
address, phone), opening hours, social links, legal. The NAP feeds the Phase 7
`LocalBusiness` JSON-LD — structured data must mirror it exactly, so whatever is
written here in Phase 3 is binding.

---

## Section order

`hero → manifesto → programs → method → coaches → courts → membership → voices
→ faq → match-point → footer`

The score rail counts the seven sets only. The four framing blocks are not
scored — they are the space between games.
