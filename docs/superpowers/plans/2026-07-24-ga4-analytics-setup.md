# GA4 Analytics Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add consent-controlled Google Analytics 4 measurement with ID `G-KGTRGW5765` to every localized page without sending recruitment form data to Google.

**Architecture:** A small analytics configuration module owns the public measurement ID and storage key. A shared Astro component renders localized consent controls, while one focused browser script owns consent persistence, Consent Mode commands, and one-time Google tag loading; `BaseLayout.astro` mounts the component once for every locale.

**Tech Stack:** Astro, TypeScript, browser `localStorage`, Google tag (`gtag.js`), Google Consent Mode, Vitest, Playwright.

## Global Constraints

- Use measurement ID `G-KGTRGW5765`.
- Analytics storage defaults to denied.
- Do not load `gtag.js` until the visitor accepts analytics.
- Support English, Bahasa Malaysia, and Simplified Chinese.
- Keep analytics consent separate from the Formspree application consent.
- Do not add Google Tag Manager, Google Ads remarketing, advertising cookies, enhanced conversions, user IDs, or application field values.
- Do not include the canonical and sitemap corrections in this implementation.
- A blocked Google script or unavailable `localStorage` must not affect navigation or application submission.

---

## File structure

- Create `src/config/analytics.ts`: public GA4 measurement ID and consent storage-key constants.
- Create `src/components/AnalyticsConsent.astro`: localized, accessible consent-banner markup.
- Create `src/scripts/analytics.ts`: consent initialization, persistence, Consent Mode updates, and one-time tag loading.
- Modify `src/content/locales.ts`: analytics banner copy and expanded analytics privacy disclosure for all locales.
- Modify `src/layouts/BaseLayout.astro`: mount the shared analytics component once.
- Modify `src/styles/global.css`: responsive banner and focus styling.
- Create `tests/unit/analytics.test.ts`: configuration and localized content contract.
- Modify `tests/e2e/landing.spec.ts`: browser-level consent, persistence, failure, localization, and no-duplicate-tag coverage.

### Task 1: Analytics configuration and localized content

**Files:**
- Create: `src/config/analytics.ts`
- Modify: `src/content/locales.ts`
- Create: `tests/unit/analytics.test.ts`

**Interfaces:**
- Produces: `GA_MEASUREMENT_ID: "G-KGTRGW5765"`
- Produces: `ANALYTICS_CONSENT_STORAGE_KEY: "coway-analytics-consent"`
- Produces: `LandingContent.analytics` with `message`, `accept`, and `decline` strings.
- Consumes: Existing `Locale`, `LandingContent`, and `getContent(locale)` contracts from `src/content/locales.ts`.

- [ ] **Step 1: Write the failing configuration and localization tests**

Create `tests/unit/analytics.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from '../../src/config/analytics';
import { getContent } from '../../src/content/locales';

describe('analytics configuration', () => {
  it('uses the approved public GA4 identifiers', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-KGTRGW5765');
    expect(ANALYTICS_CONSENT_STORAGE_KEY).toBe('coway-analytics-consent');
  });

  it.each(['en', 'bm', 'zh'] as const)(
    'provides complete %s consent and privacy copy',
    (locale) => {
      const content = getContent(locale);

      expect(content.analytics.message.trim()).not.toBe('');
      expect(content.analytics.accept.trim()).not.toBe('');
      expect(content.analytics.decline.trim()).not.toBe('');
      expect(content.footer.privacy).toContain('Google Analytics');
    },
  );
});
```

- [ ] **Step 2: Run the new unit test and verify that it fails**

Run:

```powershell
pnpm test -- tests/unit/analytics.test.ts
```

Expected: FAIL because `src/config/analytics.ts` and
`LandingContent.analytics` do not exist.

- [ ] **Step 3: Add the minimal analytics configuration**

Create `src/config/analytics.ts`:

```ts
export const GA_MEASUREMENT_ID = 'G-KGTRGW5765' as const;
export const ANALYTICS_CONSENT_STORAGE_KEY =
  'coway-analytics-consent' as const;
```

- [ ] **Step 4: Extend the localized content contract**

Add this property to `LandingContent` in `src/content/locales.ts`:

```ts
analytics: {
  message: string;
  accept: string;
  decline: string;
};
```

Add these exact objects to the English, Bahasa Malaysia, and Chinese content:

```ts
analytics: {
  message:
    'We use Google Analytics to understand how this website is used. Recruitment form answers are not intentionally sent to analytics.',
  accept: 'Accept analytics',
  decline: 'Decline analytics',
},
```

```ts
analytics: {
  message:
    'Kami menggunakan Google Analytics untuk memahami cara laman ini digunakan. Jawapan borang pengambilan tidak dihantar dengan sengaja kepada analitik.',
  accept: 'Terima analitik',
  decline: 'Tolak analitik',
},
```

