import Image from "next/image";

import { SectionShell } from "@/components/ui";
import { ButtonLink } from "@/components/ui/Button";
import { heroCopy } from "@/content/copy";
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
 * Both CTAs are links, not buttons. The primary one goes to the booking form —
 * it was a `<button>` with no handler until Phase 6, which is to say the page's
 * main call to action did nothing at all.
 */
export function Hero() {
  return (
    <SectionShell
      id="hero"
      tone="bare"
      padded={false}
      data-animate="expand"
      className="h-(--hero-plate-h) bg-court-900"
    >
      {/* `sizes` describes the plate, which is the viewport less its side
          margins — not the full width. */}
      <Image
        src={heroCourt}
        alt={heroCopy.imageAlt}
        fill
        priority
        quality={85}
        placeholder="blur"
        sizes="(min-width: 1440px) calc(100vw - 168px), 88vw"
        data-hero-media
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
        <h1 data-hero-title className="max-w-[11em] text-display-xl text-surface">
          {heroCopy.title}
        </h1>

        <p data-hero-copy className="mt-7 max-w-[31rem] text-body text-surface/90">
          {heroCopy.standfirst}
        </p>

        <div data-hero-copy className="mt-5 flex flex-wrap items-center gap-2.5">
          <ButtonLink href={heroCopy.primaryCta.href}>
            {heroCopy.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={heroCopy.secondaryCta.href} variant="secondary">
            {heroCopy.secondaryCta.label}
          </ButtonLink>
        </div>

        <SummerCampCard
          data-hero-card
          className="mt-8 xl:absolute xl:top-30 xl:right-16 xl:mt-0"
        />
      </div>
    </SectionShell>
  );
}
