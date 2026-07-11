# Coway Sales Recruitment Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, responsive, trilingual Coway sales-recruitment landing page that transparently communicates the commission opportunity and converts qualified Malaysian candidates through a short application form.

**Architecture:** Use Astro static output and i18n routing to render crawlable `/en/`, `/bm/`, and `/zh/` pages from typed locale dictionaries. Keep sections as focused Astro components, use small progressive-enhancement scripts for interaction, and isolate form submission behind a disabled adapter until a secure production destination is approved.

**Tech Stack:** Astro, TypeScript, CSS custom properties, Vitest, Playwright, Astro sitemap, pnpm

## Global Constraints

- English is the default; public routes are `/en/`, `/bm/`, and `/zh/`.
- Header and footer expose a keyboard-accessible English / Bahasa Malaysia / 中文 button.
- Language switching preserves known section anchors.
- Show `RM2,500-RM10,000+ potential monthly commission income` beside the fully commission-based, no-guarantee disclosure.
- Never imply fixed salary, guaranteed earnings, or an official Coway corporate-careers page.
- Do not invent metrics, ranks, testimonials, or outcomes.
- Preserve `assets-source/`; commit only optimized derivatives in `public/media/`.
- Do not transmit applicant data until a secure endpoint and privacy workflow are approved.
- Meet WCAG 2.2 AA and respect reduced motion.

---

## Planned File Structure

```text
astro.config.mjs                     static, sitemap, and i18n configuration
package.json                         scripts and dependencies
src/content/locales.ts               typed EN/BM/ZH dictionaries
src/content/seo.ts                   canonical and hreflang helpers
src/content/media.ts                 typed optimized-media manifest
src/layouts/BaseLayout.astro         document, metadata, header, footer
src/components/*.astro               focused landing-page sections
src/lib/form/schema.ts               normalization and validation
src/lib/form/submit.ts               disabled/production submission adapter
src/scripts/navigation.ts            locale anchor and mobile navigation
src/scripts/motion.ts                reduced-motion-safe reveals
src/scripts/application-form.ts      form state and feedback
src/styles/global.css                tokens, reset, accessibility
src/styles/landing.css               responsive Bright Momentum styling
src/pages/index.astro                redirect to `/en/`
src/pages/[locale]/index.astro        localized page composition
src/pages/robots.txt.ts              robots response
tests/unit/*.test.ts                 content, SEO, media, and form tests
tests/e2e/*.spec.ts                  localized production-preview tests
```

### Task 1: Establish the Tested Astro Foundation

**Files:**
- Create: `.gitignore`, `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `vitest.config.ts`, `playwright.config.ts`
- Create: `src/pages/index.astro`, `src/pages/[locale]/index.astro`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `locale: 'en' | 'bm' | 'zh'` and scripts `dev`, `check`, `test`, `build`, `test:e2e`.

- [ ] **Step 1: Write the failing locale-route test**

```ts
import { expect, test } from '@playwright/test';
for (const locale of ['en', 'bm', 'zh']) {
  test(`${locale} route renders`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  });
}
```

- [ ] **Step 2: Run it and verify the expected failure**

Run: `pnpm install && pnpm exec playwright install chromium && pnpm test:e2e`

Expected: FAIL because package configuration and locale pages do not exist.

- [ ] **Step 3: Create package configuration**

Use current stable Astro packages, then commit the resolved lockfile. Required scripts:

```json
{"scripts":{"dev":"astro dev","check":"astro check","test":"vitest run","build":"astro check && astro build","preview":"astro preview","test:e2e":"playwright test"}}
```

Configure static output, trailing slashes, sitemap, locales `en`, `bm`, `zh`, default `en`, and `prefixDefaultLocale: true`.

- [ ] **Step 4: Implement locale generation and redirect**

```astro
---
export function getStaticPaths() {
  return ['en', 'bm', 'zh'].map((locale) => ({ params: { locale } }));
}
const locale = Astro.params.locale as 'en' | 'bm' | 'zh';
---
<html lang={locale === 'zh' ? 'zh-CN' : locale === 'bm' ? 'ms-MY' : 'en-MY'}>
  <head><title>Coway Sales Recruitment Malaysia</title></head>
  <body><main><h1>Coway Sales Recruitment Malaysia</h1></main></body>
