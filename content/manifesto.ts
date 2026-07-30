/** SET 02 — why this academy, and the four numbers that back it. */

export type Stat = {
  /** Phase 5 counts to this from zero; it goes in a data attribute. */
  readonly value: number;
  /** Rendered after the number: "11 courts", "640 members". */
  readonly label: string;
  /** Appended to the figure itself, e.g. "+" on 640. */
  readonly suffix?: string;
  readonly detail: string;
};

export const manifesto = {
  eyebrow: "Why 7SETS",
  title: "Coaching that survives contact with a real week.",
  body: [
    "Most people who quit tennis quit in the first eight weeks. Not because they lack talent — because the coaching assumed they had four free evenings and a lift to the club. We build around the week people actually have.",
    "Every player is assessed before their first paid session, then again every twelve weeks. Groups are capped at six. If a player is in the wrong group, we move them, and we tell you why.",
  ],
  stats: [
    {
      value: 11,
      label: "courts",
      detail: "Six outdoor hard, three indoor, two clay. Floodlit until 22:00.",
    },
    {
      value: 14,
      label: "LTA-licensed coaches",
      detail: "All Level 3 or above. Four hold the Performance Coach award.",
    },
    {
      value: 640,
      suffix: "+",
      label: "active members",
      detail: "From four-year-olds to a 71-year-old who took up the game in 2023.",
    },
    {
      value: 17,
      label: "years on this site",
      detail: "Two courts and one coach in 2009. Same clubhouse, more courts.",
    },
  ] as readonly Stat[],
} as const;
