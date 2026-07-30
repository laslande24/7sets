"use client";

import { useRef, useState } from "react";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sections } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The signature: scroll position read as a tennis scoreboard.
 *
 * Seven markers, one per set. The set you are in lights lime and names itself,
 * and the counter beside it steps 0 · 15 · 30 · 40 · GAME across that section —
 * so the rail tells you both where you are and how far through it you are.
 *
 * It is **navigation, not decoration**, so it is a real `<nav>` of real anchors
 * with `aria-current`, not an `aria-hidden` ornament. That also means the click
 * behaviour needs no JavaScript of its own: SmoothScrollProvider already
 * delegates every in-page anchor to Lenis, and with JavaScript off or reduced
 * motion on the browser's native jump takes over. Only the counter beside the
 * marker is hidden from assistive tech — "30" is meaningless read aloud.
 *
 * State changes at most 35 times across the whole page (seven sets × five
 * scores) and is guarded against no-op sets, so this does not re-render on
 * scroll.
 */

/** Derived from the `as const` union so the ids stay literal and typo-proof. */
type SetSection = Extract<(typeof sections)[number], { set: number }>;

const setSections = sections.filter((section): section is SetSection => "set" in section);

const SCORES = ["0", "15", "30", "40", "GAME"] as const;

function scoreFor(progress: number) {
  return SCORES[Math.min(SCORES.length - 1, Math.floor(progress * SCORES.length))];
}

export function ScoreRail() {
  const scope = useRef<HTMLElement>(null);
  const [active, setActive] = useState<{ set: number; score: string }>({
    set: setSections[0].set,
    score: SCORES[0],
  });
  const lastRef = useRef("");

  useGSAP(
    () => {
      const publish = (set: number, score: string) => {
        const key = `${set}:${score}`;
        if (key === lastRef.current) return;
        lastRef.current = key;
        setActive({ set, score });
      };

      // One trigger per set, measured against the middle of the viewport: the
      // set you are "in" is the one crossing the centre line.
      //
      // The elements are resolved here rather than passed as `"#id"` strings.
      // useGSAP scopes selector strings to `scope`, which is this nav — so
      // every string would resolve to nothing and all seven triggers would
      // collapse onto the same start and end.
      const triggers = setSections.flatMap((section) => {
        const element = document.getElementById(section.id);
        if (!element) return [];
        return ScrollTrigger.create({
          trigger: element,
          start: "top 50%",
          end: "bottom 50%",
          onUpdate: (self) => {
            if (self.isActive) publish(section.set, scoreFor(self.progress));
          },
        });
      });

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope },
  );

  return (
    <nav
      ref={scope}
      aria-label="Sets"
      className="fixed top-1/2 right-plate z-40 hidden -translate-y-1/2 lg:block"
    >
      <ol className="flex flex-col items-end gap-2">
        {setSections.map((section) => {
          const isActive = section.set === active.set;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex h-6 items-center justify-end gap-3 rounded-xs",
                  "transition-colors duration-(--dur-fast) ease-out-quart",
                  "focus-visible:focus-ring",
                )}
              >
                <span
                  className={cn(
                    "text-caption tracking-wider uppercase transition-opacity duration-(--dur-base)",
                    isActive
                      ? "text-lime-600 opacity-100"
                      : "text-ink/50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {isActive ? (
                    <>
                      <span className="tabular-nums">
                        Set {String(section.set).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true" className="ml-2 text-ink/45 tabular-nums">
                        {active.score}
                      </span>
                    </>
                  ) : (
                    section.label
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-0.5 rounded-full transition-all duration-(--dur-base) ease-out-quart",
                    isActive
                      ? "w-8 bg-lime-600"
                      : "w-4 bg-ink/25 group-hover:w-6 group-hover:bg-ink/45",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
