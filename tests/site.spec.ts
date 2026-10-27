import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { managementFee } from "../src/lib/pricing";
import { siteSchema } from "../src/lib/content-schema";
import { enquirySchema } from "../src/lib/enquiry-schema";
import defaults from "../content/site.json";
import { mkdirSync } from "node:fs";

const routes = [
  "/",
  "/about",
  "/services",
  "/pricing",
  "/contact",
  "/get-a-quote",
  "/privacy-policy",
];
const widths = [320, 375, 390, 768, 1024, 1440, 1920];
for (const route of routes) {
  test(`${route} renders accessibly at every requested width`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Valore Property Group/);
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      await expect(image).not.toHaveJSProperty("naturalWidth", 0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} overflow at ${width}`,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        mkdirSync("docs/screenshots", { recursive: true });
        await page.screenshot({
          path: `docs/screenshots/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
    await page.setViewportSize({ width: 1440, height: 900 });
    const a11y = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22a",
        "wcag22aa",
      ])
      .analyze();
    expect(a11y.violations).toEqual([]);
  });
}
test("navigation, mobile dialog and keyboard focus work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Pricing", exact: true })
    .click();
  await expect(page).toHaveURL("/pricing");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Exceptional care. Clear pricing." }),
  ).toBeVisible();
});
test("FAQ and service selection expose actual content and preserve intent", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Leasing & Tenant Placement", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Discuss this service" }),
  ).toHaveAttribute("href", "/get-a-quote?service=leasing");
  await page
    .getByText("How often is my property inspected?", { exact: true })
    .click();
  await expect(page.locator("details[open]")).toContainText(
    "two per year in total",
  );
  await page.getByRole("link", { name: "Discuss this service" }).click();
  await fillContact(page);
  await page
    .getByRole("button", { name: "Your property", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", { name: "Tenant placement", exact: true }),
  ).toBeChecked();
});
test("calculator applies minimums, percentage fees and rejects invalid rents", async ({
  page,
}) => {
  await page.goto("/pricing");
  const field = page.getByLabel("Monthly rental income (CAD)", { exact: true });
  const results = page.locator(".estimate-results");
  await expect(results).toContainText("$159.00");
  await expect(results).toContainText("$179.00");
  await expect(results).toContainText("$269.00");
  await field.fill("5000");
  await expect(results).toContainText("$275.00");
  await expect(results).toContainText("$375.00");
  for (const value of ["-100", "0", "", "10000001"]) {
    await field.fill(value);
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(results).not.toContainText("$159");
  }
  await field.fill("3000");
  await expect(field).toHaveAttribute("aria-invalid", "false");
  const row = page.getByRole("row").filter({
    has: page.getByRole("rowheader", {
      name: "Property inspections (annual total)",
      exact: true,
    }),
  });
  await expect(row).toContainText("1 per year");
  await expect(row).toContainText("2 per year");
});
async function fillContact(page: import("@playwright/test").Page) {
  await page.getByLabel("Full name *", { exact: true }).fill("Preview Owner");
  await page
    .getByLabel("Email address *", { exact: true })
    .fill("owner@example.com");
  await page.getByLabel("Phone number *", { exact: true }).fill("4165550132");
}
test("quote validation, package preselection and real unavailable delivery are honest", async ({
  page,
}) => {
  await page.goto("/pricing");
  await page
    .getByRole("link", { name: "Choose Signature", exact: true })
    .click();
  await expect(page).toHaveURL("/get-a-quote?package=signature");
  await page
    .getByRole("button", { name: "Your property", exact: true })
    .click();
  await expect(
    page.getByText("Enter your full name.", { exact: true }),
  ).toBeVisible();
  await fillContact(page);
  await page
    .getByRole("button", { name: "Your property", exact: true })
    .click();
  await expect(
    page.getByRole("radio", { name: "Signature", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Request My Free Quote", exact: true })
    .click();
  await expect(
    page.getByText("Enter your property’s city or location.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Property city / location *").fill("Toronto");
  await page.getByLabel("Property type *").selectOption("Condominium");
  await page
    .getByRole("checkbox", { name: "Property management", exact: true })
    .check();
  await page.getByRole("checkbox", { name: /I agree that/ }).check();
  await page.waitForTimeout(2100);
  await page
    .getByRole("button", { name: "Request My Free Quote", exact: true })
    .click();
  await expect(page.locator(".form-notice[role=alert]")).toContainText(
    "Your details have not been sent",
  );
  await expect(page.getByLabel("Property city / location *")).toHaveValue(
    "Toronto",
  );
});
test("contact validation and confirmation state recover correctly", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(
    page.getByText("Enter your full name.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Full name *", { exact: true }).fill("Preview Owner");
  await page
    .getByLabel("Email address *", { exact: true })
    .fill("owner@example.com");
  await page
    .getByLabel("Your message *")
    .fill("Please discuss management options.");
  await page.getByRole("checkbox", { name: /I agree that/ }).check();
  await page.route("**/api/enquiries", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Received by test fixture" }),
    });
  });
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Sending enquiry…" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is with us." }),
  ).toBeVisible();
});
test("API rejects untrusted origin, invalid content, honeypot and unconfigured delivery", async ({
  request,
}) => {
  const base = {
    kind: "contact",
    fullName: "Preview Owner",
    email: "owner@example.com",
    phone: "",
    contactMethod: "",
    city: "",
    propertyType: "",
    units: "1",
    monthlyRent: "",
    occupancy: "",
    services: [],
    package: "not-sure",
    message: "A test enquiry only.",
    consent: true,
    website: "",
    startedAt: Date.now() - 5000,
  };
  const post = (data: unknown, origin = "http://localhost:3000") =>
    request.post("/api/enquiries", {
      data,
      headers: {
        Origin: origin,
        "Idempotency-Key": "12345678-1234-1234-1234-123456789012",
      },
    });
  expect((await post(base, "https://untrusted.example")).status()).toBe(403);
  expect((await post({ ...base, email: "invalid" })).status()).toBe(422);
  expect((await post({ ...base, website: "spam" })).status()).toBe(400);
  expect((await post({ ...base, startedAt: Date.now() })).status()).toBe(400);
  const unconfigured = await post(base);
  expect(unconfigured.status()).toBe(503);
  expect(await unconfigured.text()).toContain("not been sent");
});
test("single pricing source is correct at boundaries", () => {
  const c = siteSchema.parse(defaults);
  const [core, signature, prestige] = c.pricing.plans;
  expect(
    [core, signature, prestige].map((p) => managementFee(3000, p)),
  ).toEqual([159, 179, 269]);
  expect(managementFee(5000, signature)).toBe(275);
  expect(managementFee(5000, prestige)).toBe(375);
  for (const rent of [-1, 0, NaN, Infinity, 10000001])
    expect(() => managementFee(rent, signature)).toThrow();
  expect(c.pricing.addons.map((a) => a.price)).toEqual([
    "60% of one month's rent",
    "$129",
    "$179",
    "$129",
    "$129",
    "Starting at $199",
    "4–7% of project cost",
  ]);
  expect(enquirySchema.safeParse({}).success).toBe(false);
});
test("reduced motion and no-JavaScript keep content and safe form methods", async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page
      .locator(".hero-photo")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.screenshot({
    path: "docs/screenshots/home-reduced-motion.png",
    fullPage: true,
  });
  await context.close();
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await plain.newPage();
  await nojs.goto("/get-a-quote");
  await expect(nojs.locator("form")).toHaveAttribute("method", "post");
  expect(
    await nojs
      .locator("form")
      .evaluate((el) => (el as HTMLFormElement).innerText),
  ).toContain("JavaScript is required");
  await plain.close();
});
test("SEO, assets and all internal link targets resolve", async ({
  page,
  request,
}) => {
  const paths = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      new RegExp(`localhost:3000${route === "/" ? "/?" : route}$`),
    );
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((l) => l.getAttribute("href")!));
    hrefs.forEach((h) => paths.add(h.split(/[?#]/)[0]));
  }
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/opengraph-image")).status()).toBe(200);
});
