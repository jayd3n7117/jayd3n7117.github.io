import { expect, test as base } from "@playwright/test";

const GOOGLE_ANALYTICS_URL_PATTERN =
  /^https:\/\/(?:[^/]+\.)?(?:googletagmanager\.com|google-analytics\.com)\/|^https:\/\/analytics\.google\.com\/|^https:\/\/stats\.g\.doubleclick\.net\//;

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("https://formspree.io/**", async (route) => {
      await route.abort("blockedbyclient");
    });
    await page.route(GOOGLE_ANALYTICS_URL_PATTERN, async (route) => {
      await route.abort("blockedbyclient");
    });
    await use(page);
  },
});

export { expect, test };
