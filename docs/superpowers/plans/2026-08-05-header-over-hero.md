# Header Over Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the existing sticky glass header island visually over every first-page hero so no separate white header row appears.

**Architecture:** Preserve the semantic `Header -> main -> Footer` structure. Introduce one shared header-offset CSS token, pull the adjacent main element upward by that exact offset, and add the offset back as safe top padding inside the homepage and supporting-page heroes.

**Tech Stack:** Astro, shared CSS, Playwright, Vitest, TypeScript

## Global Constraints

- Keep `.site-header` sticky and its wrapper transparent.
- Keep `.header-inner.glass-surface` as the only painted navigation surface.
- Preserve the one-row header from 320px upward, 44px touch targets, dropdown containment, and no horizontal overflow.
- Do not change copy, metadata, structured data, URLs, navigation labels, analytics, glass styling, or scroll animation behavior.
- Apply the layout consistently to the homepage and English and Simplified Chinese supporting pages.

---

### Task 1: Integrate the Sticky Header with the First Hero

**Files:**
- Modify: `tests/e2e/landing.spec.ts`
- Modify: `src/styles/global.css`
- Modify: `src/styles/landing.css`
- Modify: `src/styles/content-page.css`

**Interfaces:**
- Consumes: `.site-header`, `.site-header + main`, `.career-hero`, `.content-hero-inner`, `.breadcrumbs`, and the existing `--page-gutter` token.
- Produces: `--site-header-offset: 5.25rem` and a shared visual overlap contract where the first hero starts behind the header while readable hero content starts below the island.

- [ ] **Step 1: Write the failing browser regression**

Add this test after the existing standalone glass-island test in `tests/e2e/landing.spec.ts`:

```ts
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
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });
}
```

- [ ] **Step 2: Run the new regression and verify RED**

Run:

```powershell
node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts --grep "places the header island over the hero"
```

Expected: both scenarios fail because the current hero begins at or below the bottom of the header's occupied row rather than behind the glass island.

- [ ] **Step 3: Add the shared overlap token and adjacent-main offset**

In the `:root` block of `src/styles/global.css`, add:

```css
--site-header-offset: 5.25rem;
```

Immediately after the `.site-header` rule, add:

```css
.site-header + main {
  margin-top: calc(-1 * var(--site-header-offset));
}
```

This offsets only the main element adjacent to the site header and does not alter the sticky header's geometry.

- [ ] **Step 4: Restore safe content spacing inside both hero families**

In the base `.hero` rule in `src/styles/landing.css`, replace its top padding value with:

```css
padding:
  calc(var(--site-header-offset) + clamp(3rem, 7vw, 5.5rem))
  var(--page-gutter)
  clamp(4rem, 8vw, 7rem);
```

In the mobile `.hero` rule under `@media (max-width: 40rem)`, replace `padding-top: 3rem` with:

```css
padding-top: calc(var(--site-header-offset) + 3rem);
```

In `.content-hero-inner` in `src/styles/content-page.css`, replace `padding-block` with:

```css
padding:
  calc(var(--site-header-offset) + clamp(2rem, 6vw, 5.5rem))
  0
  clamp(2rem, 6vw, 5.5rem);
```

- [ ] **Step 5: Run the focused regression and verify GREEN**

Run:

```powershell
node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts --grep "header island|visible header controls|header menus"
```

Expected: all matched header overlap, island, alignment, and containment tests pass.

- [ ] **Step 6: Run static and full browser verification**

Run:

```powershell
node node_modules/vitest/vitest.mjs run
node_modules\.bin\astro-check.CMD
node_modules\.bin\astro.CMD build
node node_modules/@playwright/test/cli.js test
```

Expected: 59 unit tests pass, Astro reports zero diagnostics, 13 pages build, and the full Playwright suite passes with the two new scenarios included.

- [ ] **Step 7: Commit the tested implementation**

```powershell
git add tests/e2e/landing.spec.ts src/styles/global.css src/styles/landing.css src/styles/content-page.css
git commit -m "fix: place header island over heroes"
```

### Task 2: Publish and Confirm Production Geometry

**Files:**
- Verify only: production pages and GitHub Pages workflow

**Interfaces:**
- Consumes: the tested implementation commit from Task 1.
- Produces: a published `master` commit and live geometry evidence at mobile and desktop widths.

- [ ] **Step 1: Fast-forward the verified feature branch into `master`**

Run from the primary checkout:

```powershell
git merge --ff-only codex/header-over-hero
```

Expected: `master` advances to the tested implementation commit without a merge commit.

- [ ] **Step 2: Re-run focused verification on merged `master`**

```powershell
node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts --grep "places the header island over the hero|visible header controls|header menus"
```

Expected: all focused hero-overlap and mobile-header tests pass on `master`.

- [ ] **Step 3: Push and wait for GitHub Pages**

```powershell
git push origin master
```

Expected: the push succeeds and the resulting GitHub Pages deployment concludes successfully.

- [ ] **Step 4: Inspect live responsive geometry**

At 390 x 844 and a desktop viewport, inspect:

- `https://cowaysalescareer.my/en/`
- `https://cowaysalescareer.my/zh/sales-training-leadership/`

Confirm the hero begins behind the island, the heading or breadcrumb begins below it, the outer wrapper stays transparent after scrolling, all mobile controls remain on one row, and `scrollWidth` equals `clientWidth`.

- [ ] **Step 5: Clean temporary outputs while preserving user data**

Remove only the feature worktree, its merged feature branch, generated `dist`, `.astro`, `test-results`, `playwright-report`, and preview processes created for this task. Preserve `.codex-remote-attachments`, `node_modules`, the unrelated `.worktrees/site-build`, source files, and Git history.
