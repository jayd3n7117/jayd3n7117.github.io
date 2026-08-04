# Coway Sales Career Selective-Glass Redesign and SEO Expansion

## Objective

Deliver two connected outcomes for `https://cowaysalescareer.my`:

1. Redesign the complete recruitment website using the approved V4 selective-glass direction: energetic navy, violet, rose, lilac, and white surfaces; bold display typography; restrained glass highlights; and purposeful scroll reveals.
2. Expand the current one-page-per-language site into a small, useful recruitment content cluster that can earn qualified organic traffic for Coway sales-career searches in Malaysia, with primary emphasis on English and Simplified Chinese.

The primary business conversion remains a completed recruitment application from a suitable Malaysian candidate. SEO success is qualified discovery and applications, not page count or raw impressions.

## Approved Product and Audience Context

- Opportunity: fully commission-based Coway sales work, with no fixed salary and no guaranteed income.
- Published potential commission range: `RM2,500-RM10,000+ per month`.
- Public coverage: Malaysia-wide, with practical emphasis on Kuala Lumpur, Selangor, Penang, and Johor.
- Candidate priority:
  1. Aspiring team leaders.
  2. People seeking a career change.
  3. Existing salespeople.
  4. Fresh graduates and ambitious newcomers.
- Core promise: candidates are joining for sales capability, career growth, team support, and a possible path toward leadership, not merely for a one-off sales role.
- Existing Formspree submission, multilingual privacy copy, consent-controlled GA4, and commission disclosures remain functional.

## Visual System

### Colour architecture

Use one coordinated palette across all pages:

- Deep night navy for the hero, selected trust sections, and the footer.
- Violet and rose as the primary expressive accent family.
- Peach only as a small endpoint within approved CTA gradients.
- Lilac for transitional or learning sections.
- White and near-white for long-form SEO content, FAQs, application guidance, and other reading-heavy sections.
- Cool violet-grey neutrals for borders and secondary text.

Do not introduce unrelated green, aqua, orange, or blue accents. Status information must use text or icons in addition to colour.

### Selective glass rule

Glass is an emphasis material, not the default component treatment. Use it on no more than two or three prominent surfaces in one viewport, such as:

- Main navigation.
- Hero growth-path panel.
- A location or trust badge.
- A final conversion panel when the surrounding section supports the effect.

Ordinary content, SEO copy, FAQ rows, breadcrumbs, forms, chips, and most cards use solid surfaces. This preserves hierarchy and prevents the design from becoming visually repetitive.

Approved glass behavior:

- `backdrop-filter: blur(14px) saturate(1.4)` with a solid translucent fallback.
- One-pixel translucent border and subtle inner top highlight.
- Specular streak on hover for pointer devices.
- `scale(0.97)` pressed feedback for interactive glass controls.
- No glass effect may reduce text contrast or form clarity.

### Typography

- English display headings: a self-hosted, open-licensed heavy condensed sans in the Barlow Condensed or comparable family, selected to match the approved Segoe Black-style energy.
- Simplified Chinese display headings: self-hosted Noto Sans SC in a heavy weight.
- Body and interface text: Segoe UI, Noto Sans SC, and system sans fallbacks.
- Display typography is reserved for short headings. Body copy remains comfortable at a minimum of 16 pixels on mobile with readable line length.
- Fonts use `font-display: swap` and only required weights are shipped.

### Shape and spacing

- Cards: consistent 20-26 pixel corner radius.
- Buttons: full-pill shape, with a minimum 44-pixel touch target.
- Chips: 10-12 pixel radius.
- Page gutters and section spacing follow a consistent 8-pixel-based scale.
- Desktop uses asymmetric compositions. Mobile stacks content in reading and conversion priority.

### Imagery

No new photography is required for the first implementation. The approved abstract CSS orbit, grid, and glow motifs can carry the hero and transitions without fake stock imagery.

