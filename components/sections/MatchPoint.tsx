import { Button, ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { matchPoint } from "@/content/site";

/**
 * Match Point — the last CTA.
 *
 * Full-height on a deep plate with one thing to do. Phase 5 sends a ball across
 * it and pulses the CTA on impact; the weight has to be there before any of
 * that, which is what the height and the display-xl are for.
 */
export function MatchPoint() {
  return (
    <SectionShell
      id="match-point"
      tone="deep"
      padded={false}
      className="flex min-h-svh flex-col justify-end px-gutter py-16 md:py-24"
    >
      <div data-animate="rise">
        <Eyebrow onDark>{matchPoint.eyebrow}</Eyebrow>
      </div>
      <h2 data-animate="lines" className="mt-6 max-w-[16ch] text-display-xl">
        {matchPoint.title}
      </h2>
      <p data-animate="rise" className="mt-6 max-w-[42ch] text-body-lg text-surface/75">
        {matchPoint.body}
      </p>

      {/* The ball Phase 5 sends across the plate. Decorative and off-screen at
          rest, so it costs nothing when the animation does not run. */}
      <span
        aria-hidden="true"
        data-matchpoint-ball
        className="pointer-events-none absolute bottom-24 left-0 hidden size-6 rounded-full bg-lime shadow-[0_0_24px_rgba(132,204,22,0.45)] lg:block"
        style={{ opacity: 0 }}
      />

      <div data-animate="rise" className="mt-10 flex flex-wrap items-center gap-2.5">
        <Button size="lg">{matchPoint.cta.label}</Button>
        <ButtonLink href={matchPoint.secondary.href} variant="secondary" size="lg">
          {matchPoint.secondary.label}
        </ButtonLink>
      </div>
    </SectionShell>
  );
}
