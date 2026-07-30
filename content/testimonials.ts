/**
 * Voices — the marquee band.
 *
 * Invented, like everything else on this site, and written to sound like people
 * rather than like reviews. Note for Phase 7: AggregateRating must NOT be
 * emitted from these. Fabricated ratings in structured data are a policy
 * problem, not a copy problem.
 */

export type Testimonial = {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  /** Who they are relative to the academy — this is what makes a quote land. */
  readonly context: string;
};

export const testimonials: readonly Testimonial[] = [
  {
    id: "t1",
    quote:
      "They moved Aisha down a group in her second term and explained exactly why. I was annoyed for a week. She has not missed a session since.",
    name: "Priya R.",
    context: "Parent, Juniors",
  },
  {
    id: "t2",
    quote:
      "I booked the trial expecting a sales pitch at the end. Got a group and a start date.",
    name: "Mark T.",
    context: "Adults, started 2024",
  },
  {
    id: "t3",
    quote:
      "First club where the coach knew my name in week two. Small thing. Changes whether you come back.",
    name: "Elena V.",
    context: "Adults, beginner group",
  },
  {
    id: "t4",
    quote:
      "The Monday video review is the reason I stopped losing the same way. Nobody had shown me the pattern before.",
    name: "Josh A.",
    context: "Teens Performance, 16",
  },
  {
    id: "t5",
    quote:
      "Two of my three play. The third comes for the practice wall and the chips. Still counts.",
    name: "Dan H.",
    context: "Parent, Little Aces",
  },
  {
    id: "t6",
    quote:
      "I took it up at sixty-eight. Nobody made a thing of it, which was the only thing I wanted.",
    name: "Margaret S.",
    context: "Adults, started 2023",
  },
  {
    id: "t7",
    quote:
      "They told us Leo was not ready for the Elite trial and gave us the two things to work on. He got in the next June.",
    name: "Caroline B.",
    context: "Parent, Elite Pathway",
  },
  {
    id: "t8",
    quote:
      "Indoor courts in February is the whole reason I still play. Everything else is a bonus.",
    name: "Femi O.",
    context: "Member since 2019",
  },
];
