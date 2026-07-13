# Application and Footer Amendments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the recruitment message more inclusive, fix the application image proportions, remove the unintended corporate link, and add future-ready social platform controls.

**Architecture:** Keep localized recruitment copy in `src/content/locales.ts`, isolate social destinations and link-state logic in a typed `src/config/social.ts` module, and let the footer render active or inert controls from that configuration. Reuse the existing responsive-picture pipeline for the application photo and control its crop entirely through responsive CSS.

**Tech Stack:** Astro, TypeScript, CSS, Vitest, Playwright

## Global Constraints

- Preserve the current Performance Sport visual direction.
- Support English, Bahasa Malaysia, and Simplified Chinese for every new user-facing string.
- Use the existing team-meeting photograph and existing responsive AVIF/WebP sources; introduce no new photography.
- Below `48rem`, the application image frame must use `aspect-ratio: 4 / 3`.
- From `48rem` upward, the application image frame must use `aspect-ratio: 4 / 5` and align to the top of its column.
- Empty social URLs must never render as anchors, empty `href` values, or focusable controls.
- The four supplied social destinations must render as active links with `target="_blank"` and `rel="noopener noreferrer"`.
- Social controls must have at least a 44-pixel touch target, wrap responsively, and preserve visible keyboard focus for active links.
- Keep the independent recruitment disclaimer and the safe non-submitting application workflow unchanged.
- Add no social embeds, tracking scripts, APIs, fake URLs, placeholder domains, or emoji icons.
- Preserve the untracked `assets-source/` directory.

---

## File Structure

- Modify `src/content/locales.ts`: localized FAQ copy, footer social strings, and removal of the unused official-site label.
- Create `src/config/social.ts`: one typed source of platform labels, optional destinations, and safe active-link attributes.
- Modify `src/components/Footer.astro`: render social controls and remove the Coway corporate link.
- Modify `src/styles/global.css`: responsive Performance Sport social-control layout and states.
- Modify `src/pages/[locale]/index.astro`: supply the team-meeting image to the application section.
- Modify `src/styles/landing.css`: bounded responsive application-image geometry.
- Modify `tests/unit/locales.test.ts`: copy/model assertions.
- Create `tests/unit/social.test.ts`: supplied destinations, safe configured-link behavior, and blank-URL fallback behavior.
- Modify `tests/e2e/landing.spec.ts`: rendered footer, social accessibility, and application-image breakpoint coverage.

### Task 1: Inclusive localized sales-experience answer

**Files:**
- Modify: `src/content/locales.ts`
- Modify: `tests/unit/locales.test.ts`

**Interfaces:**
- Consumes: `locales.en.faq.items`, `locales.bm.faq.items`, and `locales.zh.faq.items`.
- Produces: the revised answer at FAQ item index `1` in all three locale dictionaries; no component API changes.

- [ ] **Step 1: Write the failing localized-copy test**

Add this test to `tests/unit/locales.test.ts`:

```ts
it('welcomes committed applicants without requiring sales experience', () => {
  expect(locales.en.faq.items[1].answer).toBe(
    'No. Sales experience is not required. What matters most is your ambition, commitment to the industry, and willingness to learn. With the right attitude and consistent action, we can develop your skills and grow together.',
  );
  expect(locales.bm.faq.items[1].answer).toBe(
    'Tidak. Pengalaman jualan tidak diperlukan. Yang paling penting ialah cita-cita anda, komitmen terhadap industri ini dan kesediaan untuk belajar. Dengan sikap yang betul dan tindakan yang konsisten, kita boleh membina kemahiran anda dan berkembang bersama.',
  );
  expect(locales.zh.faq.items[1].answer).toBe(
    '不需要。销售经验并非必要条件。我们更看重你对这份事业的企图心、投入和学习意愿。只要保持正确的态度并持续行动，我们就能一起提升你的能力，共同成长。',
  );
});
```

- [ ] **Step 2: Run the focused test and confirm the old priority wording fails**

Run: `pnpm test -- tests/unit/locales.test.ts`

Expected: FAIL because FAQ item `1` still prioritizes experienced salespeople.

- [ ] **Step 3: Replace the three localized answers**

In `src/content/locales.ts`, keep each existing sales-experience question and replace only its answer with the exact English, Bahasa Malaysia, and Simplified Chinese strings asserted above.

- [ ] **Step 4: Run the focused test**

Run: `pnpm test -- tests/unit/locales.test.ts`

Expected: PASS for the complete locale-model suite.

- [ ] **Step 5: Commit the copy amendment**

```bash
git add src/content/locales.ts tests/unit/locales.test.ts
git commit -m "copy: welcome applicants without sales experience"
```

### Task 2: Future-ready footer social controls

