import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { fillBookingForm, scrollToBottom, settleMotion, waitForFonts } from "./helpers";

/**
 * The automated half of the accessibility work.
 *
 * axe finds roughly a third of what is wrong with a page — contrast, names,
 * roles, structure — and none of what only a person can judge. The manual half
 * is `docs/ACCESSIBILITY.md`; this file is the part that can fail a build.
 *
 * Critical and serious only, deliberately. "Moderate" includes things like
 * heading-order preferences that are a judgement call, and a gate that fails on
 * judgement calls gets switched off within a month.
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function scan(page: Page) {
  await settleMotion(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations
    .filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    )
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      // The summary carries the measured ratio and the two colours, which is
      // the difference between "fix this" and "fix what, exactly".
      nodes: violation.nodes.map(
        (node) => `${node.target.join(" ")} — ${node.failureSummary}`,
      ),
    }));
}

test.describe("axe", () => {
  test("the page as it loads", async ({ page }) => {
    await page.goto("/");
    await waitForFonts(page);
    expect(await scan(page)).toEqual([]);
  });

  test("the page after everything has revealed itself", async ({ page }) => {
    await page.goto("/");
    await waitForFonts(page);
    await scrollToBottom(page);
    expect(await scan(page)).toEqual([]);
  });

  test("with the mobile menu open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForFonts(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  test("with the booking form submitted", async ({ page }) => {
    await page.goto("/#book");
    await waitForFonts(page);
    await fillBookingForm(page);
    await page.getByRole("button", { name: "Book the session" }).click();

    await expect(page.getByText("Booked. Look out for an email.")).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });
});
