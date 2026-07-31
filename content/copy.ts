/**
 * Section headings, standfirsts and the labels that repeat across sections.
 *
 * Nothing in `components/sections/` may hard-code a user-visible string. Two
 * reasons beyond tidiness: Phase 7 reads the page's wording to build structured
 * data and has to find it in one place, and a heading buried in JSX is a
 * heading nobody rereads.
 */

export type SectionCopy = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly standfirst?: string;
};

/**
 * The hero. Kept here with everything else rather than inline in the component,
 * because Phase 7 reads the page's wording from `content/` to build the
 * structured data and cannot go hunting through JSX for it.
 *
 * Copy note: the mockup reads "and adults rom first swing". That is a typo in
 * the mockup and we ship "from" — see docs/design/DESIGN-ANALYSIS.md section 6.
 */
export const heroCopy = {
  title: "Every Champion Starts Somewhere",
  standfirst:
    "Build confidence, master every shot, and fall in love with the game. Expert coaching for kids, teens, and adults from first swing to tournament play.",
  primaryCta: { label: "Book free trial", href: "#book" },
  secondaryCta: { label: "Explore programs", href: "#programs" },
  imageAlt: "A player sitting courtside on a blue hard court, racket across her knees",
} as const;

export const sectionCopy = {
  programs: {
    eyebrow: "Programs",
    heading: "Five ways in. One of them is yours.",
    standfirst:
      "Every player starts with the same free assessment, whichever of these they end up in.",
  },
  coaches: {
    eyebrow: "Coaches",
    heading: "Fourteen coaches. These six run the programmes.",
    standfirst:
      "Every one holds an enhanced DBS check and current LTA safeguarding certification.",
  },
  courts: {
    eyebrow: "Courts & Summer Camp 2026",
    heading: "Eleven courts, four minutes from the sea.",
    standfirst:
      "Floodlit until 22:00. Three courts stay indoors so a wet February does not end anyone’s season.",
  },
  membership: {
    eyebrow: "Membership",
    heading: "Membership is optional. Coaching is not.",
  },
  voices: {
    eyebrow: "Voices",
    heading: "What people say when we are not there.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Ten things people ask before they book.",
    standfirst:
      "If yours is not here, call us. The number is at the bottom of the page and a coach picks it up.",
  },
} as const satisfies Record<string, SectionCopy>;

/** Short strings reused by more than one component. */
export const labels = {
  programCard: {
    session: "Session",
    ratio: "Ratio",
    frequency: "Frequency",
    cta: "See dates",
  },
  membership: {
    billingLegend: "Billing period",
    featured: "Most chosen",
    perMonth: "per month",
    perYear: "per year",
    free: "Free",
  },
  camp: {
    dates: "Dates",
    price: "Price",
  },
  footer: {
    sections: "Sections",
    programs: "Programmes",
    visit: "Visit",
    placeholderNotice: "Placeholder identity — see docs/ASSETS.md.",
  },
  /**
   * Names for the horizontal rails. A scroll container that a keyboard can
   * reach is a control, and a control with no accessible name is announced as
   * "group" and nothing else.
   */
  rails: {
    programs: "Programmes, horizontal list",
    coaches: "Coaches, horizontal list",
    voices: "Testimonials, horizontal list",
    hint: "Use the left and right arrow keys to move through the list.",
  },
  carousel: {
    label: "Featured this season",
    /** `{{n}}` and `{{total}}` are substituted at render. */
    position: "Item {{n}} of {{total}}",
  },
  /**
   * What the custom cursor says over each kind of thing. Decorative — it is
   * `aria-hidden`, never the only label on anything, and a pointer-only device
   * never sees it.
   */
  cursor: {
    view: "View",
    play: "Play",
    drag: "Drag",
  },
} as const;
