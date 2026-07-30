import Image from "next/image";

import { SectionShell } from "@/components/ui";
import { Button, ButtonLink } from "@/components/ui/Button";
import heroCourt from "@/public/images/hero-court.jpg";
import { SummerCampCard } from "./hero/SummerCampCard";

/**
 * SET 01 — the hero.
 *
 * Static. Every animation named for this section — the clip-path opening, the
 * three-plane parallax, the line-by-line title reveal — is Phase 5. Getting it
 * right standing still is the whole job here.
 *
 * The plate is square-cornered and inset by `--spacing-plate`; its height comes
 * from `--hero-plate-h`, which keeps it inside 100dvh and, from 1280 up, inside
 * the mockup's 1.405 proportion.
 *
 * Copy note: the mockup reads "and adults rom first swing". That is a typo in
 * the mockup and we ship "from" — see docs/design/DESIGN-ANALYSIS.md section 6.
 */
export function Hero() {
  return (
    <SectionShell
      id="hero"
      tone="bare"
      padded={false}
      className="h-(--hero-plate-h) bg-court-900"
    >
      {/* `sizes` describes the plate, which is the viewport less its side
          margins — not the full width. */}
      <Image
        src={heroCourt}
        alt="A player sitting courtside on a blue hard court, racket across her knees"
        fill
        priority
        quality={85}
        placeholder="blur"
        sizes="(min-width: 1440px) calc(100vw - 168px), 88vw"
        className="object-cover object-[62%_38%]"
      />

      {/* Keeps the white title legible over the court. See the hero-scrim
          utility in app/globals.css for why it is two gradients. */}
      <div aria-hidden="true" className="absolute inset-0 hero-scrim" />

      <div className="relative flex h-full flex-col justify-end px-gutter pt-nav-y pb-10 xl:pb-24">
        {/* 11em holds "Every Champion Starts" on one line and pushes
            "Somewhere" onto the next, and it scales with the type rather than
            with the viewport. Deliberately not text-balance: balancing splits
            it "Every Champion / Starts Somewhere", which is not the break the
            mockup uses. */}
        <h1 className="max-w-[11em] text-display-xl text-surface">
          Every Champion Starts Somewhere
        </h1>

        <p className="mt-7 max-w-[31rem] text-body text-surface/90">
          Build confidence, master every shot, and fall in love with the game. Expert
          coaching for kids, teens, and adults from first swing to tournament play.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button>Book free trial</Button>
          <ButtonLink href="#programs" variant="secondary">
            Explore programs
          </ButtonLink>
        </div>

        <SummerCampCard className="mt-8 xl:absolute xl:top-30 xl:right-16 xl:mt-0" />
      </div>
    </SectionShell>
  );
}
