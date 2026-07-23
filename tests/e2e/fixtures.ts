import { expect, test as base } from "@playwright/test";

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("https://formspree.io/**", async (route) => {
      await route.abort("blockedbyclient");
    });
    await use(page);
  },
});

export { expect, test };