**Files:**
- Create: `src/config/social.ts`
- Create: `tests/unit/social.test.ts`
- Modify: `src/content/locales.ts`
- Modify: `src/components/Footer.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/unit/locales.test.ts`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `SocialPlatformId`, `SocialProfile`, `socialProfiles`, and `getSocialLinkAttributes(url)` from `src/config/social.ts`.
- `getSocialLinkAttributes(url: string)` returns `null` for blank input or `{ href: string; target: '_blank'; rel: 'noopener noreferrer' }` for a nonblank URL.
- Extends `LandingContent['footer']` with `socialHeading: string` and `socialUnavailableLabel: string`.
- Removes `LandingContent['chrome']['officialSiteLabel']`.

- [ ] **Step 1: Write failing social configuration tests**

Create `tests/unit/social.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { getSocialLinkAttributes, socialProfiles } from '../../src/config/social';

describe('social profile configuration', () => {
  it('lists the four requested platforms with their supplied destinations', () => {
    expect(socialProfiles).toEqual([
      { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/share/19WmC6tBsQ/' },
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/heipige_choy?igsh=eWc2YjFienF5bHdi' },
      { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@captain.choy?_r=1&_t=ZS-97zTdFNzYhw' },
      { id: 'xiaohongshu', label: 'Xiaohongshu', url: 'https://xhslink.com/m/2fkDxBavMuL' },
    ]);
  });

  it('keeps blank destinations inert and secures configured external links', () => {
    expect(getSocialLinkAttributes('   ')).toBeNull();
    expect(getSocialLinkAttributes('https://www.facebook.com/share/19WmC6tBsQ/')).toEqual({
      href: 'https://www.facebook.com/share/19WmC6tBsQ/',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });
});
```

- [ ] **Step 2: Extend locale-model tests before changing the dictionaries**

Inside the locale loop in `tests/unit/locales.test.ts`, add:

```ts
expect(content.footer.socialHeading.trim()).not.toBe('');
expect(content.footer.socialUnavailableLabel.trim()).not.toBe('');
expect(content.chrome).not.toHaveProperty('officialSiteLabel');
```

- [ ] **Step 3: Replace official-link browser expectations with failing social-control expectations**

In the localized-route test in `tests/e2e/landing.spec.ts`, delete the Coway official-link assertion and add:

```ts
await expect(page.locator('footer a[href="https://www.coway.com.my/"]')).toHaveCount(0);
await expect(page.locator('[data-social-platform]')).toHaveCount(4);
await expect(page.locator('[data-social-platform][aria-disabled="true"]')).toHaveCount(0);
await expect(page.locator('a[data-social-platform]')).toHaveCount(4);
```

In the localized-chrome table, remove the `official` property from every row and delete the `getByRole('link', { name: official })` assertion. Add one focused test:

```ts
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
```

- [ ] **Step 4: Run the new and affected tests and confirm failure**

Run: `pnpm test -- tests/unit/social.test.ts tests/unit/locales.test.ts`

Expected: FAIL because `src/config/social.ts` and the footer social strings do not exist.

Run: `pnpm test:e2e -- --grep "social|locale route|accessible chrome"`

Expected: FAIL because the social controls do not yet use the supplied active destinations.

- [ ] **Step 5: Implement the typed social configuration**

Create `src/config/social.ts`:

```ts
export type SocialPlatformId = 'facebook' | 'instagram' | 'tiktok' | 'xiaohongshu';

export type SocialProfile = Readonly<{
  id: SocialPlatformId;
  label: string;
  url: string;
}>;

export const socialProfiles: readonly SocialProfile[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/share/19WmC6tBsQ/' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/heipige_choy?igsh=eWc2YjFienF5bHdi' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@captain.choy?_r=1&_t=ZS-97zTdFNzYhw' },
  { id: 'xiaohongshu', label: 'Xiaohongshu', url: 'https://xhslink.com/m/2fkDxBavMuL' },
];

export function getSocialLinkAttributes(url: string) {
  const href = url.trim();
  return href
    ? ({ href, target: '_blank', rel: 'noopener noreferrer' } as const)
    : null;
}
```

- [ ] **Step 6: Update the localized footer model**

Remove `officialSiteLabel` from the `LandingContent.chrome` interface and all three `chrome` dictionaries. Add these fields to `LandingContent.footer` and each locale:

```ts
// Interface
socialHeading: string;
socialUnavailableLabel: string;

// English
socialHeading: 'Follow our journey',
socialUnavailableLabel: 'link not available yet',

// Bahasa Malaysia
socialHeading: 'Ikuti perjalanan kami',
socialUnavailableLabel: 'pautan belum tersedia',

// Simplified Chinese
socialHeading: '关注我们的成长旅程',
socialUnavailableLabel: '链接暂未开放',
```

- [ ] **Step 7: Render active or inert footer controls**

Import `getSocialLinkAttributes` and `socialProfiles` in `src/components/Footer.astro`. Replace the existing corporate-link column with this structure:

