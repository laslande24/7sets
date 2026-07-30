import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Counter, Magnetic, Parallax, Reveal, SplitReveal } from "@/components/motion";
import { ContrastTable } from "@/components/styleguide/ContrastTable";
import { EaseCurve } from "@/components/styleguide/EaseCurve";
import { ScrollProgressDemo } from "@/components/styleguide/ScrollProgressDemo";
import { TokenValue } from "@/components/styleguide/TokenValue";
import {
  ArrowButton,
  Badge,
  Button,
  ButtonLink,
  Card,
  Eyebrow,
  IconGrip,
  Pill,
  SectionShell,
} from "@/components/ui";
import {
  colourGroups,
  durations,
  easings,
  radii,
  spacing,
  typeScale,
} from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Styleguide — 7SETS",
  description: "Internal reference for the 7SETS design system.",
  robots: { index: false, follow: false },
};

/* Tailwind only sees class names it can read in the source, so the type scale
   is mapped statically rather than interpolated from the token registry. */
const typeClasses: Record<string, string> = {
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "body-lg": "text-body-lg",
  body: "text-body",
  label: "text-label uppercase",
  caption: "text-caption uppercase tracking-wider",
};

const CHAPTERS = [
  ["colour", "Colour"],
  ["contrast", "Contrast audit"],
  ["shape", "Shape"],
  ["spacing", "Spacing"],
  ["type", "Type"],
  ["motion", "Motion"],
  ["motion-primitives", "Motion primitives"],
  ["buttons", "Button"],
  ["blocks", "Pill, Badge, Eyebrow"],
  ["cards", "Card"],
  ["controls", "ArrowButton, IconGrip"],
  ["plates", "SectionShell"],
] as const;

function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-gutter">{children}</div>;
}

function Chapter({
  id,
  title,
  blurb,
  bleed = false,
  children,
}: {
  id: string;
  title: string;
  blurb?: string;
  /** Renders children at full page width — for specimens that own their own margins. */
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 py-14">
      <Container>
        <h2 className="text-display-md">{title}</h2>
        {blurb ? <p className="mt-3 max-w-prose text-body text-ink/70">{blurb}</p> : null}
      </Container>
      <div className="mt-10">{bleed ? children : <Container>{children}</Container>}</div>
    </section>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-caption tracking-wider text-ink/60 uppercase">{label}</p>
      {children}
    </div>
  );
}

