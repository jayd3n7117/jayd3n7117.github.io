import { expect, test } from "@playwright/test";

const productionOrigin = new URL(
  process.env.PUBLIC_SITE_URL ?? "https://join.coway.test",
).origin;

const localizedRoutes = [
  { locale: "en", lang: "en-MY" },
  { locale: "bm", lang: "ms-MY" },
  { locale: "zh", lang: "zh-CN" },
] as const;

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

    const languageControl = page.getByText("Language", { exact: true }).first();
    await expect(languageControl).toBeVisible();

    for (const label of ["English", "Bahasa Malaysia", "中文"]) {
      await expect(
        page.locator(`footer [data-locale-link]`, { hasText: label }),
      ).toBeVisible();
    }

    await expect(
      page.getByRole("link", { name: /Coway Malaysia official website/i }),
    ).toHaveAttribute("href", "https://www.coway.com.my/");
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
    en: "Independent sales recruitment information.",
    bm: "Maklumat pengambilan jualan bebas.",
    zh: "独立销售招募信息。",
  }[locale];
}

test("uses native language navigation and stable locale links", async ({
  page,
}) => {
  await page.goto("/en/");

  const languageMenu = page.locator("header details");
  await languageMenu.locator("summary").click();
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
  const languageBounds = await page.locator("header details summary").boundingBox();
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
    outlineColor: "rgb(255, 255, 255)",
    outlineWidth: "3px",
    boxShadow: "rgb(8, 47, 73) 0px 0px 0px 6px",
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
  await expect(page.locator(".culture-statement")).toContainText(
    "There is no me in this team. Only us.",
  );
  await expect(page.locator("#faq details")).toHaveCount(7);
  await expect(page.locator("main h1")).toHaveCount(1);
  expect(await page.locator("main h2").count()).toBeGreaterThanOrEqual(8);
});

test("renders the Performance Sport hero and opportunity composition", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("[data-performance-hero]")).toHaveCount(1);
  await expect(page.locator("[data-motion-card]")).toHaveCount(3);
  await expect(page.locator("[data-ticker-track]")).toContainText(/online sales training/i);
  await expect(page.locator("#opportunity")).toHaveCSS("background-color", "rgb(234, 245, 244)");
  await expect(page.locator("#opportunity .income-card")).toHaveCSS(
    "background-color",
    "rgb(53, 213, 208)",
  );
  await expect(page.locator("#opportunity .income-card")).toHaveCSS(
    "color",
    "rgb(7, 31, 43)",
  );
});

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

test("keeps Performance Sport controls touch-sized with readable contrast", async ({ page }) => {
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

  await expect(page.locator(".performance-hero")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await expect(page.locator(".button-primary")).toHaveCSS(
    "color",
    "rgb(7, 31, 43)",
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

test("does not POST or claim receipt and blocks repeat submission while checking", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") requests.push(request.url()); });
  await page.goto("/en/");
  const form = page.locator("[data-application-form]");
  await form.locator('[name="name"]').fill("Aina Rahman");
  await form.locator('[name="ageRange"]').selectOption("25-34");
  await form.locator('[name="currentJob"]').fill("Designer");
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
  await expect(form.locator("[data-form-status]")).toContainText("not been sent or stored");
  expect(requests).toEqual([]);
  await expect(form.locator('[name="name"]')).toHaveValue("Aina Rahman");
});

for (const { locale, labels, error, status } of [
  { locale: "en", labels: ["Name", "Age range", "Current job", "Malaysian state / location", "City", "Sales experience", "Experience detail", "I consent"], error: "This field is required.", status: "not been sent or stored" },
  { locale: "bm", labels: ["Nama", "Julat umur", "Pekerjaan semasa", "Negeri / lokasi di Malaysia", "Bandar", "Pengalaman jualan", "Butiran pengalaman", "Saya bersetuju"], error: "Medan ini wajib diisi.", status: "tidak dihantar atau disimpan" },
  { locale: "zh", labels: ["\u59d3\u540d", "\u5e74\u9f84\u8303\u56f4", "\u76ee\u524d\u804c\u4e1a", "\u9a6c\u6765\u897f\u4e9a\u5dde\u5c5e\uff0f\u5730\u70b9", "\u57ce\u5e02", "\u9500\u552e\u7ecf\u9a8c", "\u7ecf\u9a8c\u8be6\u60c5", "\u6211\u540c\u610f"], error: "\u6b64\u680f\u4e3a\u5fc5\u586b\u3002", status: "\u672a\u88ab\u53d1\u9001\u6216\u50a8\u5b58" },
] as const) {
  test(`shows localized application labels, errors, and disabled status in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    for (const label of labels) await expect(page.getByLabel(new RegExp(label))).toBeVisible();
    await expect(page.locator("#apply form label")).toHaveCount(8);
    const form = page.locator("[data-application-form]");
    await form.locator('button[type="submit"]').click();
    await expect(form.locator("#name-error")).toHaveText(error);
    await form.locator('[name="name"]').fill("Aina Rahman");
    await form.locator('[name="ageRange"]').selectOption("25-34");
    await form.locator('[name="currentJob"]').fill("Designer");
    await form.locator('[name="state"]').selectOption("Selangor");
    await form.locator('[name="salesExperience"]').selectOption("1-3");
    await form.locator('[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('button[type="submit"]')).toBeDisabled();
    await expect(form.locator("[data-form-status]")).toContainText(status);
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
});

test("keeps reveal content readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/en/");

  await expect(page.locator("[data-reveal]").first()).toBeVisible();
  await expect(page.locator("#support article").first()).toBeVisible();
  await context.close();
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
