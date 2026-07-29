import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. Our type scale is named
 * (`text-label`, `text-display-xl`), and an unrecognised `text-*` falls into
 * tailwind-merge's *colour* group — so `text-label` was silently cancelling
 * `text-surface` and the ghost button rendered ink on the photograph.
 *
 * Registering the scale as font sizes puts each utility back in its own group.
 * Every name here must exist as a `--text-*` token in app/globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "body-lg",
            "body",
            "label",
            "caption",
          ],
        },
      ],
    },
  },
});

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
