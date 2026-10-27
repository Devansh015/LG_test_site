# Valore Property Group

Complete Next.js App Router site for a GTA-focused residential property management company. Seven public routes, responsive navigation, pricing comparison and calculator, two-step quote funnel, contact form, server-side delivery integration, and a standalone Sanity content editor.

## Run locally

Node 20.9+ and npm are needed for the website. Node 22.12+ is required for the optional current Sanity Studio; Node 22 LTS is recommended for deployment.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No credentials are needed. Contact details are deliberately non-identifying preview details, and unconfigured forms report that information has **not** been sent. No domain has been purchased or configured. Local pages are marked noindex.

```bash
npm run typecheck
npm run build
npm run start
npm test
```

Playwright uses an installed Chromium where available; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can override the browser location. Otherwise run `npx playwright install chromium`. The test runner starts the production server if none is running; build first. Avoid running a dev server during production QA. Screenshots are saved under `docs/screenshots`; the HTML test report is generated under `playwright-report`.

The completed verification and measured local Lighthouse results are in [docs/QA.md](docs/QA.md).

## Project map

- `src/app` — all pages, metadata routes, social image and secure enquiry endpoint.
- `src/components` — layout, CTA, forms, service selector, pricing and accessible interactions.
- `src/lib` — content validation and fetching, pricing, enquiry schema, SEO and rate limiting.
- `content/site.json` — validated initial content and fallback if the CMS is unavailable.
- `cms` — separate Sanity Studio, schema and initial-data generator.
- `DESIGN.md` — visual tokens and component rules.
- `docs/CONTENT-EDITING.md` — owner and setup instructions.
- `docs/LAUNCH.md` — required business details and connection steps.
- `docs/ASSETS.md` — image and font source/licence information.
- `tests` — browser and domain checks.

## Form delivery

Copy `.env.example` to `.env.local`. Set `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender), and `EMAIL_TO`. The server calls the Resend API over HTTPS. No secret is prefixed `NEXT_PUBLIC`, returned to the browser or written to enquiry logs. Success is shown only after the provider returns a message ID. This confirms provider acceptance, not guaranteed inbox delivery; monitor bounces and provider logs.

The endpoint validates the same schema as the client, restricts origins, limits payload size, checks a honeypot and elapsed form time, and rate limits enabled deliveries. It uses idempotency keys when calling Resend so a failed network response can be retried without sending duplicate emails. Input is sent as plain text. No application enquiry database is created.

For real production submissions, configure `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, a random `RATE_LIMIT_SALT`, and the verified `SITE_URL`. Five submission attempts per hour per hashed address are allowed. The rate limiter fails closed when its provider is unavailable. `ALLOW_LOCAL_TEST_FORMS=true` permits the process-local fallback only for isolated local production builds; leave it unset on public deployments. On Vercel the platform client-IP header is used. On another trusted proxy, set `TRUST_PROXY=true` only if that proxy overwrites `x-real-ip`; otherwise a shared bucket is used. Do not trust arbitrary forwarded client headers.

## Content management

The owner edits a single **Valore website** document in Sanity Studio using labelled fields. It covers homepage text/images, about content, services, fees, add-ons, FAQs, contact details, coverage and page SEO. Publishing updates the site cache within approximately 60 seconds. Configuration and seed instructions are in [docs/CONTENT-EDITING.md](docs/CONTENT-EDITING.md). Sanity project credentials are not yet provided; the complete local site uses the initial content meanwhile.

Management rates and features have a single validated source. Cards, comparison and estimator read the same data. Higher-plan service inheritance is validated. Annual inspection counts are stored as totals. When changing business pricing, review separately editable FAQ wording and final service terms too.

## Deployment and maintenance

Vercel: import the repository, use the Next.js preset, root directory `.`, and set the production environment variables. The CMS is a separate application and should not be included in the website build. Any Node hosting supporting `next start` also works. Never use a static export: the enquiry endpoint and CMS revalidation require a server.

Set `SITE_URL` only to the actual public HTTPS domain. It supplies canonical, sitemap and organization URLs and enables indexing. Connect verified contact details, disable preview contact mode, review the privacy draft, and test an actual email before accepting public enquiries. See [docs/LAUNCH.md](docs/LAUNCH.md).

Run the build and browser tests after changing dependencies, pricing, forms, navigation or styles. Back up/export CMS content, review provider delivery failures, monitor hosting errors, and keep dependencies on patched stable releases. No analytics or advertising scripts are installed.
