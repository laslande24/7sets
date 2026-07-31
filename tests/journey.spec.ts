import { expect, test } from "@playwright/test";

import {
  clickWhenStill,
  collectPageErrors,
  fillBookingForm,
  scrollToBottom,
  settleMotion,
  waitForFonts,
} from "./helpers";

test("loads, scrolls the whole way, and reports nothing broken", async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto("/");
  await waitForFonts(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Every Champion Starts Somewhere",
  );

  await scrollToBottom(page);
  await expect(page.getByRole("contentinfo")).toBeVisible();
  expect(errors).toEqual([]);
});

test("the landmarks are the ones we meant", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  // The floating nav, the score rail, and the footer's section list.
  await expect(page.getByRole("navigation")).toHaveCount(3);
});

test("the skip link is the first tab stop and lands on main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await skip.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("every Book free trial CTA goes to the booking form", async ({ page }) => {
  await page.goto("/");
  const ctas = page.getByRole("link", { name: "Book free trial" });
  expect(await ctas.count()).toBeGreaterThan(0);

  for (const cta of await ctas.all()) {
    await expect(cta).toHaveAttribute("href", "#book");
  }
});

test.describe("the mobile menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForFonts(page);
  });

  test("traps focus, closes on Escape, and hands focus back", async ({ page }) => {
    const grip = page.getByRole("button", { name: "Open menu" });
    await grip.click();

    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    // Focus goes to the panel, not to its first link: the links are still
    // animating in and a hidden element cannot take focus.
    await expect(dialog).toBeFocused();

    // Five stops: four links and Close. Tab off the last one wraps to the first.
    const stops = dialog.locator("a[href], button");
    await expect(stops).toHaveCount(5);
    // The last one, not the first: they arrive on a stagger, and Tab walks
    // straight past any that are still hidden.
    await expect(stops.last()).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(stops.first()).toBeFocused();

    for (let i = 0; i < 5; i += 1) await page.keyboard.press("Tab");
    await expect(stops.first()).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(stops.last()).toBeFocused();

    // Nothing behind it scrolls while it is open.
    await expect(page.locator("body")).toHaveCSS("overflow-y", "hidden");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });
});

test.describe("the booking form", () => {
  test("does not answer the two selects on the reader's behalf", async ({ page }) => {
    await page.goto("/#book");
    await expect(page.getByLabel("Level")).toHaveValue("");
    await expect(page.getByLabel("Preferred slot")).toHaveValue("");
  });

  test("submits and replaces itself with a reference", async ({ page }) => {
    await page.goto("/#book");
    await waitForFonts(page);
    await fillBookingForm(page);
    await clickWhenStill(page, page.getByRole("button", { name: "Book the session" }));

    await expect(page.getByText("Booked. Look out for an email.")).toBeVisible();
    await expect(page.getByText(/^7S-/)).toBeVisible();
    // The form is gone, not merely hidden behind the confirmation.
    await expect(page.getByLabel("First name")).toHaveCount(0);
  });

  test("names what is wrong and marks only the wrong fields", async ({ page }) => {
    await page.goto("/#book");
    await waitForFonts(page);

    await settleMotion(page);
    await page.getByLabel("First name").fill("Ada");
    await page.getByLabel("Last name").fill("Odusanya");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Phone").fill("020 7946 0180");
    await page.getByLabel("Player's age").fill("2");
    await page.getByLabel("Level").selectOption("improver");
    // Deliberately not answering "Preferred slot": the reader who never touches
    // a field is the one client-side-only validation forgets about.
    await clickWhenStill(page, page.getByRole("button", { name: "Book the session" }));

    // Still on the form, with the three unanswerable answers flagged — the bad
    // address, the four-year-old rule, and the slot never chosen — and nothing
    // else.
    await expect(page.getByLabel("First name")).toBeVisible();
    await expect(
      page.getByText(
        "That address is missing an @ or a domain — check it and try again.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Younger than that and we would rather you waited."),
    ).toBeVisible();
    await expect(page.getByText("Pick a slot that suits you.")).toBeVisible();

    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Player's age")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Preferred slot")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator("[aria-invalid='true']")).toHaveCount(3);
    // No message may simply say the field is invalid.
    await expect(page.getByText(/invalid/i)).toHaveCount(0);
  });
});
