import { expect, test } from "./fixtures";
import {
  getSupportingPage,
  supportingPageKeys,
} from "../../src/content/pages";

const productionOrigin = new URL(
  process.env.PUBLIC_SITE_URL ?? "https://join.coway.test",
).origin;

const localizedRoutes = [
  { locale: "en", lang: "en-MY" },
  { locale: "bm", lang: "ms-MY" },
  { locale: "zh", lang: "zh-CN" },
] as const;

for (const locale of ["en", "zh"] as const) {
  for (const pageKey of supportingPageKeys) {
    test(`renders the ${locale}/${pageKey} supporting recruitment page`, async ({ page }) => {
      const response = await page.goto(`/${locale}/${pageKey}/`);
      const content = getSupportingPage(locale, pageKey);

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(content.meta.title);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toHaveText(content.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${productionOrigin}/${locale}/${pageKey}/`,
      );
      await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);
      await expect(page.locator("nav[aria-label*=Breadcrumb]")).toHaveCount(1);
      expect(await page.locator("main article .content-section").count()).toBeGreaterThanOrEqual(3);
      await expect(page.locator("main .trust-disclosure")).toHaveCount(1);
      await expect(page.locator("main h1.trust-disclosure")).toHaveCount(0);
      const schemaTypes = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type']));
      expect(schemaTypes).toEqual(['BreadcrumbList', 'FAQPage']);
      if (locale === 'zh') {
        await expect(page.locator('.content-hero-orbit')).toHaveText('学习行动带领');
      }
    });
  }
}

for (const width of [375, 1440]) {
  test(`keeps the supporting-page growth pill clear of copy at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/coway-sales-career/');
    const introduction = await page.locator('.content-introduction').boundingBox();
    const orbit = page.locator('.content-hero-orbit');
    const orbitBounds = await orbit.boundingBox();

    expect(introduction).not.toBeNull();
    expect(orbitBounds).not.toBeNull();
    await expect(orbit).toHaveCSS('position', 'absolute');
    expect(
      orbitBounds!.x < introduction!.x + introduction!.width &&
      orbitBounds!.x + orbitBounds!.width > introduction!.x &&
      orbitBounds!.y < introduction!.y + introduction!.height &&
      orbitBounds!.y + orbitBounds!.height > introduction!.y,
    ).toBe(false);
  });
}

test("blocks unmocked Formspree requests suite-wide", async ({ context, page }) => {
  let escapedGlobalGuard = false;
  await context.route("https://formspree.io/**", async (route) => {
    escapedGlobalGuard = true;
    await route.fulfill({
      status: 204,
      contentType: "application/json",
      body: "",
    });
  });

  await page.goto("/en/");
  const outcome = await page.evaluate(async () => {
    try {
      const response = await fetch("https://formspree.io/f/unmocked-guard-probe", {
        method: "POST",
      });
      return `resolved:${response.status}`;
    } catch {
      return "blocked";
    }
  });

  expect(outcome).toBe("blocked");
  expect(escapedGlobalGuard).toBe(false);
});

test("blocks unmocked Google Analytics requests suite-wide", async ({
  context,
  page,
}) => {
  const escapedGlobalGuard: string[] = [];
  await context.route(
    /https:\/\/(?:www\.googletagmanager\.com|(?:www\.|region1\.)?google-analytics\.com|analytics\.google\.com|stats\.g\.doubleclick\.net)\/.*/,
    async (route) => {
      escapedGlobalGuard.push(route.request().url());
      await route.fulfill({ status: 204, body: "" });
    },
  );

  await page.goto("/en/");
  const outcomes = await page.evaluate(async () => {
    const urls = [
      "https://www.googletagmanager.com/gtag/js?id=G-KGTRGW5765",
      "https://www.google-analytics.com/g/collect?v=2&tid=G-KGTRGW5765",
      "https://region1.google-analytics.com/g/collect?v=2&tid=G-KGTRGW5765",
      "https://analytics.google.com/g/collect?v=2&tid=G-KGTRGW5765",
      "https://stats.g.doubleclick.net/g/collect?v=2&tid=G-KGTRGW5765",
    ];

    return Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url);
          return `resolved:${response.status}`;
        } catch {
          return "blocked";
        }
      }),
    );
  });

  expect(outcomes).toEqual(Array(5).fill("blocked"));
  expect(escapedGlobalGuard).toEqual([]);
});

for (const { locale, lang } of localizedRoutes) {
  test(`renders the ${locale} locale route`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`);

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${productionOrigin}/${locale}/`,
    );
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);

    const languageControl = page.locator("header .language-menu > summary");
    await expect(languageControl).toBeVisible();

    for (const label of ["English", "Bahasa Malaysia", "中文"]) {
      await expect(
        page.locator(`footer [data-locale-link]`, { hasText: label }),
      ).toBeVisible();
    }

    await expect(page.locator('footer a[href="https://www.coway.com.my/"]')).toHaveCount(0);
    await expect(page.locator('[data-social-platform]')).toHaveCount(4);
    await expect(page.locator('[data-social-platform][aria-disabled="true"]')).toHaveCount(0);
    await expect(page.locator('a[data-social-platform]')).toHaveCount(4);
    await expect(page.locator(".site-disclosure")).toContainText(
      contentDisclosure(locale),
    );
  });
}

