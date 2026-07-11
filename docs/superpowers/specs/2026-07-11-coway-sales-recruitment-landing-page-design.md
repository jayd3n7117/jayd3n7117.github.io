# Coway Sales Recruitment Landing Page Design

**Date:** 11 July 2026  
**Status:** Approved design direction; awaiting written-spec review  
**Working direction:** Bright Momentum

## 1. Purpose

Create a young, energetic, credible recruitment landing page for an independent Coway sales organization in Malaysia. The page must attract experienced salespeople first, career switchers second, and fresh graduates or first-job seekers third.

The primary conversion is a completed short application form. The page must be transparent that the opportunity is fully commission-based while presenting the training, systems, support, and leadership pathway that differentiate this sales organization.

## 2. Success Criteria

- Visitors understand the opportunity, target candidate, commission model, and support system within the first screen and first two content sections.
- Qualified visitors can complete the application in under two minutes.
- The experience feels youthful and forward-moving without reducing trust among experienced salespeople.
- English, Bahasa Malaysia, and Simplified Chinese content is available through a clearly visible language control.
- Search engines can crawl each language independently and understand the Malaysia-wide recruitment focus.
- The page performs well on mobile devices and remains usable with reduced motion enabled.

## 3. Audience Priority

1. Experienced salespeople and existing agents seeking stronger systems, income potential, and leadership progression.
2. Young career switchers seeking performance-based income and a structured path to learn sales.
3. Fresh graduates and first-job seekers with ambition and willingness to learn.

Recruitment is Malaysia-wide, with additional organic relevance for Penang, Johor, Kuala Lumpur, and Selangor. The public-facing page will not imply that applicants are limited to those regions.

## 4. Positioning and Core Message

The page positions the opportunity as a complete growth environment rather than a generic sales vacancy.

Core promise: applicants gain access to in-depth training, collaborative content support, active sales funnels, convenient sales resources, team coaching, and a pathway into leadership.

Core cultural statement: **“There is no me in this team. Only us.”**

The page will use Coway branding and official credibility carefully, but it must not imply that it is Coway Malaysia's corporate careers website. A visible footer disclosure will state that this is an independently operated Coway sales recruitment page.

## 5. Visual Direction: Bright Momentum

### Palette

- Predominantly white backgrounds for brightness and clarity.
- Coway blue as the main brand anchor.
- Deep navy for high-contrast body copy and premium credibility.
- A restrained energetic accent, selected from lime, warm coral, or electric cyan during visual implementation.
- Accent colors may highlight actions and movement but must not compete with the Coway identity.

### Typography

- A modern display typeface with distinctive shapes for large headlines.
- A highly readable sans-serif for body content, form controls, and multilingual copy.
- Typography must support Latin, Bahasa Malaysia, and Simplified Chinese with visually compatible fallbacks.
- Headlines may use large scale, tight leading, and editorial line breaks; body copy remains conventional and easy to scan.

### Photography and Media

- Use authentic supplied team images rather than stock people photography.
- Use `Team photo.JPG` or `Team Photo 3.JPG` as the main hero/culture image.
- Use `Team Photo 2.JPG` and `Team Photo 4.jpg` as energetic lifestyle support.
- Use both achievement images and the promoted-manager image as proof of progression.
- Optimize the supplied MOV video for web delivery and present it below the initial page fold.
- Preserve original source assets in `assets-source`; implementation copies will be renamed and optimized for web use.

### Motion and Interaction

- Smooth section reveals, restrained image parallax, a horizontal credibility ticker, responsive support cards, and subtle pointer reactions.
- Motion should communicate momentum, not decoration for its own sake.
- No heavy dark-neon treatment from the interaction reference; interactions will be adapted to the white visual system.
- Respect `prefers-reduced-motion` and provide static alternatives.

## 6. Information Architecture

### 6.1 Header

