/** SET 06 — the site itself, then the seasonal hook. */

/** Drives the asymmetric gallery. The layout is data, not six hard-coded divs. */
export type Tile = "wide" | "tall" | "regular";

export type Facility = {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly tile: Tile;
};

export const facilities: readonly Facility[] = [
  {
    id: "hard-courts",
    src: "/images/facility-lines.jpg",
    alt: "The corner of a blue hard court, white tramlines meeting on a green surround",
    caption: "Six outdoor hard courts",
    tile: "wide",
  },
  {
    id: "grounds",
    src: "/images/facility-outdoor.jpg",
    alt: "A tennis court seen from above, ringed by mature trees",
    caption: "Sheltered from the seafront wind",
    tile: "tall",
  },
  {
    id: "clay-overhead",
    src: "/images/facility-texture.jpg",
    alt: "A clay court photographed from directly above, tree shadows across the surface",
    caption: "Two clay courts, April to October",
    tile: "tall",
  },
  {
    id: "clay-lines",
    src: "/images/facility-clay.jpg",
    alt: "Freshly marked white lines on a clay court",
    caption: "Clay relaid every spring",
    tile: "regular",
  },
  {
    id: "balls",
    src: "/images/facility-ball.jpg",
    alt: "A yellow tennis ball resting on the court surface",
    caption: "Balls changed every session",
    tile: "regular",
  },
  {
    id: "coaching",
    src: "/images/facility-play.jpg",
    alt: "A player mid-rally, photographed from above the baseline",
    caption: "Coaching from 07:00, seven days",
    tile: "regular",
  },
];

export const summerCamp = {
  eyebrow: "Summer Camp 2026",
  badge: "Exclusive",
  title: "Five days. Nine to four. Ages seven to sixteen.",
  body: "Two coaching blocks a day, lunch on site, and a Friday tournament every player finishes. Groups are set on the Monday morning after a short assessment, not by age alone.",
  dates: "15 – 19 July 2026",
  price: "£245",
  priceNote: "per week · £220 for members",
  image: {
    src: "/images/camp-feature.jpg",
    alt: "A player holding a racket and ball on a sunlit court",
  },
  includes: [
    "Ten coached hours across the week",
    "Lunch, fruit and water each day",
    "Friday tournament with a written summary",
    "Ratio held at one coach to six players",
  ],
  cta: { label: "Reserve a place", href: "#match-point" },
} as const;