test("publishes production crawl and metadata guards", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toBe(
    `User-agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap-index.xml\n`,
  );

  const sitemapIndex = await request.get("/sitemap-index.xml");
  expect(await sitemapIndex.text()).toContain(`${productionOrigin}/sitemap-0.xml`);
  const sitemap = await request.get("/sitemap-0.xml");
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain(`${productionOrigin}/en/`);
  expect(sitemapText).toContain(`${productionOrigin}/bm/`);
  expect(sitemapText).toContain(`${productionOrigin}/zh/`);

  for (const locale of ["en", "bm", "zh"]) {
    await page.goto(`/${locale}/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const source of structuredData) {
      const schema = JSON.parse(source) as { "@type"?: string | string[] };
      expect([schema["@type"]].flat()).not.toContain("JobPosting");
    }
    expect(await page.content()).not.toContain("example.com");
    for (const image of await page.locator("img").all()) {
      await expect(image).toHaveAttribute("alt", /\S/);
      await expect(image).toHaveAttribute("width", /^\d+$/);
      await expect(image).toHaveAttribute("height", /^\d+$/);
    }
  }
});

function contentDisclosure(
  locale: (typeof localizedRoutes)[number]["locale"],
): string {
  return {
    en: "Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia.",
    bm: "Coway Sales Career ialah laman web pengambilan bebas yang dikendalikan oleh pasukan jualan Coway di Malaysia.",
    zh: "Coway Sales Career 是由马来西亚 Coway 销售团队运营的独立招聘网站。",
  }[locale];
}

test("uses native language navigation and stable locale links", async ({
  page,
}) => {
  await page.goto("/en/");

  const languageMenu = page.locator("header .language-menu");
  await languageMenu.locator(":scope > summary").click();
  await expect(languageMenu).toHaveAttribute("open", "");
  await expect(languageMenu.locator("[data-locale-link]")).toHaveCount(3);

  await languageMenu.locator('[data-locale-link][href="/bm/"]').click();
  await expect(page).toHaveURL(/\/bm\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ms-MY");
});

test("keeps the prominent Apply action visible within a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/en/");

  const applyAction = page.locator("header .button-accent");
  await expect(applyAction).toBeVisible();

  const bounds = await applyAction.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  const languageBounds = await page
    .locator("header .language-menu > summary")
    .boundingBox();
  expect(languageBounds).not.toBeNull();
  expect(languageBounds!.height).toBeGreaterThanOrEqual(44);
});

test("uses a two-color focus indicator visible across page surfaces", async ({
  page,
}) => {
  await page.goto("/en/");

  const applyAction = page.locator("header .button-accent");
  await applyAction.focus();

  await expect(applyAction).toBeFocused();
  expect(
    await applyAction.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    }),
  ).toEqual({
    outlineColor: "rgb(251, 250, 255)",
    outlineWidth: "3px",
    boxShadow: "rgb(140, 103, 232) 0px 0px 0px 6px",
  });
});

test("opens the prefixed English locale from the root route", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en\/$/);
});

test("renders the complete landing story with honest opportunity details", async ({
  page,
}) => {
  await page.goto("/en/");

  for (const id of ["opportunity", "support", "growth", "faq", "apply"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("#support article")).toHaveCount(6);
  const opportunity = page.locator("#opportunity");
  await expect(opportunity).toContainText("RM2,500-RM10,000+");
  await expect(opportunity).toContainText("Fully commission-based");
  await expect(opportunity).toContainText("No income is guaranteed");
  await expect(page.locator(".team-media-heading .lede")).toContainText(
    "There is no me in this team. Only us.",
  );
  await expect(page.locator("#faq details")).toHaveCount(7);
  await expect(page.locator("main h1")).toHaveCount(1);
  expect(await page.locator("main h2").count()).toBeGreaterThanOrEqual(8);
});

test("renders the approved recruitment hero hierarchy", async ({ page }) => {
  await page.goto("/en/");
  const hero = page.locator("[data-career-hero]");
  await expect(hero).toHaveCount(1);
  await expect(hero.locator("h1")).toHaveText(
    "Build a sales career that moves you forward.",
  );
  await expect(hero.locator(".hero-actions .button-primary")).toHaveCount(1);
  await expect(hero.locator(".hero-actions .button-secondary")).toHaveCount(1);
  await expect(hero.locator(".hero-growth-panel")).toBeVisible();
  await expect(hero.locator("[data-hero-stage]")).toHaveCount(3);
  await expect(hero).not.toContainText("not the official corporate website");
});

test('publishes WebSite structured data on the homepage and links the content cluster', async ({ page }) => {
  await page.goto('/en/');
  const schemaTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type']));
  expect(schemaTypes).toContain('WebSite');
  await expect(page.locator('footer .footer-guides a')).toHaveCount(5);
});

for (const width of [320, 1440]) {
  test(`keeps the approved hero inside a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");

    const hero = page.locator("[data-career-hero]");
    await expect(hero).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const bounds = await hero.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
  });
}

test("connects the three career stages into one journey", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("[data-journey]")).toHaveCount(1);
  await expect(page.locator("[data-journey-step]")).toHaveCount(3);
  await expect(page.locator("[data-journey-step]").nth(0)).toContainText("Learn");
  await expect(page.locator("[data-journey-step]").nth(2)).toContainText("leadership");
});

for (const width of [375, 768, 1024, 1440]) {
  test(`Performance Sport layout fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");
    expect(await page.evaluate(() => ({
      documentFits:
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
      bodyFits:
        document.body.scrollWidth <= document.documentElement.clientWidth,
    }))).toEqual({ documentFits: true, bodyFits: true });
    await expect(page.locator("[data-media-grid]")).toBeVisible();
    await expect(page.locator("[data-journey]")).toBeVisible();
  });
}

for (const width of [320, 768, 1440]) {
  test(`keeps responsive footer gutters at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");

    const expectedGutter = Math.min(80, Math.max(20, width * 0.04));
    for (const shell of await page.locator("footer .shell").all()) {
      const bounds = await shell.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(expectedGutter - 1);
      expect(width - (bounds!.x + bounds!.width)).toBeGreaterThanOrEqual(
        expectedGutter - 1,
      );
    }
  });
}