- Coway logo on the left.
- Compact navigation to Opportunity, Support, Growth, FAQ, and Apply.
- A visible language button showing the current language and a dropdown containing English, Bahasa Malaysia, and 中文.
- A persistent “Apply Now” action on desktop; a compact sticky action may appear on mobile after the hero.

The language control must be keyboard accessible and indicate the selected language. When switching languages, it will preserve a recognized section anchor (for example, `#support` or `#apply`); if no matching anchor exists, it will open the top of the selected language page.

### 6.2 Hero

Working headline: **“Don't Just Sell. Build What's Next.”**

Supporting message: join a structured Coway sales environment with practical training, sales systems, content support, and leadership development.

Content elements:

- Primary CTA: “Start Your Application.”
- Secondary anchor: “See How We Support You.”
- Authentic team imagery in a curved or layered editorial composition.
- Short trust label identifying the opportunity as Coway sales recruitment in Malaysia.
- Early but readable disclosure: fully commission-based opportunity.

### 6.3 Momentum Strip

A horizontally moving credibility strip containing:

“Online Training · Content Support · Active Sales Funnels · Leadership Growth · One Team”

The strip becomes static when reduced motion is enabled.

### 6.4 Opportunity and Income

Present **“RM2,500-RM10,000+ potential monthly commission income.”**

The income figure must always appear with the following meaning, translated accurately in every language:

“This is a fully commission-based opportunity. Actual earnings vary and depend on individual sales performance; no income is guaranteed.”

Avoid language that promises guaranteed earnings or implies employment salary.

### 6.5 Built to Help You Win

Six interactive cards:

1. In-depth online sales training, suitable for starting from scratch.
2. Collaborative content ideation and execution.
3. Multiple active sales funnels and practical selling systems.
4. One-click access to product and sales information.
5. Coaching and team support where no member is left behind.
6. Leadership development and promotion opportunities.

Each card contains a concise benefit-led headline, a plain-language explanation, and a lightweight interactive response.

### 6.6 Real Team Culture

Use an editorial grid of authentic team meeting, social, and activity images. Copy will emphasize collective learning, mutual support, execution, and momentum.

Anchor statement: **“There is no me in this team. Only us.”**

### 6.7 Career Progression and Proof

Use supplied achievement and promotion assets to demonstrate that salespeople can develop into leaders. Clearly label dates and accomplishments where visible and confirmed. Do not invent performance metrics, ranks, or testimonials that were not provided.

The current `Testimonial.jpg` is achievement proof, not a written testimonial. It will not be presented as a personal quote unless the user later provides an approved quote and attribution.

### 6.8 Team Video

Present an optimized, poster-backed video with user-initiated playback. Do not autoplay with sound. Provide captions or a written summary when final video content is confirmed.

### 6.9 Candidate Fit

Explain who will benefit most:

- Experienced salespeople who want stronger systems and leadership growth.
- Career switchers who accept performance-based income and want structured training.
- Ambitious newcomers willing to learn, create content, follow up, and improve consistently.

Include a transparent “this may not suit you” note for visitors seeking fixed salary, guaranteed income, or passive results.

### 6.10 Application Form

Required fields:

- Name: text input.
- Age: required selector with `18-24`, `25-34`, `35-44`, and `45+`. Applicants must be at least 18 years old.
- Current job: required concise text input.
- Staying at: required Malaysian state selector plus optional city text input.
- Sales experience: required selector with `No experience`, `Less than 1 year`, `1-3 years`, `4-6 years`, and `7+ years`, plus an optional short detail field.

The form must include consent copy explaining how applicant information will be used and contacted. It must not request sensitive identity documents, financial data, or unnecessary personal information.

Submission states:

- Validate fields inline with clear, translated messages.
- Prevent duplicate submissions while a request is processing.
- On success, confirm receipt and explain that the recruitment team will contact the applicant for the next step.
- On failure, preserve entered information and offer a retry path.

The final delivery destination for submissions will be selected during implementation planning. No applicant data should be collected until a secure destination and privacy handling process are defined.

### 6.11 FAQ and Final CTA

FAQ topics:

