# Header Over Hero Design

## Goal

Remove the exposed white row above each hero by visually placing the existing sticky glass header island over the hero background. Preserve the approved single-row mobile header and its floating behavior while scrolling.

## Root Cause

`Header.astro` is rendered before `<main>` in `BaseLayout.astro`. The `.site-header` wrapper is transparent but remains in normal document flow, so its occupied row reveals the white page background before the hero begins.

## Approved Approach

Use a shared CSS overlap rather than changing the document structure:

- Keep `.site-header` sticky, transparent, and above page content.
- Offset the following `<main>` upward by the header's occupied height so the first hero paints behind the island.
- Add equivalent safe top spacing to both the recruitment homepage hero and supporting-page content heroes so no heading, breadcrumb, or call to action is hidden beneath the island.
- Keep the rounded `.header-inner.glass-surface` as the only painted navigation surface.
- Preserve the existing breakpoint-specific one-row header geometry, dropdown positioning, touch-target sizes, and scroll behavior.

This approach is intentionally visual. The semantic order remains header, main, footer, so navigation, accessibility, analytics, structured data, and SEO markup do not change.

## Responsive Behavior

- At the top of every page, the header island sits on the dark or coloured hero rather than a white row.
- At 320px and wider, COWAY, Menu, Language, and Apply remain on one centred row.
- Hero content begins below the island with deliberate breathing room at mobile, tablet, and desktop widths.
- When the user scrolls beyond the hero, the sticky island continues floating over subsequent sections with a transparent outer wrapper.
- The page must not gain horizontal overflow.

## Scope

Included:

- Homepage hero.
- English and Simplified Chinese supporting-page heroes.
- Shared layout CSS and responsive regression coverage.

Excluded:

- Copy, metadata, structured data, URLs, navigation labels, or analytics changes.
- Changes to the approved glass styling or scroll animations.
- Changes to footer or body-section spacing.

## Verification

Automated browser coverage will assert that:

- The first hero begins behind the sticky header rather than below a separate header row.
- The header wrapper remains transparent and the island remains painted.
- The hero heading or breadcrumb begins below the island's lower edge.
- Mobile header controls remain aligned at Android widths.
- The document has no horizontal overflow.

The full unit, Astro, production-build, and browser suites will run before publishing. Production will then be checked at Android and desktop widths at the top of both the homepage and a supporting page, followed by a scrolled-state check.
