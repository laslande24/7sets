/** SET 04 — the four steps, and the SVG path that links them in Phase 5. */

export type MethodStep = {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly body: string;
};

export const method = {
  eyebrow: "The method",
  title: "Four steps. We tell you which one you are on.",
  body: "Nobody moves up because a term ended. They move up when the coach can show you why.",
  steps: [
    {
      id: "assess",
      title: "Assess",
      duration: "45 minutes, once",
      body: "One session before you pay for anything. Grip, contact point, movement, and what you actually want from the game. You leave with a group and a reason.",
    },
    {
      id: "drill",
      title: "Drill",
      duration: "Weeks 1–6",
      body: "One technical priority at a time, repeated until it holds under pressure. Two priorities at once is how players end up with neither.",
    },
    {
      id: "play",
      title: "Play",
      duration: "Weeks 4–12",
      body: "Points from week four, not week twelve. Drilling a shot you never have to choose under pressure teaches you very little about tennis.",
    },
    {
      id: "compete",
      title: "Compete",
      duration: "Ongoing",
      body: "The Saturday ladder for everyone, county events for those who want them. Every match is reviewed on the Monday, win or lose.",
    },
  ] as readonly MethodStep[],

  /**
   * A single cubic path across a 1000 × 260 viewBox. Phase 5 draws it with
   * DrawSVGPlugin and sends a ball along it with MotionPath, so the four
   * anchors below have to stay in step with the four steps above.
   */
  path: {
    id: "method-path",
    viewBox: "0 0 1000 260",
    d: "M 40 190 C 170 60, 270 60, 370 130 S 570 220, 660 130 S 860 40, 960 110",
    /** Fractions along the path where each step sits, 0 → 1. */
    anchors: [0, 0.34, 0.67, 1],
  },
} as const;
