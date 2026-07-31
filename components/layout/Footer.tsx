import { SectionShell } from "@/components/ui";
import { labels } from "@/content/copy";
import { programs } from "@/content/programs";
import { sections, site } from "@/content/site";
import { SevenSetsMark } from "./SevenSetsMark";

/**
 * The practical layer.
 *
 * The NAP here is binding: Phase 7 emits `LocalBusiness` and
 * `SportsActivityLocation` from `content/site.ts`, and structured data that
 * disagrees with the visible page is a penalty rather than a nicety. The
 * address is marked up with `<address>` and the phone is a real `tel:` link.
 */
export function Footer() {
  const navSections = sections.filter((section) => section.id !== "hero");

  return (
    <SectionShell
      id="footer"
      tone="ink"
      padded={false}
      className="px-gutter py-16 md:py-20"
    >
      {/* The role is not redundant. `<footer>` is only a `contentinfo` landmark
          when its nearest sectioning ancestor is `<body>`, and this one is
          inside the plate's `<section>` — so without this the page has no
          contentinfo at all, which is exactly what the audit found. */}
      <footer role="contentinfo">
        <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2">
              <SevenSetsMark className="size-6" />
              <span className="text-label tracking-wide">{site.name}</span>
            </p>
            <p className="mt-4 max-w-[28ch] text-body text-surface/70">{site.baseline}</p>
          </div>

          <nav aria-label={labels.footer.sections} className="lg:col-span-2">
            <h2 className="text-caption tracking-wider text-surface/50 uppercase">
              {labels.footer.sections}
            </h2>
            <ul className="mt-4 space-y-2">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="rounded-xs text-body text-surface/80 underline-offset-4 hover:text-surface hover:underline focus-visible:focus-ring-invert"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-caption tracking-wider text-surface/50 uppercase">
              {labels.footer.programs}
            </h2>
            <ul className="mt-4 space-y-2">
              {programs.map((program) => (
                <li key={program.id}>
                  <a
                    href={program.href}
                    className="rounded-xs text-body text-surface/80 underline-offset-4 hover:text-surface hover:underline focus-visible:focus-ring-invert"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-caption tracking-wider text-surface/50 uppercase">
              {labels.footer.visit}
            </h2>
            <address className="mt-4 text-body text-surface/80 not-italic">
              {site.legalName}
              <br />
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region} {site.address.postalCode}
              <br />
              {site.address.country}
            </address>

            <p className="mt-4 space-x-3 text-body">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="rounded-xs tabular-nums underline underline-offset-4 focus-visible:focus-ring-invert"
              >
                {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="rounded-xs underline underline-offset-4 focus-visible:focus-ring-invert"
              >
                {site.email}
              </a>
            </p>

            <dl className="mt-6 space-y-1 text-caption text-surface/70">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-6 sm:max-w-xs">
                  <dt>{entry.days}</dt>
                  <dd className="tabular-nums">{entry.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-surface/15 pt-6 text-caption text-surface/60">
          <p>
            © {site.founded}–2026 {site.legalName}. {labels.footer.placeholderNotice}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[...site.social, ...site.legal].map((link) => (
              <li key={link.href}>
                {/* min-h-6 keeps these off WCAG 2.2 SC 2.5.8's 24px floor;
                    at caption size the text box alone is only 20px tall. */}
                <a
                  href={link.href}
                  className="inline-flex min-h-6 items-center rounded-xs underline-offset-4 hover:text-surface hover:underline focus-visible:focus-ring-invert"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </SectionShell>
  );
}
