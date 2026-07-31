/**
 * The one name shared by the three files that have to agree about SET 03's pin:
 * `Programs` writes it into `data-rail-pin`, `SignatureMotion` registers the
 * ScrollTrigger under it, and `RailKeyboard` looks it up to work out where the
 * page has to scroll for a focused card to be visible.
 *
 * It lives here rather than on either component because `Programs` is a Server
 * Component: a value imported from a `"use client"` module is a client
 * reference, and reading one during the server render throws.
 */
export const PROGRAMS_PIN_ID = "programs-pin";
