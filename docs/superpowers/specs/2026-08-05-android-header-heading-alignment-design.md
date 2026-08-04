# Android Header and Chinese Heading Alignment

## Scope

Correct the approved Coway Sales Career design at phone widths without changing the desktop layout, content, SEO metadata, or navigation behaviour.

## Mobile header

- At phone widths, COWAY, Menu, the current language, and Apply remain on one row.
- None of the four controls may wrap onto a second header row at supported widths from 320px upward.
- The language control occupies the visual centre area of the header row rather than being centred only inside the actions group.
- Touch targets remain at least 44px high, dropdown panels remain inside the viewport, and opening one disclosure continues to close the other.
- Compact mobile spacing and typography may be used to achieve the single-row layout. Desktop styling remains unchanged.

## Chinese supporting-page heading

- The Chinese supporting-page hero title remains on one line at phone widths from 320px upward.
- Mobile typography scales down responsively to fit the available content width without horizontal overflow.
- English supporting-page headings and desktop heading styling remain unchanged.
- The title remains the page's single semantic `h1`; the content text is not shortened or duplicated.

## Verification

- Add a failing browser regression test at representative Android phone widths before changing production CSS.
- Assert that the four header items share one vertical row and the header does not overflow horizontally.
- Assert that the Chinese supporting-page heading renders as a single line within the viewport.
- Run the focused regression tests, then the relevant full unit, Astro check, production build, and browser suites before publishing.

## Out of scope

- Homepage root-route migration from `/en/` to `/`.
- Google Analytics or Search Console account changes.
- Copy, colour, motion, SEO, or desktop redesign changes.
