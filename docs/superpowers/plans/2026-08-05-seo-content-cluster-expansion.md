# Coway SEO Content Cluster Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ten useful English and Simplified Chinese supporting pages, strengthen trust and internal linking, and make every route technically discoverable without inventing hiring facts or mass-producing thin pages.

**Architecture:** Keep localized content in typed TypeScript modules and render all supporting pages through one Astro dynamic route and reusable content-page components. Extend the current SEO helper so each route owns unique metadata, self-canonical URL, reciprocal language alternatives, breadcrumbs, and truthful structured data. Retain the BM homepage without generating BM supporting pages in this phase.

**Tech Stack:** Astro static generation, TypeScript content maps, JSON-LD, Vitest, Playwright, `@astrojs/sitemap`, existing GA4/Formspree scripts.

## Global Constraints

- Build exactly five English and five Simplified Chinese supporting pages.
- Do not create city doorway pages; Kuala Lumpur, Selangor, Penang, and Johor share one substantial Malaysia locations page per language.
- Do not publish property-recruitment or LG-recruitment comparison pages.
- Do not add `JobPosting` structured data in this phase.
- Do not invent statistics, testimonials, awards, addresses, certifications, hiring dates, or guarantees.
- The trust disclosure is visible legal copy, never a page/SEO title or hero headline.
- Every compensation mention includes fully commission-based and no-guarantee context.
- All important copy and links are server-rendered and useful without JavaScript.

---

## File Structure

- Create `src/content/pages.ts`: typed page keys, localized metadata, sections, FAQs, and internal-link labels.
- Create `src/content/trust.ts`: approved EN/BM/ZH trust disclosures shared by footer, trust section, and application context.
- Create `src/components/ContentPage.astro`: semantic supporting-page shell.
- Create `src/components/Breadcrumbs.astro`: crawlable localized breadcrumbs and matching JSON-LD data source.
- Create `src/components/TrustDisclosure.astro`: reusable legal/trust block.
- Create `src/components/InternalLinks.astro`: contextual next-step links.
- Create `src/pages/[locale]/[page].astro`: static EN/ZH supporting routes.
- Modify `src/layouts/BaseLayout.astro`: accept page metadata, canonical path, alternates, and JSON-LD.
- Modify `src/content/seo.ts`: path-aware canonical and alternate generation.
- Modify `src/content/locales.ts`: homepage links and revised candidate priority.
- Modify `src/components/Header.astro`: supporting-page navigation URLs.
- Modify `src/components/Footer.astro`: content-cluster links and trust disclosure.
- Modify `src/components/ApplicationForm.astro`: who-reviews-this-application context.
- Modify `src/scripts/application.ts`: consent-controlled `generate_lead` after confirmed success.
- Modify `tests/unit/seo.test.ts`, `tests/unit/locales.test.ts`, `tests/unit/application.test.ts`, and `tests/e2e/landing.spec.ts`.

### Task 1: Define the Typed Page Inventory and Localized Content Contract

**Files:**
- Create: `src/content/pages.ts`
- Modify: `tests/unit/locales.test.ts`

**Interfaces:**
- Produces: `supportingPageKeys`, `getSupportingPage(locale, key)`, and `SupportingPageContent`.

- [ ] **Step 1: Write failing inventory tests**

```ts
import { supportingPageKeys, getSupportingPage } from '../../src/content/pages';

it('defines five useful supporting pages in English and Chinese', () => {
  expect(supportingPageKeys).toEqual([
    'coway-sales-career',
    'career-change-to-sales',
    'sales-training-leadership',
    'coway-sales-malaysia-locations',
    'application-faq',
  ]);
  for (const locale of ['en', 'zh'] as const) {
    for (const key of supportingPageKeys) {
      const page = getSupportingPage(locale, key);
      expect(page.meta.title.length).toBeGreaterThan(20);
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
    }
  }
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/locales.test.ts`

Expected: fail because `src/content/pages.ts` does not exist.

- [ ] **Step 3: Implement the content contract and all ten page records**

Use these types:

```ts
export type SupportingLocale = 'en' | 'zh';
export type SupportingPageKey =
  | 'coway-sales-career'
  | 'career-change-to-sales'
  | 'sales-training-leadership'
  | 'coway-sales-malaysia-locations'
  | 'application-faq';

export interface SupportingPageContent {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  introduction: string;
  sections: Array<{ id: string; title: string; body: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  cta: { title: string; body: string; label: string };
}
```

Write natural Malaysian English and Simplified Chinese copy covering the exact intent map in the design specification. Every page must directly explain the commission model where compensation is relevant and must not duplicate homepage paragraphs.

