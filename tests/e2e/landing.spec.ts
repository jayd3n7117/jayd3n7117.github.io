import { expect, test } from '@playwright/test';

const localizedRoutes = [
  { locale: 'en', lang: 'en-MY' },
  { locale: 'bm', lang: 'ms-MY' },
  { locale: 'zh', lang: 'zh-CN' },
] as const;

for (const { locale, lang } of localizedRoutes) {
  test(`renders the ${locale} locale route`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Coway Sales Recruitment Malaysia',
      }),
    ).toHaveCount(1);
  });
}

test('opens the prefixed English locale from the root route', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/en\/$/);
});