- Is this a salaried role?
- Is sales experience required?
- What training and support are available?
- Can I join from anywhere in Malaysia?
- Is the schedule flexible?
- How does leadership progression work?
- What happens after I apply?

End with a strong application invitation and repeat the commission disclosure near the CTA.

### 6.12 Footer

- Coway identity.
- Language selector.
- Links to privacy information and the official Coway Malaysia website.
- Independent recruitment disclosure.
- No unapproved team name or sub-brand will be introduced.

## 7. Multilingual Experience

- English is the default language.
- Bahasa Malaysia and Simplified Chinese are full human-readable versions, not browser-generated overlays.
- Each version has its own crawlable path, recommended as `/en`, `/bm`, and `/zh`.
- Implement `hreflang`, canonical URLs, localized titles, descriptions, headings, form labels, validation, success messages, disclaimers, and FAQ content.
- The visible language button appears in the header and footer.
- Save language preference locally without preventing direct access to any language URL.
- Chinese typography uses an appropriate local font fallback and does not inherit unsuitable display lettering.

## 8. SEO Strategy

Primary topic cluster:

- Coway sales recruitment Malaysia
- sales career Malaysia
- commission sales opportunity Malaysia
- sales agent recruitment Malaysia
- sales jobs and sales training in Malaysia

Regional supporting relevance will naturally reference Penang, Johor, Kuala Lumpur, and Selangor without presenting the opportunity as region-limited.

Technical requirements:

- Semantic headings and HTML content rather than text embedded in images.
- Unique localized metadata and Open Graph content.
- Structured data appropriate to the final legal classification of the opportunity. Do not publish `JobPosting` schema until the commission-based relationship and required fields comply with search-engine policy.
- XML sitemap, robots directives, canonical URLs, and language alternates.
- Descriptive image filenames, dimensions, compression, responsive sources, and meaningful alt text.
- Strong Core Web Vitals through deferred video, optimized images, minimal blocking scripts, and restrained animation.

## 9. Accessibility

- Meet WCAG 2.2 AA color contrast targets.
- Full keyboard navigation for menus, language controls, cards, and form fields.
- Visible focus states and properly associated form labels.
- Alternative text for meaningful images and empty alt text for decorative crops.
- Captions or an equivalent text summary for meaningful video content.
- Touch targets sized for mobile use.
- Reduced-motion behavior for all animations.

## 10. Responsive Behavior

- Mobile-first content order preserves the hero message, disclosure, CTA, and form clarity.
- Curved photo compositions simplify into stable stacked crops on smaller screens.
- Navigation collapses into an accessible menu while keeping language and application actions easy to reach.
- Forms use a single column on mobile and may use two columns only where labels and controls remain clear on larger screens.

## 11. Component Boundaries

The implementation should separate:

- Global layout, navigation, footer, and language routing.
- Reusable content sections and cards.
- Centralized localized content dictionaries.
- Media and responsive image handling.
- Application form state, validation, submission adapter, and status feedback.
- SEO metadata and structured-data generation.

The form submission destination must be isolated behind an adapter so it can later change without rewriting the visible form.

## 12. Testing and Verification

- Content and navigation checks in all three languages.
- Responsive checks at representative mobile, tablet, laptop, and wide desktop widths.
- Keyboard-only and screen-reader-oriented semantic checks.
- Form validation, success, failure, duplicate submission, and data-preservation tests.
- SEO checks for titles, descriptions, canonicals, language alternates, sitemap, robots, and indexable localized copy.
- Performance checks for image sizing, video deferral, layout shift, and animation cost.
- Visual comparison against the approved Bright Momentum direction using the supplied assets.

## 13. Deferred Decisions

The following are intentionally deferred to implementation planning because they require deployment or operational choices:

- Website framework and hosting provider.
- Secure application-form destination and notification workflow.
- Domain name and production analytics platform.
- Final accent color after visual comparison.
- Final approved translations and any additional testimonials.

These decisions do not change the approved landing-page structure or visual direction.
