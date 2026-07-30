import { Eyebrow, SectionShell } from "@/components/ui";
import { sectionCopy } from "@/content/copy";
import { testimonials } from "@/content/testimonials";

/**
 * Voices — the testimonial band.
 *
 * The track is rendered twice so Phase 5 can translate it by exactly -50% and
 * loop seamlessly. The duplicate is `aria-hidden`, so a screen reader hears the
 * eight quotes once. Static here: it is a horizontal scroller until the marquee
 * arrives, which also happens to be the reduced-motion fallback.
 */
export function Voices() {
  return (
    <SectionShell id="voices" tone="canvas" padded={false} className="py-16 md:py-24">
      <div className="px-gutter">
        <div data-animate="rise">
          <Eyebrow>{sectionCopy.voices.eyebrow}</Eyebrow>
        </div>
        <h2 data-animate="lines" className="mt-4 max-w-[20ch] text-display-lg">
          {sectionCopy.voices.heading}
        </h2>
      </div>

      <div data-marquee-viewport className="mt-12 [scrollbar-width:thin] overflow-x-auto">
        <div data-marquee-track className="flex w-max gap-4 px-gutter pb-4">
          {[false, true].map((isClone) => (
            <ul
              key={String(isClone)}
              aria-hidden={isClone || undefined}
              className="flex w-max gap-4"
            >
              {testimonials.map((testimonial) => (
                <li
                  key={testimonial.id}
                  className="flex w-[min(24rem,78vw)] shrink-0 flex-col justify-between rounded-md bg-surface p-6 ring-1 ring-ink/10 ring-inset"
                >
                  <blockquote className="text-body-lg text-ink/85">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <p className="mt-6 text-caption text-ink/60">
                    <span className="text-ink/80">{testimonial.name}</span> ·{" "}
                    {testimonial.context}
                  </p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
