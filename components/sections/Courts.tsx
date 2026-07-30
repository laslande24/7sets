import Image from "next/image";

import { Badge, ButtonLink, Card, Eyebrow, SectionShell } from "@/components/ui";
import { labels, sectionCopy } from "@/content/copy";
import { facilities, summerCamp, type Tile } from "@/content/facilities";

/**
 * SET 06 — the grounds, then the camp.
 *
 * The gallery is asymmetric by data: each tile carries a `tile` value and the
 * span and aspect come from that, so the arrangement can be changed in
 * content/facilities.ts without touching this file. Every tile declares an
 * aspect ratio, which is what keeps CLS at zero while the images stream in.
 */
const tileClasses: Record<Tile, string> = {
  wide: "col-span-2 aspect-16/9",
  tall: "col-span-1 aspect-3/4",
  regular: "col-span-1 aspect-square",
};

export function Courts() {
  return (
    <SectionShell id="courts">
      <div data-animate="rise">
        <Eyebrow set={6}>{sectionCopy.courts.eyebrow}</Eyebrow>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-gutter gap-y-4">
        <h2 data-animate="lines" className="max-w-[18ch] text-display-lg">
          {sectionCopy.courts.heading}
        </h2>
        <p data-animate="rise" className="max-w-[34ch] text-body text-ink/70">
          {sectionCopy.courts.standfirst}
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {facilities.map((facility) => (
          <li
            key={facility.id}
            data-animate="rise"
            className={tileClasses[facility.tile]}
          >
            <figure className="relative h-full w-full overflow-hidden rounded-md bg-court-100">
              {/* The frame is scaled past its box so the parallax has somewhere
                  to travel without exposing an edge. 110% of the height against
                  a ±5% offset leaves margin on both sides. */}
              <div
                data-animate="parallax"
                data-parallax-speed="0.1"
                className="absolute inset-0 scale-110"
              >
                <Image
                  src={facility.src}
                  alt={facility.alt}
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-court-950/85 to-transparent p-3 pt-8 text-caption text-surface">
                {facility.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Card
        variant="solid"
        radius="lg"
        className="mt-16 grid overflow-hidden bg-court-deep text-surface lg:grid-cols-2"
      >
        <div className="relative min-h-64 lg:min-h-full">
          <Image
            src={summerCamp.image.src}
            alt={summerCamp.image.alt}
            fill
            quality={85}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div data-animate="rise" className="p-8 lg:p-12">
          <Badge>{summerCamp.badge}</Badge>
          <h3 className="mt-5 text-display-md">{summerCamp.title}</h3>
          <p className="mt-4 max-w-prose text-body text-surface/80">{summerCamp.body}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-caption tracking-wider text-surface/60 uppercase">
                {labels.camp.dates}
              </dt>
              <dd className="mt-1 text-body-lg tabular-nums">{summerCamp.dates}</dd>
            </div>
            <div>
              <dt className="text-caption tracking-wider text-surface/60 uppercase">
                {labels.camp.price}
              </dt>
              <dd className="mt-1 text-body-lg tabular-nums">
                {summerCamp.price}{" "}
                <span className="text-caption text-surface/70">
                  {summerCamp.priceNote}
                </span>
              </dd>
            </div>
          </dl>

          <ul className="mt-8 space-y-2 text-body text-surface/80">
            {summerCamp.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1 shrink-0 rounded-full bg-lime"
                />
                {item}
              </li>
            ))}
          </ul>

          <ButtonLink href={summerCamp.cta.href} className="mt-8">
            {summerCamp.cta.label}
          </ButtonLink>
        </div>
      </Card>
    </SectionShell>
  );
}