Existing team media may be retained only where it provides genuine first-hand evidence of team culture or achievement. It must be optimized, accurately described with alt text, and never imply an official Coway corporate endorsement. If a future section needs an image and no suitable authorized asset exists, the component must reflow cleanly without a visible blank placeholder; a media source can be added later.

## Motion and Interaction

Motion communicates hierarchy, progress, and feedback.

- Use `IntersectionObserver` for one-time reveal groups.
- Section headings rise and fade when entering the viewport.
- Related rows or cards reveal with short 60-80 millisecond staggering.
- Hero copy and the primary visual may enter from different directions with low amplitude.
- Glass surfaces may run one entry sheen when first revealed and repeat the sheen on intentional hover.
- Links and buttons use 150-250 millisecond hover and pressed transitions.
- No scroll hijacking, forced snap, autoplaying marquee, looping decorative animation, or heavy parallax.
- Native scrolling and the browser Back button remain untouched.
- Content is visible by default. JavaScript only enables hidden pre-reveal states after initialization, so crawlers and no-JavaScript users never receive invisible content.
- `prefers-reduced-motion: reduce` disables reveals, sheen travel, parallax, and nonessential transforms.

## Information Architecture

### Existing localized homepages

- `/en/` - English homepage.
- `/zh/` - Simplified Chinese homepage.
- `/bm/` - Bahasa Malaysia homepage retained and visually redesigned.

The homepages remain broad recruitment entry points. English and Chinese receive the first supporting-page expansion. Bahasa Malaysia retains a complete homepage and language links, but does not receive thin translated supporting pages in this phase.

### English supporting pages

1. `/en/coway-sales-career/`
   - Complete opportunity, responsibilities, fully commission-based structure, potential income range, suitable candidate profile, expectations, and application CTA.
2. `/en/career-change-to-sales/`
   - Transferable skills, what changes in a performance-led role, realistic first steps, training, common concerns, and who should not apply.
3. `/en/sales-training-leadership/`
   - Training system, coaching, content support, sales habits, leadership development, and performance-dependent progression.
4. `/en/coway-sales-malaysia-locations/`
   - One substantial nationwide page with distinct, useful sections for Kuala Lumpur, Selangor, Penang, Johor, and other Malaysian applicants. Do not create separate thin city doorway pages.
5. `/en/application-faq/`
   - Application steps, information collected, review process, response expectations, commission questions, experience requirements, privacy, and direct application form or clearly linked application CTA.

### Chinese supporting pages

Create matching Simplified Chinese versions under the same stable slugs:

1. `/zh/coway-sales-career/`
2. `/zh/career-change-to-sales/`
3. `/zh/sales-training-leadership/`
4. `/zh/coway-sales-malaysia-locations/`
5. `/zh/application-faq/`

Chinese content must be naturally written for Malaysian Chinese readers, not a literal sentence-by-sentence translation. It must preserve all commission, guarantee, privacy, and identity disclosures.

## Search Intent and Page Mapping

Use keywords naturally in titles, headings, introductions, internal links, image alternatives when relevant, and answers. Never repeat them mechanically.

| Page | English intent examples | Chinese intent examples |
|---|---|---|
| Homepage | Coway sales recruitment Malaysia, Coway career Malaysia, sales career Malaysia | Coway 销售招聘, Coway 马来西亚招聘, 马来西亚销售事业 |
| Sales career | Coway sales career, Coway sales agent career, commission-based sales opportunity | Coway 销售事业, Coway 销售代理, 佣金制销售机会 |
| Career change | career change to sales Malaysia, switch career to sales, sales career without experience | 转行做销售, 无经验销售工作, 马来西亚转行销售 |
| Training and leadership | sales training Malaysia, sales leadership development, sales team coaching | 销售培训, 销售团队培训, 销售领导力发展 |
| Malaysia locations | sales recruitment KL, Selangor, Penang, Johor, nationwide Malaysia | 吉隆坡销售招聘, 雪兰莪销售招聘, 槟城销售招聘, 柔佛销售招聘 |
| Application FAQ | Coway sales application, Coway recruitment process, commission sales FAQ | Coway 销售申请, Coway 招聘流程, 佣金销售常见问题 |