```astro
<div class="footer-social">
  <p class="footer-heading">{content.footer.socialHeading}</p>
  <ul class="social-links">
    {socialProfiles.map((profile) => {
      const attributes = getSocialLinkAttributes(profile.url);
      const unavailableLabel = `${profile.label}: ${content.footer.socialUnavailableLabel}`;

      return (
        <li>
          {attributes ? (
            <a class="social-link" data-social-platform={profile.id} {...attributes}>
              {profile.label}
            </a>
          ) : (
            <span
              class="social-link social-link-disabled"
              data-social-platform={profile.id}
              aria-disabled="true"
              aria-label={unavailableLabel}
            >
              {profile.label}
            </span>
          )}
        </li>
      );
    })}
  </ul>
</div>
```

- [ ] **Step 8: Add responsive Performance Sport social styles**

Add to `src/styles/global.css`:

```css
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.social-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: 999px;
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
}

a.social-link:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

a.social-link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.social-link-disabled {
  cursor: default;
  opacity: 0.58;
}
```

Keep the existing three-column desktop footer grid and one-column mobile breakpoint; the social list wraps within its column.

- [ ] **Step 9: Run focused verification**

Run: `pnpm test -- tests/unit/social.test.ts tests/unit/locales.test.ts`

Expected: PASS.

Run: `pnpm test:e2e -- --grep "social|locale route|accessible chrome"`

Expected: PASS with four safe active social links per locale and no Coway corporate link.

- [ ] **Step 10: Commit the footer amendment**

```bash
git add src/config/social.ts src/content/locales.ts src/components/Footer.astro src/styles/global.css tests/unit/social.test.ts tests/unit/locales.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: add future-ready social footer"
```

### Task 3: Responsive application image frame

**Files:**
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/styles/landing.css`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: `media.culture[2]`, the existing team-meeting `MediaImage`.
- Preserves: `ApplicationForm` props `{ locale: Locale; image: MediaImage }` and `ResponsivePicture` behavior.
- Produces: a `4 / 3` mobile frame and `4 / 5` desktop frame without tying image height to form height.

- [ ] **Step 1: Write failing responsive geometry tests**

Add to `tests/e2e/landing.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run the focused browser tests and confirm failure**

Run: `pnpm test:e2e -- --grep "application image|team-meeting photograph"`

Expected: FAIL because the current desktop visual stretches with the form and the application uses `media.culture[1]`.

- [ ] **Step 3: Supply the approved team-meeting image**

In `src/pages/[locale]/index.astro`, change only the final application call:

```astro
<ApplicationForm {locale} image={media.culture[2]} />
```

- [ ] **Step 4: Bound the image geometry in CSS**

Replace the application-image sizing rules in `src/styles/landing.css` with:

```css
.application-section {
  display: grid;
  gap: 0;
  overflow: hidden;
  margin-bottom: 5rem;
  padding: 0;
  border-radius: 1.5rem;
  background: var(--color-surface);
}

.application-visual {
  aspect-ratio: 4 / 3;
  min-height: 0;
  overflow: hidden;
}

.application-visual picture,
.application-visual img {
  display: block;
  width: 100%;
  height: 100%;
}

.application-visual img {
  object-fit: cover;
  object-position: center 35%;
}
```

Inside the existing `@media (min-width: 48rem)` block, use:

```css
.application-section {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
}

.application-visual {
  aspect-ratio: 4 / 5;
  min-height: 0;
}
```

Delete the old `min-height: clamp(18rem, 58vw, 28rem)`, desktop `min-height: 100%`, and `align-items: stretch` declarations.

- [ ] **Step 5: Run the responsive browser tests**

Run: `pnpm test:e2e -- --grep "application image|team-meeting photograph"`

Expected: PASS at 375, 768, 1024, and 1440 pixels.

- [ ] **Step 6: Run media and application regression tests**

Run: `pnpm test -- tests/unit/media.test.ts tests/unit/application.test.ts`

Expected: PASS; responsive sources and safe application behavior remain intact.

- [ ] **Step 7: Commit the responsive image amendment**

```bash
git add src/pages/[locale]/index.astro src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "fix: keep application photography proportional"
```

## Final Verification

- [ ] Run `pnpm test` and expect all Vitest files to pass.
- [ ] Run `pnpm check` and expect zero Astro errors, warnings, or hints.
- [ ] Run `$env:PUBLIC_SITE_URL='https://join.coway.test'; pnpm build` and expect successful `/en`, `/bm`, and `/zh` output plus sitemap and robots files.
- [ ] Run `pnpm test:e2e` and expect all assertions to execute without failures; if the known Windows Playwright teardown hang recurs after assertions complete, record it separately rather than treating it as a product failure.
- [ ] Visually inspect `/en/` at 375 and 1440 pixels: verify the FAQ wording, proportional application image, no Coway corporate link, four balanced active social links with visible keyboard focus and safe external-link behavior, and no horizontal overflow.
- [ ] Confirm `git status --short` contains only the preserved untracked `assets-source/` directory before final review.
