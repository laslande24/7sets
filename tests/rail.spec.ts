import { expect, test, type Locator, type Page } from "@playwright/test";

import { waitForFonts } from "./helpers";

/**
 * SET 03's rail, from a keyboard.
 *
 * On desktop this section is pinned and the cards are moved by `x`, so the
 * browser's own "scroll the focused thing into view" has nothing it can scroll.
 * These tests are the reason `RailKeyboard` exists: without it, focus lands on
 * a card that is somewhere off to the right of the window.
 */

/**
 * Wheels down until every programme card has revealed itself.
 *
 * Every one, not the first: the reveal is a staggered batch, so for a third of
 * a second the later cards are still `visibility: hidden` — and a hidden
 * element cannot take focus, which makes a test that starts before then a test
 * of the stagger rather than of the rail.
 */
async function reachTheRail(page: Page) {
  for (let i = 0; i < 60; i += 1) {
    const revealed = await page.evaluate(() =>
      [...document.querySelectorAll("[data-rail-item]")].every(
        (card) => getComputedStyle(card).visibility === "visible",
      ),
    );
    if (revealed) return;
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(80);
  }
  throw new Error("the programme cards never became visible");
}

/** True once `target` sits entirely inside the window, horizontally. */
async function isOnScreen(page: Page, target: Locator) {
  const box = await target.boundingBox();
  const width = page.viewportSize()?.width ?? 1440;
  return !!box && box.x >= 0 && box.x + box.width <= width;
}

/** Wheels down until `target` is somewhere inside the window. */
async function wheelInto(page: Page, target: Locator) {
  for (let i = 0; i < 80; i += 1) {
    const box = await target.boundingBox();
    const height = page.viewportSize()?.height ?? 900;
    if (box && box.y < height * 0.7 && box.y + box.height > 0) return;
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(80);
  }
  throw new Error("never scrolled the target into view");
}

test.describe("the programmes rail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForFonts(page);
    await reachTheRail(page);
  });

  test("arrow keys move between cards and keep them on screen", async ({ page }) => {
    const links = page.locator("[data-rail][data-rail-pin] [data-rail-item] a");

    await links.first().focus();
    await expect(links.first()).toBeFocused();

    for (let index = 1; index < 5; index += 1) {
      await page.keyboard.press("ArrowRight");
      await expect(links.nth(index)).toBeFocused();

      // The whole point: what has focus ends up where it can be seen. Polled
      // rather than measured once — the page scroll is eased and the rail is
      // scrubbed behind it, so it arrives about a second after the keypress.
      await expect
        .poll(() => isOnScreen(page, links.nth(index)), { timeout: 5000 })
        .toBe(true);
    }

    await page.keyboard.press("Home");
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(links.last()).toBeFocused();
  });

  test("the arrow past the last card is left to the browser", async ({ page }) => {
    const links = page.locator("[data-rail][data-rail-pin] [data-rail-item] a");
    await links.last().focus();
    await expect(links.last()).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(links.last()).toBeFocused();
  });

  test("the rail names itself and says how it works", async ({ page }) => {
    const rail = page.locator("[data-rail][data-rail-pin]");
    await expect(rail).toHaveAttribute("aria-label", "Programmes, horizontal list");

    const describedBy = await rail.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText(
      "Use the left and right arrow keys to move through the list.",
    );
  });
});

test("the testimonial band can be reached, and reaching it stops it", async ({
  page,
}) => {
  await page.goto("/");
  await waitForFonts(page);

  const band = page.locator("[data-marquee-viewport]");
  await expect(band).toHaveAttribute("tabindex", "0");
  await expect(band).toHaveAttribute("aria-label", "Testimonials, horizontal list");

  await wheelInto(page, band);
  await page.waitForTimeout(600);

  const positionOf = () =>
    page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("[data-marquee-track]");
      return track ? new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 : 0;
    });

  // WCAG 2.2.2 wants moving content to be stoppable, and focus is the only
  // stopping mechanism a keyboard has here.
  await band.focus();
  await page.waitForTimeout(150);
  const stopped = await positionOf();
  await page.waitForTimeout(700);
  expect(Math.abs((await positionOf()) - stopped)).toBeLessThan(2);
});
