/**
 * SET 05 — the coaching staff.
 *
 * These people are invented, and so are their records. That is why they are
 * drawn as initial monograms rather than illustrated with stock headshots:
 * putting a fabricated playing record and a fabricated safeguarding role on a
 * real photographed person is not a thing to do, even in a demo. Real
 * photography replaces the monograms — see docs/ASSETS.md.
 */

export type Coach = {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly role: string;
  readonly speciality: string;
  /** One believable line. No superlatives, no unverifiable claims. */
  readonly record: string;
  readonly years: number;
};

export const coaches: readonly Coach[] = [
  {
    id: "n-adeyemi",
    name: "Nadia Adeyemi",
    initials: "NA",
    role: "Head of Coaching",
    speciality: "Serve and return",
    record: "LTA Level 5. Coached two players onto the national 18U tour.",
    years: 19,
  },
  {
    id: "t-varga",
    name: "Tomas Varga",
    initials: "TV",
    role: "Performance Coach",
    speciality: "Clay-court movement",
    record: "Former ITF Futures player. Slovak national junior squad, 2011–2014.",
    years: 12,
  },
  {
    id: "r-okonkwo",
    name: "Ruth Okonkwo",
    initials: "RO",
    role: "Head of Juniors",
    speciality: "Ages 4–11",
    record: "LTA Level 4 and Youth Start tutor. Trains our junior coaching team.",
    years: 14,
  },
  {
    id: "j-mcallister",
    name: "Jamie McAllister",
    initials: "JM",
    role: "Adult Programme Lead",
    speciality: "Adult beginners and doubles",
    record: "Sussex county doubles, 2016–2019. Runs the Tuesday drop-in.",
    years: 9,
  },
  {
    id: "s-benali",
    name: "Sofia Benali",
    initials: "SB",
    role: "Strength & Conditioning",
    speciality: "Injury prevention, 14+",
    record: "MSc Sport Rehabilitation. Six years in academy tennis before 7SETS.",
    years: 7,
  },
  {
    id: "d-fairbairn",
    name: "Douglas Fairbairn",
    initials: "DF",
    role: "Elite Pathway",
    speciality: "Match tactics and video",
    record: "LTA Level 5. Runs the Monday review for every competing player.",
    years: 22,
  },
];
