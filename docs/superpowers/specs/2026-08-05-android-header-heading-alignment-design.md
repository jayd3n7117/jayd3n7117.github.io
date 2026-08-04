# Android Header Alignment

## Scope

Correct the approved Coway Sales Career header at phone widths without changing the desktop layout, page-title typography, content, SEO metadata, or navigation behaviour.

## Mobile header

- At phone widths, COWAY, Menu, the current language, and Apply remain on one row.
- None of the four controls may wrap onto a second header row at supported widths from 320px upward.
- The language control occupies the visual centre area of the header row rather than being centred only inside the actions group.
- Touch targets remain at least 44px high, dropdown panels remain inside the viewport, and opening one disclosure continues to close the other.
- Compact mobile spacing and typography may be used to achieve the single-row layout. Desktop styling remains unchanged.
- Supporting-page hero titles are not changed by this fix.

## Verification

- Add a failing browser regression test at representative Android phone widths before changing production CSS.
- Assert that the four header items share one vertical row and the header does not overflow horizontally.
- Run the focused regression tests, then the relevant full unit, Astro check, production build, and browser suites before publishing.

## Out of scope

- Homepage root-route migration from `/en/` to `/`.
- Google Analytics or Search Console account changes.
- Copy, colour, motion, SEO, or desktop redesign changes.
