import type { Metadata } from "next";
import { Jost } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
