/**
 * Renders an interactive state statically so `/styleguide` can show default,
 * hover, active and focus side by side.
 *
 * Every primitive that declares a `:hover` / `:active` / `:focus-visible` rule
 * pairs it with the matching `data-[force=…]` variant, so there is one source
 * of truth for the state's appearance and the documentation cannot drift from
 * the component. Nothing outside the styleguide should set this.
 */
export type ForceState = {
  "data-force"?: "hover" | "active" | "focus";
};
