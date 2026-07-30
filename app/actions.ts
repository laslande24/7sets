"use server";

import { headers } from "next/headers";

import { bookingSchema, type BookingResult } from "@/lib/booking";

/**
 * The booking Server Action.
 *
 * It takes `FormData`, not a parsed object, so the form works with JavaScript
 * disabled — the browser posts the form, Next runs this, and the reader gets an
 * answer. That is the whole reason the booking is a section and not a modal.
 *
 * Nothing is sent anywhere yet. Wiring a real inbox or CRM is a Phase 9 job, and
 * doing it now would mean putting a credential in the repo.
 */

/**
 * Rate limiting, in memory.
 *
 * Deliberately the simplest thing that works: a Map of IP to timestamps, pruned
 * as it goes. It is per-instance and it resets on deploy, so it stops a bored
 * person with a browser, not a botnet. Phase 9 replaces it with something
 * shared — see docs/QA-REPORT.md when that exists.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const attempts = new Map<string, number[]>();

function overRateLimit(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (attempts.size > 5000) {
    for (const [ip, times] of attempts) {
      if (times.every((at) => now - at >= WINDOW_MS)) attempts.delete(ip);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function bookTrial(_previous: BookingResult | null, formData: FormData) {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";

  if (overRateLimit(ip)) {
    return {
      status: "error",
      message: "That is a lot of requests. Give it ten minutes, or call us on 020 7946 0117.",
    } satisfies BookingResult;
  }

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      status: "error",
      message: "Some details need another look.",
      fieldErrors,
    } satisfies BookingResult;
  }

  // The honeypot is invisible to people and irresistible to bots. Answer as if
  // it worked: telling a bot it was caught only teaches it to try again.
  if (parsed.data.website) {
    return { status: "success", reference: "7S-000000" } satisfies BookingResult;
  }

  // A reference the reader can quote on the phone. Not a security token.
  const reference = `7S-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return { status: "success", reference } satisfies BookingResult;
}
