# Redesign Final Fixes Report

## Status

DONE_WITH_CONCERNS

## Implemented

- Added a visible transform-only journey progress overlay, horizontal on desktop and vertical on mobile, driven by `--journey-progress`.
- Added a fixed, decorative lime page-progress rail driven by `--page-progress` with `scaleX`.
- Moved media parallax from figure tiles to clipped photo picture layers marked `data-motion-media-layer`; video and grid geometry remain stable.
- Localized hero growth fact, skip link, home label, primary navigation label, and official-site link for EN, BM, and ZH through `LandingContent.chrome`.
- Added reduced-motion media-query change handling and controller cleanup (RAF cancellation, observer disconnect, listener removal, inline motion reset).
- Scoped media `will-change` to motion layers.
- Replaced the application CSS background with an aria-hidden responsive `ResponsivePicture` using the existing AVIF/WebP manifest.

## TDD Evidence

RED focused Playwright run (before rebuilding the stale preview output) failed on all new assertions: missing page rail, moving tile geometry, and untranslated BM/ZH chrome. This demonstrated the new tests exercised the requested behavior.

GREEN focused Playwright run after implementation and rebuild executed all five selected tests without an assertion failure:

`node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "journey and page progress|media tile geometry|localizes visible"`

The command was externally bounded at 60 seconds and timed out after test 5/5 during Playwright/server teardown, so it did not emit its normal final pass summary.

## Verification

- `node node_modules/vitest/vitest.mjs run` — PASS: 7 files, 34 tests.
- `node node_modules/astro/bin/astro.mjs check` — PASS: 42 files, 0 errors/warnings/hints.
- `node node_modules/astro/bin/astro.mjs build` with `ASTRO_TELEMETRY_DISABLED=1` and `PUBLIC_SITE_URL=https://join.example.org` — PASS: 3 localized pages plus root and robots/sitemap output.
- Focused Playwright command above — all 5 selected tests executed with no assertion failure; teardown exceeded the 60-second process bound.

Runtime adaptation: commands used `C:\Users\CH\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` by prepending its directory to PATH because `node` was not initially available.

## Self-review

- Motion writes remain transform/opacity/custom-property only.
- The page and journey indicators are decorative and do not add screen-reader noise.
- Photo motion is clipped by existing tile overflow; the video has no motion hook.
- Application form fields, validation, consent, and no-POST behavior were not changed.
- `assets-source/` remains untracked and was not staged.

## Concern

Playwright completes each selected test but the preview/web-server process does not tear down within the 60-second command bound in this environment. No test assertion failure was observed in the post-fix run.