test("keeps recruitment controls touch-sized with readable contrast", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/en/");

  for (const selector of [
    ".hero-actions .button-primary",
    ".hero-actions .button-secondary",
    "header .button-accent",
  ]) {
    const bounds = await page.locator(selector).boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }

  await expect(page.locator(".career-hero")).toHaveCSS(
    "color",
    "rgb(251, 250, 255)",
  );
  await expect(page.locator(".button-primary")).toHaveCSS(
    "color",
    "rgb(9, 7, 17)",
  );
});

test("uses an accessible user-controlled team video", async ({ page }) => {
  await page.goto("/en/");
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).not.toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("poster", /team-video-poster\.webp$/);
  await expect(video.locator('source[type="video/mp4"]')).toHaveCount(1);
  await expect(video.locator('source[type="video/webm"]')).toHaveCount(1);
});

test("uses one complete media mosaic without empty tiles", async ({ page }) => {
  await page.goto("/en/");
  const grid = page.locator("[data-media-grid]");
  await expect(grid).toHaveCount(1);
  await expect(grid.locator("[data-media-tile]")).toHaveCount(4);
  await expect(grid.locator("video")).toHaveAttribute("controls", "");
  await expect(grid.locator('video source[type="video/mp4"]')).toHaveCount(1);
});

