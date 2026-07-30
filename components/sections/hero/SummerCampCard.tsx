"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";

import { ArrowButton, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";
import campAdult from "@/public/images/camp-adult.jpg";
import campJunior from "@/public/images/camp-junior.jpg";
import campSummer from "@/public/images/camp-summer.jpg";

/**
 * The floating card at the top right of the hero.
 *
 * Measured: a glass panel about 361 x 117 at design scale, a 141 x 93
 * thumbnail on the left, the lime-soft badge above the title, and the two
 * arrows as 23px rounded squares sitting outside the panel and below it. A
 * second card shows behind and slightly to the left, which is what makes it
 * read as a stack rather than a single card.
 *
 * The stack transition and the autoplay are Phase 5. The `aria-live`
 * announcement of the new slide is Phase 6, along with the rest of the
 * carousel's assistive-tech semantics.
 */

type Slide = {
  readonly badge: string;
  readonly title: string;
  readonly meta: string;
  readonly image: StaticImageData;
  readonly alt: string;
};

const SLIDES: readonly Slide[] = [
  {
    badge: "Exclusive",
    title: "Summer Camp 2026",
    meta: "Ages 7–16 · Starts July 15",
    image: campSummer,
    alt: "Tennis balls scattered across a blue hard court",
  },
  {
    badge: "Free entry",
    title: "Junior Open Day",
    meta: "Ages 8–13 · Saturday, May 9",
    image: campJunior,
    alt: "Three tennis balls resting on a blue hard court",
  },
  {
    badge: "New",
    title: "Adult Bootcamp",
    meta: "18+ · Six weeks from June 1",
    image: campAdult,
    alt: "A racket and a ball on the baseline of a blue hard court",
  },
];

export function SummerCampCard({
  className,
  ...props
}: { className?: string } & { "data-hero-card"?: string | boolean }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const scope = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const behind = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // The handler is built inside useGSAP, not during render: `contextSafe` is
  // handed to the callback for exactly this, and it keeps every timeline the
  // handler creates inside the context that useGSAP reverts on unmount.
  const step = useRef<(delta: number) => void>(() => {});

  useGSAP(
    (_context, contextSafe) => {
      const advance = (delta: number) =>
        setIndex((current) => (current + delta + SLIDES.length) % SLIDES.length);

      step.current =
        contextSafe?.((delta: number) => {
          const card = front.current;
          const under = behind.current;

          if (!card || !under || prefersReducedMotion()) {
            advance(delta);
            return;
          }
          // A tween in flight owns the card. Without this a held arrow key
          // stacks timelines and the stack visibly tears.
          if (busy.current) return;
          busy.current = true;

          const { duration, ease } = motionTokens();
          const away = delta > 0 ? -1 : 1;

          gsap
            .timeline({
              onComplete: () => {
                busy.current = false;
              },
            })
            // The top card leaves sideways with a little rotation…
            .to(card, {
              xPercent: away * 26,
              rotate: away * -4,
              autoAlpha: 0,
              duration: duration.base,
              ease: ease.outQuart,
            })
            // …while the one behind steps up into its place.
            .to(
              under,
              { scale: 1, x: 0, y: 0, duration: duration.base, ease: ease.outQuart },
              0,
            )
            .add(() => advance(delta))
            // Reset for the next hand — React has swapped the content by now.
            .set(under, { clearProps: "transform" })
            .fromTo(
              card,
              { xPercent: away * -14, rotate: away * 2, autoAlpha: 0 },
              {
                xPercent: 0,
                rotate: 0,
                autoAlpha: 1,
                duration: duration.base,
                ease: ease.outExpo,
                clearProps: "transform",
              },
            );
        }) ?? advance;

      // Autoplay, paused whenever a pointer or the keyboard is on the card.
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      let timer = window.setInterval(() => step.current(1), 6000);
      const stop = () => window.clearInterval(timer);
      const start = () => {
        stop();
        timer = window.setInterval(() => step.current(1), 6000);
      };

      root.addEventListener("pointerenter", stop);
      root.addEventListener("pointerleave", start);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", start);

      return () => {
        stop();
        root.removeEventListener("pointerenter", stop);
        root.removeEventListener("pointerleave", start);
        root.removeEventListener("focusin", stop);
        root.removeEventListener("focusout", start);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={cn("w-90 max-w-full", className)} {...props}>
      <div className="relative">
        {/* The card behind, showing the stack. Decorative: the content of the
            next slide is announced when it becomes the front card. */}
        <div
          ref={behind}
          aria-hidden="true"
          className="absolute inset-0 -translate-x-2 -translate-y-2 scale-[0.97] rounded-md bg-surface/10 ring-1 ring-surface/15 backdrop-blur-sm ring-inset"
        />

        <Card
          ref={front}
          variant="glass"
          className="relative flex items-center gap-3 p-2"
        >
          <div className="relative aspect-[141/93] w-35 shrink-0 overflow-hidden rounded-xs">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="141px"
              placeholder="blur"
              quality={85}
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Badge>{slide.badge}</Badge>
            <h2 className="mt-1.5 truncate text-body-lg">{slide.title}</h2>
            <p className="text-caption text-surface/80">{slide.meta}</p>
          </div>
        </Card>
      </div>

      <div className="mt-2 flex justify-end gap-1">
        <ArrowButton direction="prev" size="sm" onDark onClick={() => step.current(-1)} />
        <ArrowButton direction="next" size="sm" onDark onClick={() => step.current(1)} />
      </div>
    </div>
  );
}