</html>
```

Root route returns `Astro.redirect('/en/', 302)`.

- [ ] **Step 5: Verify and commit**

Run: `pnpm check && pnpm build && pnpm test:e2e`

Expected: PASS; three localized HTML files exist in `dist/`.

```powershell
git add .gitignore package.json pnpm-lock.yaml astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts src/pages tests/e2e/landing.spec.ts
git commit -m "chore: establish tested Astro foundation"
```

### Task 2: Create Complete Typed Localized Content

**Files:**
- Create: `src/content/locales.ts`
- Test: `tests/unit/locales.test.ts`

**Interfaces:**
- Produces: `Locale`, `LandingContent`, `locales`, and `getContent(locale)`.

- [ ] **Step 1: Write dictionary parity tests**

```ts
import { expect, it } from 'vitest';
import { getContent, locales } from '../../src/content/locales';
it.each(locales)('%s has required content', (locale) => {
  const content = getContent(locale);
  expect(content.support.items).toHaveLength(6);
  expect(content.form.fields).toHaveLength(5);
  expect(content.opportunity.guarantee).toBe(false);
});
```

- [ ] **Step 2: Run and confirm missing-module failure**

Run: `pnpm test -- tests/unit/locales.test.ts`

- [ ] **Step 3: Implement strict content types and English dictionary**

`LandingContent` must contain `meta`, `nav`, `hero`, `momentum`, `opportunity`, `support`, `culture`, `progression`, `video`, `candidateFit`, `form`, `faq`, and `footer`. Include the approved headline, income disclosure, six support benefits, culture statement, candidate priority, five form categories, and seven FAQs.

```ts
export const locales = ['en', 'bm', 'zh'] as const;
export type Locale = (typeof locales)[number];
const dictionaries: Record<Locale, LandingContent> = { en, bm, zh };
export const getContent = (locale: Locale) => dictionaries[locale];
```

- [ ] **Step 4: Add complete BM and Simplified Chinese dictionaries**

Translate meaning, preserve the income disclaimer, keep Coway untranslated, and use natural Malaysian recruitment wording. Every key must be present in every dictionary.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test -- tests/unit/locales.test.ts && pnpm check`

```powershell
git add src/content/locales.ts tests/unit/locales.test.ts
git commit -m "feat: add trilingual recruitment content"
```

### Task 3: Build SEO Shell and Language Navigation

**Files:**
- Create: `src/content/seo.ts`, `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`, `src/components/Footer.astro`
- Create: `src/styles/global.css`
- Modify: `src/pages/[locale]/index.astro`
- Test: `tests/unit/seo.test.ts`, `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `getSeo(locale, origin)` with canonical and three alternates.

- [ ] **Step 1: Write the failing SEO test**

```ts
expect(getSeo('bm', new URL('https://recruit.example'))).toMatchObject({
  canonical: 'https://recruit.example/bm/',
  alternates: {
    'en-MY': 'https://recruit.example/en/',
    'ms-MY': 'https://recruit.example/bm/',
    'zh-CN': 'https://recruit.example/zh/'
  }
});
```

- [ ] **Step 2: Implement `getSeo` and shared layout**

Map `en -> en-MY`, `bm -> ms-MY`, and `zh -> zh-CN`. Render localized title, description, canonical, hreflang, Open Graph tags, skip link, header, main slot, footer, and official link to `https://www.coway.com.my/`.

- [ ] **Step 3: Implement language menu**

Use native `<details>`/`<summary>` with links carrying `data-locale-link`. Include navigation anchors `#opportunity`, `#support`, `#growth`, `#faq`, and `#apply`.

- [ ] **Step 4: Add design tokens and accessibility baseline**

