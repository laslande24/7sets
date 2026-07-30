import type { Metadata } from "next";
import { Jost } from "next/font/google";

import { SmoothScrollProvider } from "@/components/motion";
import "./globals.css";

// One family for display and body — the mockup uses a single geometric face.
// See docs/design/DESIGN-ANALYSIS.md §4.
const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

// Placeholder only. Full metadata, Open Graph and structured data land in Phase 7.
export const metadata: Metadata = {
  title: "7SETS — Tennis Academy",
  description:
    "Coaching for kids, teens and adults, from first swing to tournament play.",
};

/**
 * Marks <html> as scripted before the first paint.
 *
 * Every pre-animation hidden state in globals.css hangs off `[data-js]`, so a
 * reader with JavaScript disabled gets the finished page rather than a blank
 * one — and because this runs synchronously in <head>, there is no frame where
 * the content paints and is then hidden again.
 *
 * A data attribute rather than a class: React renders `className` on <html>, so
 * adding one behind its back is a hydration mismatch. React does not render
 * this attribute, so it leaves it alone.
 *
 * The timeout is the safety net. `data-js` only promises that scripting is on,
 * not that GSAP arrived — a failed chunk would otherwise leave every revealed
 * element hidden for good. `lib/gsap` sets `data-motion-ready` as soon as it
 * loads; if that has not happened within three seconds the pre-states are
 * dropped and the page shows itself.
 */
const MARK_AS_SCRIPTED = `document.documentElement.dataset.js="";setTimeout(function(){var d=document.documentElement;if(!d.hasAttribute("data-motion-ready"))d.removeAttribute("data-js")},3000)`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jost.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_AS_SCRIPTED }} />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
