import { LEVELS, SLOTS } from "@/lib/booking";

/** Copy for the trial booking. Nothing here is decided in the component. */
export const booking = {
  id: "book",
  eyebrow: "Book a free trial",
  heading: "One session. No card, no commitment.",
  standfirst:
    "Forty-five minutes on court with a coach who will tell you honestly where to start. We reply within one working day and hold the slot for 48 hours.",
  fields: {
    firstName: { label: "First name", autoComplete: "given-name" },
    lastName: { label: "Last name", autoComplete: "family-name" },
    email: { label: "Email", autoComplete: "email" },
    phone: { label: "Phone", autoComplete: "tel" },
    playerAge: { label: "Player's age", hint: "In years. Little Aces starts at 4." },
    level: { label: "Level" },
    slot: { label: "Preferred slot" },
    message: {
      label: "Anything we should know?",
      hint: "Injuries, kit, a nervous eight-year-old.",
    },
  },
  levels: {
    beginner: "Never held a racket",
    improver: "Played a bit",
    intermediate: "Play regularly",
    advanced: "Compete",
  } satisfies Record<(typeof LEVELS)[number], string>,
  slots: {
    "weekday-morning": "Weekday mornings",
    "weekday-evening": "Weekday evenings",
    saturday: "Saturday",
    sunday: "Sunday",
  } satisfies Record<(typeof SLOTS)[number], string>,
  submit: "Book the session",
  submitting: "Sending…",
  success: {
    heading: "Booked. Look out for an email.",
    body: "A coach will reply within one working day with two or three times that fit. The slot is held for 48 hours. If nothing arrives, check spam and then call us.",
    referenceLabel: "Your reference",
    again: "Book another session",
  },
  optional: "optional",
} as const;
