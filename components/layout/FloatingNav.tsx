import { IconGrip, Pill } from "@/components/ui";
import { navLinks, site } from "@/content/site";
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
              className="flex items-center gap-2 self-stretch rounded-xs text-label uppercase focus-visible:focus-ring"
            >
              <span
                aria-hidden="true"
                className="size-1 shrink-0 rounded-full bg-current"
              />
              {link.label}
            </a>
          ))}
        </Pill>

        <IconGrip />
      </nav>
    </header>
  );
}