for (const width of [320, 390, 1440]) {
  test(`has no horizontal page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");
    expect(await page.evaluate(() => ({
      documentFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      bodyFits: document.body.scrollWidth <= document.documentElement.clientWidth,
    }))).toEqual({ documentFits: true, bodyFits: true });
  });
}

for (const { width, expectedRatio } of [
  { width: 375, expectedRatio: 4 / 3 },
  { width: 768, expectedRatio: 4 / 5 },
  { width: 1024, expectedRatio: 4 / 5 },
  { width: 1440, expectedRatio: 4 / 5 },
] as const) {
  test(`keeps the application image proportional at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/');
    const visual = page.locator('.application-visual');
    await visual.scrollIntoViewIfNeeded();
    const box = await visual.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(expectedRatio, 1);
    await expect(visual.locator('img')).toHaveCSS('object-fit', 'cover');
    expect(await page.evaluate(() => document.body.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

test('uses the team-meeting photograph in the application section', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.application-visual img')).toHaveAttribute(
    'src',
    /\/media\/team-meeting-\d+\.webp$/,
  );
});

for (const locale of ["bm", "zh"] as const) {
  test(`keeps ${locale} landing sections localized`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const support = page.locator("#support");
    const opportunity = page.locator("#opportunity");
    await expect(support.locator("article")).toHaveCount(6);
    await expect(support).toContainText(locale === "bm" ? "Sokongan praktikal" : "\u52a9\u4f60\u524d\u8fdb\u7684\u5b9e\u7528\u652f\u6301");
    await expect(opportunity).toContainText("RM2,500-RM10,000+");
    await expect(opportunity).toContainText(locale === "bm" ? "Tiada pendapatan yang dijamin" : "\u4e0d\u4fdd\u8bc1\u4efb\u4f55\u6536\u5165");
    await expect(page.locator("#apply")).toContainText(locale === "bm" ? "Mulakan perbualan" : "\u5f00\u59cb\u6c9f\u901a");
  });
}

test("validates inline, focuses the first error, and preserves values", async ({ page }) => {
  await page.goto("/en/");
  const form = page.locator("[data-application-form]");
  await form.locator('[name="currentJob"]').fill("Designer");
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[name="name"]')).toBeFocused();
  await expect(form.locator("#name-error")).toContainText("required");
  await expect(form.locator('[name="currentJob"]')).toHaveValue("Designer");
});

test("posts once, confirms success, and clears fields only after acceptance", async ({ page }) => {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  const requests: Array<{ method: string; body: string | null }> = [];
  await page.route("https://formspree.io/f/xvzebykj", async (route) => {
    const request = route.request();
    requests.push({ method: request.method(), body: request.postData() });
    await responseGate;
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.goto("/en/");
  const form = page.locator("[data-application-form]");
  const honeypot = form.locator('[name="_gotcha"]');
  await expect(honeypot).toHaveAttribute("aria-hidden", "true");
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
  await form.locator('[name="name"]').fill("Aina Rahman");
  await form.locator('[name="ageRange"]').selectOption("25-34");
  await form.locator('[name="currentJob"]').fill("Designer");
  await form.locator('[name="contactNumber"]').fill("012-345 6789");
  await form.locator('[name="state"]').selectOption("Selangor");
  await form.locator('[name="salesExperience"]').selectOption("1-3");
  await form.locator('[name="consent"]').check();
  const disabledDuringSubmission = await form.evaluate((formElement) => {
    const event = () => new SubmitEvent("submit", { bubbles: true, cancelable: true });
    formElement.dispatchEvent(event());
    formElement.dispatchEvent(event());
    return (formElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled;
  });
  expect(disabledDuringSubmission).toBe(true);
  await expect.poll(() => requests.length).toBe(1);
  releaseResponse();
  await expect(form.locator("[data-form-status]")).toHaveText("Thank you. Your application has been sent successfully.");
  await expect(form.locator("[data-form-status]")).toHaveAttribute("role", "status");
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
  await expect(form.locator('button[type="submit"]')).toHaveText("Send application");
  await expect(form.locator('[name="name"]')).toHaveValue("");
  expect(
    await page.evaluate(() =>
      window.dataLayer.filter(
        (entry) => Array.from(entry as ArrayLike<unknown>)[1] === 'generate_lead',
      ).length,
    ),
  ).toBe(0);
  expect(requests).toHaveLength(1);
  expect(requests[0]?.method).toBe("POST");
  expect(JSON.parse(requests[0]?.body ?? "{}")).toMatchObject({
    _gotcha: "",
    name: "Aina Rahman",
    contactNumber: "012-345 6789",
  });
});

test("shows failure and preserves fields when Formspree rejects the application", async ({ page }) => {
  await page.route("https://formspree.io/f/xvzebykj", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
  });
  await page.goto("/en/");
  const form = page.locator("[data-application-form]");
  await form.locator('[name="name"]').fill("Aina Rahman");
  await form.locator('[name="ageRange"]').selectOption("25-34");
  await form.locator('[name="currentJob"]').fill("Designer");
  await form.locator('[name="contactNumber"]').fill("012-345 6789");
  await form.locator('[name="state"]').selectOption("Selangor");
  await form.locator('[name="salesExperience"]').selectOption("1-3");
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();

  await expect(form.locator("[data-form-status]")).toHaveText("We couldn't send your application. Please try again.");
  await expect(form.locator("[data-form-status]")).toHaveAttribute("role", "alert");
  await expect(form.locator('[name="name"]')).toHaveValue("Aina Rahman");
  await expect(form.locator('[name="contactNumber"]')).toHaveValue("012-345 6789");
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
  await expect(form.locator('button[type="submit"]')).toHaveText("Send application");
});

test("ends with prioritized candidates and the safe application form", async ({ page }) => {
  await page.goto("/en/");
  const priorities = page.locator("#candidate-fit > ol");
  await expect(priorities.locator(":scope > li")).toHaveCount(4);
  await expect(priorities.locator(":scope > li > article")).toHaveCount(4);
  const cards = page.locator("#candidate-fit article");
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText("Aspiring team leaders");
  await expect(cards.nth(1)).toContainText("Career switchers");
  await expect(cards.nth(2)).toContainText("Existing salespeople");
  await expect(cards.nth(3)).toContainText("Fresh graduates");
  await expect(page.locator("#apply")).toHaveAttribute("data-conversion-section", "");
});

test('records one consented generate_lead event after Formspree success without PII', async ({ page }) => {
  await page.route('https://formspree.io/f/xvzebykj', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/en/');
  await page
    .locator('[data-analytics-consent]')
    .getByRole('button', { name: 'Accept analytics' })
    .click();

  const form = page.locator('[data-application-form]');
  const privateValues = ['Applicant Private 88421', '012-884 2121', 'Private City 731'];
  await form.locator('[name="name"]').fill(privateValues[0]);
  await form.locator('[name="ageRange"]').selectOption('25-34');
  await form.locator('[name="currentJob"]').fill('Designer');
  await form.locator('[name="contactNumber"]').fill(privateValues[1]);
  await form.locator('[name="state"]').selectOption('Selangor');
  await form.locator('[name="city"]').fill(privateValues[2]);
  await form.locator('[name="salesExperience"]').selectOption('1-3');
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-form-status]')).toContainText('sent successfully');

  const leadEvents = await page.evaluate(() =>
    window.dataLayer
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((entry) => entry[0] === 'event' && entry[1] === 'generate_lead'),
  );
  expect(leadEvents).toEqual([[
    'event',
    'generate_lead',
    { form_id: 'career_application', opportunity_type: 'commission_sales' },
  ]]);
  const serializedEvents = JSON.stringify(leadEvents);
  for (const value of privateValues) expect(serializedEvents).not.toContain(value);
});

test("uses the approved homepage section system and trust placement", async ({ page }) => {
  await page.goto("/en/");

  await expect(page.locator("#support")).toHaveCSS("background-color", "rgb(251, 250, 255)");
  await expect(page.locator("#growth")).toHaveCSS("background-color", "rgb(242, 237, 255)");
  await expect(page.locator("#opportunity .income-card")).toContainText(
    "RM2,500-RM10,000+",
  );
  await expect(page.locator("#opportunity .income-card")).toContainText(
    "No income is guaranteed",
  );

  const disclosure =
    "Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia. It is not the official corporate website of Coway (Malaysia) Sdn. Bhd.";
  await expect(page.locator("footer .site-disclosure")).toContainText(disclosure);
  await expect(page.locator("[data-career-hero]")).not.toContainText(disclosure);
  await expect(page.locator("#apply .application-reviewer")).toContainText(
    "sales leadership team",
  );

  expect(await page.locator(".glass-surface").count()).toBeLessThanOrEqual(3);
});

const footerPrivacyByLocale = {
  en: "Your information is used for recruitment follow-up and is processed and stored through Formspree, our configured third-party form service. With your permission, Google Analytics also measures website use; recruitment form answers are not intentionally sent to analytics.",
  bm: "Maklumat anda digunakan untuk tindakan susulan pengambilan dan diproses serta disimpan melalui Formspree, perkhidmatan borang pihak ketiga yang dikonfigurasikan. Dengan kebenaran anda, Google Analytics turut mengukur penggunaan laman; jawapan borang pengambilan tidak dihantar dengan sengaja kepada analitik.",
  zh: "\u4f60\u7684\u8d44\u6599\u7528\u4e8e\u62db\u8058\u8ddf\u8fdb\uff0c\u5e76\u901a\u8fc7\u6211\u4eec\u914d\u7f6e\u7684\u7b2c\u4e09\u65b9\u8868\u5355\u670d\u52a1 Formspree \u5904\u7406\u548c\u5b58\u50a8\u3002 \u5728\u83b7\u5f97\u4f60\u7684\u8bb8\u53ef\u540e\uff0cGoogle Analytics \u4e5f\u4f1a\u8861\u91cf\u7f51\u7ad9\u4f7f\u7528\u60c5\u51b5\uff1b\u62db\u8058\u7533\u8bf7\u8868\u4e2d\u7684\u8d44\u6599\u4e0d\u4f1a\u88ab\u523b\u610f\u53d1\u9001\u5230\u5206\u6790\u670d\u52a1\u3002",
} as const;

for (const { locale, labels, error, submit, submitting, success, failure, privacy } of [
  { locale: "en", labels: ["Name", "Contact number", "Age range", "Current job", "Malaysian state / location", "City", "Sales experience", "Experience detail", "I consent"], error: "This field is required.", submit: "Send application", submitting: "Sending…", success: "Thank you. Your application has been sent successfully.", failure: "We couldn't send your application. Please try again.", privacy: "Your information is used for recruitment follow-up and is processed and stored through Formspree, our configured third-party form service." },
  { locale: "bm", labels: ["Nama", "Nombor telefon", "Julat umur", "Pekerjaan semasa", "Negeri / lokasi di Malaysia", "Bandar", "Pengalaman jualan", "Butiran pengalaman", "Saya bersetuju"], error: "Medan ini wajib diisi.", submit: "Hantar permohonan", submitting: "Sedang menghantar…", success: "Terima kasih. Permohonan anda telah berjaya dihantar.", failure: "Kami tidak dapat menghantar permohonan anda. Sila cuba lagi.", privacy: "Maklumat anda digunakan untuk tindakan susulan pengambilan dan diproses serta disimpan melalui Formspree, perkhidmatan borang pihak ketiga yang dikonfigurasikan." },
  { locale: "zh", labels: ["\u59d3\u540d", "\u8054\u7cfb\u7535\u8bdd", "\u5e74\u9f84\u8303\u56f4", "\u76ee\u524d\u804c\u4e1a", "\u9a6c\u6765\u897f\u4e9a\u5dde\u5c5e\uff0f\u5730\u70b9", "\u57ce\u5e02", "\u9500\u552e\u7ecf\u9a8c", "\u7ecf\u9a8c\u8be6\u60c5", "\u6211\u540c\u610f"], error: "\u6b64\u680f\u4e3a\u5fc5\u586b\u3002", submit: "\u63d0\u4ea4\u7533\u8bf7", submitting: "\u6b63\u5728\u63d0\u4ea4\u2026", success: "\u8c22\u8c22\u3002\u4f60\u7684\u7533\u8bf7\u5df2\u6210\u529f\u53d1\u9001\u3002", failure: "\u65e0\u6cd5\u53d1\u9001\u4f60\u7684\u7533\u8bf7\u3002\u8bf7\u518d\u8bd5\u4e00\u6b21\u3002", privacy: "\u4f60\u7684\u8d44\u6599\u7528\u4e8e\u62db\u8058\u8ddf\u8fdb\uff0c\u5e76\u901a\u8fc7\u6211\u4eec\u914d\u7f6e\u7684\u7b2c\u4e09\u65b9\u8868\u5355\u670d\u52a1 Formspree \u5904\u7406\u548c\u5b58\u50a8\u3002" },
] as const) {
  test(`shows localized application labels, errors, and response copy in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    for (const label of labels) await expect(page.getByLabel(new RegExp(label))).toBeVisible();
    await expect(page.locator("#apply form label")).toHaveCount(9);
    const form = page.locator("[data-application-form]");
    const copy = JSON.parse(await form.getAttribute("data-copy") ?? "{}");
    expect(copy).toMatchObject({ submit, submitting, success, failure });
    await expect(page.locator("#application-privacy")).toHaveText(privacy);
    await expect(page.locator("#privacy-note")).toHaveText(footerPrivacyByLocale[locale]);
    await expect(form.locator('button[type="submit"]')).toHaveText(submit);
    await form.locator('button[type="submit"]').click();
    await expect(form.locator("#name-error")).toHaveText(error);
  });
}

test("preserves a recognized section anchor when changing language", async ({ page }) => {
  await page.goto("/en/#support");

  await page.locator("footer [data-locale-link][href='/bm/']").click();

  await expect(page).toHaveURL(/\/bm\/#support$/);
});

test("removes an unknown anchor when changing language", async ({ page }) => {
  await page.goto("/en/#unknown");

  await page.locator("footer [data-locale-link][href='/bm/']").click();

  await expect(page).toHaveURL(/\/bm\/$/);
});

test("does not intercept a locale link with a bare download attribute", async ({ page }) => {
  await page.goto("/en/");

  const wasPrevented = await page.evaluate(() => {
    const link = document.createElement("a");
    link.href = "/bm/";
    link.dataset.localeLink = "";
    link.setAttribute("download", "");
    document.body.append(link);

    let prevented = false;
    document.addEventListener("click", (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    link.remove();
    return prevented;
  });

  expect(wasPrevented).toBe(false);
  await expect(page).toHaveURL(/\/en\/$/);
});

test("leaves modified, non-primary, targeted, and external locale clicks alone", async ({ page }) => {
  await page.goto("/en/");

  const results = await page.evaluate(() => {
    const cases = [
      { href: "/bm/", init: { ctrlKey: true, button: 0 } },
      { href: "/bm/", init: { button: 1 } },
      { href: "/bm/", target: "_blank", init: { button: 0 } },
      { href: "https://example.org/bm/", init: { button: 0 } },
    ];

    return cases.map(({ href, target, init }) => {
      const link = document.createElement("a");
      link.href = href;
      link.dataset.localeLink = "";
      if (target) link.target = target;
      document.body.append(link);

      let prevented = false;
      document.addEventListener("click", (event) => {
        prevented = event.defaultPrevented;
        event.preventDefault();
      }, { once: true });
      link.dispatchEvent(new MouseEvent("click", { ...init, bubbles: true, cancelable: true }));
      link.remove();
      return prevented;
    });
  });

  expect(results).toEqual([false, false, false, false]);
  await expect(page).toHaveURL(/\/en\/$/);
});

test("keeps reduced-motion content visible and ticker static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/");

  await expect(page.locator("[data-reveal]").first()).toBeVisible();
  await expect(page.locator("[data-ticker]")).toHaveCSS("animation-name", "none");
  await expect(page.locator("[data-reveal]").first()).toHaveCSS("transform", "none");
  await expect(page.locator('[data-motion="hero-title"]')).toHaveCSS("transform", "none");
  await expect(page.locator("[data-ticker-track]")).toHaveCSS("transform", "none");

  for (const tile of await page.locator("[data-media-tile]").all()) {
    await expect(tile).toBeVisible();
    await expect(tile).toHaveCSS("transform", "none");
  }
  for (const image of await page.locator("[data-media-tile] img").all()) {
    await expect(image).toBeVisible();
    await expect(image).toHaveCSS("transform", "none");
  }
  await expect(page.locator("[data-media-tile] video")).toBeVisible();
  for (const step of await page.locator("[data-journey-step]").all()) {
    await expect(step).toBeVisible();
    await expect(step).toHaveCSS("transform", "none");
  }
  await expect(page.locator(".journey-path")).toHaveCSS("transform", "none");
});

test("reveals the career journey once it enters view", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto("/en/");
  const journey = page.locator("[data-journey]");

  await journey.scrollIntoViewIfNeeded();
  for (const step of await journey.locator("[data-journey-step]").all()) {
    await expect(step).toHaveClass(/is-revealed/);
  }
});

test("uses a static journey path without a page-lifetime progress indicator", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto("/en/");
  const journey = page.locator("[data-journey]");
  const connector = journey.locator(".journey-path");
  const extent = await connector.boundingBox();
  expect(extent!.width).toBeGreaterThan(extent!.height);
  await expect(journey.locator(".journey-flow-wrapper > .journey-path")).toHaveCount(1);
  await expect(page.locator("[data-page-progress]")).toHaveCount(0);
});

test("restores visible static content when reduced motion is enabled at runtime", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/");
  const heroTitle = page.locator('[data-motion="hero-title"]');
  await page.emulateMedia({ reducedMotion: "reduce" });

  await expect(page.locator("html")).toHaveClass(/motion-reduced/);
  await expect(heroTitle).toHaveCSS("opacity", "1");
  await expect(heroTitle).toHaveCSS("transform", "none");
  await expect(page.locator('[data-motion="hero-image"]')).toHaveCSS("transform", "none");
  await expect(page.locator("[data-reveal]").first()).toBeVisible();
});

test("does not retain page-lifetime will-change hints", async ({ page }) => {
  await page.goto("/en/");

  await expect(page.locator('[data-motion="hero-title"]')).toHaveCSS("will-change", "auto");
  await expect(page.locator("[data-motion-media-layer]").first()).toHaveCSS("will-change", "auto");
});

test("keeps media tile geometry fixed without continuous parallax", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto("/en/");
  const tile = page.locator("[data-media-tile]").first();
  const before = await tile.boundingBox();
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const after = await tile.boundingBox();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await expect(tile).toHaveCSS("transform", "none");
  await expect(tile.locator("[data-motion-media-layer]")).toHaveCSS("transform", "none");
  await expect(page.locator("[data-media-tile] video")).toHaveCSS("transform", "none");
});

for (const { locale, skip, home, nav, growth } of [
  { locale: "en", skip: "Skip to main content", home: "Coway recruitment home", nav: "Primary navigation", growth: "Learn → Lead" },
  { locale: "bm", skip: "Langkau ke kandungan utama", home: "Laman utama pengambilan Coway", nav: "Navigasi utama", growth: "Belajar → Memimpin" },
  { locale: "zh", skip: "跳至主要内容", home: "Coway 招聘主页", nav: "主导航", growth: "学习 → 领导" },
] as const) {
  test(`localizes visible and accessible chrome in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator(".skip-link")).toHaveText(skip);
    await expect(page.locator("header .wordmark")).toHaveAttribute("aria-label", home);
    await expect(page.locator("header .desktop-navigation")).toHaveAttribute("aria-label", nav);
    await expect(page.locator("[data-hero-stage]").first()).toContainText(
      growth.split(/\s+/)[0],
    );
  });
}

test('renders configured social platforms as safe external links', async ({ page }) => {
  await page.goto('/en/');
  const expectedProfiles = [
    { id: 'facebook', url: 'https://www.facebook.com/share/19WmC6tBsQ/' },
    { id: 'instagram', url: 'https://www.instagram.com/heipige_choy?igsh=eWc2YjFienF5bHdi' },
    { id: 'tiktok', url: 'https://www.tiktok.com/@captain.choy?_r=1&_t=ZS-97zTdFNzYhw' },
    { id: 'xiaohongshu', url: 'https://xhslink.com/m/2fkDxBavMuL' },
  ] as const;

  for (const { id, url } of expectedProfiles) {
    const link = page.locator(`a[data-social-platform="${id}"]`);
    await expect(link).toHaveAttribute('href', url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /(?:^|\s)noopener(?:\s|$)/);
    await expect(link).toHaveAttribute('rel', /(?:^|\s)noreferrer(?:\s|$)/);
  }
});

test("scrolling does not change layout bounds", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/en/");
  expect(await page.evaluate(() =>
    document.body.scrollWidth <= document.documentElement.clientWidth
  )).toBe(true);
  await page.evaluate(() => scrollTo(0, 900));
  expect(await page.evaluate(() =>
    document.body.scrollWidth <= document.documentElement.clientWidth
  )).toBe(true);
});

