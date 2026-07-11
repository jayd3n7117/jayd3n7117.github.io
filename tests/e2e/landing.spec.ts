import { expect, test } from '@playwright/test';

const localizedRoutes = [
  { locale: 'en', lang: 'en-MY', title: 'Coway Sales Recruitment Malaysia' },
  { locale: 'bm', lang: 'ms-MY', title: 'Pengambilan Jualan Coway Malaysia' },
  { locale: 'zh', lang: 'zh-CN', title: 'Coway 马来西亚销售招募' },
] as const;

for (const { locale, lang, title } of localizedRoutes) {
  test(`renders the ${locale} locale route`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1, name: title })).toHaveCount(1);
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

test('opens the prefixed English locale from the root route', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/en\/$/);
});