- [ ] **Step 4: Run inventory tests**

Run: `node_modules\.bin\vitest.cmd run tests/unit/locales.test.ts`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/content/pages.ts tests/unit/locales.test.ts
git commit -m "feat: add localized recruitment page content"
```

### Task 2: Add Path-Aware Canonicals and Reciprocal Language Alternatives

**Files:**
- Modify: `src/content/seo.ts`
- Modify: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `getSeo(locale, origin, pathKey?)` returning canonical, available alternates, and `x-default`.

- [ ] **Step 1: Write failing SEO mapping tests**

```ts
const seo = getSeo('zh', new URL('https://cowaysalescareer.my'), 'career-change-to-sales');
expect(seo.canonical).toBe('https://cowaysalescareer.my/zh/career-change-to-sales/');
expect(seo.alternates['en-MY']).toBe('https://cowaysalescareer.my/en/career-change-to-sales/');
expect(seo.alternates['zh-CN']).toBe('https://cowaysalescareer.my/zh/career-change-to-sales/');
expect(seo.alternates['x-default']).toBe('https://cowaysalescareer.my/en/career-change-to-sales/');
expect(seo.alternates['ms-MY']).toBeUndefined();
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/seo.test.ts`

Expected: current helper always returns homepage URLs and has no `x-default`.

- [ ] **Step 3: Implement path-aware SEO**

Keep BM in homepage alternates only. For supporting pages, return EN/ZH reciprocal mappings plus `x-default` to EN. Always include trailing slashes and use `new URL()`.

- [ ] **Step 4: Run SEO tests**

Run: `node_modules\.bin\vitest.cmd run tests/unit/seo.test.ts`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/content/seo.ts tests/unit/seo.test.ts
git commit -m "feat: add route-aware localized SEO metadata"
```

### Task 3: Render the Ten Supporting Routes

**Files:**
- Create: `src/pages/[locale]/[page].astro`
- Create: `src/components/ContentPage.astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/InternalLinks.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: `supportingPageKeys`, `getSupportingPage`, and path-aware `getSeo`.
- Produces: ten static routes with unique metadata, one `h1`, breadcrumbs, visible sections, FAQs, and application CTA.

- [ ] **Step 1: Write failing route tests**

Loop through EN/ZH and all five keys. Assert HTTP 200, unique `<title>`, one `h1`, self-canonical, two locale alternates plus `x-default`, breadcrumbs, and at least three substantive sections.

- [ ] **Step 2: Run focused browser tests and verify failure**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "supporting recruitment pages"`

Expected: routes return 404.

- [ ] **Step 3: Implement static paths and reusable rendering**

`getStaticPaths()` must emit exactly ten paths:

```ts
export function getStaticPaths() {
  return (['en', 'zh'] as const).flatMap((locale) =>
    supportingPageKeys.map((page) => ({ params: { locale, page }, props: { locale, page } })),
  );
}
```

Render the content through semantic `<article>`, `<section>`, `<h2>`, paragraph, FAQ, and standard anchor elements. Extend `BaseLayout` with explicit `meta`, `pathKey`, and optional JSON-LD props without breaking homepage calls.

- [ ] **Step 4: Run focused route tests**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "supporting recruitment pages"`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/pages src/components/ContentPage.astro src/components/Breadcrumbs.astro src/components/InternalLinks.astro src/layouts/BaseLayout.astro tests/e2e/landing.spec.ts
git commit -m "feat: render localized recruitment content cluster"
```

### Task 4: Add Trust Disclosure Without Polluting Marketing Titles

**Files:**
- Create: `src/content/trust.ts`
- Create: `src/components/TrustDisclosure.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/ApplicationForm.astro`
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/components/ContentPage.astro`
- Modify: `tests/unit/footer.test.ts`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: approved EN/BM/ZH disclosure in trust, footer, and application contexts only.

- [ ] **Step 1: Write failing placement tests**

Assert the full disclosure appears in the footer/trust section, does not appear inside `h1`, `<title>`, hero eyebrow, or primary CTA, and that the application context says the sales leadership team reviews submissions.

- [ ] **Step 2: Run tests and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/footer.test.ts`

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "trust disclosure"`

Expected: fail because the current copy does not contain the approved operator explanation.

- [ ] **Step 3: Implement shared disclosure content**

Store the exact approved English, BM, and Simplified Chinese statements in `trust.ts`. Render them through a reusable component. Do not concatenate them into metadata or hero content. Keep privacy and commission disclaimers separate.

- [ ] **Step 4: Run placement tests**

Run the same focused Vitest and Playwright commands.

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/content/trust.ts src/components/TrustDisclosure.astro src/components/Footer.astro src/components/ApplicationForm.astro src/pages src/components/ContentPage.astro tests/unit/footer.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: add transparent sales team disclosure"
```