test("keeps reveal content readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/en/");

  await expect(page.locator("[data-reveal]").first()).toBeVisible();
  await expect(page.locator("#support article").first()).toBeVisible();
  await context.close();
});

test("stages grouped content as it enters the viewport", async ({ page }) => {
  await page.goto("/en/");

  const supportItems = page.locator("#support [data-reveal]");
  await expect(supportItems).toHaveCount(7);
  expect(
    await supportItems.evaluateAll((items) =>
      items.slice(0, 4).map((item) =>
        (item as HTMLElement).style.getPropertyValue("--reveal-delay"),
      ),
    ),
  ).toEqual(["0ms", "70ms", "140ms", "210ms"]);

  const lastItem = supportItems.last();
  await lastItem.scrollIntoViewIfNeeded();
  await expect(lastItem).toHaveClass(/is-revealed/);
});

test("identifies and persists the selected language without overriding direct URLs", async ({ page }) => {
  await page.goto("/bm/");
  await expect(page.locator(".language-menu summary")).toContainText("Bahasa Malaysia");
  await page.locator(".language-menu summary").click();
  await page.locator('.language-menu a[href="/zh/"]').click();
  await expect(page).toHaveURL(/\/zh\/$/);
  expect(await page.evaluate(() => localStorage.getItem("preferredLocale"))).toBe("zh");
  await page.goto("/en/");
  await expect(page).toHaveURL(/\/en\/$/);
});

