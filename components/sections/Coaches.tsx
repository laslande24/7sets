import { Eyebrow, SectionShell } from "@/components/ui";
import { coaches } from "@/content/coaches";
import { sectionCopy } from "@/content/copy";

/**
 * SET 05 — the coaching staff.
 *
 * Deliberately drawn as initial monograms rather than photographs. The people
 * are invented and so are their records; attaching a fabricated playing history
 * and a fabricated safeguarding role to a real photographed person is not
 * something to do, even in a portfolio build. Real photography replaces these —
 * see docs/ASSETS.md — and the markup below is already the shape it needs.
 *
 * `data-coach-card` and the `group` are the hooks Phase 5 uses for the masked
 * cascade and the hover reveal.
 */
export function Coaches() {
  return (
    <SectionShell id="coaches">
      <Eyebrow set={5}>{sectionCopy.coaches.eyebrow}</Eyebrow>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-gutter gap-y-4">
        <h2 className="max-w-[20ch] text-display-lg">{sectionCopy.coaches.heading}</h2>
        <p className="max-w-[34ch] text-body text-ink/70">
          {sectionCopy.coaches.standfirst}
        </p>
      </div>

      {/* Six stacked cards is a 3,400px scroll on a phone, so below 640 this is
          a snap carousel and above it a grid — which is also what
          docs/CONTENT-ARCHITECTURE.md specifies for this set. */}
      <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-x-gutter sm:gap-y-10 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
        {coaches.map((coach) => (
          <li
            key={coach.id}
            data-coach-card
            className="group w-[min(17rem,72vw)] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <div className="relative overflow-hidden rounded-md bg-court">
              <div
                aria-hidden="true"
                className="grid aspect-[4/5] place-items-center bg-linear-to-br from-court-600 to-court-900"
              >
                <span className="text-display-xl text-surface/25">{coach.initials}</span>
              </div>

              {/* Phase 5 raises this from the bottom edge on hover. Static for now,
                  and always present so the record is never keyboard-inaccessible. */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-court-950/90 to-transparent p-4 pt-10">
                <p className="text-caption text-surface/85">{coach.record}</p>
              </div>
            </div>

            <h3 className="mt-4 text-display-md">{coach.name}</h3>
            <p className="text-label text-ink/70">{coach.role}</p>
            <p className="mt-2 text-caption text-ink/60">
              {coach.speciality} · {coach.years} years coaching
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
