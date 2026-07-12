# Coway Sales Recruitment Performance Sport Redesign

## Objective

Redesign the approved recruitment landing page into a full-width, high-energy experience that feels active, organized, and visually complete. The page must attract Malaysian sales talent while preserving clear recruitment information, realistic income disclosure, multilingual support, accessibility, search visibility, and a short application path.

## Approved Direction

- Visual style: Performance Sport.
- Palette: deep navy foundation, electric lime primary accent, aqua secondary accent, and pale ice surfaces.
- Layout: edge-to-edge section backgrounds with adaptive gutters; text remains constrained to readable line lengths.
- Density: more intentional use of the viewport, fewer isolated narrow cards, and no accidental empty corners.
- Tone: ambitious, capable, youthful, and team-oriented without resembling a gaming or entertainment website.
- Content: retain the current recruitment content initially; copy refinement is outside this redesign phase except where small labels are needed to support the new layout.

## Page Structure

### Header and Hero

Use a full-width navy header and hero. The hero pairs a large performance-led headline with a dominant team photograph. Compact floating information panels show team culture, the realistic commission range, and the learning-to-lead path. The primary application action remains visually dominant.

### Momentum Band

A horizontal benefit band connects the hero to the opportunity section. It presents training, content support, active funnels, and leadership growth as one continuous system.

### Opportunity and Income

Use a two-panel full-width composition. The opportunity narrative sits on a pale ice surface, while the realistic monthly commission range sits on a high-contrast aqua panel. The disclosure remains explicit: fully commission-based, dependent on individual performance, with no guaranteed income.

### Career Journey

Replace disconnected progression cards with a connected three-stage flow:

1. Learn the system.
2. Build momentum.
3. Grow into leadership.

A visible path connects the stages. Its progress follows the visitor's scroll so the journey reads as a sequence rather than three unrelated cards.

### Team Media

Combine photos and video into one intentional edge-to-edge media grid. Use one dominant vertical team image, one wide video tile, and two supporting achievement or promotion images. Each tile has a short purposeful caption. The grid must never leave an unexplained empty quadrant.

### Support System

Use a split full-width section. The left-hand statement remains anchored on larger screens while the six support items move through the right-hand grid. Mobile uses a normal single-column flow with no sticky behavior.

### Candidate Priority and Application

Present the three candidate groups in priority order with experienced salespeople first, career switchers second, and ambitious newcomers third. Finish with a high-impact team image and a short application form containing name, age, current job, location, and sales experience. Existing safe-preview submission behavior remains until a secure endpoint and privacy notice are approved.

## Scroll Motion System

Motion must communicate progress and depth, not decorate every object.

- Hero: the main photograph and compact information panels move at slightly different speeds.
- Headline: a small horizontal offset reinforces forward movement.
- Momentum band: content travels slowly in response to page scroll.
- Opportunity: the income figure shifts subtly within its panel.
- Journey: the connecting path fills progressively and stages reveal in order.
- Media: image layers use low-amplitude parallax inside clipped tiles.
- Support: the section heading may remain sticky on desktop while support items reveal sequentially.
- Page progress: a thin lime indicator shows overall scroll position.

Continuous movement must use transform and opacity only. Each viewport should have no more than one or two primary moving ideas. Motion must remain interruptible, preserve native scrolling, avoid horizontal overflow, and disable or simplify when `prefers-reduced-motion: reduce` is enabled. Mobile motion uses smaller offsets and no pinned sections.

## Media Quality

Original files in `assets-source/` are the source of truth. Do not upscale low-resolution derivatives.

- Generate responsive AVIF and WebP images from the original JPEG files at widths appropriate for 375, 768, 1024, and 1440 pixel layouts.
- Use high-quality encoding suitable for large edge-to-edge photographs while keeping responsive alternatives for mobile.
- Declare dimensions or aspect ratios to prevent layout shift.
- Load the hero image eagerly and below-the-fold media lazily.
- Re-encode `Team Video.MOV` directly into browser-compatible MP4 and WebM versions rather than transcoding from an existing compressed derivative.
- Provide at least a clear 720p delivery version when supported by the source, plus an optimized poster generated from the original video.
- Preserve aspect ratio, avoid unnecessary cropping of faces, and use `object-position` overrides where needed.
- Video remains user-controlled, muted only when autoplay is used, includes visible play/pause controls, and never blocks page interaction.

## Responsive Behavior

- Validate at 375, 768, 1024, and 1440 pixel widths.
- Desktop uses asymmetric full-width compositions and the complete media mosaic.
- Tablet reduces type scale and motion amplitude while preserving the journey connection.
- Mobile stacks content by priority, removes sticky behavior, uses touch targets of at least 44 pixels, and avoids horizontal scrolling.
- Body text remains at least 16 pixels on mobile with readable line length.

## Accessibility and Performance

- Maintain WCAG AA contrast for text and controls.
- Preserve semantic heading order, skip link, keyboard navigation, visible focus indicators, descriptive alternative text, and form labels.
- Do not rely on motion or color alone to communicate progression.
- Provide a no-JavaScript readable state; content must not remain permanently hidden when scripts fail.
- Use one batched animation loop or a small number of observers rather than independent scroll listeners for each element.
- Reserve media dimensions to keep cumulative layout shift low.
- Lazy-load non-critical assets and avoid shipping a large animation framework unless native browser APIs cannot meet the approved behavior.

## Localization and SEO

English, Bahasa Malaysia, and Chinese routes remain available. Language selection persistence and locale-specific navigation remain intact. Existing metadata, canonical URLs, alternate-language links, structured data, sitemap, and robots behavior must continue to work after the redesign.

## Verification

- Unit tests cover locale content, navigation behavior, application validation, and reduced-motion handling where practical.
- End-to-end checks cover the three locale routes, language switching, mobile navigation, application form behavior, journey progression, and absence of horizontal overflow.
- Production build and Astro type checks must pass.
- Visual QA covers desktop and mobile at the target breakpoints, including media sharpness, face cropping, scroll choreography, reduced-motion mode, and video playback controls.

## Deferred Production Decisions

- Final production domain.
- Secure application submission endpoint.
- Final privacy notice and consent wording.
- Any replacement or additional source photography supplied after this redesign.

