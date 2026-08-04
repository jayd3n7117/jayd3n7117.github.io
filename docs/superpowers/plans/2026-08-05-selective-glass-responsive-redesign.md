# Coway Selective-Glass Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Coway recruitment interface around the approved selective-glass visual system, purposeful scroll reveals, and a viewport-safe mobile navigation.

**Architecture:** Preserve the Astro component structure and server-rendered content. Establish shared colour, typography, glass, spacing, and motion tokens in the existing stylesheets; update focused components rather than replacing the app architecture. Fix mobile navigation at the header-container boundary and cover it with Playwright regression tests before visual redesign work.

**Tech Stack:** Astro, TypeScript, native CSS, IntersectionObserver, Vitest, Playwright.

## Global Constraints

- Keep `RM2,500-RM10,000+ per month` and the fully commission-based/no-guarantee disclosure unchanged in meaning.
- Palette is deep night navy, violet, rose, peach endpoint, lilac, white, and cool violet-grey neutrals only.
- Use glass on no more than two or three prominent surfaces per viewport.
- Important content is visible without JavaScript; motion-ready styles activate only after initialization.
- Respect `prefers-reduced-motion: reduce` and do not hijack native scrolling.
- Mobile touch targets are at least 44 pixels and the site has no horizontal overflow at 320 pixels.
- The trust disclaimer is not a page title, SEO title, hero headline, eyebrow, or primary CTA.
- Preserve existing Formspree, analytics consent, locale persistence, privacy copy, and authorized Coway logo treatment.

---

## File Structure

- Modify `src/styles/global.css`: shared design tokens, glass primitives, header/footer, controls, mobile navigation.
- Modify `src/styles/landing.css`: approved homepage section composition and responsive rules.
- Modify `src/components/Header.astro`: navigation semantics and viewport-safe mobile panel structure.
- Modify `src/components/Hero.astro`: approved hero hierarchy and selective glass surfaces.
- Modify `src/components/Opportunity.astro`: solid compensation panel and exact disclosure.
- Modify `src/components/SupportGrid.astro`: white/lilac reading surface and non-glass feature treatment.
- Modify `src/components/TeamMedia.astro`: use only genuine existing media where it supports trust.
- Modify `src/components/JourneyFlow.astro`: solid career-path rows with grouped reveals.
- Modify `src/components/CandidateFit.astro`: updated audience priority and responsive layout.
- Modify `src/components/Faq.astro`: solid, readable disclosure rows.
- Modify `src/components/ApplicationForm.astro`: approved conversion surface without changing fields.
- Modify `src/components/Footer.astro`: coordinated dark footer and legal disclosure placement.
- Modify `src/scripts/navigation.ts`: close competing disclosure menus and support Escape/outside interaction.
- Modify `src/scripts/motion.ts`: grouped reveal behavior and glass entry sheen.
- Modify `tests/e2e/landing.spec.ts`: mobile navigation, overflow, visual-behavior, and reduced-motion coverage.
- Modify `tests/unit/motion.test.ts`: motion-ready and reduced-motion invariants.

### Task 1: Lock the Mobile Navigation Inside the Viewport

**Files:**
- Modify: `tests/e2e/landing.spec.ts`
- Modify: `src/styles/global.css`
- Modify: `src/components/Header.astro`
- Modify: `src/scripts/navigation.ts`

**Interfaces:**
- Consumes: existing `.header-inner`, `.mobile-navigation`, `.language-menu`, and `[data-locale-link]` hooks.
- Produces: a header-bound mobile panel with no horizontal overflow and mutually exclusive open `<details>` controls.

- [ ] **Step 1: Write the failing viewport regression test**

Add a parameterized Playwright test that opens both the mobile menu and language menu at 320, 375, and 390 pixels and asserts each panel is inside the viewport:

