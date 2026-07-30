import { z } from "zod";

/**
 * One schema, used by the browser and by the Server Action.
 *
 * The client validates for speed and for good error messages; the server
 * validates because the client's answer cannot be trusted. Sharing the schema is
 * what stops those two drifting apart.
 *
 * Messages say what to do, never "invalid". A reader who has just been told
 * their input is invalid still does not know what would be valid.
 */

export const LEVELS = ["beginner", "improver", "intermediate", "advanced"] as const;
export const SLOTS = ["weekday-morning", "weekday-evening", "saturday", "sunday"] as const;

export const bookingSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Tell us your first name.")
    .max(60, "That is longer than we can store — 60 characters at most."),
  lastName: z
    .string()
    .trim()
    .min(1, "Tell us your last name.")
    .max(60, "That is longer than we can store — 60 characters at most."),
  email: z
    .string()
    .trim()
    .min(1, "We need an email address to confirm the session.")
    .email("That address is missing an @ or a domain — check it and try again."),
  phone: z
    .string()
    .trim()
    .min(6, "A phone number helps us reach you if the courts flood. Six digits or more.")
    .max(24, "That is longer than any phone number we can dial.")
    .regex(/^[\d\s+()-]+$/, "Digits, spaces and + ( ) - only."),
  playerAge: z.coerce
    .number({ message: "Enter the player's age in years." })
    .int("Whole years, please.")
    .min(4, "Little Aces starts at 4. Younger than that and we would rather you waited.")
    .max(99, "Enter the age in years."),
  level: z.enum(LEVELS, { message: "Pick the level that fits best." }),
  slot: z.enum(SLOTS, { message: "Pick a slot that suits you." }),
  message: z
    .string()
    .trim()
    .max(600, "Keep it under 600 characters — you can tell us the rest on court.")
    .optional()
    .or(z.literal("")),
  /** Honeypot. Real people never see this field, so a value in it is a bot. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingValues = z.output<typeof bookingSchema>;

export type BookingResult =
  | { status: "success"; reference: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<string, string>> };
