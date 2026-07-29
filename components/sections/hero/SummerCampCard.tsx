"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { ArrowButton, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
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
 * The state works now; the card-to-card transition is Phase 5, and the
 * live-region announcement and autoplay are Phase 6.
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

export function SummerCampCard({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const step = (delta: number) => {
    setIndex((current) => (current + delta + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className={cn("w-90 max-w-full", className)}>
      <div className="relative">
        {/* The card behind, showing the stack. Decorative: the content of the
            next slide is announced when it becomes the front card. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -translate-x-2 -translate-y-2 scale-[0.97] rounded-md bg-surface/10 ring-1 ring-surface/15 backdrop-blur-sm ring-inset"
        />

        <Card variant="glass" className="relative flex items-center gap-3 p-2">
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
        <ArrowButton direction="prev" size="sm" onDark onClick={() => step(-1)} />
        <ArrowButton direction="next" size="sm" onDark onClick={() => step(1)} />
      </div>
    </div>
  );
}