### Task 5: Add Crawlable Navigation, Breadcrumbs, and Truthful Structured Data

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Breadcrumbs.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `tests/unit/seo.test.ts`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: crawlable cluster links, `WebSite`, `BreadcrumbList`, and visible-content-matched FAQ JSON-LD.

- [ ] **Step 1: Write failing structured-data and internal-link tests**

Assert every supporting page is linked from homepage/header/footer or a contextual internal-links block. Parse JSON-LD and assert `WebSite` on home, `BreadcrumbList` on supporting pages, FAQ questions matching visible text, and no `JobPosting` type anywhere.

- [ ] **Step 2: Run tests and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/seo.test.ts`

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "structured data|content cluster links"`

Expected: missing structured data and cluster links fail.

- [ ] **Step 3: Implement crawlable links and JSON-LD**

Use ordinary `<a href>` links. Serialize JSON-LD with `JSON.stringify()` inside an Astro `<script type="application/ld+json" set:html={...}>`. Use only visible page values; do not claim Coway Malaysia is the site publisher or hiring organization.

- [ ] **Step 4: Run tests**

Run the same focused commands.

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/components/Header.astro src/components/Footer.astro src/components/Breadcrumbs.astro src/layouts/BaseLayout.astro tests/unit/seo.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: connect recruitment pages for search discovery"
```

### Task 6: Record Qualified Application Success in GA4

**Files:**
- Modify: `src/scripts/application.ts`
- Modify: `src/scripts/analytics.ts`
- Modify: `tests/unit/application.test.ts`
- Modify: `tests/unit/analytics.test.ts`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `trackLeadConversion()` that emits `generate_lead` only after confirmed Formspree success and consent.

- [ ] **Step 1: Write failing analytics tests**

Assert no event on validation error or failed submission, one `generate_lead` on confirmed success with consent, and no applicant field values in the event payload.

- [ ] **Step 2: Run tests and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/application.test.ts tests/unit/analytics.test.ts`

Expected: fail because no lead conversion helper exists.

- [ ] **Step 3: Implement consent-controlled conversion tracking**

Expose a helper that calls the existing consent-aware analytics boundary:

```ts
trackEvent('generate_lead', {
  form_name: 'sales_recruitment_application',
  locale,
});
```

Call it exactly once after the Formspree success response. Do not include name, phone, age, job, city, state, experience, or free-text values.

- [ ] **Step 4: Run unit and mocked browser tests**

Run the same Vitest command, then:

`node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "application analytics"`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/scripts/application.ts src/scripts/analytics.ts tests/unit/application.test.ts tests/unit/analytics.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: measure qualified recruitment leads"
```

### Task 7: Verify Sitemap, Build, Routes, and Search Readiness

**Files:**
- Modify only files required by failures found in this task.

- [ ] **Step 1: Run the complete unit suite**

Run: `node_modules\.bin\vitest.cmd run`

Expected: all tests pass.

- [ ] **Step 2: Run Astro diagnostics**

Run: `node_modules\.bin\astro.cmd check`

Expected: zero errors, warnings, or hints.

- [ ] **Step 3: Build for the production origin**

Run: `$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; node_modules\.bin\astro.cmd build`

Expected: build succeeds with 13 public HTML routes: three localized homepages and ten EN/ZH supporting pages.

- [ ] **Step 4: Verify generated search files**

Inspect `dist/sitemap-index.xml`, the referenced sitemap, and `dist/robots.txt`. Confirm all 13 canonical routes are present, robots references the sitemap, and no `JobPosting` string exists in `dist`.

- [ ] **Step 5: Run the complete browser suite**

Use the established external-preview workflow:

`$env:PLAYWRIGHT_EXTERNAL_SERVER='1'; node_modules\.bin\playwright.cmd test`

Expected: all browser tests pass across locales, supporting routes, mobile navigation, form handling, consent, and motion.

- [ ] **Step 6: Present local preview for user approval**

Open the exact local preview URL in Codex. Do not publish until the user confirms the redesigned homepages, representative EN/ZH supporting pages, mobile menu, trust copy, and application form.

- [ ] **Step 7: Publish and complete Search Console handoff after approval**

Use the existing GitHub Pages workflow. Verify the live canonical, language alternatives, sitemap, robots, form, and GA consent. Then resubmit the sitemap and request indexing for `/en/`, `/zh/`, `/en/coway-sales-career/`, and `/zh/coway-sales-career/`.

