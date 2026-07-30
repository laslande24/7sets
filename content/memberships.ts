/** SET 07 — three plans. The middle one is meant to be the easy answer. */

export type BillingPeriod = "monthly" | "annual";

export type Membership = {
  readonly id: string;
  readonly name: string;
  readonly forWhom: string;
  /** Price in pounds for each billing period. Annual is ten months' worth. */
  readonly price: Readonly<Record<BillingPeriod, number>>;
  readonly includes: readonly string[];
  readonly featured?: boolean;
  readonly cta: string;
};

export const billingLabels: Readonly<Record<BillingPeriod, string>> = {
  monthly: "Monthly",
  annual: "Annual",
};

/** Shown next to the toggle so the saving is stated, not implied. */
export const annualNote = "Pay annually and two months are free.";

export const memberships: readonly Membership[] = [
  {
    id: "casual",
    name: "Casual",
    forWhom: "For playing when the week allows it.",
    price: { monthly: 0, annual: 0 },
    includes: [
      "Court hire at £12 an hour off-peak",
      "Drop-in adult sessions at £16",
      "Book up to three days ahead",
      "No minimum term",
    ],
    cta: "Start without a plan",
  },
  {
    id: "member",
    name: "Member",
    forWhom: "For one or two sessions a week, most weeks.",
    price: { monthly: 46, annual: 460 },
    includes: [
      "Unlimited off-peak court hire",
      "Adult group sessions at £11",
      "Book fourteen days ahead",
      "Saturday ladder entry included",
      "Two guest passes a month",
    ],
    featured: true,
    cta: "Join as a member",
  },
  {
    id: "performance",
    name: "Performance",
    forWhom: "For players training three times a week or more.",
    price: { monthly: 89, annual: 890 },
    includes: [
      "Unlimited court hire, peak and off-peak",
      "All adult group sessions included",
      "Book twenty-eight days ahead",
      "One S&C session a week",
      "Quarterly video review",
      "Priority on camp and clinic places",
    ],
    cta: "Join Performance",
  },
];
