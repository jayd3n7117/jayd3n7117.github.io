# Coway sales recruitment landing page

Static Astro landing page in English, Bahasa Malaysia, and Simplified Chinese, deployed through GitHub Pages with applications submitted through Formspree.

## Commands

Use Node.js 22 and pnpm. On managed Codex machines, `node` may not be on `PATH`; call the bundled Node executable directly or add its `bin` directory to `PATH` before running these exact commands.

```powershell
pnpm install
pnpm dev
pnpm test
pnpm check
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm build
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm preview
pnpm media
```

Run browser checks against a completed production build:

```powershell
$env:PUBLIC_SITE_URL='https://cowaysalescareer.my'; pnpm test:e2e
```

Localized page content lives in `src/content/locales.ts`; SEO metadata lives in `src/content/seo.ts`. Keep the commission disclosure explicit in every language: the role is fully commission-based, earnings vary, and no income is guaranteed. Never replace this with an earnings promise.

The application form submits to Formspree. New applications are available in the Formspree dashboard and sent to the configured notification email recipient. Formspree's free plan retains submissions in the dashboard for 30 days, so the recipient must export, archive, or otherwise process applications within that window according to the approved retention and deletion workflow.

## Launch gates

`PUBLIC_SITE_URL` is required for builds and must be the approved HTTPS production origin. A release remains blocked until all of these are explicitly approved:

- production domain and contact details;
- privacy notice, consent language, data owner, retention, and deletion workflow;
- secure form endpoint and recipient workflow;
- professional review of all English, Bahasa Malaysia, and Chinese translations;
- final media rights, selections, crops, and alt text;
- Coway brand and legal approval.

After approvals, rebuild with `PUBLIC_SITE_URL=https://cowaysalescareer.my`, run unit/check/build/E2E commands, inspect 390px and 1440px layouts, test keyboard navigation and reduced motion, and only then hand the static output to the approved hosting process.
