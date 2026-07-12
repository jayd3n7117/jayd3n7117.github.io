# Redesign Task 2 Report

## Result

DONE_WITH_CONCERNS: the Performance Sport visual foundation is implemented and unit/build verification is green. Focused Playwright reached both requested tests without printing an assertion failure, but the known Windows Playwright process/teardown hang prevented a trustworthy pass result.

## Files changed

- `src/styles/global.css`: added semantic Performance Sport tokens, full-width primitives, dark header treatment, accessible light menu surfaces, and lime CTA styling.
- `src/styles/landing.css`: established the dark full-bleed hero, fact-card composition, clipped full-width ticker, and pale-aqua opportunity split.
- `src/components/Header.astro`: applied the shared responsive section gutter.
- `src/components/Hero.astro`: preserved localized copy, one h1, and both CTAs; added stable motion selectors and three factual cards.
- `src/components/MomentumStrip.astro`: added a semantic overflow viewport and stable ticker-track selector.
- `src/components/Opportunity.astro`: made the section full bleed while preserving the localized disclaimer binding verbatim.
- `tests/e2e/landing.spec.ts`: added the required Performance Sport structure and palette regression.

The Task 1 media pipeline and unrelated untracked `assets-source/` were not changed.

## TDD and commands

1. Added the required `renders the Performance Sport hero and opportunity composition` test before production edits.
2. Initial red command: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "Performance Sport hero"`.
   - Outcome: command could not reach assertions because `node` was absent from PATH (`The term 'node' is not recognized`).
   - Adaptation: prepended `C:\Users\CH\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin` to PATH for every Node command.
3. Retried focused red command.
   - First retry: Astro telemetry attempted to write `C:\Users\CH\AppData\Roaming\astro\Config` and failed with EPERM.
   - Adaptation: set `ASTRO_TELEMETRY_DISABLED=1`.
   - The environment failures meant no valid assertion-level red result was captured before implementation.
4. Unit regression: `node node_modules/vitest/vitest.mjs run` with adapted PATH/telemetry environment.
   - Exact outcome: PASS, 6 test files passed, 31 tests passed, duration 696 ms on final run.
5. Production build: `PUBLIC_SITE_URL=https://join.coway.test node node_modules/astro/bin/astro.mjs build` with adapted PATH/telemetry environment.
   - Exact outcome: PASS, 3 pages built, sitemap generated, complete in 609 ms on final run.
6. Focused E2E: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "Performance Sport hero|honest opportunity"` with adapted PATH/telemetry environment.
   - Exact output before termination: `Running 2 tests using 1 worker`, then both test names were listed.
   - Exact outcome: timed out after 120.433 seconds (exit 124). No assertion failure was printed, but no trustworthy Playwright pass summary was produced.
7. `git diff --check`.
   - Outcome: PASS; only Git's existing LF-to-CRLF notices were printed.

## Self-review

- Confirmed exactly one `h1` remains and both localized hero CTAs are unchanged.
- Confirmed stable selectors exist: `[data-motion="hero-image"]`, `[data-motion="hero-title"]`, three `[data-motion-card]`, and `[data-ticker-track]`.
- Confirmed the opportunity disclaimer still renders directly from `content.opportunity.disclaimer` with no edits or truncation.
- Confirmed mobile and language dropdowns explicitly restore dark text on their white surfaces after the header changed to dark.
- Confirmed full-bleed hero, momentum, and opportunity rules override the earlier constrained section width.
- Confirmed no media component, content model, localization strings, SEO code, application behavior, or `assets-source/` files changed.

## Concerns

- Focused E2E is inconclusive due to the known Windows Playwright process/teardown hang. The browser emitted GPU staging-buffer errors into a transient `debug.log`; that generated file was removed.
- TDD red could not be observed at assertion level because the initial runs were blocked by missing runtime PATH and Astro telemetry filesystem permissions. The test was nevertheless added before production changes.

## Fix Review

DONE_WITH_CONCERNS: all reviewer findings are fixed and assertion-level RED was captured before CSS changes. Unit and build verification pass. Focused Playwright assertions execute without failure output, but the known Windows teardown hang prevents a final pass summary.

Changes:

- Restored responsive footer `.shell` gutters while retaining full-bleed sections and the header's section-inner treatment.
- Implemented the specified pale-ice/aqua opportunity split with dark text on aqua.
- Removed the redundant white eyebrow declaration.
- Added regressions for aqua color/foreground, footer gutters at 320px/768px/1440px, touch targets and foreground colors; retained no-overflow checks at 320px/390px/1440px.

RED command (bundled Node, `ASTRO_TELEMETRY_DISABLED=1`, line reporter, 15-second per-test timeout, 90-second process bound): `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "Performance Sport hero|responsive footer gutters|Performance Sport controls" --reporter=line --timeout=15000`.

- `Running 5 tests using 1 worker`.
- Aqua failed: expected `rgb(53, 213, 208)`, received `rgb(7, 31, 43)`.
- Footer at 320px failed: expected left gutter `>= 19`, received `0`.
- Footer at 768px failed: expected left gutter `>= 29.72`, received `0`.
- The 1440px footer and touch/contrast names printed before teardown timed out.

GREEN verification:

- Unit: PASS, 6 files and 31 tests, duration 814ms.
- Build: PASS, 3 pages, sitemap generated, complete in 686ms.
- Eight-test Task 2 browser run: all 8 names printed, no assertion failure; teardown timed out after 90.415 seconds, so no final pass summary.
- Brief-focused browser run: both `honest opportunity` and `Performance Sport hero` names printed, no assertion failure; teardown timed out after 60.433 seconds, so no final pass summary.
- `git diff --check`: PASS; only LF-to-CRLF notices.

Concern: Playwright remains inconclusive only at process teardown; every selected name printed without failure evidence on the fresh build.

Fix commit: recorded in the final handoff.

## Commit

- `d84577b` — `feat: add Performance Sport visual foundation`
