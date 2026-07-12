# Performance Sport Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Coway recruitment landing page as an edge-to-edge Performance Sport experience with organized high-quality media and accessible scroll-driven motion.

**Architecture:** Preserve the Astro static-site and locale-content architecture. Recompose the page through focused Astro components, use CSS custom properties for the visual system, and implement motion with a small native TypeScript controller that batches scroll reads and transform writes. Rebuild all responsive media directly from the original files in `assets-source/` and keep application submission disabled until its separate production gates are approved.

**Tech Stack:** Astro 7, TypeScript, CSS, Sharp, FFmpeg, Vitest, Playwright.

## Global Constraints

- Visual style: Performance Sport.
- Palette: deep navy foundation, electric lime primary accent, aqua secondary accent, and pale ice surfaces.
- Layout: edge-to-edge section backgrounds with adaptive gutters; text remains constrained to readable line lengths.
- Motion uses transform and opacity only, preserves native scrolling, and respects `prefers-reduced-motion: reduce`.
- Each viewport has no more than one or two primary moving ideas.
- Original files in `assets-source/` are the media source of truth; never upscale low-resolution derivatives.
- Validate responsive behavior at 375, 768, 1024, and 1440 pixels.
- Maintain English, Bahasa Malaysia, and Chinese routes, metadata, locale switching, accessibility, SEO, and honest commission disclosure.
- Application submission remains disabled until a secure endpoint and final privacy wording are approved.
- Do not add an animation framework unless native browser APIs fail an approved behavior.

---

## File Structure

- `src/styles/global.css`: semantic Performance Sport tokens, focus treatment, base typography, and shared full-width primitives.
- `src/styles/landing.css`: page compositions, responsive layouts, and motion presentation states.
- `src/components/Hero.astro`: headline, primary actions, hero picture, and three compact fact panels.
- `src/components/MomentumStrip.astro`: semantic moving benefit track.
- `src/components/Opportunity.astro`: split opportunity and income composition.
- `src/components/JourneyFlow.astro`: connected three-stage career progression.
- `src/components/TeamMedia.astro`: intentional photo/video mosaic.
- `src/components/SupportGrid.astro`: sticky desktop statement and six support items.
- `src/components/CandidateFit.astro`: prioritized candidate cards.
- `src/components/ApplicationForm.astro`: full-width conversion ending while preserving safe form behavior.
- `src/pages/[locale]/index.astro`: final section order and component wiring.
- `src/scripts/motion.ts`: browser initialization, observers, and one requestAnimationFrame scroll loop.
- `src/motion/scroll.ts`: pure clamping and section-progress calculations.
- `scripts/optimize-media.mjs`: original-source image/video encoding and validation.
- `src/content/media.ts`: responsive image metadata and high-quality video descriptor.
- `tests/unit/media.test.ts`: media descriptor and pipeline-policy tests.
- `tests/unit/motion.test.ts`: pure motion calculation tests.
- `tests/e2e/landing.spec.ts`: responsive layout, motion, localization, accessibility, media, and regression coverage.

---

### Task 1: Rebuild High-Quality Responsive Media

**Files:**
- Modify: `scripts/optimize-media.mjs`
- Modify: `src/content/media.ts`
- Modify: `src/content/video.generated.ts`
- Modify: `tests/unit/media.test.ts`
- Regenerate: `public/media/*`

**Interfaces:**
- Consumes: original files under `assets-source/Team Assets/`.
- Produces: image candidates at widths `640`, `960`, `1440`, and `1920`; `team-video-720.mp4`; optional `team-video-720.webm`; `team-video-poster.webp`; unchanged `MediaImage` consumer shape.

- [ ] **Step 1: Add failing media-policy tests**

