# Editing Valore content

## For the business owner

After the one-time project connection below, open the hosted Sanity Studio and sign in with your invited account. Select **Valore website**. Use the tabs for Contact & area, Home, About, Services, Pricing, FAQs and Search & sharing. Fields are normal text boxes, checkboxes and image upload controls; changing source code is not required.

1. Edit the field you need. Preview contacts should stay enabled until actual monitored business contacts are entered.
2. For photos, use the image-upload field; this overrides the local fallback path. Keep fallback paths unchanged. Update the image alternative text to match the photograph and confirm usage rights.
3. Check the preview of your text and save with **Publish**. Open the website again after about 60 seconds. A cached page may need a refresh after this interval.
4. If the document fails validation, address the listed fields before publishing. Do not remove/reorder the three plans or rename their IDs. Use 0.055 for 5.5% and 0.075 for 7.5%; minimum fees are entered in dollars.
5. A plan feature has an **Included** checkbox per plan. The annual inspection detail is a total (`1 per year`, `2 per year`). Prestige's total replaces Signature's count.
6. Review FAQ explanations when changing fees or operational terms. The price cards, feature table and calculator update together, while FAQ prose is intentionally separately editable.

You can review Sanity's document history before restoring earlier content. Image crops use cover fitting; check desktop and phone views after changing imagery. The provided Studio is deliberately a content tool, not a custom administration dashboard.

## One-time connection by the site maintainer

Sanity is optional for local preview, but connecting it is required for independent remote content publishing. Use a public dataset containing website copy only. Never store customer enquiries, credentials or private company records in it.

1. Create a Sanity project with a public `production` dataset and invite the owner with the appropriate editor role.
2. Use Node 22.12+ for `cms`. Copy `cms/.env.example` to `cms/.env`; set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
3. In `cms`, run `npx pnpm@10.34.9 install --frozen-lockfile`, then `npm run seed:file`. The standalone editor has its own pnpm lockfile; the website uses npm. Inspect the generated `seed.ndjson` and import it once using `npx sanity dataset import seed.ndjson production`. Do this only in a fresh dataset; do not overwrite edited content. Sign in via the Sanity CLI when prompted.
4. Run `npm run dev` in `cms` and open the returned Studio URL. The singleton document ID must remain `siteContent`. Test publication, validation and image uploads.
5. Run `npm run build` and `npm run deploy` in `cms` to publish the authenticated Studio to the chosen Sanity Studio hostname. Add the relevant Studio origins to the Sanity project's CORS settings with credentials. Access is governed by Sanity project membership; do not enable public write access.
6. Set `SANITY_PROJECT_ID` and `SANITY_DATASET` in the website's server environment and restart/redeploy it. Read queries use the public API and fetch only the published singleton; no write token is shipped to the browser.
7. Publish a harmless text change, wait approximately 60 seconds, and confirm it appears on the website. Restore it if it was only a connection test.

The Studio can be operated independently of website deployment. Business content updates do not require a new website build. Invalid or unavailable CMS content falls back to the validated local baseline; a configuration problem logs a generic message without content or personal information. Correct the CMS validation issue promptly so stale fallback content is not used unintentionally.

The site fetches Sanity image URLs using `next/image` and permits only `cdn.sanity.io` as a remote image source. A developer may extend this allowlist if a new approved source is genuinely required.

References: [Sanity schema documentation](https://www.sanity.io/docs/studio/schema-types), [Sanity data import](https://www.sanity.io/docs/content-lake/importing-data).
