# Redesign Cleanup Report

## Status

DONE_WITH_CONCERNS

## Implementation commit

`7cf8cad` (`fix: complete redesign cleanup`)

## Changes

- Moved `.journey-progress` into a `.journey-flow-wrapper` as a sibling of the ordered list, leaving only `li` elements as direct `ol` children while preserving the connector class, progress variable, and test hook.
- Cleared the hero title's inline `opacity` when reduced motion is initialized or enabled at runtime, alongside the existing transform cleanup.
- Removed the broad `.motion-ready` `will-change: transform` rule so motion elements do not retain page-lifetime compositing hints.
- Added focused browser regressions for semantic journey markup, runtime reduced-motion switching, visible/static content restoration, and removed `will-change` hints.

## TDD evidence

The initial focused browser run failed all three new regression cases for the expected reasons:

- `ol > .journey-progress` count was `1`, expected `0`.
- Hero title computed opacity remained approximately `0.888`, expected `1`, after switching to reduced motion.
- Hero title computed `will-change` remained `transform`, expected `auto`.

After the fixes, the bounded focused run reached all `3/3` selected tests without an assertion failure:

`node node_modules\\@playwright\\test\\cli.js test tests/e2e/landing.spec.ts --grep "renders journey|restores visible|page-lifetime"`

## Verification evidence

- Units: `node node_modules\\vitest\\vitest.mjs run` -> exit `0`; 7 files passed, 34 tests passed.
- Astro check: `node node_modules\\astro\\bin\\astro.mjs check` with telemetry disabled and `PUBLIC_SITE_URL=https://join.coway.test` -> exit `0`; 42 files, 0 errors, 0 warnings, 0 hints.
- Production build: `node node_modules\\astro\\bin\\astro.mjs build` with telemetry disabled and the same site URL -> exit `0`; 3 pages built and sitemap generated.
- Diff hygiene: `git diff --check` -> exit `0` before the implementation commit.

## Teardown evidence

- The focused Playwright command was bounded to 90 seconds. It reached the third selected test without assertion output, then the outer command timed out during/after runner teardown with exit `124`.
- A separate post-run port check found no listener on port `4321`; no preview server remained to stop.

## Concerns

- Playwright did not exit cleanly within the bounded window, so the focused browser evidence is assertion-complete but not a clean runner exit. Chromium also emitted transient raster `SharedImage` diagnostics to an untracked `debug.log`; that generated log was removed and was not committed.
- The pre-existing untracked `assets-source/` directory was preserved and excluded from both commits.