```ts
import { describe, expect, it } from 'vitest';
import { IMAGE_WIDTHS, createVideoDescriptor } from '../../scripts/optimize-media.mjs';

describe('high-quality media policy', () => {
  it('offers a 1920px candidate for edge-to-edge desktop photography', () => {
    expect(IMAGE_WIDTHS).toEqual([640, 960, 1440, 1920]);
  });

  it('keeps MP4 mandatory and WebM optional', () => {
    expect(createVideoDescriptor({ supportsWebm: false })).toEqual({
      poster: '/media/team-video-poster.webp',
      mp4: '/media/team-video-720.mp4',
      webm: null,
    });
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the policy is missing**

Run: `node node_modules/vitest/vitest.mjs run tests/unit/media.test.ts`

Expected: FAIL because `IMAGE_WIDTHS` is not exported and the current candidate list stops at `1440`.

- [ ] **Step 3: Export the widths and raise image quality without enlargement**

```js
export const IMAGE_WIDTHS = [640, 960, 1440, 1920];

async function writeResponsiveImage(sourceName, outputName) {
  const input = join(sourceRoot, sourceName);
  const metadata = await sharp(input).rotate().metadata();
  const candidates = IMAGE_WIDTHS.filter((width) => width <= (metadata.width ?? width));

  for (const width of candidates) {
    const resized = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    await resized.clone().webp({ quality: 86, effort: 6 }).toFile(join(outputRoot, `${outputName}-${width}.webp`));
    await resized.clone().avif({ quality: 62, effort: 6 }).toFile(join(outputRoot, `${outputName}-${width}.avif`));
  }
}
```

Update `responsive()` in `src/content/media.ts` to accept an explicit candidate list so the 1280px originals do not advertise nonexistent 1440/1920 outputs:

```ts
const responsive = (
  name: string,
  width: number,
  height: number,
  alt: LocalizedAlt,
  candidates = [640, 960, 1440, 1920].filter((candidate) => candidate <= width),
): MediaImage => ({
  src: `/media/${name}-${candidates.includes(960) ? 960 : candidates.at(-1)}.webp`,
  width: candidates.includes(960) ? 960 : candidates.at(-1)!,
  height: Math.round((height / width) * (candidates.includes(960) ? 960 : candidates.at(-1)!)),
  alt,
  sources: {
    webp: candidates.map((candidate) => ({ src: `/media/${name}-${candidate}.webp`, width: candidate })),
    avif: candidates.map((candidate) => ({ src: `/media/${name}-${candidate}.avif`, width: candidate })),
  },
});
```

- [ ] **Step 4: Re-encode video directly from `Team Video.MOV`**

Use the original MOV input with H.264 CRF 19 and VP9 CRF 28, preserve audio when present, and generate the poster at the same 720px delivery height:

```js
execFileSync(ffmpeg, [
  '-y', '-i', input, '-vf', 'scale=-2:720', '-c:v', 'libx264', '-preset', 'slow',
  '-crf', '19', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
  join(outputRoot, 'team-video-720.mp4'),
], { stdio: 'inherit' });
```

Keep `validateVideoOutputs()` decoding the first video frame and additionally assert poster dimensions are at least `1280 × 720` when the source supports them.

- [ ] **Step 5: Regenerate and verify media**

Run: `$env:FFMPEG_PATH='C:\Users\CH\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe'; node scripts/optimize-media.mjs`

Expected: all authentic images are regenerated from originals; MP4 and WebM decode successfully; no output exceeds its source size; poster metadata is valid.

Run: `node node_modules/vitest/vitest.mjs run tests/unit/media.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/optimize-media.mjs src/content/media.ts src/content/video.generated.ts tests/unit/media.test.ts public/media
git commit -m "feat: rebuild high-quality recruitment media"
```

---

### Task 2: Establish the Performance Sport Visual Foundation

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/landing.css`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/MomentumStrip.astro`
- Modify: `src/components/Opportunity.astro`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: existing `LandingContent`, `Locale`, and `MediaImage` props.
- Produces: stable selectors `[data-motion="hero-image"]`, `[data-motion="hero-title"]`, `[data-motion-card]`, and `[data-ticker-track]` for Task 3.

- [ ] **Step 1: Add failing structure and palette assertions**

```ts
test('renders the Performance Sport hero and opportunity composition', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('[data-performance-hero]')).toHaveCount(1);
  await expect(page.locator('[data-motion-card]')).toHaveCount(3);
  await expect(page.locator('[data-ticker-track]')).toContainText(/online sales training/i);
  await expect(page.locator('#opportunity')).toHaveCSS('background-color', 'rgb(234, 245, 244)');
});
```

- [ ] **Step 2: Run the focused E2E test and confirm failure**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "Performance Sport hero"`

