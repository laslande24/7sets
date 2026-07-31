import type { Locator, Page } from "@playwright/test";

/**
 * Wheel events, not `window.scrollTo`.
 *
 * Lenis owns the scroll position while it is running: setting `scrollY` behind
 * its back leaves it holding the old value, and it animates straight back. A
 * wheel event is what it is listening for, so it is also what a test scrolls
 * with — and it exercises the same path a reader does.
 */
export async function scrollToBottom(page: Page, steps = 150) {
  for (let i = 0; i < steps; i += 1) {
    const done = await page.evaluate(
      () =>
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4,
    );
    if (done) break;
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(70);
  }
  // The pinned rail and the scrubbed tweens are one frame behind the scroll.
  await page.waitForTimeout(600);
}

/** Everything the page reported as broken while the test ran. */
export function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Waits for the webfont, which every measured animation is gated on. */
export async function waitForFonts(page: Page) {
  await page.waitForFunction(() => document.fonts.status === "loaded");
}

/**
 * Waits until nothing on the page is part-way through its reveal.
 *
 * Worth the wait for two different reasons. A scan taken mid-fade measures text
 * at `opacity: 0.4` against whatever is behind it and reports a contrast
 * failure that is true of every fade ever written. And a *click* taken mid-rise
 * lands on a target that then moves 24px before the mouse comes back up, so the
 * browser fires the click on the common ancestor instead of the button — which
 * is a submit that silently never happens, and cost an afternoon to find.
 */
export async function settleMotion(page: Page) {
  // Stability, not end states. "Opacity is 0 or 1" looks like a settled page
  // but reads exactly the same on an element that has not started yet — which
  // is every item in a staggered menu for the first third of a second, sitting
  // at `opacity: 0` and 48px below where it will end up.
  await page.waitForFunction(
    () => {
      const store = window as unknown as { __frame?: string; __same?: number };
      const frame = [
        // The method steps are excluded because they never settle: their
        // brightening is scrubbed against scroll and rests part-way until the
        // reader arrives, which is a resting state, not a transition.
        ...document.querySelectorAll<HTMLElement>(
          "[data-animate]:not([data-method-step]), [data-menu-item]",
        ),
      ]
        .map((element) => {
          const styles = getComputedStyle(element);
          return `${styles.opacity}|${styles.transform}`;
        })
        .join(",");

      if (store.__frame === frame) store.__same = (store.__same ?? 0) + 1;
      else {
        store.__frame = frame;
        store.__same = 0;
      }
      return (store.__same ?? 0) >= 3;
    },
    null,
    { timeout: 15_000, polling: 100 },
  );

  // And until the page has stopped moving. Playwright reveals an element by
  // scrolling to it, Lenis eases that scroll over about a second, and a click
  // during the ease puts mousedown and mouseup on different elements — which
  // fires no click at all.
  await page.waitForFunction(
    () => {
      const store = window as unknown as { __y?: number; __still?: number };
      const y = Math.round(window.scrollY);
      if (store.__y === y) store.__still = (store.__still ?? 0) + 1;
      else {
        store.__y = y;
        store.__still = 0;
      }
      return (store.__still ?? 0) >= 3;
    },
    null,
    { timeout: 10_000, polling: 100 },
  );
}

/**
 * Brings `target` into view, waits for the page to stop, then clicks it.
 *
 * Playwright reveals an element by scrolling to it and clicks immediately
 * after. Lenis eases that scroll, so the element is still travelling when the
 * mouse goes down — and by the time it comes up the button has moved out from
 * under it, which fires the click on an ancestor and submits nothing at all.
 */
export async function clickWhenStill(page: Page, target: Locator) {
  // Blur first. Pressing the button is itself what takes focus off the last
  // field, and this form validates on blur — so the error messages appear
  // between mousedown and mouseup, moving the button down the page by the
  // height of a line. Getting that out of the way first is what a reader does
  // anyway by looking at the field they just left.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await target.scrollIntoViewIfNeeded();
  await settleMotion(page);
  await target.click();
}

/**
 * Fills the booking form with valid answers.
 *
 * The action rate-limits at five submissions per IP per ten minutes, so the
 * suite submits it twice in total — once valid, once not. Adding a third
 * submitting test will start failing the other two.
 */
export async function fillBookingForm(page: Page) {
  await settleMotion(page);
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Odusanya");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Phone").fill("020 7946 0180");
  await page.getByLabel("Player's age").fill("11");
  await page.getByLabel("Level").selectOption("improver");
  await page.getByLabel("Preferred slot").selectOption("saturday");
}