```ts
analytics: {
  message:
    '我们使用 Google Analytics 来了解此网站的使用情况。招聘申请表中的资料不会被刻意发送到分析服务。',
  accept: '接受分析',
  decline: '拒绝分析',
},
```

Append these exact sentences to each existing `footer.privacy` string:

```text
 With your permission, Google Analytics also measures website use; recruitment form answers are not intentionally sent to analytics.
```

```text
 Dengan kebenaran anda, Google Analytics turut mengukur penggunaan laman; jawapan borang pengambilan tidak dihantar dengan sengaja kepada analitik.
```

```text
 在获得你的许可后，Google Analytics 也会衡量网站使用情况；招聘申请表中的资料不会被刻意发送到分析服务。
```

- [ ] **Step 5: Run focused and full unit tests**

Run:

```powershell
pnpm test -- tests/unit/analytics.test.ts
pnpm test
```

Expected: both commands PASS.

- [ ] **Step 6: Commit Task 1**

```powershell
git add src/config/analytics.ts src/content/locales.ts tests/unit/analytics.test.ts
git commit -m "feat: add localized analytics configuration"
```

### Task 2: Consent-controlled tag, banner, and browser verification

**Files:**
- Create: `src/components/AnalyticsConsent.astro`
- Create: `src/scripts/analytics.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: `GA_MEASUREMENT_ID` and `ANALYTICS_CONSENT_STORAGE_KEY` from `src/config/analytics.ts`.
- Consumes: `LandingContent.analytics` from `src/content/locales.ts`.
- Produces: one `[data-analytics-consent]` region with accept and decline buttons.
- Produces: `window.dataLayer` and `window.gtag` after initialization.
- Produces: one script marked `[data-google-analytics-tag="G-KGTRGW5765"]` only after consent is granted.

- [ ] **Step 1: Write failing end-to-end consent tests**

Append to `tests/e2e/landing.spec.ts`:

```ts
test.describe('analytics consent', () => {
  test('defaults to denied and loads GA4 only after acceptance', async ({
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

  test('restores accepted consent without installing a duplicate tag', async ({
    page,
  }) => {
    await page.goto('/en/');
    await page
      .locator('[data-analytics-consent]')
      .getByRole('button', { name: 'Accept analytics' })
      .click();

    await page.goto('/zh/');
    await expect(
      page.locator('[data-google-analytics-tag="G-KGTRGW5765"]'),
    ).toHaveCount(1);
  });

  test('localizes consent controls and leaves the application usable', async ({
    page,
  }) => {
    for (const { locale, accept, decline } of [
      { locale: 'en', accept: 'Accept analytics', decline: 'Decline analytics' },
      { locale: 'bm', accept: 'Terima analitik', decline: 'Tolak analitik' },
      { locale: 'zh', accept: '接受分析', decline: '拒绝分析' },
    ]) {
      await page.goto(`/${locale}/`);
      const banner = page.locator('[data-analytics-consent]');
      await expect(banner.getByRole('button', { name: accept })).toBeVisible();
      await expect(banner.getByRole('button', { name: decline })).toBeVisible();
      await expect(page.locator('[data-application-form]')).toBeVisible();
    }
  });
});
```

- [ ] **Step 2: Run the focused browser tests and verify that they fail**

Run:

```powershell
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm test:e2e -- --grep "analytics consent"
```

Expected: FAIL because the consent component and tag loader do not exist.

- [ ] **Step 3: Create the localized consent component**

Create `src/components/AnalyticsConsent.astro`:

```astro
---
import type { LandingContent } from '../content/locales';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from '../config/analytics';

interface Props {
  content: LandingContent;
}

const { content } = Astro.props;
---

<aside
  class="analytics-consent"
  data-analytics-consent
  data-measurement-id={GA_MEASUREMENT_ID}
  data-storage-key={ANALYTICS_CONSENT_STORAGE_KEY}
  aria-label={content.analytics.message}
  hidden
>
  <p>{content.analytics.message}</p>
  <div class="analytics-consent-actions">
    <button type="button" data-analytics-accept>
      {content.analytics.accept}
    </button>
    <button type="button" data-analytics-decline>
      {content.analytics.decline}
    </button>
  </div>
</aside>

<script>
  import '../scripts/analytics';
</script>
```

- [ ] **Step 4: Implement fail-closed consent and one-time tag loading**

Create `src/scripts/analytics.ts`:

```ts
type ConsentChoice = 'granted' | 'denied';
type GtagArguments = [command: string, ...values: unknown[]];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: GtagArguments) => void;
  }
}

const root = document.querySelector<HTMLElement>('[data-analytics-consent]');

