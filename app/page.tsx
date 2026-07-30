import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
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
      <main className="flex flex-col gap-gutter py-gutter">
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
        <Footer />
      </main>
    </>
  );
}
