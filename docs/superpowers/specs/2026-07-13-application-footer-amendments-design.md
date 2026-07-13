# Application and Footer Amendments Design

Date: 2026-07-13

## Objective

Refine the existing Performance Sport recruitment landing page without changing its overall visual direction. The amendment will make the sales-experience message more welcoming, prevent the application image from appearing stretched on laptops, remove the unintended Coway corporate link, and prepare accessible social-media controls for future profile URLs.

## Scope

### Sales-experience FAQ

Replace the current answer, which prioritises experienced applicants, with a direct and inclusive message:

> No. Sales experience is not required. What matters most is your ambition, commitment to the industry, and willingness to learn. With the right attitude and consistent action, we can develop your skills and grow together.

The Bahasa Malaysia and Simplified Chinese versions must communicate the same meaning naturally rather than translating word for word. The FAQ question remains unchanged in all three languages.

### Application image

The application section will use the existing team-meeting photograph instead of the current team-social-gathering photograph.

The photograph must no longer stretch to match the full height of the application form. Its display rules will be:

- below 48rem: full-width with an exact `4 / 3` aspect ratio;
- from 48rem upward: a controlled `4 / 5` portrait frame filling the left column width and aligned to the top of the application section;
- all sizes: `object-fit: cover` with an intentional focal position, declared dimensions or aspect ratio, and the existing responsive AVIF/WebP sources;
- no distortion, horizontal overflow, or layout shift;
- preserve the existing application form, privacy copy, and safe non-submitting behavior.

The image remains decorative in this section because it does not add information needed to understand or complete the form.

### Footer and social platforms

Remove the Coway Malaysia official website link and its footer heading. The independent recruitment disclaimer remains unchanged.

Add a localized social-media area containing these four platforms:

- Facebook
- Instagram
- TikTok
- Xiaohongshu

Social destinations will be stored in one typed configuration object. Initially, every URL is empty. An empty destination must render as a visibly inactive, non-focusable platform control rather than an anchor with an empty `href`. This prevents page jumps and avoids suggesting that a working account link exists. When a valid URL is added later, the same control becomes a normal external link with an accessible name, `target="_blank"`, and `rel="noopener noreferrer"`.

The controls will use the established Performance Sport styling: compact outlined pills or buttons, clear text labels, strong contrast, at least a 44-pixel touch target, visible focus treatment for active links, and a responsive wrapping layout. No fake URLs, placeholder domains, or emoji icons will be added.

## Content and localization

All user-facing additions must support English, Bahasa Malaysia, and Simplified Chinese. Platform brand names remain recognizable; only the social-area heading and inactive-state accessibility wording require localization.

Removing the corporate link also removes the now-unused localized official-site label from the content model.

## Components and data flow

- The landing page supplies the team-meeting media entry to the application form.
- The application component continues to use the existing responsive-picture component.
- A single social configuration exports the platform identifiers, labels, and optional URLs.
- The footer maps that configuration to either an external anchor or an inert control based on whether a URL is present.
- No third-party social scripts, tracking pixels, APIs, or embeds are introduced.

## Responsive and accessibility requirements

- The application layout must remain readable at 375, 768, 1024, and 1440 pixels.
- The image must keep its intended proportions at each breakpoint.
- Inactive social controls must not enter the keyboard tab order or announce themselves as working links.
- Future active social links must have visible keyboard focus and descriptive accessible labels.
- Social controls must wrap without clipping or causing horizontal scrolling.
- Existing reduced-motion behavior remains unchanged.

## Verification

Automated coverage will verify:

- the revised FAQ meaning in English, Bahasa Malaysia, and Simplified Chinese;
- removal of the Coway official-site link and associated content field;
- presence of all four social platforms;
- empty social destinations render without empty anchors or focusable links;
- a configured destination renders as a safe external link;
- the application page uses the team-meeting media entry;
- responsive image CSS contains controlled aspect and sizing rules rather than full form-height stretching;
- the full unit suite, Astro check, production build, and focused browser tests continue to pass.

Visual review will confirm the application image composition on mobile and laptop widths and check that the footer controls remain balanced within the existing Performance Sport design.

## Out of scope

- Creating or discovering social-media accounts or URLs
- Changing the application fields or submission workflow
- Changing the commission disclosure, income range, ranking of target audiences outside this FAQ answer, or independent recruitment disclaimer
- Introducing new photography, social embeds, analytics, or third-party scripts
