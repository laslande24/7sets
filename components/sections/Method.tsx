import { Eyebrow, SectionShell } from "@/components/ui";
import { method } from "@/content/method";

/**
 * SET 04 — Assess, Drill, Play, Compete.
 *
 * The curve is one path so Phase 5 can draw it with DrawSVG and run a ball
 * along it with MotionPath. It is decorative — the four steps below read
 * perfectly without it, which is why it carries `aria-hidden` and why it is
 * hidden outright on narrow screens where it would only add noise.
 */
export function Method() {
  return (
    <SectionShell id="method" tone="court">
      <div className="max-w-[46rem]">
        <div data-animate="rise">
          <Eyebrow set={4} onDark>
            {method.eyebrow}
          </Eyebrow>
        </div>
        <h2 data-animate="lines" className="mt-4 text-display-lg">
          {method.title}
        </h2>
        <p data-animate="rise" className="mt-4 text-body-lg text-surface/75">
          {method.body}
        </p>
      </div>

      <svg
        viewBox={method.path.viewBox}
        aria-hidden="true"
        preserveAspectRatio="none"
        className="mt-12 hidden h-40 w-full lg:block"
      >
        <path
          id={method.path.id}
          d={method.path.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 10"
          className="text-surface/45"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ol className="mt-12 grid gap-x-gutter gap-y-10 lg:mt-4 lg:grid-cols-4">
        {method.steps.map((step, index) => (
          <li key={step.id} data-method-step={step.id} data-animate="rise">
            <p className="text-label text-lime-300 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-display-md">{step.title}</h3>
            <p className="mt-1 text-caption tracking-wider text-surface/60 uppercase">
              {step.duration}
            </p>
            <p className="mt-3 max-w-[34ch] text-body text-surface/75">{step.body}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