Expected: FAIL because the new selectors and palette do not exist.

- [ ] **Step 3: Add semantic tokens and full-width primitives**

```css
:root {
  --color-primary: #071f2b;
  --color-primary-raised: #0b2e3d;
  --color-accent: #bdf23a;
  --color-secondary-accent: #35d5d0;
  --color-surface-cool: #eaf5f4;
  --color-on-dark: #ffffff;
  --page-gutter: clamp(1.25rem, 4vw, 5rem);
  --content-measure: 72rem;
}

.full-bleed { width: 100%; }
.section-inner { padding-inline: var(--page-gutter); }
```

- [ ] **Step 4: Recompose header, hero, ticker, and opportunity**

In `Hero.astro`, preserve one `h1`, the two CTA links, and localized text. Add the three factual cards using existing content only:

```astro
<section class="hero performance-hero" data-performance-hero>
  <div class="hero-copy">
    <p class="eyebrow">{content.hero.eyebrow}</p>
    <h1 data-motion="hero-title">{content.hero.title}</h1>
    <p class="lede">{content.hero.subtitle}</p>
    <div class="hero-actions">...</div>
  </div>
  <div class="hero-visual">
    <ResponsivePicture image={image} {locale} eager class="hero-picture" sizes="(min-width: 64rem) 50vw, 100vw" />
    <aside class="hero-fact" data-motion-card>RM2,500–RM10,000+</aside>
    <aside class="hero-fact" data-motion-card>{content.culture.statement}</aside>
    <aside class="hero-fact" data-motion-card>Learn → Lead</aside>
  </div>
</section>
```

Make `MomentumStrip.astro` a semantic, overflow-clipped track with `data-ticker-track`. Make `Opportunity.astro` the pale-ice/aqua split while retaining the full commission disclaimer verbatim.

- [ ] **Step 5: Run regression tests**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all unit tests PASS.

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "Performance Sport hero|honest opportunity"`

Expected: both focused tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/styles/landing.css src/components/Header.astro src/components/Hero.astro src/components/MomentumStrip.astro src/components/Opportunity.astro tests/e2e/landing.spec.ts
git commit -m "feat: add Performance Sport visual foundation"
```

---

### Task 3: Build the Accessible Scroll-Motion Engine

**Files:**
- Create: `src/motion/scroll.ts`
- Create: `tests/unit/motion.test.ts`
- Modify: `src/scripts/motion.ts`
- Modify: `src/styles/landing.css`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `clamp01(value: number): number`; `sectionProgress(rectTop: number, rectHeight: number, viewportHeight: number): number`.
- Consumes: Task 2 motion data attributes and later `[data-journey]`, `[data-media-tile]`, and `[data-reveal]` hooks.

- [ ] **Step 1: Write failing pure motion tests**

```ts
import { describe, expect, it } from 'vitest';
import { clamp01, sectionProgress } from '../../src/motion/scroll';

describe('scroll motion calculations', () => {
  it('clamps progress', () => {
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(0.45)).toBe(0.45);
    expect(clamp01(1.2)).toBe(1);
  });

  it('maps section entry to normalized progress', () => {
    expect(sectionProgress(900, 600, 900)).toBe(0);
    expect(sectionProgress(300, 600, 900)).toBeCloseTo(0.667, 2);
  });
});
```