test("provides a keyboard-operable mobile menu and privacy-information link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  const menu = page.locator(".mobile-navigation");
  await menu.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await expect(menu.getByRole("link", { name: "Support" })).toBeVisible();
  const privacy = page.getByRole("link", { name: "Privacy information" });
  await expect(privacy).toHaveAttribute("href", "#privacy-note");
});

test('renders the sticky header as a standalone glass island', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  await page.locator('#support').scrollIntoViewIfNeeded();

  const wrapper = page.locator('.site-header');
  const island = page.locator('.header-inner.glass-surface');
  await expect(wrapper).toHaveCSS('position', 'sticky');
  await expect(wrapper).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(island).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const bounds = await island.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThan(0);
  expect(bounds!.x + bounds!.width).toBeLessThan(390);
});

for (const scenario of [
  { route: '/en/', hero: '[data-career-hero]', safeContent: 'h1' },
  {
    route: '/zh/sales-training-leadership/',
    hero: '.content-hero',
    safeContent: '.breadcrumbs',
  },
]) {
  test(`places the header island over the hero on ${scenario.route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(scenario.route);

    const hero = page.locator(scenario.hero);
    const island = page.locator('.header-inner.glass-surface');
    const safeContent = hero.locator(scenario.safeContent).first();
    const [heroBounds, islandBounds, safeBounds] = await Promise.all([
      hero.boundingBox(),
      island.boundingBox(),
      safeContent.boundingBox(),
    ]);

    expect(heroBounds).not.toBeNull();
    expect(islandBounds).not.toBeNull();
    expect(safeBounds).not.toBeNull();
    expect(heroBounds!.y).toBeLessThan(islandBounds!.y + islandBounds!.height);
    expect(safeBounds!.y).toBeGreaterThanOrEqual(
      islandBounds!.y + islandBounds!.height,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390);
  });
}

for (const width of [320, 390]) {
  test(`keeps all visible header controls on one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/zh/sales-training-leadership/');

    const controls = [
      page.locator('header .wordmark'),
      page.locator('header .mobile-navigation > summary'),
      page.locator('header .language-menu > summary'),
      page.locator('header .button-accent'),
    ];
    const boxes = await Promise.all(controls.map((control) => control.boundingBox()));
    expect(boxes.every(Boolean)).toBe(true);

    const centres = boxes.map((box) => box!.y + box!.height / 2);
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
    expect(Math.max(...boxes.map((box) => box!.x + box!.width))).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const width of [320, 375, 390]) {
  test(`keeps header menus inside a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/en/");

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const mobileMenu = page.locator(".mobile-navigation");
    await mobileMenu.locator(":scope > summary").click();
    const mobilePanel = mobileMenu.locator("nav");
    await expect(mobilePanel).toBeVisible();

    const mobileBounds = await mobilePanel.boundingBox();
    expect(mobileBounds).not.toBeNull();
    expect(mobileBounds!.x).toBeGreaterThanOrEqual(0);
    expect(mobileBounds!.x + mobileBounds!.width).toBeLessThanOrEqual(width);

    const languageMenu = page.locator(".language-menu");
    await languageMenu.locator(":scope > summary").click();
    await expect(languageMenu).toHaveAttribute("open", "");
    await expect(mobileMenu).not.toHaveAttribute("open", "");

    const languagePanel = languageMenu.locator(":scope > ul");
    const languageBounds = await languagePanel.boundingBox();
    expect(languageBounds).not.toBeNull();
    expect(languageBounds!.x).toBeGreaterThanOrEqual(0);
    expect(languageBounds!.x + languageBounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
      documentWidth,
    );
  });
}

test("uses selective glass only on prominent interface surfaces", async ({ page }) => {
  await page.goto("/en/");

  const headerGlass = page.locator(".site-header .glass-surface");
  await expect(headerGlass).toHaveCount(1);
  const headerStyle = await headerGlass.evaluate((element) =>
    getComputedStyle(element),
  );
  expect(headerStyle.backdropFilter).toContain("blur");
  expect(headerStyle.borderTopWidth).toBe("1px");

  const faqFilter = await page.locator("#faq details").first().evaluate(
    (element) => getComputedStyle(element).backdropFilter,
  );
  expect(faqFilter === "none" || faqFilter === "").toBe(true);
});

test.describe('analytics consent', () => {
  test('queues denied defaults before the accepted GA4 command sequence', async ({
    page,
  }) => {
    const googleRequests: string[] = [];
    await page.route('https://www.googletagmanager.com/**', async (route) => {
      googleRequests.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });

    await page.goto('/en/');

    const banner = page.locator('[data-analytics-consent]');
    await expect(banner).toBeVisible();
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(0);
    expect(googleRequests).toHaveLength(0);

    const initialQueue = await page.evaluate(() =>
      window.dataLayer.map((entry) => ({
        tag: Object.prototype.toString.call(entry),
        values: Array.from(entry as ArrayLike<unknown>),
      })),
    );
    expect(initialQueue).toEqual([
      {
        tag: '[object Arguments]',
        values: [
          'consent',
          'default',
          {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          },
        ],
      },
    ]);

    const distinctiveFormValues = [
      'Applicant Queue Marker 92841',
      '01987654321',
      'Private Occupation Marker 64152',
      'Private City Marker 37018',
      'Distinctive recruitment experience marker 81279',
    ];
    await page.locator('[name="name"]').fill(distinctiveFormValues[0]);
    await page.locator('[name="contactNumber"]').fill(distinctiveFormValues[1]);
    await page.locator('[name="currentJob"]').fill(distinctiveFormValues[2]);
    await page.locator('[name="city"]').fill(distinctiveFormValues[3]);
    await page
      .locator('[name="experienceDetail"]')
      .fill(distinctiveFormValues[4]);

    await banner.getByRole('button', { name: 'Accept analytics' }).click();

    await expect(banner).toBeHidden();
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(1);
    await expect
      .poll(() => googleRequests.some((url) => url.includes('id=G-KGTRGW5765')))
      .toBe(true);
    expect(
      await page.evaluate(() =>
        window.localStorage.getItem('coway-analytics-consent'),
      ),
    ).toBe('granted');

    const acceptedQueue = await page.evaluate(() =>
      window.dataLayer.map((entry) => ({
        tag: Object.prototype.toString.call(entry),
        values: Array.from(entry as ArrayLike<unknown>),
      })),
    );
    expect(acceptedQueue.map(({ tag }) => tag)).toEqual(
      Array(4).fill('[object Arguments]'),
    );
    expect(acceptedQueue.map(({ values }) => values[0])).toEqual([
      'consent',
      'consent',
      'js',
      'config',
    ]);
    expect(acceptedQueue[0].values).toEqual([
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(acceptedQueue[1].values).toEqual([
      'consent',
      'update',
      { analytics_storage: 'granted' },
    ]);
    expect(acceptedQueue[3].values).toEqual([
      'config',
      'G-KGTRGW5765',
    ]);
    const serializedQueue = JSON.stringify(acceptedQueue);
    for (const value of distinctiveFormValues) {
      expect(serializedQueue).not.toContain(value);
    }
  });

  test('persists decline without loading the Google tag', async ({ page }) => {
    await page.goto('/en/');
    const banner = page.locator('[data-analytics-consent]');

    await banner.getByRole('button', { name: 'Decline analytics' }).click();
    await expect(banner).toBeHidden();
    expect(
      await page.evaluate(() =>
        window.localStorage.getItem('coway-analytics-consent'),
      ),
    ).toBe('denied');
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(0);

    await page.reload();
    await expect(banner).toBeHidden();
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(0);
  });

  test('fails closed when browser storage is unavailable', async ({
    context,
    page,
  }) => {
    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new Error('storage unavailable');
        },
      });
    });

    await page.goto('/en/');
    const banner = page.locator('[data-analytics-consent]');
    await banner.getByRole('button', { name: 'Accept analytics' }).click();

    await expect(banner).toBeVisible();
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(0);
  });

  test('keeps the application usable when the Google script is blocked', async ({
    page,
  }) => {
    await page.route('https://www.googletagmanager.com/**', (route) =>
      route.abort(),
    );
    await page.goto('/en/');
    await page
      .locator('[data-analytics-consent]')
      .getByRole('button', { name: 'Accept analytics' })
      .click();

    await expect(page.locator('[data-application-form]')).toBeVisible();
    await expect(
      page.locator('[data-application-form] button[type="submit"]'),
    ).toBeEnabled();
  });

  test('prevents duplicate tag and config commands in the same document', async ({
    page,
  }) => {
    await page.goto('/en/');
    const accept = page
      .locator('[data-analytics-consent]')
      .getByRole('button', { name: 'Accept analytics' });
    await accept.click();
    await page.evaluate(() => {
      const hiddenAccept = document.querySelector<HTMLButtonElement>(
        '[data-analytics-accept]',
      );
      hiddenAccept?.click();
      hiddenAccept?.click();
    });

    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(1);
    expect(
      await page.evaluate(() =>
        window.dataLayer.filter(
          (entry) => Array.from(entry as ArrayLike<unknown>)[0] === 'config',
        ).length,
      ),
    ).toBe(1);
  });

  test('localizes consent controls and leaves the application usable', async ({
    page,
  }) => {
    for (const { locale, message, accept, decline } of [
      {
        locale: 'en',
        message:
          'We use Google Analytics to understand how this website is used. Recruitment form answers are not intentionally sent to analytics.',
        accept: 'Accept analytics',
        decline: 'Decline analytics',
      },
      {
        locale: 'bm',
        message:
          'Kami menggunakan Google Analytics untuk memahami cara laman ini digunakan. Jawapan borang pengambilan tidak dihantar dengan sengaja kepada analitik.',
        accept: 'Terima analitik',
        decline: 'Tolak analitik',
      },
      {
        locale: 'zh',
        message:
          '我们使用 Google Analytics 来了解此网站的使用情况。招聘申请表中的资料不会被刻意发送到分析服务。',
        accept: '接受分析',
        decline: '拒绝分析',
      },
    ]) {
      await page.goto(`/${locale}/`);
      const banner = page.locator('[data-analytics-consent]');
      await expect(banner.locator('p')).toHaveText(message);
      await expect(banner.getByRole('button', { name: accept })).toBeVisible();
      await expect(banner.getByRole('button', { name: decline })).toBeVisible();
      await expect(page.locator('[data-application-form]')).toBeVisible();
    }
  });
});
