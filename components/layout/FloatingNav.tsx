import { Pill } from "@/components/ui";
import { navLinks, site } from "@/content/site";
import { NavMenu } from "./NavMenu";
import { SevenSetsMark } from "./SevenSetsMark";

/**
 * The floating nav: three separate blocks with 8px gaps, not one pill.
 *
 * It is `fixed` rather than `sticky` because the plate that it visually belongs
 * to clips its own overflow, so a sticky child inside it would never stick. The
 * offsets are built from `--spacing-nav-x` / `--spacing-nav-y`, which resolve to
 * the mockup's measured inset from the plate corner, so at the top of the page
 * it lands exactly where the mockup draws it.
 *
 * No scroll behaviour here. The contraction and the mobile hide-on-scroll are
 * Phase 5; the full-screen mobile menu is Phase 6.
 */

export function FloatingNav() {
  return (
    <header className="fixed top-nav-y left-nav-x z-50">
      <nav aria-label="Main" className="flex items-center gap-2">
        <Pill className="gap-2 pr-4 pl-3">
          <SevenSetsMark className="size-6" />
          <span className="text-label tracking-wide">{site.name}</span>
        </Pill>

        <Pill className="hidden gap-8 md:inline-flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              /* self-stretch makes each link fill the 40px block rather than
                 sit at its 18px text height, which is what WCAG 2.2 SC 2.5.8
                 needs (24px minimum). It changes the hit area, not the look. */
              /* The underline draws in from the left and retracts to the right
                 — asymmetric on purpose, because a rule that leaves the way it
                 arrived reads as a toggle rather than a gesture. */
              className="group/link flex items-center gap-2 self-stretch rounded-xs text-label uppercase focus-visible:focus-ring"
            >
              <span
                aria-hidden="true"
                className="size-1 shrink-0 rounded-full bg-current"
              />
              <span className="relative">
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-(--dur-base) ease-out-quart group-hover/link:origin-left group-hover/link:scale-x-100 group-focus-visible/link:origin-left group-focus-visible/link:scale-x-100 motion-reduce:transition-none"
                />
              </span>
            </a>
          ))}
        </Pill>

        <NavMenu links={navLinks} />
      </nav>
    </header>
  );
}