- [ ] **Step 2: Run tests and confirm missing module**

Run: `node node_modules/vitest/vitest.mjs run tests/unit/motion.test.ts`

Expected: FAIL because `src/motion/scroll.ts` does not exist.

- [ ] **Step 3: Implement pure calculations**

```ts
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const sectionProgress = (
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
) => clamp01((viewportHeight - rectTop) / (rectHeight + viewportHeight * 0.15));
```

- [ ] **Step 4: Replace independent reveal logic with one controller**

`src/scripts/motion.ts` must:

```ts
import { clamp01, sectionProgress } from '../motion/scroll';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

if (reduced) {
  document.documentElement.classList.add('motion-reduced');
  revealItems.forEach((item) => item.classList.add('is-revealed'));
} else {
  document.documentElement.classList.add('motion-ready');
  // One IntersectionObserver for entrance reveals.
  // One passive scroll listener schedules one requestAnimationFrame render.
  // The render updates only transform, opacity, and CSS custom properties.
}
```

The render loop updates hero offsets, ticker translation, journey `--journey-progress`, media tile parallax, and the top `--page-progress`. Cache element collections once; do not query the DOM inside every frame.

- [ ] **Step 5: Add reduced-motion and active-scroll E2E checks**

```ts
test('updates scroll progress without changing layout bounds', async ({ page }) => {
  await page.goto('/en/');
  await page.evaluate(() => scrollTo(0, 900));
  await expect.poll(() => page.locator('html').evaluate((el) =>
    getComputedStyle(el).getPropertyValue('--page-progress').trim()
  )).not.toBe('0');
  expect(await page.evaluate(() => document.body.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
```

Retain the existing reduced-motion and no-JavaScript tests; assert hero and ticker transforms are `none` in reduced mode.

- [ ] **Step 6: Run tests and commit**

Run: `node node_modules/vitest/vitest.mjs run tests/unit/motion.test.ts`

Expected: PASS.

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "scroll progress|reduced-motion|without JavaScript"`

Expected: all focused tests PASS.

```bash
git add src/motion/scroll.ts src/scripts/motion.ts src/styles/landing.css tests/unit/motion.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: add accessible scroll choreography"
```

---

### Task 4: Connect the Career Journey and Support System

**Files:**
- Create: `src/components/JourneyFlow.astro`
- Modify: `src/components/SupportGrid.astro`
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/styles/landing.css`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- `JourneyFlow.astro` consumes `{ content: LandingContent }` and exposes `#growth`, `[data-journey]`, and three `[data-journey-step]` elements.
- `SupportGrid.astro` preserves `#support` and six semantic articles.

- [ ] **Step 1: Add failing journey assertions**

```ts
test('connects the three career stages into one journey', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('[data-journey]')).toHaveCount(1);
  await expect(page.locator('[data-journey-step]')).toHaveCount(3);
  await expect(page.locator('[data-journey-step]').nth(0)).toContainText('Learn');
  await expect(page.locator('[data-journey-step]').nth(2)).toContainText('leadership');
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "three career stages"`

Expected: FAIL because `[data-journey]` does not exist.

- [ ] **Step 3: Create `JourneyFlow.astro` and wire it into the page**

```astro
---
import type { LandingContent } from '../content/locales';
const { content } = Astro.props as { content: LandingContent };
---
<section id="growth" class="journey" data-journey>
  <header data-reveal>
    <h2>{content.progression.title}</h2>
    <p>{content.progression.body}</p>
  </header>
  <ol class="journey-flow">
    {content.progression.steps.map((step, index) => (
      <li data-journey-step data-reveal>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{step}</h3>
      </li>
    ))}
  </ol>
</section>
```

Replace `<Progression ... />` with `<JourneyFlow {content} />` in `index.astro`. Preserve `Progression.astro` until Task 5 confirms achievement media has moved successfully.

- [ ] **Step 4: Recompose support**

