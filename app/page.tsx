import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { ScoreRail } from "@/components/layout/ScoreRail";
import { SectionMotion, SignatureMotion } from "@/components/motion";
import { BookTrial } from "@/components/sections/BookTrial";
import { Coaches } from "@/components/sections/Coaches";
import { Courts } from "@/components/sections/Courts";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { MatchPoint } from "@/components/sections/MatchPoint";
import { Membership } from "@/components/sections/Membership";
import { Method } from "@/components/sections/Method";
import { Programs } from "@/components/sections/Programs";
import { Voices } from "@/components/sections/Voices";

/**
 * The page is a stack of square-cornered plates on the pale canvas, gapped by
 * the gutter. Seven sets, four framing blocks — see docs/CONTENT-ARCHITECTURE.md.
 */
export default function Home() {
  return (
    <>
      <FloatingNav />
      <ScoreRail />
      <SectionMotion />
      <SignatureMotion />
      {/* First stop for a keyboard, and the only way past a fixed nav and a
          full-height hero without twenty tab presses. */}
      <a
        href="#main"
        className="sr-only rounded-sm bg-surface px-4 py-3 text-label uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus-visible:focus-ring"
      >
        Skip to content
      </a>

      <main id="main" className="flex flex-col gap-gutter py-gutter">
        <Hero />
        <Manifesto />
        <Programs />
        <Method />
        <Coaches />
        <Courts />
        <Membership />
        <Voices />
        <Faq />
        <MatchPoint />
        <BookTrial />
      </main>

      {/* Outside main: a footer is a sibling landmark, not page content. */}
      <div className="pb-gutter">
        <Footer />
      </div>
    </>
  );
}