/** A field on which white-on-photo primitives can be judged. */
function DarkField({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md bg-court p-6">
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="pb-24">
      <header className="py-16">
        <Container>
          <Eyebrow>Internal — not indexed</Eyebrow>
          <h1 className="mt-4 text-display-lg">7SETS design system</h1>
          <p className="mt-4 max-w-prose text-body-lg text-ink/70">
            Every token below is measured from{" "}
            <code className="font-mono text-body">docs/design/hero-mockup.jpeg</code> and
            read back out of the live cascade — nothing on this page restates a value by
            hand. This is the control mirror for the eight phases that follow.
          </p>
          <p className="mt-4 max-w-prose text-body text-ink/70">
            Three findings overrule the original brief: the plates have{" "}
            <strong className="font-medium text-ink">square corners</strong>, nothing here
            is a <strong className="font-medium text-ink">pill</strong>, and the primary
            CTA label ships in ink rather than the mockup&rsquo;s white, which measures
            2.0:1.
          </p>
          <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {CHAPTERS.map(([id, label]) => (
              <Link
                key={id}
                href={`#${id}`}
                className="rounded-xs text-caption tracking-wider text-ink/70 uppercase underline-offset-4 hover:text-ink hover:underline focus-visible:focus-ring"
              >
                {label}
              </Link>
            ))}
          </nav>
        </Container>
      </header>

      {/* ---------------------------------------------------------- colour */}
      <Chapter
        id="colour"
        title="Colour"
        blurb="Swatches paint from the token; the hex beside each one is what the browser resolved, aliases followed."
      >
        <div className="space-y-12">
          {colourGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-body-lg font-medium">{group.title}</h3>
              <p className="mt-2 max-w-prose text-caption text-ink/70">{group.blurb}</p>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.tokens.map((token) => (
                  <li key={token.cssVar}>
                    <div
                      className="h-16 rounded-md ring-1 ring-ink/12 ring-inset"
                      style={{ backgroundColor: `var(${token.cssVar})` }}
                    />
                    <p className="mt-2 font-mono text-caption">{token.utility}</p>
                    <p className="text-ink/60">
                      <TokenValue cssVar={token.cssVar} kind="color" />
                    </p>
                    {token.note ? (
                      <p className="mt-1 text-caption text-ink/60">{token.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Chapter>

      {/* -------------------------------------------------------- contrast */}
      <Chapter
        id="contrast"
        title="Contrast audit"
        blurb="Every text-on-background pair the site ships, measured live. 4.5:1 for text under 24px, 3:1 for large text and non-text UI."
      >
        <ContrastTable />
      </Chapter>

      {/* ----------------------------------------------------------- shape */}
      <Chapter
        id="shape"
        title="Shape"
        blurb="The mockup contains no pills and no large radii. The hero plate's left edge measured an inset of 0 across its first 34 rows — the corners are square, and that is the layout's signature."
      >
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {radii.map((token) => (
            <li key={token.cssVar}>
              <div
                className="h-20 bg-court"
                style={{ borderRadius: `var(${token.cssVar})` }}
                aria-hidden="true"
              />
              <p className="mt-2 font-mono text-caption">rounded-{token.utility}</p>
              <p className="text-ink/60">
                <TokenValue cssVar={token.cssVar} kind="raw" />
              </p>
              {token.note ? (
                <p className="mt-1 text-caption text-ink/60">{token.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* --------------------------------------------------------- spacing */}
      <Chapter
        id="spacing"
        title="Spacing"
        blurb="Base 4, plus three layout constants taken off the mockup. Resolved widths update with the viewport — narrow this window and the plate margin follows."
      >
        <ul className="space-y-6">
          {spacing.map((token) => (
            <li key={token.cssVar}>
              <div className="flex items-center gap-4">
                <div
                  className="h-6 shrink-0 rounded-xs bg-lime"
                  style={{ width: `var(${token.cssVar})` }}
                  aria-hidden="true"
                />
                <p className="font-mono text-caption">{token.utility}</p>
                <p className="text-ink/60">
                  <TokenValue cssVar={token.cssVar} kind="length" />
                </p>
              </div>
              {token.note ? (
                <p className="mt-1 text-caption text-ink/60">{token.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* ------------------------------------------------------------ type */}
      <Chapter
        id="type"
        title="Type"
        blurb="Jost — the Futura-lineage geometric with the single-storey `a` the mockup uses. One family for display and body, because the mockup uses one."
      >
        <ul className="space-y-10">
          {typeScale.map((token) => (
            <li key={token.cssVar} className="border-t border-ink/12 pt-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-mono text-caption">text-{token.utility}</p>
                <p className="text-ink/60">
                  <TokenValue cssVar={token.cssVar} kind="length" />
                </p>
              </div>
              {token.note ? (
                <p className="mt-1 text-caption text-ink/60">{token.note}</p>
              ) : null}
              <p className={`mt-4 ${typeClasses[token.utility] ?? "text-body"}`}>
                {token.sample}
              </p>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* ---------------------------------------------------------- motion */}
      <Chapter
        id="motion"
        title="Motion"
        blurb="Curves are drawn from the token's own control points. Durations are the budget Phase 5 spends against — nothing on the site may exceed --dur-hero."
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <Specimen label="Easings">
            <ul className="space-y-5">
              {easings.map((token) => (
                <li key={token.cssVar} className="flex items-center gap-4">
                  <EaseCurve cssVar={token.cssVar} />
                  <div>
                    <p className="font-mono text-caption">ease-{token.utility}</p>
                    <p className="text-ink/60">
                      <TokenValue cssVar={token.cssVar} kind="raw" />
                    </p>
                    {token.note ? (
                      <p className="mt-1 text-caption text-ink/60">{token.note}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Specimen>

          <Specimen label="Durations">
            <ul className="space-y-5">
              {durations.map((token) => (
                <li key={token.cssVar}>
                  <div className="flex flex-wrap items-baseline gap-x-4">
                    <p className="font-mono text-caption">{token.utility}</p>
                    <p className="text-ink/60">
                      <TokenValue cssVar={token.cssVar} kind="raw" />
                    </p>
                  </div>
                  {token.note ? (
                    <p className="mt-1 text-caption text-ink/60">{token.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Specimen>
        </div>
      </Chapter>

      {/* ------------------------------------------------ motion primitives */}
      <Chapter
        id="motion-primitives"
        title="Motion primitives"
        blurb="Six pieces in components/motion/. Every one of them hides its starting state in CSS behind a `.js` class rather than in a gsap.set, so a page with JavaScript off renders finished and reduced motion never leaves anything invisible. Scroll past each demo to fire it; reload to run them again."
      >
        <div className="space-y-14">
          <Specimen label="Reveal — fade and rise on enter">
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal className="rounded-md bg-canvas p-6 ring-1 ring-ink/10 ring-inset">
                <p className="font-mono text-caption">&lt;Reveal&gt;</p>
                <p className="mt-2 text-body text-ink/70">
                  Default: 24px, `--dur-base`, ease-out-expo, fires once at `top 82%`.
                </p>
              </Reveal>
              <Reveal
                distance={48}
                delay={0.1}
                className="rounded-md bg-canvas p-6 ring-1 ring-ink/10 ring-inset"
              >
                <p className="font-mono text-caption">
                  distance={48} delay={0.1}
                </p>
                <p className="mt-2 text-body text-ink/70">
                  Distance is a prop, not a magic number in the component.
                </p>
              </Reveal>
            </div>
          </Specimen>

          <Specimen label="Reveal — stagger moves the target to the children">
            <Reveal as="ul" stagger={0.08} className="grid gap-3 sm:grid-cols-4">
              {["Assess", "Drill", "Play", "Compete"].map((step) => (
                <li
                  key={step}
                  className="rounded-md bg-canvas p-5 text-display-md ring-1 ring-ink/10 ring-inset"
                >
                  {step}
                </li>
              ))}
            </Reveal>
          </Specimen>

          <Specimen label="SplitReveal — masked lines, then words">
            <div className="space-y-8">
              <SplitReveal as="p" className="max-w-[20ch] text-display-lg">
                Coaching that survives contact with a real week.
              </SplitReveal>
              <SplitReveal
                as="p"
                by="words"
                stagger={0.03}
                className="max-w-prose text-body-lg"
              >
                Split after the webfont lands, never before — measuring line breaks in the
                fallback face puts every line in the wrong place.
              </SplitReveal>
            </div>
          </Specimen>

          <Specimen label="Parallax — offset tied to scroll, as a fraction of the element's height">
            <div className="grid gap-4 sm:grid-cols-3">
              {[0.05, 0.15, 0.3].map((speed) => (
                <Parallax key={speed} speed={speed}>
                  <div className="grid h-40 place-items-center rounded-md bg-court text-surface">
                    <span className="font-mono text-caption">speed={speed}</span>
                  </div>
                </Parallax>
              ))}
            </div>
          </Specimen>

          <Specimen label="Counter — renders the final value, counts only if off-screen at load">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { to: 11, suffix: "", label: "courts" },
                { to: 14, suffix: "", label: "coaches" },
                { to: 640, suffix: "+", label: "members" },
                { to: 17, suffix: "", label: "years" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dd className="text-display-lg tabular-nums">
                    <Counter to={stat.to} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-1 text-label text-ink/70 lowercase">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Specimen>

          <Specimen label="Magnetic — fine pointers only, and weak on purpose">
            <div className="flex flex-wrap items-center gap-6">
              <Magnetic>
                <Button>Book free trial</Button>
              </Magnetic>
              <Magnetic strength={0.35} radius={80}>
                <Button variant="secondary">strength=0.35 — too much</Button>
              </Magnetic>
              <p className="max-w-[34ch] text-caption text-ink/60">
                A button that moves far enough to be obvious is a button people miss. The
                second one is here to show where that line is.
              </p>
            </div>
          </Specimen>

          <Specimen label="useScrollProgress — 0 → 1 across the viewport">
            <ScrollProgressDemo />
          </Specimen>
        </div>
      </Chapter>

      {/* ---------------------------------------------------------- button */}
      <Chapter
        id="buttons"
        title="Button"
        blurb="40px tall, 4px radius, uppercase label at 18px, and the ↗ chip in lime-soft — all measured. Hover, active and focus below are rendered statically by the same rules the live states use, so this row cannot drift from the component."
      >
        <div className="space-y-12">
          <Specimen label="Variants">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Book free trial</Button>
              <Button variant="primary" arrow={false}>
                Book free trial
              </Button>
              <Button variant="secondary">Explore programs</Button>
              <Button variant="ghost">See the method</Button>
              <ButtonLink href="#buttons" variant="secondary">
                As a link
              </ButtonLink>
            </div>
          </Specimen>

          <Specimen label="Sizes — sm, md, lg">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Book free trial</Button>
              <Button size="md">Book free trial</Button>
              <Button size="lg">Book free trial</Button>
            </div>
          </Specimen>

          <Specimen label="States — default, hover, active, focus, disabled">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button>Default</Button>
                <Button data-force="hover">Hover</Button>
                <Button data-force="active">Active</Button>
                <Button data-force="focus">Focus</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="secondary">Default</Button>
                <Button variant="secondary" data-force="hover">
                  Hover
                </Button>
                <Button variant="secondary" data-force="active">
                  Active
                </Button>
                <Button variant="secondary" data-force="focus">
                  Focus
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="ghost">Default</Button>
                <Button variant="ghost" data-force="hover">
                  Hover
                </Button>
                <Button variant="ghost" data-force="active">
                  Active
                </Button>
                <Button variant="ghost" data-force="focus">
                  Focus
                </Button>
                <Button variant="ghost" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </Specimen>

          <Specimen label="On the photograph — the hero pairing, with the inverted focus ring">
            <DarkField>
              <Button>Book free trial</Button>
              <Button variant="secondary">Explore programs</Button>
              <Button variant="ghost" onDark>
                Ghost
              </Button>
              <Button variant="ghost" onDark data-force="focus">
                Ghost, focused
              </Button>
            </DarkField>
          </Specimen>
        </div>
      </Chapter>

      {/* ----------------------------------------------------------- blocks */}
      <Chapter
        id="blocks"
        title="Pill, Badge, Eyebrow"
        blurb="The nav is three of these blocks side by side with 6px gaps, not one bar. `Pill` keeps the brief's name; in this system a pill is a 40px block with a 4px radius."
      >
        <div className="space-y-12">
          <Specimen label="Pill — surface, ink, glass">
            <div className="flex flex-wrap items-center gap-4">
              <Pill>7SETS</Pill>
              <Pill tone="ink">7SETS</Pill>
            </div>
            <div className="mt-4">
              <DarkField>
                <Pill tone="glass">Glass over the photo</Pill>
              </DarkField>
            </div>
          </Specimen>

          <Specimen label="Pill — the nav assembly, 8px gaps">
            {/* The assembly is a fixed desktop width; it scrolls inside its own
                box so the page itself never gains a horizontal scrollbar. */}
            <div className="overflow-x-auto rounded-md bg-court p-6">
              <div className="flex w-max items-center gap-2">
                <Pill className="gap-2">
                  <span aria-hidden="true" className="size-5 rounded-xs bg-ink" />
                  <span className="text-label">7SETS</span>
                </Pill>
                <Pill className="gap-5">
                  {["Home", "About", "Programs", "Contact"].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 text-label uppercase"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-current"
                      />
                      {item}
                    </span>
                  ))}
                </Pill>
                <IconGrip />
              </div>
            </div>
          </Specimen>

          <Specimen label="Badge">
            <div className="flex flex-wrap items-center gap-4">
              <Badge>Exclusive</Badge>
              <Badge tone="surface">New</Badge>
              <Badge tone="ink">Full</Badge>
            </div>
          </Specimen>

          <Specimen label="Eyebrow">
            <div className="space-y-3">
              <Eyebrow set={3}>Programs</Eyebrow>
              <Eyebrow set={7}>Membership</Eyebrow>
              <Eyebrow>Frequently asked</Eyebrow>
            </div>
            <div className="mt-4">
              <DarkField>
                <Eyebrow set={6} onDark>
                  Courts &amp; Summer Camp 2026
                </Eyebrow>
              </DarkField>
            </div>
          </Specimen>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------ card */}
      <Chapter
        id="cards"
        title="Card"
        blurb="Glass reproduces the Summer Camp panel: sampling it returns #8D999D, which is the court blue read through roughly 15% white."
      >
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-display-md">Solid</h3>
              <p className="mt-2 text-body text-ink/70">Cards on a light plate.</p>
            </Card>
            <Card variant="outline" className="p-6">
              <h3 className="text-display-md">Outline</h3>
              <p className="mt-2 text-body text-ink/70">Secondary grouping, no fill.</p>
            </Card>
          </div>
          <div className="rounded-md bg-court p-6">
            <Card variant="glass" radius="lg" className="max-w-sm p-6">
              <Badge>Exclusive</Badge>
              <h3 className="mt-4 text-display-md">Summer Camp 2026</h3>
              <p className="mt-2 text-caption text-surface/80">
                Ages 7–16 · Starts July 15
              </p>
            </Card>
          </div>
        </div>
      </Chapter>

      {/* -------------------------------------------------------- controls */}
      <Chapter
        id="controls"
        title="ArrowButton, IconGrip"
        blurb="The mockup draws the carousel arrows at 28px, which fails WCAG 2.2's 44px target. The visible chip keeps the measured size and the hit area grows around it — the outline you see on focus is drawn on the chip, not the hit box."
      >
        <div className="space-y-12">
          <Specimen label="ArrowButton — sizes">
            <div className="flex flex-wrap items-center gap-4">
              <ArrowButton direction="prev" size="sm" />
              <ArrowButton direction="next" size="sm" />
              <ArrowButton direction="prev" size="md" />
              <ArrowButton direction="next" size="md" />
              <ArrowButton direction="prev" size="lg" />
              <ArrowButton direction="next" size="lg" />
            </div>
          </Specimen>

          <Specimen label="ArrowButton — default, hover, active, focus, disabled">
            <div className="flex flex-wrap items-center gap-4">
              <ArrowButton direction="next" />
              <ArrowButton direction="next" data-force="hover" />
              <ArrowButton direction="next" data-force="active" />
              <ArrowButton direction="next" data-force="focus" />
              <ArrowButton direction="next" disabled />
            </div>
          </Specimen>

          <Specimen label="IconGrip — default, hover, active, focus">
            <div className="flex flex-wrap items-center gap-4">
              <IconGrip />
              <IconGrip data-force="hover" />
              <IconGrip data-force="active" />
              <IconGrip data-force="focus" />
            </div>
          </Specimen>

          <Specimen label="On the photograph">
            <DarkField>
              <ArrowButton direction="prev" onDark />
              <ArrowButton direction="next" onDark data-force="focus" />
              <IconGrip onDark data-force="focus" />
            </DarkField>
          </Specimen>
        </div>
      </Chapter>

      {/* ---------------------------------------------------------- plates */}
      <Chapter
        id="plates"
        title="SectionShell"
        bleed
        blurb="Shown at true page width, because the margin is the point. Every section of the site is one of these: a hard-edged plate inset by --spacing-plate on the pale canvas."
      >
        <div className="space-y-4">
          <SectionShell>
            <Eyebrow set={2}>Why 7SETS</Eyebrow>
            <h3 className="mt-4 text-display-lg">tone=&quot;surface&quot;</h3>
            <p className="mt-3 max-w-prose text-body text-ink/70">
              The default. Square corners, gutter from the token, sitting on the canvas.
            </p>
          </SectionShell>
          <SectionShell tone="court">
            <Eyebrow set={6} onDark>
              Courts
            </Eyebrow>
            <h3 className="mt-4 text-display-lg">tone=&quot;court&quot;</h3>
          </SectionShell>
          <SectionShell tone="deep">
            <h3 className="text-display-lg">tone=&quot;deep&quot; — Match Point</h3>
          </SectionShell>
          <SectionShell tone="ink">
            <h3 className="text-display-lg">tone=&quot;ink&quot;</h3>
          </SectionShell>
        </div>
      </Chapter>
    </main>
  );
}