Keep the support heading in a desktop sticky column and the six items in a two-column grid. At `max-width: 860px`, set `position: static` and use one column. Add `data-reveal` to items for Task 3's observer.

- [ ] **Step 5: Verify and commit**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "three career stages|complete landing story|localized"`

Expected: all focused tests PASS for English, BM, and Chinese.

```bash
git add src/components/JourneyFlow.astro src/components/SupportGrid.astro src/pages/[locale]/index.astro src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: connect career journey and support flow"
```

---

### Task 5: Replace Scattered Media With One High-Quality Mosaic

**Files:**
- Create: `src/components/TeamMedia.astro`
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/styles/landing.css`
- Modify: `tests/e2e/landing.spec.ts`
- Stop rendering: `src/components/Culture.astro`, `src/components/Progression.astro`, `src/components/TeamVideo.astro`

**Interfaces:**
- `TeamMedia.astro` consumes `{ content: LandingContent; locale: Locale; lead: MediaImage; support: readonly MediaImage[]; video: typeof media.video }`.
- Produces one `[data-media-grid]`, four `[data-media-tile]` elements, and one accessible controlled video.

- [ ] **Step 1: Add failing mosaic tests**

```ts
test('uses one complete media mosaic without empty tiles', async ({ page }) => {
  await page.goto('/en/');
  const grid = page.locator('[data-media-grid]');
  await expect(grid).toHaveCount(1);
  await expect(grid.locator('[data-media-tile]')).toHaveCount(4);
  await expect(grid.locator('video')).toHaveAttribute('controls', '');
  await expect(grid.locator('video source[type="video/mp4"]')).toHaveCount(1);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "complete media mosaic"`

Expected: FAIL because the page still renders separate culture, achievement, and video sections.

- [ ] **Step 3: Create the mosaic**

```astro
<section class="team-media" aria-labelledby="team-media-title">
  <header class="team-media-heading" data-reveal>
    <p class="eyebrow">{content.culture.eyebrow}</p>
    <h2 id="team-media-title">{content.culture.title}</h2>
  </header>
  <div class="team-media-grid" data-media-grid>
    <figure class="media-tile media-tile-lead" data-media-tile>...</figure>
    <figure class="media-tile media-tile-video" data-media-tile>
      <video controls preload="metadata" poster={video.poster} aria-label={video.alt[locale]}>...</video>
    </figure>
    <figure class="media-tile" data-media-tile>...</figure>
    <figure class="media-tile" data-media-tile>...</figure>
  </div>
</section>
```

Use `ResponsivePicture` for all photos, `object-position` per tile when faces need protection, and a desktop `1.2fr .8fr .8fr` by two-row grid. Mobile uses a complete two-column layout with the lead and video tiles spanning both columns.

- [ ] **Step 4: Replace old media sections in `index.astro`**

```astro
<TeamMedia
  {content}
  {locale}
  lead={media.culture[2]}
  support={media.achievements.slice(0, 2)}
  video={media.video}
/>
```

Remove the old component imports and render calls only after the new component contains all required media and localized alternative text.

- [ ] **Step 5: Verify video and image quality contracts**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "media mosaic|user-controlled team video|metadata guards"`

Expected: all focused tests PASS; every image has alt, width, and height; MP4 and WebM sources are present when generated.

- [ ] **Step 6: Commit**

```bash
git add src/components/TeamMedia.astro src/pages/[locale]/index.astro src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: organize team media into full-width mosaic"
```

---

### Task 6: Finish Candidate and Application Conversion Sections

**Files:**
- Modify: `src/components/CandidateFit.astro`
- Modify: `src/components/ApplicationForm.astro`
- Modify: `src/styles/landing.css`
- Modify: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Preserve existing candidate content order and all application field names consumed by `src/scripts/application.ts`.
- Preserve `[data-application-form]`, `[data-form-status]`, localized labels, consent, and disabled safe-preview submission.

- [ ] **Step 1: Add failing visual-order assertions**

```ts
test('ends with prioritized candidates and the safe application form', async ({ page }) => {
  await page.goto('/en/');
  const cards = page.locator('#candidate-fit article');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Experienced');
  await expect(page.locator('#apply')).toHaveAttribute('data-conversion-section', '');
});
```

- [ ] **Step 2: Run and confirm selector failure**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "prioritized candidates"`

