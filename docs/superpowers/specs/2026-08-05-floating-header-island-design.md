# Floating Header Island Design

## Scope

Make the existing sticky Coway Sales Career header appear as a floating glass island while scrolling by removing the full-width background outside the rounded header box.

## Behaviour

- `.site-header` remains sticky and retains its existing spacing and stacking position.
- The outer header wrapper becomes transparent, so the current page section remains visible around the rounded box while scrolling.
- `.header-inner.glass-surface` remains the only painted header surface, preserving its blur, border, colour, radius, and shadow.
- No scroll listener, state class, animation, or layout shift is introduced.
- The previously verified one-row Android layout remains unchanged from 320px upward.
- Mobile and desktop menus, language switching, Apply links, touch targets, and focus states remain unchanged.

## Verification

- Add a browser regression test that first fails while `.site-header` paints an opaque background.
- Assert that the sticky wrapper is transparent and the rounded `.header-inner` retains a non-transparent glass background.
- Re-run the Android one-row and menu containment tests.
- Run unit tests, Astro diagnostics, production build, and the full browser suite before publishing.
- Verify the deployed page at an Android viewport after scrolling into a light section.

## Out of scope

- Changing the glass island size, radius, colour, typography, or content.
- Hiding or revealing the header based on scroll direction.
- Changing page sections, SEO metadata, analytics, or Search Console configuration.