if (root) {
  const accept = root.querySelector<HTMLButtonElement>(
    '[data-analytics-accept]',
  );
  const decline = root.querySelector<HTMLButtonElement>(
    '[data-analytics-decline]',
  );
  const measurementId = root.dataset.measurementId;
  const storageKey = root.dataset.storageKey;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: GtagArguments) {
      window.dataLayer.push(args);
    };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  const loadGoogleTag = () => {
    if (
      !measurementId ||
      document.querySelector(
        `[data-google-analytics-tag="${measurementId}"]`,
      )
    ) {
      return;
    }

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    script.dataset.googleAnalyticsTag = measurementId;
    document.head.append(script);
  };

  const readChoice = (): ConsentChoice | null => {
    if (!storageKey) return null;
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  };

  const saveChoice = (choice: ConsentChoice) => {
    if (!storageKey) return false;
    try {
      window.localStorage.setItem(storageKey, choice);
      return true;
    } catch {
      return false;
    }
  };

  const applyChoice = (choice: ConsentChoice) => {
    if (choice === 'granted') loadGoogleTag();
    root.hidden = true;
  };

  const savedChoice = readChoice();
  if (savedChoice) {
    applyChoice(savedChoice);
  } else {
    root.hidden = false;
  }

  accept?.addEventListener('click', () => {
    if (saveChoice('granted')) applyChoice('granted');
  });
  decline?.addEventListener('click', () => {
    if (saveChoice('denied')) applyChoice('denied');
  });
}
```

- [ ] **Step 5: Mount the component once in the shared layout**

In `src/layouts/BaseLayout.astro`, import the component:

```astro
import AnalyticsConsent from '../components/AnalyticsConsent.astro';
```

Render it immediately before the existing navigation/motion script:

```astro
<AnalyticsConsent {content} />
```

- [ ] **Step 6: Add accessible responsive styles**

Append to `src/styles/global.css`:

```css
.analytics-consent {
  position: fixed;
  z-index: 90;
  right: var(--page-gutter);
  bottom: var(--space-4);
  width: min(32rem, calc(100% - 2 * var(--page-gutter)));
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: 0 1rem 2rem rgb(8 47 73 / 20%);
}

.analytics-consent[hidden] {
  display: none;
}

.analytics-consent p {
  margin: 0;
}

.analytics-consent-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.analytics-consent button {
  min-height: 2.75rem;
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: var(--color-white);
  color: var(--color-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 750;
}

.analytics-consent [data-analytics-accept] {
  background: var(--color-primary);
  color: var(--color-white);
}

.analytics-consent button:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px var(--focus-ring-contrast);
}

@media (max-width: 40rem) {
  .analytics-consent {
    right: var(--space-3);
    bottom: var(--space-3);
    width: calc(100% - 2 * var(--space-3));
  }

  .analytics-consent-actions {
    display: grid;
  }
}
```

- [ ] **Step 7: Run the focused browser tests and fix only requirement gaps**

Run:

```powershell
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm test:e2e -- --grep "analytics consent"
```

Expected: PASS with no live request sent to Google because Playwright intercepts
the tag request.

- [ ] **Step 8: Run complete static and browser verification**

Run:

```powershell
pnpm test
pnpm check
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm test:e2e
```

Expected: all unit tests, Astro checks, production build, and Playwright tests
PASS. No test submits a real Formspree application or loads a real Google tag.

- [ ] **Step 9: Commit Task 2**

```powershell
git add src/components/AnalyticsConsent.astro src/scripts/analytics.ts src/layouts/BaseLayout.astro src/styles/global.css tests/e2e/landing.spec.ts
git commit -m "feat: add consent-controlled GA4 tracking"
```

### Task 3: Production measurement verification

**Files:**
- No source-file changes expected.

**Interfaces:**
- Consumes: deployed `G-KGTRGW5765` tag and consent banner from Tasks 1–2.
- Produces: confirmed GA4 Realtime or DebugView activity for a consented visit.

- [ ] **Step 1: Deploy through the existing approved GitHub Pages workflow**

Push the committed changes using the project's existing deployment route. Do
not create a second hosting project or change the custom domain.

Expected: the production deployment succeeds at
`https://cowaysalescareer.my/en/`.

- [ ] **Step 2: Verify the live consent boundary**

Open a private browser window, visit `https://cowaysalescareer.my/en/`, and
confirm:

```text
Before acceptance:
- consent banner is visible
- no gtag/js request is present

After acceptance:
- consent banner is hidden
- exactly one gtag/js request contains id=G-KGTRGW5765
- the application form remains usable
```

- [ ] **Step 3: Verify GA4 collection**

Open Google Analytics → Reports → Realtime, then visit the English and Chinese
pages after accepting analytics.

Expected: one active user appears and page views for `/en/` and `/zh/` arrive
without recruitment form values.

- [ ] **Step 4: Record the result**

If Realtime remains empty after 10 minutes, check the browser network request,
the GA4 data-stream URL, and the exact measurement ID before changing code.
Do not add a second tag as a workaround.
