# Floating Header Island Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the full-width sticky-header background so the existing rounded glass header floats as an island over scrolled page content.

**Architecture:** Keep the existing Astro header markup and sticky positioning. Add a Playwright computed-style regression test, then change only the `.site-header` background declaration in `global.css` from opaque night colour to transparent.

**Tech Stack:** Astro, CSS, TypeScript, Playwright.

## Global Constraints

- The outer sticky header wrapper is transparent.
- `.header-inner.glass-surface` remains visibly painted with its existing glass styling.
- No JavaScript, scroll-state class, animation, or layout shift is introduced.
- Android one-row alignment, menus, language switching, Apply links, touch targets, desktop layout, and page-title styling remain unchanged.

---

### Task 1: Test and implement the floating island

**Files:**
- Modify: `tests/e2e/landing.spec.ts`
- Modify: `src/styles/global.css:169-176`

**Interfaces:**
- Consumes: Existing `.site-header` and `.header-inner.glass-surface` elements.
- Produces: A transparent full-width sticky wrapper around the unchanged rounded glass surface.

- [ ] **Step 1: Add the failing regression test**

Add near the existing mobile header tests:

```ts
test('renders the sticky header as a standalone glass island', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  await page.locator('#support').scrollIntoViewIfNeeded();

  const wrapper = page.locator('.site-header');
  const island = page.locator('.header-inner.glass-surface');
  await expect(wrapper).toHaveCSS('position', 'sticky');
  await expect(wrapper).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(island).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const bounds = await island.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThan(0);
  expect(bounds!.x + bounds!.width).toBeLessThan(390);
});
```

- [ ] **Step 2: Run the test and verify RED**

```powershell
node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "standalone glass island"
```

Expected: FAIL because `.site-header` currently computes to the opaque night background.

- [ ] **Step 3: Implement the minimum CSS change**

In `src/styles/global.css`, change only the wrapper background:

```css
.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  padding: 0.75rem var(--page-gutter) 0;
  background: transparent;
  color: var(--color-on-dark);
}
```

- [ ] **Step 4: Verify focused header tests**

```powershell
node_modules\.bin\playwright.cmd test tests/e2e/landing.spec.ts -g "standalone glass island|keeps all visible header controls|keeps header menus inside|keyboard-operable mobile menu"
```

Expected: all selected tests pass with zero failures.

- [ ] **Step 5: Run complete verification**

```powershell
node_modules\.bin\vitest.cmd run
node_modules\.bin\astro.cmd check
node_modules\.bin\astro.cmd build
node_modules\.bin\playwright.cmd test
```

Expected: all unit tests, Astro diagnostics, production build, and browser tests pass with zero failures.

- [ ] **Step 6: Commit**

```powershell
git add src/styles/global.css tests/e2e/landing.spec.ts
git commit -m "fix: float sticky header as glass island"
```

### Task 2: Publish and production-check

**Files:**
- No additional source files.

**Interfaces:**
- Consumes: Verified Task 1 commit.
- Produces: The floating island header on `https://cowaysalescareer.my/`.

- [ ] **Step 1: Integrate the verified commit into `master`**

Fast-forward the temporary feature branch into `master`, then rerun the focused island and Android header tests on the merged checkout.

- [ ] **Step 2: Push and monitor GitHub Pages**

Push `master`, identify the deployment for the new commit, and wait until it completes successfully.

- [ ] **Step 3: Verify live production**

At an Android viewport, scroll the live English homepage into a light section. Confirm the sticky wrapper computes transparent, the rounded glass surface remains painted and inset from both viewport edges, and the four controls remain on one row.

- [ ] **Step 4: Clean up**

Remove the temporary worktree, feature branch, generated build/test output, caches, and preview processes. Preserve main dependencies, Git history, user attachments, and unrelated worktrees.
