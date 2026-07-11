import { expect, test } from '@playwright/test';

const localizedRoutes = [
  { locale: 'en', lang: 'en-MY', title: 'Coway Sales Recruitment Malaysia' },
  { locale: 'bm', lang: 'ms-MY', title: 'Pengambilan Jualan Coway Malaysia' },
  { locale: 'zh', lang: 'zh-CN', title: 'Coway 马来西亚销售招募' },
] as const;

for (const { locale, lang } of localizedRoutes) {
  test(`renders the ${locale} locale route`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://example.com/${locale}/`,
    );
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);

    const languageControl = page.getByText('Language', { exact: true }).first();
    await expect(languageControl).toBeVisible();

    for (const label of ['English', 'Bahasa Malaysia', '中文']) {
      await expect(page.locator(`footer [data-locale-link]`, { hasText: label })).toBeVisible();
    }

    await expect(page.getByRole('link', { name: /Coway Malaysia official website/i })).toHaveAttribute(
      'href',
      'https://www.coway.com.my/',
    );
    await expect(page.locator('.site-disclosure')).toContainText(contentDisclosure(locale));
  });
}

function contentDisclosure(locale: (typeof localizedRoutes)[number]['locale']): string {
  return {
    en: 'Independent sales recruitment information.',
    bm: 'Maklumat pengambilan jualan bebas.',
    zh: '独立销售招募信息。',
  }[locale];
}

test('uses native language navigation and stable locale links', async ({ page }) => {
  await page.goto('/en/');

  const languageMenu = page.locator('header details');
  await languageMenu.locator('summary').click();
  await expect(languageMenu).toHaveAttribute('open', '');
  await expect(languageMenu.locator('[data-locale-link]')).toHaveCount(3);

  await languageMenu.locator('[data-locale-link][href="/bm/"]').click();
  await expect(page).toHaveURL(/\/bm\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ms-MY');
});

test('keeps the prominent Apply action visible within a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/en/');

  const applyAction = page.locator('header .button-accent');
  await expect(applyAction).toBeVisible();

  const bounds = await applyAction.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
});

test('uses a two-color focus indicator visible across page surfaces', async ({ page }) => {
  await page.goto('/en/');

  const applyAction = page.locator('header .button-accent');
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
    outlineColor: 'rgb(255, 255, 255)',
    outlineWidth: '3px',
    boxShadow: 'rgb(8, 47, 73) 0px 0px 0px 6px',
  });
});

test('opens the prefixed English locale from the root route', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/en\/$/);
});

test('renders the complete landing story with honest opportunity details', async ({ page }) => {
  await page.goto('/en/');

  for (const id of ['opportunity', 'support', 'growth', 'faq', 'apply']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator('#support article')).toHaveCount(6);
  const opportunity = page.locator('#opportunity');
  await expect(opportunity).toContainText('RM2,500-RM10,000+');
  await expect(opportunity).toContainText('Fully commission-based');
  await expect(opportunity).toContainText('No income is guaranteed');
  await expect(page.locator('.culture-statement')).toContainText('There is no me in this team. Only us.');
  await expect(page.locator('#faq details')).toHaveCount(7);
  await expect(page.locator('main h1')).toHaveCount(1);
  expect(await page.locator('main h2').count()).toBeGreaterThanOrEqual(8);
});

test('uses an accessible user-controlled team video', async ({ page }) => {
  await page.goto('/en/');
  const video = page.locator('video');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).not.toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('poster', /team-video-poster\.webp$/);
  await expect(video.locator('source[type="video/mp4"]')).toHaveCount(1);
  await expect(video.locator('source[type="video/webm"]')).toHaveCount(1);
});

for (const width of [320, 390, 1440]) {
  test(`has no horizontal page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}