Define Coway blue, navy, white, coral accent, focus ring, spacing, radii, readable typography, Chinese fallback, skip-link, `:focus-visible`, and reduced-motion override.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test && pnpm check && pnpm build && pnpm test:e2e`

```powershell
git add src/content src/layouts src/components/Header.astro src/components/Footer.astro src/styles/global.css src/pages tests
git commit -m "feat: add localized SEO shell and navigation"
```

### Task 4: Optimize Authentic Media

**Files:**
- Create: `scripts/optimize-media.mjs`, `src/content/media.ts`, `public/media/*`
- Test: `tests/unit/media.test.ts`

**Interfaces:**
- Produces: typed `media.hero`, `media.culture`, `media.achievements`, and `media.video`.

- [ ] **Step 1: Write a failing manifest test**

```ts
for (const item of [media.hero, ...media.culture, ...media.achievements]) {
  expect(item.width).toBeGreaterThan(0);
  expect(item.height).toBeGreaterThan(0);
  expect(item.alt.en.length).toBeGreaterThan(10);
}
```

- [ ] **Step 2: Generate 640/960/1440 AVIF and WebP images**

Use `sharp`; normalize filenames; never overwrite `assets-source/`. Generate responsive derivatives for four team and two achievement photos plus an optimized transparent logo.

- [ ] **Step 3: Transcode the MOV**

Use FFmpeg to create 720p MP4/WebM and a WebP poster. If FFmpeg is unavailable, request installation and leave the original MOV out of `public/`.

- [ ] **Step 4: Complete media manifest**

Each asset includes `src`, `width`, `height`, and approved EN/BM/ZH alt text. The `culture` and `achievements` arrays must not be empty.

- [ ] **Step 5: Verify and commit**

Run: `pnpm media && pnpm test -- tests/unit/media.test.ts && pnpm build`

```powershell
git add scripts package.json pnpm-lock.yaml src/content/media.ts public/media tests/unit/media.test.ts
git commit -m "feat: optimize authentic recruitment media"
```

### Task 5: Implement Bright Momentum Sections

**Files:**
- Create: `src/components/Hero.astro`, `MomentumStrip.astro`, `Opportunity.astro`
- Create: `SupportGrid.astro`, `Culture.astro`, `Progression.astro`
- Create: `TeamVideo.astro`, `CandidateFit.astro`, `Faq.astro`
- Create: `src/styles/landing.css`
- Modify: `src/pages/[locale]/index.astro`, `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: localized content and media manifest.
- Produces: stable section IDs used by navigation and language switching.

- [ ] **Step 1: Add failing E2E content assertions**

```ts
await expect(page.getByRole('heading', { level: 1 })).toContainText("Don't Just Sell");
await expect(page.getByText('RM2,500-RM10,000+', { exact: false })).toBeVisible();
await expect(page.getByText('no income is guaranteed', { exact: false })).toBeVisible();
await expect(page.locator('#support article')).toHaveCount(6);
```

- [ ] **Step 2: Build semantic components**

Give each component only its dictionary subsection and media. Use sequential headings, figures for proof, native details for FAQ, explicit image dimensions, user-initiated muted video controls, and the commission disclosure inside the income card.

- [ ] **Step 3: Compose the page**

```astro
<BaseLayout locale={locale} content={content}>
  <Hero content={content.hero} media={media.hero} />
  <MomentumStrip items={content.momentum} />
  <Opportunity content={content.opportunity} />
  <SupportGrid content={content.support} />
  <Culture content={content.culture} media={media.culture} />
  <Progression content={content.progression} media={media.achievements} />
  <TeamVideo content={content.video} media={media.video} />
  <CandidateFit content={content.candidateFit} />
  <Faq content={content.faq} />
</BaseLayout>
```

- [ ] **Step 4: Implement responsive editorial styling**

Use white canvas, navy type, Coway-blue actions, restrained coral accents, a 12-column desktop hero, arched media, asymmetric culture grid, `clamp()` typography, single-column mobile flow, and no horizontal overflow from 320px upward.

- [ ] **Step 5: Verify and commit**

Run: `pnpm check && pnpm test && pnpm build && pnpm test:e2e`

Expected: PASS at 390x844 and 1440x900 with no overlap or clipping.

```powershell
git add src/components src/pages src/styles tests/e2e/landing.spec.ts
git commit -m "feat: build Bright Momentum landing sections"
```

### Task 6: Add Accessible Motion and Anchor Preservation

**Files:**
- Create: `src/scripts/navigation.ts`, `src/scripts/motion.ts`
- Modify: `src/layouts/BaseLayout.astro`, `src/styles/landing.css`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `preserveLocaleAnchor(target, hash)`.

- [ ] **Step 1: Add failing tests**

Assert switching from `/en/#support` to BM opens `/bm/#support`; reduced-motion emulation disables ticker animation and reveals all `[data-reveal]` elements.

- [ ] **Step 2: Implement anchor preservation**

```ts
const recognized = new Set(['#opportunity', '#support', '#growth', '#faq', '#apply']);
export const preserveLocaleAnchor = (target: URL, hash: string) => {
  target.hash = recognized.has(hash) ? hash : '';
  return target.toString();
};
```

- [ ] **Step 3: Implement one reveal observer**

Add `is-visible` once per element. With `prefers-reduced-motion: reduce`, reveal all elements and disable ticker/image motion without creating observers.

- [ ] **Step 4: Verify and commit**

Run: `pnpm check && pnpm test:e2e`

```powershell
git add src/scripts src/layouts/BaseLayout.astro src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: add accessible page motion"
```

### Task 7: Build the Safe Application Form

**Files:**
- Create: `src/lib/form/schema.ts`, `src/lib/form/submit.ts`
- Create: `src/components/ApplicationForm.astro`, `src/scripts/application-form.ts`
- Modify: `src/pages/[locale]/index.astro`
- Test: `tests/unit/form-schema.test.ts`, `tests/e2e/form.spec.ts`

**Interfaces:**
- Produces: `validateApplication(FormData): ValidationResult`.
- Produces: `submitApplication(ApplicationData): Promise<SubmitResult>`.

- [ ] **Step 1: Write failing validation tests**

Test one complete adult applicant and rejection of missing consent, invalid age, invalid experience option, blank state, and free text over 120 characters.

- [ ] **Step 2: Implement exact form types**

```ts
export type ApplicationData = {
  name: string;
  ageRange: '18-24' | '25-34' | '35-44' | '45+';
  currentJob: string;
  state: string;
  city?: string;
  salesExperience: 'none' | 'lt1' | '1-3' | '4-6' | '7+';
  experienceDetail?: string;
  consent: true;
};
```

Trim values, validate enums, require consent, and return field-keyed localized error codes.

- [ ] **Step 3: Implement accessible localized markup**

Use labels, required indicators, `autocomplete="name"`, status region, inline errors with `aria-describedby`, five required information categories, and optional city/experience detail.

- [ ] **Step 4: Implement disabled transport**

```ts
export async function submitApplication(): Promise<{ ok: false; code: 'SUBMISSION_NOT_CONFIGURED' }> {
  return { ok: false, code: 'SUBMISSION_NOT_CONFIGURED' };
}
```

The preview validates and demonstrates success/failure UI but must not call `fetch`, email, WhatsApp, storage, or analytics with applicant data.

- [ ] **Step 5: Add E2E form-state tests**

Assert no POST occurs, invalid submission focuses the first error, values survive failure, and double submission is blocked.

- [ ] **Step 6: Verify and commit**

Run: `pnpm test && pnpm build && pnpm test:e2e -- tests/e2e/form.spec.ts`

```powershell
git add src/lib/form src/components/ApplicationForm.astro src/scripts/application-form.ts src/pages tests
git commit -m "feat: add safe recruitment application form"
```

### Task 8: Add Production Guards and Full Verification

**Files:**
- Create: `src/pages/robots.txt.ts`, `tests/e2e/production.spec.ts`, `README.md`
- Modify: `astro.config.mjs`

**Interfaces:**
- Produces: environment-controlled production origin and launch checklist.

- [ ] **Step 1: Write failing production checks**

Assert robots and sitemap exist, all locales appear, every page has one H1/canonical, meaningful images have alt/dimensions, no `JobPosting` schema exists, and rendered production metadata does not contain `example.com`.

- [ ] **Step 2: Require production origin**

```js
const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';
if (process.env.CI && !process.env.PUBLIC_SITE_URL) {
  throw new Error('PUBLIC_SITE_URL is required for production builds');
}
```

- [ ] **Step 3: Add robots response**

```ts
export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', site)}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
```

- [ ] **Step 4: Document operation and launch blockers**

Document install/dev/test/build commands, media generation, translation location, disclosure rule, disabled form, production origin, and requirements for privacy notice, final translations, secure endpoint, media permission, and Coway disclosure approval.

- [ ] **Step 5: Run the complete verification suite**

```powershell
pnpm check
pnpm test
$env:PUBLIC_SITE_URL='https://recruit.example'; pnpm build
pnpm test:e2e
```

Expected: all commands exit 0. Manually inspect three languages at 390px and 1440px, keyboard through controls, and verify reduced-motion mode.

- [ ] **Step 6: Commit**

```powershell
git add README.md astro.config.mjs src/pages/robots.txt.ts tests/e2e/production.spec.ts
git commit -m "chore: add launch guards and verification"
```

## Production Completion Gate

Before launch, obtain the final domain, secure form endpoint and retention workflow, published privacy notice, human-reviewed BM and Simplified Chinese wording, permission for all people/media shown, and approval of the independent Coway recruitment disclosure. Until then, the deliverable is a complete testable content/design preview with applicant transmission disabled.
