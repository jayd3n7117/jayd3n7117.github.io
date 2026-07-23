# Formspree application submission design

## Goal

Turn the existing multilingual recruitment application form into a working
submission flow without changing its visual design. Applications will be sent
to the approved Formspree endpoint, and every application will include a
required WhatsApp or contact number so the recruitment team can follow up.

## Scope

- Keep the existing English, Bahasa Malaysia, and Simplified Chinese form.
- Add one required `contactNumber` field to all three locales.
- Connect the form to `https://formspree.io/f/xvzebykj`.
- Submit with JavaScript so applicants remain on the landing page.
- Add localized success and failure messages.
- Add a hidden honeypot field for basic bot filtering.
- Update production site URLs to `https://cowaysalescareer.my`.
- Do not add a database, administrator portal, file uploads, or automated
  applicant messaging.

## Contact-number behaviour

The visible label will mean "WhatsApp / contact number" in each locale. The
field will use `type="tel"` and `autocomplete="tel"`.

Validation will be deliberately tolerant:

- required after trimming;
- 8 to 20 characters;
- may contain digits, spaces, `+`, hyphens, and parentheses;
- must contain at least 8 digits.

This accepts common Malaysian and international formats such as
`012-345 6789` and `+60 12-345 6789` without attempting to prove that a phone
number exists.

## Submission architecture

The existing client-side schema remains the single validation boundary for
user feedback. After validation succeeds:

1. Disable the submit button and show the localized submitting label.
2. POST the application fields to the Formspree endpoint with an
   `Accept: application/json` header.
3. On a successful Formspree response, clear the form, clear field errors, and
   show a localized confirmation that the application was received.
4. On a network error or non-success response, preserve every field value,
   restore the button, and show a localized retry message.
5. Prevent a second submission while the first request is pending.

The Formspree endpoint is safe to include in public frontend code because form
endpoints are designed to receive browser submissions. No GitHub token, API
key, email password, or other secret will be added to the repository.

## Privacy and stored data

The visible privacy copy will state that the submitted information is used for
recruitment follow-up and is processed through the configured form service.
The existing consent checkbox remains required.

Formspree, rather than GitHub Pages, receives and stores the submission.
GitHub Pages continues to host only the static website. Applicant information
must never be written to the public Git repository, GitHub Issues, build logs,
or analytics.

## Error handling

- Client validation errors remain inline and move focus to the first invalid
  field.
- Formspree or network failures use a form-level alert and preserve answers.
- Only a confirmed successful response may show the success message or clear
  the form.
- Unexpected response details will not be shown to applicants.

## Production-domain update

The GitHub Actions build environment will use
`https://cowaysalescareer.my` as `PUBLIC_SITE_URL`. This makes canonical URLs,
hreflang links, sitemap entries, robots metadata, and social metadata use the
approved domain after the next deployment.

## Verification

Automated checks will cover:

- required contact-number validation;
- accepted Malaysian and international number formats;
- rejected malformed or too-short values;
- localized contact labels and form statuses;
- one POST to the exact Formspree endpoint;
- duplicate-submit prevention;
- success clears the form and shows confirmation;
- failure preserves values and shows a retry message;
- production output references `https://cowaysalescareer.my`.

Browser tests will intercept the Formspree request so automated verification
does not create fake applications in the real Formspree account. The final
manual check will use one clearly labelled test application after deployment,
then confirm it appears in Formspree and the notification email arrives.
