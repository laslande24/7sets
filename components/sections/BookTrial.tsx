"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useId } from "react";
import { useForm } from "react-hook-form";

import { bookTrial } from "@/app/actions";
import { Button, Eyebrow, SectionShell } from "@/components/ui";
import { booking } from "@/content/booking";
import { cn } from "@/lib/cn";
import { bookingSchema, LEVELS, SLOTS, type BookingInput } from "@/lib/booking";

/**
 * SET — booking. A section, not a modal, and that was the choice to make.
 *
 * A modal would have to trap focus, lock the body, restore focus on close, and
 * fit eight fields onto a phone. A section does none of that, is linkable
 * (`#book`), and — the argument that actually settles it — **works with
 * JavaScript disabled**. `<form action={serverAction}>` posts natively and Next
 * runs the action, so a reader with no JavaScript still books a session. Rule 6
 * in CLAUDE.md says the site stays functional without JavaScript; a modal form
 * cannot honour that.
 *
 * Validation runs twice on purpose. react-hook-form checks on blur for a fast,
 * specific message; the Server Action re-checks everything because the client's
 * answer is not evidence. Both read the same zod schema, so they cannot drift.
 */
export function BookTrial() {
  const [result, formAction, pending] = useActionState(bookTrial, null);
  const baseId = useId();

  const {
    register,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
  });

  const fieldId = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${baseId}-${name}-error`;
  const hintId = (name: string) => `${baseId}-${name}-hint`;

  /** Client message first — it arrives sooner — then whatever the server said. */
  const errorFor = (name: keyof BookingInput) =>
    errors[name]?.message ?? (result?.status === "error" ? result.fieldErrors?.[name] : undefined);

  const describedBy = (name: keyof BookingInput, hasHint = false) =>
    [hasHint ? hintId(name) : null, errorFor(name) ? errorId(name) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldClasses = (invalid: boolean) =>
    cn(
      "mt-2 h-control w-full rounded-sm bg-surface px-3 text-body text-ink",
      "ring-1 ring-inset transition-colors duration-(--dur-fast) ease-out-quart",
      "focus-visible:focus-ring",
      invalid ? "ring-court-800" : "ring-ink/15 hover:ring-ink/30",
    );

  if (result?.status === "success") {
    return (
      <SectionShell id={booking.id} tone="court">
        {/* The success screen replaces the form rather than sitting above it, so
            a screen reader landing here is not read the whole form again. */}
        <div className="max-w-[46rem]" role="status">
          <Eyebrow onDark>{booking.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-lg">{booking.success.heading}</h2>
          <p className="mt-4 text-body-lg text-surface/80">{booking.success.body}</p>
          <p className="mt-6 text-caption tracking-wider text-surface/60 uppercase">
            {booking.success.referenceLabel}
          </p>
          <p className="mt-1 font-mono text-display-md tabular-nums">{result.reference}</p>
          <p className="mt-8">
            <a
              href={`#${booking.id}`}
              onClick={() => window.location.reload()}
              className="rounded-xs text-label uppercase underline underline-offset-4 focus-visible:focus-ring-invert"
            >
              {booking.success.again}
            </a>
          </p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id={booking.id}>
      <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div data-animate="rise">
            <Eyebrow>{booking.eyebrow}</Eyebrow>
          </div>
          <h2 data-animate="lines" className="mt-4 text-display-lg">
            {booking.heading}
          </h2>
          <p data-animate="rise" className="mt-4 max-w-prose text-body text-ink/70">
            {booking.standfirst}
          </p>
        </div>

        <form action={formAction} noValidate className="lg:col-span-7 lg:col-start-6">
          {/* Announced, not just shown: a reader who cannot see the red ring
              still needs to know the submission failed. */}
          <p aria-live="polite" className="sr-only">
            {pending ? booking.submitting : (result?.status === "error" && result.message) || ""}
          </p>

          {result?.status === "error" && !result.fieldErrors ? (
            <p className="mb-6 rounded-sm bg-court-50 p-4 text-body text-court-900 ring-1 ring-court-200 ring-inset">
              {result.message}
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {(["firstName", "lastName", "email", "phone"] as const).map((name) => (
              <p key={name}>
                <label htmlFor={fieldId(name)} className="text-label">
                  {booking.fields[name].label}
                </label>
                <input
                  {...register(name)}
                  id={fieldId(name)}
                  type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                  autoComplete={booking.fields[name].autoComplete}
                  required
                  aria-invalid={errorFor(name) ? true : undefined}
                  aria-describedby={describedBy(name)}
                  className={fieldClasses(Boolean(errorFor(name)))}
                />
                {errorFor(name) ? (
                  <span id={errorId(name)} className="mt-1.5 block text-caption text-court-800">
                    {errorFor(name)}
                  </span>
                ) : null}
              </p>
            ))}

            <p>
              <label htmlFor={fieldId("playerAge")} className="text-label">
                {booking.fields.playerAge.label}
              </label>
              <input
                {...register("playerAge")}
                id={fieldId("playerAge")}
                type="number"
                inputMode="numeric"
                min={4}
                max={99}
                required
                aria-invalid={errorFor("playerAge") ? true : undefined}
                aria-describedby={describedBy("playerAge", true)}
                className={fieldClasses(Boolean(errorFor("playerAge")))}
              />
              <span id={hintId("playerAge")} className="mt-1.5 block text-caption text-ink/60">
                {booking.fields.playerAge.hint}
              </span>
              {errorFor("playerAge") ? (
                <span
                  id={errorId("playerAge")}
                  className="mt-1 block text-caption text-court-800"
                >
                  {errorFor("playerAge")}
                </span>
              ) : null}
            </p>

            <p>
              <label htmlFor={fieldId("level")} className="text-label">
                {booking.fields.level.label}
              </label>
              <select
                {...register("level")}
                id={fieldId("level")}
                required
                defaultValue=""
                aria-invalid={errorFor("level") ? true : undefined}
                aria-describedby={describedBy("level")}
                className={fieldClasses(Boolean(errorFor("level")))}
              >
                <option value="" disabled />
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {booking.levels[level]}
                  </option>
                ))}
              </select>
              {errorFor("level") ? (
                <span id={errorId("level")} className="mt-1.5 block text-caption text-court-800">
                  {errorFor("level")}
                </span>
              ) : null}
            </p>

            <p className="sm:col-span-2">
              <label htmlFor={fieldId("slot")} className="text-label">
                {booking.fields.slot.label}
              </label>
              <select
                {...register("slot")}
                id={fieldId("slot")}
                required
                defaultValue=""
                aria-invalid={errorFor("slot") ? true : undefined}
                aria-describedby={describedBy("slot")}
                className={fieldClasses(Boolean(errorFor("slot")))}
              >
                <option value="" disabled />
                {SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {booking.slots[slot]}
                  </option>
                ))}
              </select>
              {errorFor("slot") ? (
                <span id={errorId("slot")} className="mt-1.5 block text-caption text-court-800">
                  {errorFor("slot")}
                </span>
              ) : null}
            </p>

            <p className="sm:col-span-2">
              <label htmlFor={fieldId("message")} className="text-label">
                {booking.fields.message.label}{" "}
                <span className="text-ink/50 lowercase">({booking.optional})</span>
              </label>
              <textarea
                {...register("message")}
                id={fieldId("message")}
                rows={4}
                aria-describedby={describedBy("message", true)}
                className={cn(fieldClasses(false), "h-auto py-3")}
              />
              <span id={hintId("message")} className="mt-1.5 block text-caption text-ink/60">
                {booking.fields.message.hint}
              </span>
            </p>
          </div>

          {/* Honeypot. Off-screen rather than display:none — some bots skip
              hidden fields, and none of them use a screen reader. */}
          <p aria-hidden="true" className="absolute -left-[9999px] w-px overflow-hidden">
            <label htmlFor={fieldId("website")}>Leave this empty</label>
            <input id={fieldId("website")} {...register("website")} tabIndex={-1} autoComplete="off" />
          </p>

          <div className="mt-8">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? booking.submitting : booking.submit}
            </Button>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}
