import { Eyebrow, SectionShell } from "@/components/ui";
import { manifesto } from "@/content/manifesto";

/**
 * SET 02 — the ten seconds after the hero.
 *
 * The four figures carry `data-count-to`, which is what Phase 5 counts up from
 * zero. The rendered text is already the final value, so the section reads
 * correctly with JavaScript off and under reduced motion.
 */
export function Manifesto() {
  return (
    <SectionShell id="manifesto">
      <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow set={2}>{manifesto.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-lg">{manifesto.title}</h2>
        </div>

        <div className="space-y-5 lg:col-span-6 lg:col-start-7">
          {manifesto.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="max-w-prose text-body-lg text-ink/70"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-gutter gap-y-10 border-t border-ink/12 pt-10 lg:mt-24 lg:grid-cols-4">
        {manifesto.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span
                data-count-to={stat.value}
                className="block text-display-lg tabular-nums"
              >
                {stat.value}
                {stat.suffix ?? ""}
              </span>
              <span className="mt-1 block text-label lowercase">{stat.label}</span>
              <span className="mt-3 block max-w-[26ch] text-caption text-ink/60">
                {stat.detail}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
