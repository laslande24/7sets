"use client";

import { gsap, loadSplitText, ScrollTrigger, useGSAP, withWillChange } from "@/lib/gsap";
import { motionTokens, REVEAL_START } from "@/lib/gsap/config";

/**
 * Wires the page's baseline scroll motion in one place.
 *
 * The sections are Server Components. Wrapping their markup in client
 * primitives would drag ten subtrees across the client boundary for the sake of
 * a fade, so instead they carry plain `data-animate` attributes and this single
 * client component animates them.
 *
 *   data-animate="rise"      fade and rise, batched with its neighbours
 *   data-animate="lines"     revealed line by line from behind a mask
 *   data-animate="parallax"  offset scrubbed against scroll
 *   data-count-to="640"      counts up from zero
 *
 * `ScrollTrigger.batch` rather than one trigger per element: everything that
 * crosses the line together animates together, with a stagger, from a single
 * callback. Elements are resolved to real nodes before being handed over, never
 * passed as selector strings — a scoped `useGSAP` would resolve those against
 * this component, which renders nothing.
 *
 * The signature moments — the pinned horizontal rail, the drawn method path,
 * the scroll-reactive marquee — are Phase 5. This is the rhythm underneath them.
 */

const STAGGER = 0.08;

export function SectionMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const { duration, ease } = motionTokens();
      const cleanups: Array<() => void> = [];

      /* ---------------------------------------------------------- rise */
      const rising = gsap.utils.toArray<HTMLElement>('[data-animate="rise"]');
      if (rising.length) {
        ScrollTrigger.batch(rising, {
          start: REVEAL_START,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: duration.base,
              stagger: STAGGER,
              ease: ease.outExpo,
              // "auto", not true: true kills every tween on these targets,
              // including one from SignatureMotion that owns other properties.
              // "auto" only clears the properties this tween actually sets.
              overwrite: "auto",
              onStart: () => {
                for (const el of batch)
                  (el as HTMLElement).style.willChange = "transform, opacity";
              },
              onComplete: () => {
                for (const el of batch) (el as HTMLElement).style.willChange = "";
              },
            });
          },
        });
      }

      /* --------------------------------------------------------- lines */
      const headings = gsap.utils.toArray<HTMLElement>('[data-animate="lines"]');
      if (headings.length) {
        let cancelled = false;

        // Splitting before the webfont resolves measures line breaks in the
        // fallback face, and every line lands in the wrong place.
        void Promise.all([loadSplitText(), document.fonts?.ready])
          .then(([SplitText]) => {
            if (cancelled) return;
            for (const heading of headings) {
              const split = new SplitText(heading, { type: "lines", mask: "lines" });
              gsap.set(heading, { autoAlpha: 1 });
              const tween = gsap.from(split.lines, {
                yPercent: 110,
                duration: duration.slow,
                stagger: STAGGER,
                ease: ease.outExpo,
                ...withWillChange(heading, "transform"),
                scrollTrigger: { trigger: heading, start: REVEAL_START, once: true },
              });
              cleanups.push(() => {
                tween.scrollTrigger?.kill();
                tween.kill();
                split.revert();
              });
            }
          })
          // Never leave text invisible because a plugin chunk failed.
          .catch(() => gsap.set(headings, { autoAlpha: 1 }));

        cleanups.push(() => {
          cancelled = true;
        });
      }

      /* -------------------------------------------------- hero expand */
      // The hero sits inset from the page edges like every other plate. As you
      // scroll away from it, it grows until it is exactly full-bleed, then the
      // next plate paints over it and takes the page. Uniform scale, so the
      // photograph is never stretched.
      //
      // The target is computed rather than fixed: the side margin is
      // `min(5.83vw, 84px)`, so the ratio is a constant 1.132 until the 84px cap
      // takes over past 1440, after which it falls away. `invalidateOnRefresh`
      // recomputes it whenever the layout is remeasured.
      const heroPlate = document.querySelector<HTMLElement>('[data-animate="expand"]');
      if (heroPlate) {
        const tween = gsap.fromTo(
          heroPlate,
          { scale: 1 },
          {
            // offsetWidth is the untransformed layout width, so this stays
            // correct even when re-read mid-tween. The target is
            // documentElement.clientWidth, not window.innerWidth — innerWidth
            // includes the scrollbar, which would push the plate a few pixels
            // under it and give the document a horizontal scroll.
            scale: () =>
              heroPlate.offsetWidth
                ? document.documentElement.clientWidth / heroPlate.offsetWidth
                : 1,
            ease: "none",
            transformOrigin: "50% 50%",
            scrollTrigger: {
              trigger: heroPlate,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
              onEnter: () => (heroPlate.style.willChange = "transform"),
              onEnterBack: () => (heroPlate.style.willChange = "transform"),
              onLeave: () => (heroPlate.style.willChange = ""),
              onLeaveBack: () => (heroPlate.style.willChange = ""),
            },
          },
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          heroPlate.style.willChange = "";
        });
      }

      /* ------------------------------------------------------ parallax */
      for (const layer of gsap.utils.toArray<HTMLElement>('[data-animate="parallax"]')) {
        const speed = Number(layer.dataset.parallaxSpeed ?? 0.12);
        const tween = gsap.fromTo(
          layer,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              // The compositor layer exists while the element is on screen and
              // not a moment longer.
              onEnter: () => (layer.style.willChange = "transform"),
              onEnterBack: () => (layer.style.willChange = "transform"),
              onLeave: () => (layer.style.willChange = ""),
              onLeaveBack: () => (layer.style.willChange = ""),
            },
          },
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          layer.style.willChange = "";
        });
      }

      /* ------------------------------------------------------ counters */
      for (const figure of gsap.utils.toArray<HTMLElement>("[data-count-to]")) {
        const target = Number(figure.dataset.countTo);
        if (!Number.isFinite(target)) continue;

        const finalText = figure.textContent ?? "";
        const suffix = finalText.replace(/[\d\s,]/g, "");
        const box = figure.getBoundingClientRect();
        // Already on screen at load: leave the rendered figure alone rather
        // than dropping it to zero in front of the reader.
        if (box.top < window.innerHeight && box.bottom > 0) continue;

        const state = { value: 0 };
        figure.textContent = `0${suffix}`;

        const tween = gsap.to(state, {
          value: target,
          duration: duration.hero,
          ease: ease.outQuart,
          onUpdate: () => {
            figure.textContent = `${Math.round(state.value)}${suffix}`;
          },
          onComplete: () => {
            figure.textContent = finalText;
          },
          scrollTrigger: { trigger: figure, start: REVEAL_START, once: true },
        });

        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          figure.textContent = finalText;
        });
      }

      return () => cleanups.forEach((cleanup) => cleanup());
    });
  });

  return null;
}
