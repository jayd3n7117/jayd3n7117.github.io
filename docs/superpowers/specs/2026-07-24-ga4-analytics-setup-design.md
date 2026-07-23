# GA4 analytics setup design

## Goal

Add Google Analytics 4 measurement to the multilingual Coway sales-recruitment
website using measurement ID `G-KGTRGW5765`, while giving visitors a clear
analytics choice and preventing recruitment form details from being sent to
Google.

## Scope

- Load one Google tag from the shared Astro layout so it covers the English,
  Bahasa Malaysia, and Simplified Chinese pages.
- Add a compact, localized analytics consent banner.
- Use Google Consent Mode with analytics storage denied until the visitor
  accepts analytics.
- Record standard GA4 page-view and engagement data after consent.
- Add localized privacy copy explaining the use of Google Analytics.
- Keep the existing Formspree application consent separate from analytics
  consent.
- Do not add Google Tag Manager, Google Ads remarketing, advertising cookies,
  enhanced conversions, user IDs, or form-field values.
- Do not combine the unrelated canonical and sitemap corrections with this
  analytics change.

## Tag architecture

The measurement ID will live in one small analytics configuration module. A
shared Astro analytics component will be rendered from `BaseLayout.astro`.
It will:

1. Define `dataLayer` and `gtag`.
2. Set the initial analytics consent state to denied.
3. Load `gtag.js` once for `G-KGTRGW5765` only after analytics is accepted.
4. Configure GA4 without manually sending duplicate page-view events.

The ID is a public website identifier rather than a secret, so it may be stored
in the repository. No Google account credential, API secret, or access token
will be added to the site.

## Consent behaviour

On a visitor's first visit, analytics storage will default to denied and a
localized banner will offer two equally accessible actions:

- Accept analytics
- Decline analytics

The choice will be stored in local browser storage. On later visits, the saved
choice will be applied before analytics configuration. Accepting updates
analytics consent to granted and loads the Google tag. Declining keeps consent
denied and does not load the Google tag.

The banner will not block navigation or the recruitment application form. It
will be keyboard operable, use clear focus styles, and remain readable on
mobile screens. If browser storage is unavailable, the site will fail safely:
analytics remains denied and the visitor can make a choice again later.

## Localized content

English, Bahasa Malaysia, and Simplified Chinese will each include:

- a short explanation that analytics helps understand website use;
- an Accept analytics action;
- a Decline analytics action;
- privacy text naming Google Analytics and stating that recruitment form
  answers are not intentionally sent to analytics.

The website owner will review the final English and Chinese wording. Bahasa
Malaysia will remain supported because the website already publishes a Bahasa
Malaysia route.

## Data boundaries

The initial release will use only standard GA4 collection after consent. It
will not send:

- applicant names or contact numbers;
- age range, current job, location, or sales-experience answers;
- free-text application details;
- Formspree response content;
- stable internal applicant identifiers.

Application-success and WhatsApp-click conversions will be designed separately
after the underlying application and WhatsApp flows are confirmed live.

## Error handling

- A blocked or unavailable Google script must not affect the page or form.
- A local-storage read or write failure must leave analytics denied.
- Repeated consent clicks must not add duplicate scripts or handlers.
- Invalid or missing analytics configuration must fail closed without sending
  analytics data.

## Verification

Automated checks will verify:

- the measurement ID is configured once;
- initial analytics consent is denied;
- accepting and declining update the correct consent state;
- the stored choice is restored on a later page load;
- all three locales render translated banner actions and privacy text;
- no application field value is passed to analytics code;
- the existing navigation, motion, and application behaviour remains intact.

Production verification will confirm:

1. the Google tag is detected on `cowaysalescareer.my`;
2. no GA4 activity is recorded before analytics acceptance;
3. a consented test visit appears in GA4 Realtime or DebugView;
4. switching between English and Chinese produces normal page views without
   duplicate tag installation;
5. declining analytics leaves the site and application form fully usable.
