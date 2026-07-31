import { expect, test } from "@playwright/test";

import { waitForFonts } from "./helpers";

/**
 * The hero, held still and photographed.
 *
 * Every test in this file runs under `prefers-reduced-motion: reduce`, which is
 * not a compromise — it is the only honest way to photograph this page. With
 * motion on, the hero is a 1.4-second entrance over a carousel that advances
 * itself every six seconds, and a screenshot of that is a picture of whenever
 * the shutter happened to open. Reduced motion is also a state the site
 * promises to support, so this doubles as the test that it renders finished
 * rather than blank.
 */
test.beforeEach(async ({ page }) => {
  // Before `goto`, not after: the components read the preference once, on mount.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

const WIDTHS = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

test("the mobile menu covers the whole screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForFonts(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();

  // The regression this guards: the panel is `fixed inset-0`, and `fixed`
  // resolves against the nearest transformed ancestor. Rendered inside the
  // header — which carries a transform from its entrance and another when it
  // condenses — "the whole screen" meant "the nav pill", and the menu painted
  // a dark rectangle about 90 x 40 in the corner with its links spilling over
  // the hero. It is portalled to `<body>` now, and this photograph is what
  // notices if it ever goes back.
  await expect(page).toHaveScreenshot("menu-open.png");
});

for (const { name, width, height } of WIDTHS) {
  test(`the hero at ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await waitForFonts(page);
    // The hero photograph is `priority`, so it is decoded before this resolves.
    await page.waitForLoadState("networkidle");

    await expect(page.locator("#hero")).toHaveScreenshot(`hero-${name}.png`);
  });
}
