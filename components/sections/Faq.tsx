"use client";

import { useId, useState } from "react";

import { Eyebrow, SectionShell } from "@/components/ui";
import { sectionCopy } from "@/content/copy";
import { faq } from "@/content/faq";
import { cn } from "@/lib/cn";

/**
 * FAQ — a native accordion, no library.
 *
 * `<button aria-expanded>` controlling a region by id, one panel open at a
 * time, and the panel removed from the tree when closed rather than merely
 * hidden. These ten questions and answers are also the only source for the
 * Phase 7 `FAQPage` structured data — never restate them in the JSON-LD.
 */
export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faq[0].id);
  const baseId = useId();

  return (
    <SectionShell id="faq">
      <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>{sectionCopy.faq.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-lg">{sectionCopy.faq.heading}</h2>
          <p className="mt-4 max-w-prose text-body text-ink/70">
            {sectionCopy.faq.standfirst}
          </p>
        </div>

        <dl className="lg:col-span-7 lg:col-start-6">
          {faq.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}`;
            return (
              <div key={item.id} className="border-b border-ink/12 first:border-t">
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

                {isOpen ? (
                  <dd id={panelId} className="pb-6">
                    <p className="max-w-prose text-body text-ink/70">{item.answer}</p>
                  </dd>
                ) : null}
              </div>
            );
          })}
        </dl>
      </div>
    </SectionShell>
  );
}