The content focus remains Coway sales recruitment. Property recruitment and LG recruitment are competitor research inputs, not topics to publish on this site. Publishing unrelated comparison pages would dilute the site's purpose and risk search-engine-first content.

## Content Quality Standard

Every supporting page must:

- Answer a distinct candidate question and provide information not fully covered by the homepage.
- Use first-hand team knowledge, honest expectations, and specific application guidance.
- State the commission model wherever income or compensation is discussed.
- Avoid invented testimonials, statistics, awards, hiring volumes, office addresses, training certifications, or guaranteed outcomes.
- Avoid arbitrary word-count targets.
- Include a clear next step and relevant internal links.
- Be useful if visited directly without reading the homepage first.
- Use correct grammar and natural Malaysian English or Simplified Chinese.

No page may exist only to repeat a city name or keyword. No hidden keyword blocks, cloaking, auto-generated mass pages, or duplicated translated metadata are allowed.

## Identity, Trust, and Trademark Disclosure

Do not use the phrase “not fake” in primary site copy. Use a precise identity statement that explains the relationship and avoids implying that this is Coway Malaysia's corporate website.

### Approved English disclosure

> About this website: Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia. It is not the official corporate website of Coway (Malaysia) Sdn. Bhd. Applications submitted here are reviewed by our sales leadership team for Coway sales opportunities. Coway names, logos, and trademarks belong to their respective owners.

### Approved Bahasa Malaysia disclosure

> Tentang laman ini: Coway Sales Career ialah laman pengambilan bebas yang dikendalikan oleh sebuah pasukan jualan Coway di Malaysia. Laman ini bukan laman korporat rasmi Coway (Malaysia) Sdn. Bhd. Permohonan yang dihantar di sini disemak oleh pasukan kepimpinan jualan kami untuk peluang jualan Coway. Nama, logo dan tanda dagangan Coway milik pemilik masing-masing.

### Approved Simplified Chinese disclosure

> 关于本网站：Coway Sales Career 是由马来西亚 Coway 销售团队运营的独立招聘网站，并非 Coway (Malaysia) Sdn. Bhd. 的官方企业网站。通过本网站提交的申请，将由我们的销售领导团队审核，用于 Coway 销售机会的招募。Coway 名称、标志及商标归其各自权利人所有。

Placement:

- Short visible trust statement near the first application CTA.
- Full statement in an About/Trust section reachable from every page.
- Full or compact statement in the footer on every page.
- Application form context explaining who reviews the submission.
- Privacy copy remains separate and continues explaining Formspree and consent-controlled analytics.

Only use the existing authorized Coway logo asset. Preserve proportions, clear space, original colours, and alternative text. Do not apply the site's gradient, glass, glow, shadow, or recolouring effects to the Coway logo.

## Technical SEO

### Metadata and indexing

- Unique, descriptive title and meta description for every route.
- Self-referencing canonical URL on every page.
- Reciprocal `hreflang` mappings between each English and Chinese page pair, plus `x-default` to the English homepage or equivalent English page.
- Bahasa Malaysia homepage remains linked from all global language controls.
- Every indexable page appears in the generated XML sitemap with its canonical URL.
- `robots.txt` continues allowing public pages and referencing the sitemap index.
- Preserve one crawlable URL per content item and avoid query-string duplicates.

### Internal linking and navigation

- Desktop and mobile navigation link to Opportunity, Career Change, Training and Leadership, Locations, FAQ, and Apply.
- Breadcrumbs appear on supporting pages.
- Homepage sections link contextually to their detailed pages.
- Supporting pages cross-link only where the next topic is genuinely useful.
- Footer contains the page cluster, language links, trust disclosure, and privacy link.
- All links are standard crawlable anchor elements.

