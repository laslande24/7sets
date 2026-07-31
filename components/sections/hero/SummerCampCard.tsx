"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";

import { ArrowButton, Badge, Card } from "@/components/ui";
import { labels } from "@/content/copy";
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
 * Phase 6 gave it the semantics. The live region is deliberately `off` while
 * the carousel is advancing itself — a polite region that fires every six
 * seconds does not inform anybody, it just talks over whatever they were
 * reading. It switches to `polite` the moment the reader presses an arrow,
 * because from then on the announcement answers a question they asked.
 *
 * That same press stops the autoplay for good. WCAG 2.2.2 wants a way to stop
 * moving content: hover and focus both pause it, and taking manual control ends
 * it outright. Under reduced motion it never starts.
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
  const [manual, setManual] = useState(false);
  const slide = SLIDES[index];

  const scope = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const behind = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  // Read by the autoplay interval, which cannot see the state above.
  const stopped = useRef(false);

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

      const advanceIfRunning = () => {
        if (stopped.current) return;
        step.current(1);
      };

      let timer = window.setInterval(advanceIfRunning, 6000);
      const stop = () => window.clearInterval(timer);
      const start = () => {
        stop();
        if (stopped.current) return;
        timer = window.setInterval(advanceIfRunning, 6000);
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

  /** A press takes the wheel: autoplay ends and announcements begin. */
  const take = (delta: number) => {
    stopped.current = true;
    setManual(true);
    step.current(delta);
  };

  const position = labels.carousel.position
    .replace("{{n}}", String(index + 1))
    .replace("{{total}}", String(SLIDES.length));

  return (
    <div
      ref={scope}
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.carousel.label}
      data-cursor="play"
      className={cn("w-90 max-w-full", className)}
      {...props}
    >
      <div className="relative" aria-atomic="true" aria-live={manual ? "polite" : "off"}>
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
            {/* Announced with the rest of the slide, so "Junior Open Day" is
                not the second of three things with no way to tell. */}
            <p className="sr-only">{position}</p>
          </div>
        </Card>
      </div>

      <div className="mt-2 flex justify-end gap-1">
        <ArrowButton direction="prev" size="sm" onDark onClick={() => take(-1)} />
        <ArrowButton direction="next" size="sm" onDark onClick={() => take(1)} />
      </div>
    </div>
  );
}
