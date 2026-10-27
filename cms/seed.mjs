import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
const data = JSON.parse(
  readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
);
const types = {
  services: "service",
  principles: "principle",
  process: "processStep",
  plans: "managementPlan",
  features: "planFeature",
  addons: "addon",
  faqs: "faq",
  seo: "pageSeo",
};
function keys(value, parent = "") {
  if (Array.isArray(value))
    return value.map((v) =>
      typeof v === "object" && v
        ? { _key: randomUUID(), _type: types[parent], ...keys(v) }
        : v,
    );
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, keys(v, k)]),
    );
  return value;
}
writeFileSync(
  new URL("./seed.ndjson", import.meta.url),
  JSON.stringify({ _id: "siteContent", _type: "siteContent", ...keys(data) }) +
    "\n",
);
console.log(
  "Created cms/seed.ndjson. Import once into an empty dataset; do not replace edited production content.",
);