```ts
for (const width of [320, 375, 390]) {
  test(`keeps mobile navigation inside a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/en/');

    const documentWidthBefore = await page.evaluate(() => document.documentElement.scrollWidth);
    const menu = page.locator('.mobile-navigation');
    await menu.locator(':scope > summary').click();
    const panel = menu.locator('nav');
    await expect(panel).toBeVisible();

    const bounds = await panel.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(documentWidthBefore);
  });
}
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "keeps mobile navigation"`

Expected: at least one viewport fails because the current absolute panel is positioned relative to the small menu control.

- [ ] **Step 3: Anchor the mobile panel to the header container**

At the mobile breakpoint, make `.header-inner` the containing block, make `.mobile-navigation` static, and stretch its panel to the shell:

```css
@media (max-width: 60rem) {
  .header-inner {
    position: relative;
  }

  .mobile-navigation {
    position: static;
  }

  .mobile-navigation nav {
    inset-inline: 0;
    width: auto;
    min-width: 0;
    max-width: 100%;
  }
}
```

Keep language-menu width within `min(12rem, calc(100vw - 2 * var(--page-gutter)))`. Add data hooks to both header `<details>` elements if needed and update `navigation.ts` so opening one closes the other, Escape closes the open control, and successful navigation closes the mobile panel.

- [ ] **Step 4: Run the mobile-navigation tests**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "mobile navigation|inside a"`

Expected: all focused tests pass at 320, 375, and 390 pixels.

- [ ] **Step 5: Commit the regression fix**

```powershell
git add src/styles/global.css src/components/Header.astro src/scripts/navigation.ts tests/e2e/landing.spec.ts
git commit -m "fix: keep mobile navigation inside viewport"
```

### Task 2: Establish the Approved Design Tokens and Glass Primitive

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `--color-night`, `--color-violet`, `--color-rose`, `--color-peach`, `--color-lilac`, shared radii, and `.glass-surface`.

- [ ] **Step 1: Add failing computed-style assertions**

Assert that the header glass surface has a backdrop filter, one-pixel border, and that ordinary FAQ rows do not use backdrop filtering.

```ts
const headerStyle = await page.locator('.site-header .glass-surface').evaluate((element) => getComputedStyle(element));
expect(headerStyle.backdropFilter).toContain('blur');
const faqFilter = await page.locator('#faq details').first().evaluate((element) => getComputedStyle(element).backdropFilter);
expect(faqFilter === 'none' || faqFilter === '').toBeTruthy();
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "selective glass"`

Expected: failure because the new token and primitive names do not exist.

- [ ] **Step 3: Replace legacy colour tokens and add the primitive**

Define the approved palette and a reusable effect:

```css
:root {
  --color-night: #090711;
  --color-night-soft: #151126;
  --color-violet: #8c67e8;
  --color-rose: #ee709d;
  --color-peach: #ffb78d;
  --color-lilac: #f2edff;
  --color-ink: #1a1724;
  --color-muted: #686474;
  --color-line: #e9e3f3;
  --radius-card: 1.5rem;
}

.glass-surface {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 14%);
  background: rgb(18 15 35 / 59%);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 18%);
}
```

Add the specular pseudo-element only to `.glass-interactive`, not every glass surface. Provide a solid background fallback before `backdrop-filter` and remove legacy lime/aqua accents.

- [ ] **Step 4: Run the test and stylesheet diagnostics**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "selective glass"`

Expected: pass.

- [ ] **Step 5: Commit the design foundation**

```powershell
git add src/styles/global.css tests/e2e/landing.spec.ts
git commit -m "feat: add selective glass design tokens"
```

### Task 3: Recompose the Header and Hero

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/landing.css`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: approved locale content and existing hero media configuration.
- Produces: responsive dark hero, one primary CTA, solid secondary CTA, glass growth panel, and crawlable text.

- [ ] **Step 1: Write failing hierarchy and layout tests**

