import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { labels, sectionCopy } from "@/content/copy";
import { programs } from "@/content/programs";
import { PROGRAMS_PIN_ID } from "@/lib/rails";

/**
 * SET 03 — the five programmes.
 *
 * Three nested elements, each with one job. `data-programs-viewport` is what
 * Phase 5 pins. Inside it, `data-rail` is the scroll container — a native snap
 * scroller below 1024px, where pinning a phone would be a bad trade, and the
 * element `RailKeyboard` gives a tab stop and arrow keys to. Inside that,
 * `data-programs-track` is what actually translates on desktop.
 *
 * The scroller and the list are separate elements on purpose: a role on the
 * `<ul>` itself would take the list semantics away from its children, so the
 * named group wraps the list rather than being it.
 */
export function Programs() {
  const hintId = "programs-rail-hint";

  return (
    <SectionShell id="programs" padded={false} className="py-16 md:py-24">
      <div className="px-gutter">
        <div data-animate="rise">
          <Eyebrow set={3}>{sectionCopy.programs.eyebrow}</Eyebrow>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-gutter gap-y-4">
          <h2 data-animate="lines" className="max-w-[18ch] text-display-lg">
            {sectionCopy.programs.heading}
          </h2>
          <p data-animate="rise" className="max-w-[38ch] text-body text-ink/70">
            {sectionCopy.programs.standfirst}
          </p>
        </div>
      </div>

      <div data-programs-viewport className="mt-12">
        {/* Native snap scroller below 1024, which is also the reduced-motion and
            no-JavaScript fallback. From 1024 up the overflow is released so the
            pinned tween can translate the track instead. */}
        <div
          data-rail
          data-rail-pin={PROGRAMS_PIN_ID}
          data-cursor="drag"
          role="group"
          aria-label={labels.rails.programs}
          aria-describedby={hintId}
          className="snap-x snap-mandatory [scrollbar-width:thin] overflow-x-auto pb-4 focus-visible:focus-ring lg:overflow-x-visible"
        >
          <ul data-programs-track data-rail-track className="flex w-max gap-4 px-gutter">
            {programs.map((program) => (
              <li
                key={program.id}
                data-animate="rise"
                data-rail-item
                data-cursor="view"
                /* Wider from 1024 so the pinned rail has a journey worth pinning
                 for: at 20rem the five cards overhang the viewport by barely
                 400px, which is a lot of held scroll for very little travel. */
                className="flex w-[min(20rem,80vw)] shrink-0 snap-start flex-col rounded-md bg-canvas p-6 ring-1 ring-ink/10 ring-inset lg:w-96"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-display-md">{program.name}</h3>
                  <span className="shrink-0 text-label text-ink/60 tabular-nums">
                    {program.ages}
                  </span>
                </div>

                <p className="mt-3 text-body text-ink/70">{program.summary}</p>

                <dl className="mt-6 space-y-1.5 border-t border-ink/12 pt-4 text-caption">
                  {[
                    [labels.programCard.session, program.sessionLength],
                    [labels.programCard.ratio, program.ratio],
                    [labels.programCard.frequency, program.frequency],
                  ].map(([term, value]) => (
                    <div key={term} className="flex justify-between gap-4">
                      {/* Not /55: at 14px that measures 4.08:1 on the canvas
                          card and WCAG 1.4.3 wants 4.5. /60 is 4.81. */}
                      <dt className="text-ink/60">{term}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5 space-y-2 text-caption text-ink/70">
                  {program.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-lime-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <p className="flex items-baseline gap-2">
                    <span className="text-display-md tabular-nums">{program.price}</span>
                    <span className="text-caption text-ink/60">{program.priceNote}</span>
                  </p>
                  <ButtonLink
                    href={program.href}
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full ring-1 ring-ink/12 ring-inset"
                  >
                    <span className="sr-only">{program.name}: </span>
                    {labels.programCard.cta}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Said once, for the reader who has just landed on the rail and needs
            to know it moves sideways. */}
        <p id={hintId} className="sr-only">
          {labels.rails.hint}
        </p>
      </div>
    </SectionShell>
  );
}
