# Formspree Application Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the multilingual recruitment application form send validated applications, including a required contact number, to the approved Formspree endpoint.

**Architecture:** Keep validation in the existing `src/application/schema.ts` boundary and keep DOM behaviour in `src/scripts/application.ts`. The browser sends JSON-acceptable form data to Formspree with `fetch`; localized content controls every visible state. GitHub Pages remains static and never stores applicant data.

**Tech Stack:** Astro, TypeScript, Vitest, Playwright, Formspree, GitHub Actions

## Global Constraints

- Endpoint: `https://formspree.io/f/xvzebykj`.
- Production origin: `https://cowaysalescareer.my`.
- Contact number is required, 8 to 20 characters, contains at least 8 digits, and permits digits, spaces, `+`, hyphens, and parentheses.
- Keep English, Bahasa Malaysia, and Simplified Chinese localized.
- Clear the form only after Formspree confirms success.
- Preserve answers after network or non-success responses.
- Automated tests must intercept network requests and must not create real Formspree submissions.
- Applicant information must never be written to GitHub, build logs, or analytics.

---

### Task 1: Contact-number validation and localized field

**Files:**
- Modify: `src/application/schema.ts`
- Modify: `src/application/content.ts`
- Modify: `src/components/ApplicationForm.astro`
- Test: `tests/unit/application.test.ts`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: existing `ApplicationData`, `ApplicationField`, `ValidationResult`, and localized `Copy`.
- Produces: required `contactNumber: string` in `ApplicationData` and the rendered `name="contactNumber"` input.

- [ ] **Step 1: Write failing schema tests**

Add tests that assert a missing number returns `REQUIRED`, `012-345 6789` and
`+60 12-345 6789` are accepted, and malformed or seven-digit values return
`INVALID_PHONE`.

```ts
expect(validateApplication({ ...validApplication, contactNumber: "" })).toEqual(
  expect.objectContaining({ valid: false, errors: expect.objectContaining({ contactNumber: "REQUIRED" }) }),
);
expect(validateApplication({ ...validApplication, contactNumber: "+60 12-345 6789" }).valid).toBe(true);
expect(validateApplication({ ...validApplication, contactNumber: "1234567" })).toEqual(
  expect.objectContaining({ valid: false, errors: expect.objectContaining({ contactNumber: "INVALID_PHONE" }) }),
);
```

- [ ] **Step 2: Run the unit test and verify RED**

Run:

```powershell
pnpm vitest run tests/unit/application.test.ts
```

Expected: failure because `contactNumber` and `INVALID_PHONE` do not exist.

- [ ] **Step 3: Implement minimal schema validation**

Add `contactNumber` to `ApplicationData`, add `INVALID_PHONE` to
`ValidationErrorCode`, and validate with:

```ts
const contactNumber = typeof value.contactNumber === "string" ? value.contactNumber : "";
const contactDigits = contactNumber.replace(/\D/g, "");
if (!contactNumber) errors.contactNumber = "REQUIRED";
else if (
  contactNumber.length < 8 ||
  contactNumber.length > 20 ||
  !/^[+\d\s()-]+$/.test(contactNumber) ||
  contactDigits.length < 8
) errors.contactNumber = "INVALID_PHONE";
```

- [ ] **Step 4: Add localized copy and field markup**

Add `contactNumber` to each locale’s `labels`, add `INVALID_PHONE` to each
locale’s `errors`, update preview/privacy copy to describe active recruitment
submission, and render:

```astro
<div class="form-field">
  <label for="application-contact">{required(copy.labels.contactNumber)} <span aria-hidden="true">*</span></label>
  <input
    id="application-contact"
    name="contactNumber"
    type="tel"
    required
    minlength="8"
    maxlength="20"
    autocomplete="tel"
    inputmode="tel"
    aria-describedby="contactNumber-error"
  />
  <p id="contactNumber-error" class="field-error" data-error-for="contactNumber"></p>
</div>
```

- [ ] **Step 5: Update localized E2E assertions and verify GREEN**

Expect nine visible labels and the localized contact label in each locale.

Run:

```powershell
pnpm vitest run tests/unit/application.test.ts
```

Expected: all application unit tests pass.

- [ ] **Step 6: Commit Task 1**

```powershell
git add src/application/schema.ts src/application/content.ts src/components/ApplicationForm.astro tests/unit/application.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: require applicant contact number"
```

---

### Task 2: Formspree transport and applicant feedback

**Files:**
- Modify: `src/application/schema.ts`
- Modify: `src/application/content.ts`
- Modify: `src/components/ApplicationForm.astro`
- Modify: `src/scripts/application.ts`
- Test: `tests/unit/application.test.ts`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: validated `ApplicationData` from Task 1.
- Produces: `submitApplication(data, fetcher?)` returning `{ ok: true }` or `{ ok: false }`, and localized success/failure UI.

- [ ] **Step 1: Write failing transport tests**

Test the endpoint, POST method, headers, body, successful response, and rejected
response using an injected real-function fake:

