import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against a production build, on a port of their own.
 *
 * Not the dev server: it injects the Next.js dev overlay into the page, which
 * an accessibility scan has every right to complain about and which nobody
 * visiting the site will ever load. The separate port means a `npm run dev` on
 * 3000 can stay open while the suite runs.
 */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  // Tight, because a screenshot that has to allow for a lot of difference is
  // not testing anything. The 1% covers text antialiasing between runs.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: "pipe",
  },
});
