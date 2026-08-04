# Android Header Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep COWAY, Menu, Language, and Apply on one vertically aligned header row at Android phone widths from 320px upward.

**Architecture:** Preserve the existing Astro header markup and native `details` disclosures. Add a Playwright geometry regression test, then change only the phone breakpoint in `global.css` so the existing flex row cannot wrap and uses compact responsive spacing while retaining 44px touch targets.

**Tech Stack:** Astro, CSS, TypeScript, Playwright.

## Global Constraints

- COWAY, Menu, the current language, and Apply remain on one row from 320px upward.
- The language control remains vertically centred with the other header controls.
- Dropdown panels remain inside the viewport and one disclosure still closes the other.
- Supporting-page hero titles, desktop styling, content, SEO metadata, and navigation behaviour remain unchanged.

---

### Task 1: Reproduce and fix the Android header wrap

**Files:**
- Modify: `tests/e2e/landing.spec.ts:914`
- Modify: `src/styles/global.css:378-476`

**Interfaces:**
- Consumes: Existing `.header-inner`, `.wordmark`, `.mobile-navigation`, `.language-menu`, `.header-actions`, and `.button-accent` selectors.
- Produces: A no-wrap phone header whose four visible controls share the same vertical centre and remain inside the viewport.

- [ ] **Step 1: Write the failing geometry regression test**

Add this test before the existing header-menu viewport tests:

```ts
for (const width of [320, 390]) {
  test(`keeps all visible header controls on one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/zh/sales-training-leadership/');

    const controls = [
      page.locator('header .wordmark'),
      page.locator('header .mobile-navigation > summary'),
      page.locator('header .language-menu > summary'),
      page.locator('header .button-accent'),
    ];
    const boxes = await Promise.all(controls.map((control) => control.boundingBox()));
    expect(boxes.every(Boolean)).toBe(true);

    const centres = boxes.map((box) => box!.y + box!.height / 2);
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
    expect(Math.max(...boxes.map((box) => box!.x + box!.width))).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "keeps all visible header controls"
```

Expected: FAIL because `.header-inner` currently wraps and `.mobile-navigation` is ordered onto a second row.

- [ ] **Step 3: Implement the minimum phone-breakpoint CSS**

Inside `@media (max-width: 40rem)`, preserve the existing rules and add compact single-row layout rules equivalent to:

```css
.site-header {
  padding-inline: var(--space-2);
}

.header-inner {
  flex-wrap: nowrap;
  gap: var(--space-1);
  padding-inline: var(--space-2);
}

.wordmark {
  flex: 0 0 auto;
  font-size: 0.9rem;
}

.mobile-navigation {
  order: initial;
  flex: 0 0 auto;
}

.mobile-navigation summary,
.language-menu summary {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  padding-inline: var(--space-1);
  font-size: 0.72rem;
  white-space: nowrap;
}

.header-actions {
  flex: 0 0 auto;
  gap: var(--space-1);
  margin-left: 0;
}

.button-accent {
  min-height: 2.75rem;
  padding-inline: var(--space-2);
  font-size: 0.72rem;
  white-space: nowrap;
}
```

Adjust only compact spacing values if the 320px geometry test proves they are required. Do not change the header component or page-title styles.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "keeps all visible header controls|keeps header menus inside|keyboard-operable mobile menu"
```

Expected: all selected tests pass with 0 failures.

- [ ] **Step 5: Run project verification**

Run:

```powershell
node_modules\.bin\vitest.cmd run
node_modules\.bin\astro.cmd check
node_modules\.bin\astro.cmd build
node_modules\.bin\playwright.cmd test
```

Expected: all unit tests, Astro diagnostics, production build, and browser tests pass with zero failures.

- [ ] **Step 6: Commit the tested fix**

```powershell
git add src/styles/global.css tests/e2e/landing.spec.ts
git commit -m "fix: keep mobile header controls on one row"
```

### Task 2: Integrate, publish, and verify production

**Files:**
- No source files beyond Task 1.

**Interfaces:**
- Consumes: The verified fix commit from Task 1.
- Produces: The corrected production header at `https://cowaysalescareer.my/zh/sales-training-leadership/`.

- [ ] **Step 1: Integrate the feature commit into `master`**

Cherry-pick the verified commit from the isolated branch into `master` and confirm `git status --short` is clean.

- [ ] **Step 2: Push and monitor GitHub Pages**

```powershell
git push origin master
gh run list --workflow deploy.yml --limit 1
gh run watch <run-id> --exit-status
```

Expected: the new GitHub Pages deployment completes successfully.

- [ ] **Step 3: Verify the live Android-width layout**

Run the same Playwright geometry assertions against the production URL at 320px and 390px. Confirm all four controls share one row, dropdown panels remain within the viewport, and there is no horizontal overflow.

- [ ] **Step 4: Clean up temporary artifacts**

Remove the temporary worktree and feature branch after successful integration, and remove generated `dist`, `.astro`, and test-result folders while preserving the source repository and Git history.
