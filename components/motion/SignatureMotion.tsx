"use client";

import {
  gsap,
  loadDrawSVG,
  loadMotionPath,
  loadSplitText,
  ScrollTrigger,
  useGSAP,
} from "@/lib/gsap";
import { motionTokens } from "@/lib/gsap/config";

/**
 * Phase 5 — the moments the page is remembered for.
 *
 * One orchestrator rather than six, for the same reason as SectionMotion: the
 * sections stay Server Components and hand over named hooks. Every block below
 * is independent, guards its own targets, and registers its own teardown, so a
 * missing section is a no-op rather than a crash.
 *
 * The whole thing lives inside one `prefers-reduced-motion: no-preference`
 * match, so a reader who asked for less motion gets the static page that Phase 3
 * already built — the pinned rail stays a snap scroller, the marquee stays a
 * horizontal scroller, the method path stays a drawn line.
 *
 * Guiding rule, from the brief: one orchestrated moment beats ten scattered
 * effects. Tennis is rhythm, trajectory and impact — that is what is animated,
 * not decoration.
 */

type Cleanup = () => void;

export function SignatureMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const { duration, ease } = motionTokens();
      const cleanups: Cleanup[] = [];
      const add = (cleanup: Cleanup) => cleanups.push(cleanup);
      const isDesktop = window.matchMedia("(min-width: 64rem)").matches;

      /* ================================================== HERO — entrance */
      // A single timeline, about 1.4s, played once on load. Waits for the
      // webfont: splitting the title before it resolves measures line breaks in
      // the fallback face and every line lands wrong.
      const plate = document.getElementById("hero");
      const title = document.querySelector<HTMLElement>("[data-hero-title]");
      const media = document.querySelector<HTMLElement>("[data-hero-media]");
      const nav = document.querySelector<HTMLElement>("header nav");
      const copy = gsap.utils.toArray<HTMLElement>("[data-hero-copy]");
      const card = document.querySelector<HTMLElement>("[data-hero-card]");

      if (plate && title) {
        let cancelled = false;

        void Promise.all([loadSplitText(), document.fonts?.ready])
          .then(([SplitText]) => {
            if (cancelled) return;

            const split = new SplitText(title, { type: "lines", mask: "lines" });
            const tl = gsap.timeline({
              defaults: { ease: ease.outExpo, duration: duration.slow },
            });

            tl.from(plate, {
              // The plate unfolds from its own centre. clip-path is a paint
              // property, not layout, and this runs once on load.
              clipPath: "inset(12% 18% 12% 18%)",
              duration: duration.hero,
            })
              .from(media, { scale: 1.08, duration: duration.hero }, "<")
              .from(nav, { yPercent: -180, ease: "back.out(1.7)" }, "<0.15")
              .from(split.lines, { yPercent: 110, stagger: 0.08 }, "<0.2")
              .from(copy, { y: 24, autoAlpha: 0, stagger: 0.06 }, "<0.45")
              .from(card, { xPercent: 18, autoAlpha: 0, ease: "back.out(1.4)" }, "<0.1");

            add(() => {
              tl.kill();
              split.revert();
            });
          })
          .catch(() => undefined);

        add(() => {
          cancelled = true;
        });
      }

      /* ================================================== HERO — parallax */
      // Three planes at different rates. Capped deliberately low: the brief's
      // ceiling is 15% and anything past that reads as a glitch rather than
      // depth. The plate is already scaling on this same scroll range, so these
      // ride on top of it.
      if (plate) {
        const planes: Array<[HTMLElement | null, number]> = [
          [media, 0.1],
          [title, -0.14],
        ];
        for (const [layer, rate] of planes) {
          if (!layer) continue;
          const tween = gsap.to(layer, {
            yPercent: rate * 100,
            ease: "none",
            scrollTrigger: {
              trigger: plate,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          add(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        }
      }

      /* ======================================================= NAV — morph */
      // Contracts past 100px. Scale rather than padding, so nothing reflows;
      // the heavier blur rides on a CSS class transition.
      if (nav) {
        const trigger = ScrollTrigger.create({
          start: 100,
          end: "max",
          onToggle: (self) => nav.classList.toggle("is-condensed", self.isActive),
        });
        add(() => trigger.kill());
      }

      /* ======================================== SET 03 — pin + horizontal */
      // The bravura piece. Desktop only: pinning a phone is a bad trade, and
      // below 1024 the track stays the native snap scroller Phase 3 built.
      const viewport = document.querySelector<HTMLElement>("[data-programs-viewport]");
      const track = document.querySelector<HTMLElement>("[data-programs-track]");

      if (isDesktop && viewport && track) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          // Required by containerAnimation: any other ease and the horizontal
          // position stops matching the scroll position.
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            pin: viewport,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // There was a per-card focus effect here — off-centre cards scaled and
        // dimmed against `containerAnimation`. It is gone on purpose. The cards
        // already carry `data-animate="rise"` for their entrance, and a second
        // owner animating `opacity` on the same elements is exactly the clash
        // that broke SET 07: the rise batch's `overwrite` killed it and left the
        // cards frozen part-way. The pin and the horizontal travel are the
        // signature moment here; the section does not need a second one.

        add(() => {
          scrollTween.scrollTrigger?.kill();
          scrollTween.kill();
          gsap.set(track, { clearProps: "transform" });
        });
      }

      /* ============================================ SET 04 — method path */
      // The line draws itself, a ball rides it, and each step lights as the
      // ball reaches it. Both plugins load only because this section exists.
      const path = document.querySelector<SVGPathElement>("#method-path");

      if (isDesktop && path) {
        let cancelled = false;

        void Promise.all([loadDrawSVG(), loadMotionPath()])
          .then(() => {
            if (cancelled) return;
            const svg = path.ownerSVGElement;
            if (!svg) return;

            // DrawSVG owns stroke-dasharray, so the dotted rest state has to go.
            path.style.strokeDasharray = "";

            const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ball.setAttribute("r", "7");
            ball.setAttribute("fill", "currentColor");
            ball.setAttribute("class", "text-lime");
            svg.appendChild(ball);

            const steps = gsap.utils.toArray<HTMLElement>("[data-method-step]");

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: svg,
                start: "top 78%",
                end: "bottom 45%",
                scrub: 1,
              },
            });

            tl.fromTo(path, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" }, 0).to(
              ball,
              { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } },
              0,
            );

            // Each step brightens as the ball passes it.
            steps.forEach((step, index) => {
              const at = steps.length > 1 ? index / (steps.length - 1) : 0;
              tl.fromTo(
                step,
                { opacity: 0.5 },
                { opacity: 1, duration: 0.15 },
                Math.max(0, at * tl.duration() - 0.05),
              );
            });

            add(() => {
              tl.scrollTrigger?.kill();
              tl.kill();
              ball.remove();
            });
          })
          .catch(() => undefined);

        add(() => {
          cancelled = true;
        });
      }

      /* ================================================ VOICES — marquee */
      // Continuous loop whose speed and direction follow scroll velocity. The
      // track is rendered twice, so translating it by exactly -50% is seamless.
      const marqueeViewport = document.querySelector<HTMLElement>(
        "[data-marquee-viewport]",
      );
      const marqueeTrack = document.querySelector<HTMLElement>("[data-marquee-track]");

      // Desktop only, for the same reason as the pin. On a phone an
      // auto-scrolling band cannot be hovered to pause and, once its overflow
      // is taken away, cannot be swiped either — a swipeable list is simply the
      // better control there.
      if (isDesktop && marqueeViewport && marqueeTrack) {
        // It is a native scroller at rest; the marquee takes the wheel here.
        marqueeViewport.style.overflowX = "hidden";

        const loop = gsap.to(marqueeTrack, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });

        const velocity = ScrollTrigger.create({
          trigger: marqueeViewport,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // Scrolling down speeds it up; scrolling up runs it backwards.
            const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 320);
            gsap.to(loop, {
              timeScale:
                self.direction === -1 ? -1 - Math.abs(boost) : 1 + Math.abs(boost),
              duration: duration.base,
              overwrite: true,
            });
          },
        });

        const pause = () => loop.pause();
        const resume = () => loop.play();
        marqueeViewport.addEventListener("pointerenter", pause);
        marqueeViewport.addEventListener("pointerleave", resume);

        add(() => {
          marqueeViewport.removeEventListener("pointerenter", pause);
          marqueeViewport.removeEventListener("pointerleave", resume);
          velocity.kill();
          loop.kill();
          marqueeViewport.style.overflowX = "";
          gsap.set(marqueeTrack, { clearProps: "transform" });
        });
      }

      /* ========================================= SET 07 — membership fan */
      // The three plans arrive stacked and open out.
      //
      // This owns the cards outright — they carry `data-animate="fan"`, not
      // "rise", so SectionMotion never touches them. When both did, the batch's
      // `overwrite` killed this tween mid-flight and left `xPercent` and
      // `rotate` frozen at their start values: the cards read as static because
      // the only animation still running was the one that could not undo the
      // other's transform.
      //
      // Explicit fromTo rather than `from`, so the start state is stated rather
      // than inferred, and the CSS pre-state has nothing to disagree with.
      const plans = gsap.utils.toArray<HTMLElement>('[data-animate="fan"]');
      if (plans.length) {
        const tween = gsap.fromTo(
          plans,
          {
            // Stacked and tilted on desktop; a plain rise on narrow screens,
            // where three overlapping cards would just be a mess.
            xPercent: (index: number) => (isDesktop ? (index - 1) * -30 : 0),
            rotate: (index: number) => (isDesktop ? (index - 1) * -3 : 0),
            y: 40,
            autoAlpha: 0,
          },
          {
            xPercent: 0,
            rotate: 0,
            y: 0,
            autoAlpha: 1,
            duration: duration.slow,
            ease: ease.outExpo,
            stagger: 0.08,
            clearProps: "transform",
            scrollTrigger: { trigger: plans[0], start: "top 85%", once: true },
          },
        );
        add(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(plans, { clearProps: "all" });
        });
      }

      /* ============================================ MATCH POINT — the ball */
      // Crosses the plate and bounces twice, losing height each time, then the
      // CTA takes one pulse on impact. Nothing here exceeds 1.5s.
      const ball = document.querySelector<HTMLElement>("[data-matchpoint-ball]");
      const matchPoint = document.getElementById("match-point");

      if (isDesktop && ball && matchPoint) {
        const cta = matchPoint.querySelector<HTMLElement>("button");
        const travel = () => matchPoint.offsetWidth * 0.82;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: matchPoint, start: "top 55%", once: true },
        });

        tl.set(ball, { autoAlpha: 1 })
          .to(ball, { x: travel, duration: 1.25, ease: "none" }, 0)
          // Two arcs, the second shorter — a ball that loses energy.
          .to(ball, { y: -170, duration: 0.42, ease: "power2.out" }, 0)
          .to(ball, { y: 0, duration: 0.42, ease: "power2.in" }, 0.42)
          .to(ball, { y: -70, duration: 0.24, ease: "power2.out" }, 0.84)
          .to(ball, { y: 0, duration: 0.24, ease: "power2.in" }, 1.08)
          .to(ball, { autoAlpha: 0, duration: duration.fast }, 1.3);

        if (cta) {
          tl.to(cta, { scale: 1.05, duration: 0.12, ease: "power2.out" }, 0.84).to(
            cta,
            { scale: 1, duration: 0.34, ease: "elastic.out(1, 0.45)" },
            0.96,
          );
        }

        add(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      }

      /* ========================================= PLATES — the page's breath */
      // Every plate opens by the same small clip, so the page has one rhythm
      // rather than ten separate arrivals. Deliberately subtle: 5% at the
      // bottom edge, once, and gone.
      //
      // The hero is excluded because it already owns a clip on entrance and a
      // scale on exit, and SET 03 because clipping a pinned element fights the
      // pin's own spacer.
      const plates = gsap.utils
        .toArray<HTMLElement>("main > section")
        .filter((section) => section.id !== "hero" && section.id !== "programs");

      for (const section of plates) {
        const tween = gsap.from(section, {
          clipPath: "inset(0% 0% 5% 0%)",
          duration: duration.slow,
          ease: ease.outExpo,
          scrollTrigger: { trigger: section, start: "top 88%", once: true },
          // The clip is only needed while it animates; left behind it would be
          // a permanent containing block for any fixed descendant.
          onComplete: () => gsap.set(section, { clearProps: "clipPath" }),
        });
        add(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(section, { clearProps: "clipPath" });
        });
      }

      // ScrollTrigger measured everything above against a layout that the pin
      // has since changed. One refresh, after the pin exists.
      ScrollTrigger.refresh();

      return () => cleanups.forEach((cleanup) => cleanup());
    });
  });

  return null;
}