### Structured data

- Add truthful `WebSite` structured data on the homepage.
- Add `BreadcrumbList` to supporting pages.
- Add FAQ structured data only when the same questions and answers are visibly present on the page.
- Do not add `JobPosting` structured data in this phase. The required hiring-organization identity, employment type, date posted, validity period, and exact location model must not be guessed. It can be added later only after these details are formally confirmed and the page meets Google's job-posting policies.
- Do not identify Coway (Malaysia) Sdn. Bhd. as the site's publisher or hiring organization unless written authorization and accurate organizational details are available.

### Page experience

- Server-render all important text and links through Astro.
- Keep glass and motion CSS lightweight; do not add a large animation framework.
- Optimize and lazy-load below-the-fold media, declare media dimensions, and preserve a stable layout.
- Maintain accessible contrast, semantic heading order, skip navigation, keyboard access, visible focus, touch targets, form labels, and no horizontal overflow.
- Test at 375, 768, 1024, and 1440 pixels.

## Application and Measurement

- Preserve the current short Formspree application flow, validation, honeypot, localized privacy disclosure, and failure recovery.
- Preserve field names unless a separate migration is approved.
- On confirmed successful submission, emit a consent-controlled GA4 `generate_lead` event without sending applicant answers or personal information.
- Keep recruitment form values out of page URLs, analytics labels, console logs, and rendered success messages.
- Search Console monitoring will compare impressions, clicks, click-through rate, average position, indexed pages, and query/page pairs before and after release.

## Release and Search Console Workflow

1. Build and verify all routes locally.
2. Review English and Chinese page copy, identity wording, form behavior, mobile layout, reduced motion, and logo treatment.
3. Publish through the existing GitHub Pages workflow only after user approval of the local preview.
4. Verify the live canonical tags, `hreflang`, sitemap, robots file, form, analytics consent, and responsive behavior.
5. Resubmit the sitemap index in Google Search Console.
6. Request indexing for the English and Chinese homepages and the highest-priority supporting pages.
7. Review Search Console weekly for the first month and monthly afterward. Evaluate results over weeks, not days; Google does not guarantee ranking or immediate indexing.

## Verification

### Unit and content tests

- Every route has unique title, description, canonical URL, and correct locale.
- English and Chinese page pairs have complete reciprocal `hreflang` mappings.
- Sitemap includes every canonical route and robots references the sitemap.
- Required commission language and no-guarantee disclosure appear wherever compensation is discussed.
- Trust disclosure is present in all three languages and does not describe the site as the official Coway corporate website.
- Structured data matches visible content and does not include `JobPosting`.
- Analytics lead event fires only after confirmed form success and only when analytics consent permits it.

### Browser tests

- All routes load, navigate, and remain free of horizontal overflow.
- Global navigation, mobile navigation, breadcrumbs, language switching, and internal links work.
- Scroll reveals occur once, content remains readable without JavaScript, and reduced-motion mode shows content immediately.
- Glass hover and pressed states do not obscure text or shift surrounding layout.
- Application success and failure behavior remains correct with mocked Formspree requests.
- Existing privacy and analytics-consent behavior remains intact.

### Build and visual review

- Astro check reports no diagnostics.
- Unit, production build, and end-to-end suites pass.
- Visual review covers the approved palette, selective-glass limit, typography, responsive spacing, form usability, and logo integrity.

## Scope Boundaries

- No paid SEO, keyword, analytics, design, or content subscription is required.
- No promise of a specific Google ranking, indexing date, traffic volume, or application volume.
- No new city doorway pages, blog publishing engine, applicant database, login system, WordPress migration, or replacement form provider in this phase.
- No publication occurs until the user approves the completed local preview.

## Official Google References

- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Localized versions of pages and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [JobPosting structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

