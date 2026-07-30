/** SET 03 — the five programmes, in the order a family works through them. */

export type Program = {
  readonly id: string;
  readonly name: string;
  readonly ages: string;
  readonly sessionLength: string;
  readonly ratio: string;
  readonly frequency: string;
  readonly price: string;
  readonly priceNote: string;
  readonly summary: string;
  readonly includes: readonly [string, string, string];
  readonly href: string;
};

export const programs: readonly Program[] = [
  {
    id: "little-aces",
    name: "Little Aces",
    ages: "4–7",
    sessionLength: "45 min",
    ratio: "1 coach : 6 players",
    frequency: "Once or twice a week",
    price: "£16",
    priceNote: "per session",
    summary:
      "Red ball, low-bounce, on a third-size court. Most of it looks like a game because at this age that is the only thing that works.",
    includes: [
      "Racket provided until they own one",
      "Parents stay courtside — no drop-off before six",
      "Termly report card, one side of A4",
    ],
    href: "#programs",
  },
  {
    id: "juniors",
    name: "Juniors",
    ages: "8–13",
    sessionLength: "60 min",
    ratio: "1 coach : 6 players",
    frequency: "Two or three times a week",
    price: "£22",
    priceNote: "per session",
    summary:
      "Orange then green ball, full court by eleven. Serve and return get their own block every week, because they are what decides junior matches.",
    includes: [
      "Match play every third session",
      "Entry to the internal Saturday ladder",
      "Twelve-weekly reassessment and regrouping",
    ],
    href: "#programs",
  },
  {
    id: "teens-performance",
    name: "Teens Performance",
    ages: "14–17",
    sessionLength: "90 min",
    ratio: "1 coach : 4 players",
    frequency: "Four times a week",
    price: "£180",
    priceNote: "per month",
    summary:
      "For players entering county events. Two technical sessions, one physical, one match-play block, and a tournament calendar we plan with you in September.",
    includes: [
      "Video review after every match-play block",
      "Strength and conditioning with a S&C coach",
      "Tournament entry planning and travel notes",
    ],
    href: "#programs",
  },
  {
    id: "adults",
    name: "Adults",
    ages: "18+",
    sessionLength: "60 min",
    ratio: "1 coach : 8 players",
    frequency: "Weekly, or drop in",
    price: "£16",
    priceNote: "per session",
    summary:
      "Four standing groups by level, from never-held-a-racket to club team. Book the block or pay as you go — the drop-in group runs Tuesday and Thursday at 19:00.",
    includes: [
      "Cardio Tennis on Monday and Friday, 07:00",
      "Doubles clinic on the first Sunday of the month",
      "Rackets to borrow for the first four weeks",
    ],
    href: "#programs",
  },
  {
    id: "elite-pathway",
    name: "Elite Pathway",
    ages: "By selection",
    sessionLength: "2 × 90 min",
    ratio: "1 coach : 2 players",
    frequency: "Ten sessions a week",
    price: "By assessment",
    priceNote: "funded places available",
    summary:
      "Twelve places, reviewed every June. Players train around school hours with a written annual plan. We will tell you honestly if your child is not ready.",
    includes: [
      "Individual annual plan, reviewed each term",
      "Physio and nutrition sessions included",
      "Two funded places held each year",
    ],
    href: "#programs",
  },
];