Assert one `h1`, one primary CTA, no disclaimer inside the hero, a visible growth panel, and no horizontal overflow at 320 and 1440 pixels.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "hero hierarchy|hero responsive"`

Expected: failure against the current performance-sport composition.

- [ ] **Step 3: Implement the approved hero**

Use a two-column desktop grid and single-column mobile stack. Apply `.glass-surface.glass-interactive` only to the navigation and growth panel. Keep the headline, supporting paragraph, two CTAs, and three solid proof chips. Use an abstract orbit/grid background; do not require a new photograph.

- [ ] **Step 4: Verify hero behavior**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "hero hierarchy|hero responsive|mobile navigation"`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/components/Header.astro src/components/Hero.astro src/styles/global.css src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: rebuild header and recruitment hero"
```

### Task 4: Redesign the Homepage Reading Sections

**Files:**
- Modify: `src/components/Opportunity.astro`
- Modify: `src/components/SupportGrid.astro`
- Modify: `src/components/TeamMedia.astro`
- Modify: `src/components/JourneyFlow.astro`
- Modify: `src/components/CandidateFit.astro`
- Modify: `src/components/Faq.astro`
- Modify: `src/components/ApplicationForm.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/styles/landing.css`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: alternating dark, white, and lilac section rhythm; solid reading surfaces; exact disclosure placement; responsive application flow.

- [ ] **Step 1: Write failing section-order and disclosure tests**

Assert the commission range and no-guarantee copy, updated candidate order, trust disclosure outside the hero, visible form labels, and no more than three `.glass-surface` elements in the initial viewport.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "homepage section system|candidate priority|trust disclosure"`

Expected: candidate ordering and new presentation hooks fail.

- [ ] **Step 3: Implement the section system**

Use solid white rows for support and FAQs, a lilac progression section, a solid high-contrast commission panel, genuine existing media only in the team proof section, and a dark footer. Keep the form fields and submission hooks unchanged. Add the full trust disclosure only to the trust/footer/application context.

- [ ] **Step 4: Run focused homepage and application tests**

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "homepage section system|candidate priority|trust disclosure|application"`

Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add src/components src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: apply responsive homepage design system"
```

### Task 5: Implement Grouped Scroll Reveals and Reduced Motion

**Files:**
- Modify: `src/scripts/motion.ts`
- Modify: `src/styles/global.css`
- Modify: `src/styles/landing.css`
- Modify: `tests/unit/motion.test.ts`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: `[data-reveal]`, optional `data-reveal-group`, and `.glass-interactive` hooks.
- Produces: one-time grouped reveals and immediate visible state for reduced motion/no JavaScript.

- [ ] **Step 1: Write failing motion tests**

Add assertions that pre-reveal opacity is only applied under `.motion-ready`, observer entries unobserve after reveal, and reduced-motion mode immediately adds visible state.

- [ ] **Step 2: Run tests and verify failure**

Run: `node_modules\.bin\vitest.cmd run tests/unit/motion.test.ts`

Expected: new grouped-reveal assertions fail.

- [ ] **Step 3: Implement minimal grouped motion**

Keep one IntersectionObserver. Set stagger delay through a CSS custom property derived from sibling order; unobserve after first entry. Add one entry sheen class only to glass surfaces. Remove or reduce continuous hero/parallax work where it competes with the approved reveal system.

- [ ] **Step 4: Verify motion and accessibility**

Run: `node_modules\.bin\vitest.cmd run tests/unit/motion.test.ts`

Run: `node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "motion|reduced"`

Expected: all focused tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/scripts/motion.ts src/styles/global.css src/styles/landing.css tests/unit/motion.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: add accessible grouped scroll reveals"
```

### Task 6: Validate the Complete Responsive Redesign

**Files:**
- Modify only files required by failures found in this task.

- [ ] **Step 1: Run unit tests**

Run: `node_modules\.bin\vitest.cmd run`

Expected: all tests pass.

- [ ] **Step 2: Run Astro diagnostics**

Run: `node_modules\.bin\astro.cmd check`

Expected: zero errors, warnings, or hints.

- [ ] **Step 3: Run the production build**

Run: `$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; node_modules\.bin\astro.cmd build`

Expected: build succeeds and produces all existing locale routes.

- [ ] **Step 4: Run the complete browser suite**

Use the established external-preview workflow on Windows and run:

`$env:PLAYWRIGHT_EXTERNAL_SERVER='1'; node_modules\.bin\playwright.cmd test`

Expected: all browser tests pass, including 320/375/390 mobile navigation cases.

- [ ] **Step 5: Handle verification corrections through their owning task**

If verification requires no code changes, create no extra commit. If a failure requires a correction, return to the task that owns that file, rerun that task's focused tests, and use its exact staging and commit step before repeating this validation task.