Expected: FAIL because the approved conversion-section selector is absent.

- [ ] **Step 3: Recompose without changing form behavior**

Add numbered candidate cards with the first card on a navy surface. Make the application section a two-column desktop composition with a team image panel and the existing form panel. Keep all existing inputs, validation IDs, consent copy, and privacy anchor unchanged.

```astro
<section id="apply" class="application-section" data-conversion-section>
  <div class="application-visual" aria-hidden="true"></div>
  <div class="application-panel">
    <!-- existing localized heading, disclosure, and form markup -->
  </div>
</section>
```

- [ ] **Step 4: Run application regressions**

Run: `node node_modules/@playwright/test/cli.js test tests/e2e/landing.spec.ts -g "prioritized candidates|validates inline|does not POST|localized application"`

Expected: all focused tests PASS; no network POST occurs.

- [ ] **Step 5: Commit**

```bash
git add src/components/CandidateFit.astro src/components/ApplicationForm.astro src/styles/landing.css tests/e2e/landing.spec.ts
git commit -m "feat: complete recruitment conversion flow"
```

---

### Task 7: Full Regression, Responsive, and Visual QA

**Files:**
- Modify: `tests/e2e/landing.spec.ts`
- Modify only if failures prove necessary: files changed in Tasks 1–6.

**Interfaces:**
- Consumes the completed page.
- Produces verification evidence; no new product behavior.

- [ ] **Step 1: Add the final breakpoint and motion safety matrix**

```ts
for (const width of [375, 768, 1024, 1440]) {
  test(`Performance Sport layout fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/');
    expect(await page.evaluate(() => ({
      documentFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      bodyFits: document.body.scrollWidth <= document.documentElement.clientWidth,
    }))).toEqual({ documentFits: true, bodyFits: true });
    await expect(page.locator('[data-media-grid]')).toBeVisible();
    await expect(page.locator('[data-journey]')).toBeVisible();
  });
}
```

- [ ] **Step 2: Run all unit tests**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all test files PASS with zero failures.

- [ ] **Step 3: Run Astro checks**

Run: `node node_modules/@astrojs/check/bin/astro-check.js`

Expected: zero errors, warnings, or hints.

- [ ] **Step 4: Run the complete E2E suite**

Run: `node node_modules/@playwright/test/cli.js test`

Expected: all tests PASS. On this Windows workspace, if Playwright completes tests but hangs during process teardown, record the completed test results and confirm no assertion failure appears before terminating the stale runner.

- [ ] **Step 5: Build production output**

Run: `$env:PUBLIC_SITE_URL='https://join.coway.test'; $env:ASTRO_TELEMETRY_DISABLED='1'; node node_modules/astro/bin/astro.mjs build`

Expected: successful build containing `/en/`, `/bm/`, `/zh/`, `robots.txt`, and sitemap files.

- [ ] **Step 6: Perform browser visual QA**

Inspect 375px and 1440px previews and verify:

- hero faces and text remain sharp and uncropped;
- video poster and playback are clear;
- journey progress follows scroll;
- no more than two primary elements move in any viewport;
- reduced-motion mode shows all content without transforms;
- media mosaic has no empty quadrant;
- focus rings remain visible on navy, lime, aqua, and ice surfaces;
- language switching and application validation still work.

- [ ] **Step 7: Commit final test adjustments**

```bash
git add tests/e2e/landing.spec.ts
git commit -m "test: verify Performance Sport redesign"
```

If Step 7 has no diff because every assertion was added in its owning task, do not create an empty commit.