```ts
const fetcher = vi.fn(async () => new Response("{}", { status: 200 }));
const response = await submitApplication(validApplication, fetcher);
expect(response).toEqual({ ok: true });
expect(fetcher).toHaveBeenCalledWith(
  "https://formspree.io/f/xvzebykj",
  expect.objectContaining({ method: "POST", headers: expect.objectContaining({ Accept: "application/json" }) }),
);
```

- [ ] **Step 2: Run unit tests and verify RED**

Run:

```powershell
pnpm vitest run tests/unit/application.test.ts
```

Expected: failure because the current transport always returns
`SUBMISSION_NOT_CONFIGURED`.

- [ ] **Step 3: Implement minimal Formspree transport**

```ts
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvzebykj";

export async function submitApplication(
  data: ApplicationData | Record<string, unknown>,
  fetcher: typeof fetch = fetch,
) {
  try {
    const response = await fetcher(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: response.ok } as const;
  } catch {
    return { ok: false } as const;
  }
}
```

- [ ] **Step 4: Add honeypot and localized status copy**

Add hidden `_gotcha` markup that is inaccessible to keyboard and screen-reader
users. Replace `notConfigured` with `success` and `failure` in the localized
copy contract.

- [ ] **Step 5: Update submit-state DOM behaviour**

After response:

```ts
status.setAttribute("role", response.ok ? "status" : "alert");
status.textContent = response.ok ? copy.success : copy.failure;
if (response.ok) form.reset();
```

Always restore the button text and enabled state after the request. Keep the
existing `submitting` guard so a second submit event creates no second request.

- [ ] **Step 6: Write E2E success and failure tests**

Use Playwright routing:

```ts
await page.route("https://formspree.io/f/xvzebykj", async (route) => {
  await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
});
```

Assert one POST, success copy, and cleared fields. In a separate test return
`500`, then assert failure copy and preserved fields.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```powershell
pnpm vitest run tests/unit/application.test.ts
pnpm build
pnpm playwright test tests/e2e/landing.spec.ts
```

Expected: all focused tests pass without contacting Formspree.

- [ ] **Step 8: Commit Task 2**

```powershell
git add src/application/schema.ts src/application/content.ts src/components/ApplicationForm.astro src/scripts/application.ts tests/unit/application.test.ts tests/e2e/landing.spec.ts
git commit -m "feat: submit applications through Formspree"
```

---

### Task 3: Production-domain metadata

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `README.md`
- Test: `tests/unit/deployment.test.ts`
- Test: `tests/unit/production.test.ts`

**Interfaces:**
- Consumes: `PUBLIC_SITE_URL` in `astro.config.mjs`.
- Produces: production builds whose canonical URLs, sitemap, and robots entries use `https://cowaysalescareer.my`.

- [ ] **Step 1: Write failing deployment assertions**

Assert the workflow includes:

```text
PUBLIC_SITE_URL: https://cowaysalescareer.my
```

and no longer contains `https://jayd3n7117.github.io`.

- [ ] **Step 2: Run deployment tests and verify RED**

Run:

```powershell
pnpm vitest run tests/unit/deployment.test.ts tests/unit/production.test.ts
```

Expected: failure because the workflow still uses the GitHub hostname.

- [ ] **Step 3: Update production configuration and launch documentation**

Change the workflow environment to:

```yaml
PUBLIC_SITE_URL: https://cowaysalescareer.my
```

Update README statements that still claim form submission is intentionally
disabled, replacing them with the Formspree dashboard/email workflow and the
30-day free-plan dashboard-retention reminder.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
pnpm vitest run tests/unit/deployment.test.ts tests/unit/production.test.ts
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
```

Expected: tests and production build pass; generated canonical URLs use the
custom domain.

- [ ] **Step 5: Commit Task 3**

```powershell
git add .github/workflows/deploy.yml README.md tests/unit/deployment.test.ts tests/unit/production.test.ts
git commit -m "chore: use production recruitment domain"
```

---

### Task 4: Full verification and publication

**Files:**
- Verify all files changed in Tasks 1–3.

**Interfaces:**
- Consumes: completed form, transport, and production configuration.
- Produces: pushed `master` deployment and one verified manual Formspree test.

- [ ] **Step 1: Run the full automated verification**

```powershell
pnpm test
pnpm check
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm test:e2e
```

Expected: every command exits `0`.

- [ ] **Step 2: Inspect repository scope**

```powershell
git status --short
git diff --check
git log -5 --oneline
```

Expected: no unrelated changes and no whitespace errors.

- [ ] **Step 3: Push the completed commits**

```powershell
git push origin master
```

Expected: GitHub accepts the push and starts the Pages deployment workflow.

- [ ] **Step 4: Confirm deployment**

Check the GitHub Actions `Deploy to GitHub Pages` workflow and verify the
deployment completes successfully. If the custom domain is still awaiting DNS,
the GitHub-hosted fallback URL may be used to inspect the deployed form.

- [ ] **Step 5: Perform one manual application test**

Submit a clearly labelled test record such as `TEST - Codex deployment check`,
confirm the localized success message, confirm the row appears in Formspree,
and confirm the notification email arrives. Delete the test entry afterward.
