/**
 * FAQ — the single source for the Phase 7 `FAQPage` structured data.
 *
 * Every answer leads with the answer in its first sentence. That is what makes
 * a passage quotable by an AI overview, and it is also just how a person asks
 * to be answered. Never duplicate these strings into the JSON-LD by hand.
 */

export type FaqItem = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export const faq: readonly FaqItem[] = [
  {
    id: "trial",
    question: "Is the first session really free?",
    answer:
      "Yes — one 45-minute assessment, no card details, no obligation. You leave knowing which group suits you and what it costs. If nothing fits, we say so.",
  },
  {
    id: "equipment",
    question: "Does my child need their own racket?",
    answer:
      "No. We lend rackets to every player under twelve for as long as they need one, and to adults for their first four weeks. When you do buy, ask the coach first — the wrong grip size undoes a term of work.",
  },
  {
    id: "never-played",
    question: "I have never played. Am I too old to start?",
    answer:
      "No. Our adult beginner group starts from scratch every September and January, and the average age in it is forty-four. The oldest player to join us started at seventy-one, in 2023.",
  },
  {
    id: "groups",
    question: "How are groups decided?",
    answer:
      "By assessment, not by age or by how long you have been here. Every player is reassessed every twelve weeks, and we move people up or down with an explanation. Groups are capped at six, or four in Teens Performance.",
  },
  {
    id: "weather",
    question: "What happens if it rains?",
    answer:
      "Junior and Performance sessions move indoors — we hold three indoor courts back for exactly this. Adult group sessions are cancelled and credited to your account if the courts are unplayable at the start time.",
  },
  {
    id: "missed",
    question: "Can we make up a missed session?",
    answer:
      "Yes, within the same term, subject to space in an equivalent group. Tell us before the session where possible. We do not refund missed sessions, but we do not cap how many you make up.",
  },
  {
    id: "cost",
    question: "What does a term actually cost?",
    answer:
      "A once-a-week junior term of twelve sessions is £264, and twice a week is £475. Adults pay £16 a session or £11 with a membership. Nothing is added at the door — racket loan, court hire for your session and the Saturday ladder are all in.",
  },
  {
    id: "membership-needed",
    question: "Do I have to be a member to book coaching?",
    answer:
      "No. Every programme is open to non-members at the standard rate. Membership pays for itself at roughly two sessions a week, and the plan comparison is above.",
  },
  {
    id: "competition",
    question: "Will my child have to compete?",
    answer:
      "Only if they want to. The Saturday ladder is internal, low-key and optional, and plenty of players never enter a tournament. Competitive play is a route through the club, not the point of it.",
  },
  {
    id: "safeguarding",
    question: "What are your safeguarding arrangements?",
    answer:
      "Every coach holds an enhanced DBS check and current LTA safeguarding certification, and we hold a named Welfare Officer on site during all junior sessions. Our policy is published in full and we will send it to you before your child's first session.",
  },
];
