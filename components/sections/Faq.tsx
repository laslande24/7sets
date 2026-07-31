"use client";

import { useId, useRef, useState } from "react";

import { Eyebrow, SectionShell } from "@/components/ui";
import { sectionCopy } from "@/content/copy";
import { faq } from "@/content/faq";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";

/**
 * FAQ — a native accordion, no library.
 *
 * `<button aria-expanded>` controlling a region by id, one panel open at a
 * time. These ten questions and answers are also the only source for the Phase 7
 * `FAQPage` structured data — never restate them in the JSON-LD.
 *
 * Every panel stays in the DOM and is collapsed by height rather than removed,
 * which is what makes the open animate. It also means the server sends ten
 * answers, all of them open: with JavaScript off this is a plain list of
 * questions and answers rather than one answer and nine dead buttons. The
 * closed ones are marked `inert` from JavaScript, never in the markup, so that
 * fallback stays readable — it is set in a layout effect, before the first
 * paint, so there is no frame where the page shows all ten and then folds.
 *
 * The height tween is the one exception to rule 3 in CLAUDE.md. Everything the
 * rule protects — scroll-linked work, anything running per frame while the page
 * moves — is untouched by it: this is one element, once, in response to a click,
 * and the thing being animated *is* the layout. A transform cannot push the
 * questions below it down the page.
 */
export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faq[0].id);
  const baseId = useId();
  const panels = useRef<Record<string, HTMLElement | null>>({});
  /** `undefined` until the first pass, which sets heights instead of tweening. */
  const previous = useRef<string | null | undefined>(undefined);

  useGSAP(
    () => {
      const { duration, ease } = motionTokens();
      const reduced = prefersReducedMotion();
      const firstPass = previous.current === undefined;

      for (const item of faq) {
        const panel = panels.current[item.id];
        if (!panel) continue;

        const open = openId === item.id;
        // Not an attribute in the JSX: rendering it on the server would hide
        // nine answers from a reader who has no JavaScript to open them with.
        panel.inert = !open;

        if (firstPass || reduced) {
          gsap.set(panel, { height: open ? "auto" : 0 });
          continue;
        }

        // Only the two panels that changed move; the other eight are already
        // where they belong and re-tweening them would fight a running one.
        if ((previous.current === item.id) === open) continue;

        gsap.to(panel, {
          height: open ? "auto" : 0,
          duration: duration.base,
          ease: ease.outQuart,
          overwrite: true,
        });
      }

      previous.current = openId;
    },
    { dependencies: [openId] },
  );

  return (
    <SectionShell id="faq">
      <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div data-animate="rise">
            <Eyebrow>{sectionCopy.faq.eyebrow}</Eyebrow>
          </div>
          <h2 data-animate="lines" className="mt-4 text-display-lg">
            {sectionCopy.faq.heading}
          </h2>
          <p data-animate="rise" className="mt-4 max-w-prose text-body text-ink/70">
            {sectionCopy.faq.standfirst}
          </p>
        </div>

        <dl className="lg:col-span-7 lg:col-start-6">
          {faq.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}`;
            return (
              <div
                key={item.id}
                data-animate="rise"
                className="border-b border-ink/12 first:border-t"
              >
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-start justify-between gap-6 rounded-xs py-5 text-left focus-visible:focus-ring"
                  >
                    <span className="text-body-lg">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 grid size-6 shrink-0 place-items-center rounded-xs bg-canvas",
                        "transition-transform duration-(--dur-fast) ease-out-quart",
                        isOpen && "rotate-45",
                      )}
                    >
                      <svg viewBox="0 0 12 12" fill="none" className="size-3">
                        <path
                          d="M6 1.5v9M1.5 6h9"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                </dt>

                {/* The padding belongs to the paragraph, not the panel: on a
                    panel collapsed to `height: 0` it would still occupy its
                    24px and the accordion would never quite close. */}
                <dd
                  id={panelId}
                  ref={(node) => {
                    panels.current[item.id] = node;
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-6 text-body text-ink/70">{item.answer}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </SectionShell>
  );
}
