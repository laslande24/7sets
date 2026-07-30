/**
 * Everything the site says about itself in one place.
 *
 * PLACEHOLDER IDENTITY. 7SETS is a fictional academy. The address, phone,
 * email, prices and coach records below are invented but internally consistent,
 * which is what matters: Phase 7 emits `LocalBusiness` and `SportsActivityLocation`
 * structured data, and structured data that disagrees with the visible page is a
 * penalty. Change these values here and the whole site follows.
 *
 * The phone number is inside Ofcom's 01273 496 0xxx drama range, so it cannot
 * connect to a real line. The domain and postcode are plausible rather than
 * verified — both need checking before this ever goes to a real client.
 */

export type OpeningHours = {
  readonly days: string;
  readonly hours: string;
};

export const site = {
  name: "7SETS",
  legalName: "7SETS Tennis Academy",
  baseline: "Tennis coaching in Hove, from first swing to tournament play.",
  founded: 2009,

  address: {
    street: "14 Kingsway",
    locality: "Hove",
    region: "East Sussex",
    postalCode: "BN3 2LP",
    country: "United Kingdom",
  },

  phone: "+44 1273 496 0117",
  phoneDisplay: "01273 496 0117",
  email: "hello@7sets.co.uk",

  /** Ordered Monday first. Phase 7 turns this into openingHoursSpecification. */
  hours: [
    { days: "Monday – Friday", hours: "07:00 – 22:00" },
    { days: "Saturday", hours: "08:00 – 20:00" },
    { days: "Sunday", hours: "08:00 – 18:00" },
  ] as readonly OpeningHours[],

  social: [
    { label: "Instagram", href: "https://instagram.com/7sets" },
    { label: "YouTube", href: "https://youtube.com/@7sets" },
    { label: "LinkedIn", href: "https://linkedin.com/company/7sets" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Safeguarding", href: "/safeguarding" },
  ],
} as const;

/** The seven sets plus the framing blocks, in the order they appear. */
export const sections = [
  { id: "hero", label: "Home", set: 1 },
  { id: "manifesto", label: "About", set: 2 },
  { id: "programs", label: "Programs", set: 3 },
  { id: "method", label: "Method", set: 4 },
  { id: "coaches", label: "Coaches", set: 5 },
  { id: "courts", label: "Courts", set: 6 },
  { id: "membership", label: "Membership", set: 7 },
  { id: "voices", label: "Voices" },
  { id: "faq", label: "FAQ" },
  { id: "match-point", label: "Contact" },
] as const;

/** The four the mockup puts in the floating nav, in its order. */
export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#manifesto" },
  { label: "Programs", href: "#programs" },
  { label: "Contact", href: "#match-point" },
] as const;

export const matchPoint = {
  eyebrow: "Match point",
  title: "Book a court. Bring a racket. We do the rest.",
  body: "First session is free, whatever your level. Forty-five minutes, one coach, no sales pitch at the end.",
  cta: { label: "Book free trial", href: "#match-point" },
  secondary: {
    label: `Call ${site.phoneDisplay}`,
    href: `tel:${site.phone.replace(/\s/g, "")}`,
  },
} as const;
