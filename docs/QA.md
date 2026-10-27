# Valore quality review

Tested locally on 25 October 2026 (Toronto time) against the Next.js production build.

## Results

- Website production build: passed with Next.js 16.4.3 and React 19.3.1.
- Website TypeScript: passed, including browser test source.
- Playwright: **17 passed** in the final run. Chromium was run headlessly.
- Seven routes checked at **320, 375, 390, 768, 1024, 1440 and 1920px**. No page-level horizontal overflow detected. The pricing comparison intentionally scrolls inside its labelled region.
- Axe scans on every route: no violations in the configured WCAG A/AA tags through 2.2. This is automated evidence, not a WCAG certification.
- Main browser checks: page headings/metadata; loaded images; client errors; mobile dialog and Escape/focus return; FAQ disclosure; service selection; package and service preselection; minimum and percentage fee calculations; invalid rental values; quote/contact validation; real unavailable-delivery feedback and retained data; mocked confirmation/loading state; reduced motion; safe POST form method without JavaScript; internal links, sitemap, robots and social image.
- Isolated server integration: provider acceptance, retry, provider rejection, connection interruption and rate limiting passed against a local fetch fixture. No real email was sent. The public preview correctly reports that delivery is not connected.
- Sanity editor: TypeScript and production bundle build passed using Node 22. Studio runtime content publication and authentication require an actual Sanity project and were not tested against a live account. Initial content validates against the shared schema.
- Design detector: no mechanical findings. Design document linter reported no errors and one format warning because the design system is Markdown without YAML frontmatter.

## Measured homepage performance

Local Lighthouse 12.8.2, simulated mobile throttling:

| Category / metric | Result |
|---|---|
| Performance | 91 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 |
| First contentful paint | 0.9 s |
| Largest contentful paint | 3.4 s |
| Cumulative layout shift | 0 |
| Total blocking time | 100 ms |

SEO is deliberately reduced by the local `noindex` configuration. The remaining scored SEO checks pass. A verified `SITE_URL` enables indexing when deployed; this preview has no production domain. These are local lab results, not field Core Web Vitals or a promise of deployed scores. LCP still has room for improvement on a real hosting/network profile. The full report is [qa/lighthouse-mobile.html](qa/lighthouse-mobile.html), with machine-readable summary in [qa/lighthouse-summary.json](qa/lighthouse-summary.json).

The first mobile audit measured 87 performance, 100 accessibility, 100 best practices and 61 SEO. Optimizations replaced three TTF font downloads with two Latin WOFF2 files, increased hero loading priority, fixed logo label text spacing and replaced generic service link labels. The final report supersedes that initial run. Font transfer and asset prioritization changes preserved the chosen typography and imagery.

## Visual evidence

`docs/screenshots` contains full-page desktop (1440px) and mobile (390px) captures for every route, plus a 320px opening, reduced-motion capture, and desktop/mobile hero opening/midpoint/exit samples. The [contact sheet](screenshots/review-contact-sheet.jpg) compares the route openings. Desktop and mobile composition, header, typography, forms, pricing and footer were reviewed from actual captures.

## Issues found and fixed

- Small-screen table accessibility spans escaped their scroll container and caused document overflow. Positioning the labelled scroll region contains them correctly.
- Local API origin validation originally used the internal `0.0.0.0` bind address. It now compares the browser origin with the request host locally and the configured canonical origin when supplied.
- Homepage title did not inherit the layout title template at the same route level. Page titles are now explicit.
- Mobile form columns were too narrow for comfortable entry. Contact and property inputs now stack at mobile widths.
- An adjacent homepage photo repeated. The service composition now opens with a different image.
- Screen-reader logo spacing and generic service links were refined after Lighthouse findings.
- Build cache retained a removed font reference during optimization. A clean production rebuild passed, and repeated final browser checks use that build.

## Environment and limits

The machine's Chromium needed `libgbm`; an existing extracted local library was used through `LD_LIBRARY_PATH`, without changing OS packages. Standard machines can use `npx playwright install --with-deps chromium` as appropriate for their environment. The current Playwright configuration can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for a specific local browser; otherwise Playwright uses its own installed Chromium.

No public deployment, domain registration, CRM mutation, business contact publication or real notification delivery was performed. Complete the business and provider items in [LAUNCH.md](LAUNCH.md) before accepting public enquiries.
