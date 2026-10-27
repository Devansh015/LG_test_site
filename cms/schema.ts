import {
  defineType,
  defineField,
  type FieldDefinition,
} from "sanity";
import defaults from "../content/site.json";
import { siteSchema } from "../src/lib/content-schema";
const string = (
  name: string,
  title: string,
  description?: string,
): FieldDefinition =>
  defineField({
    name,
    title,
    type: "string",
    description,
    validation: (r) => r.required(),
  });
const prose = (name: string, title: string): FieldDefinition =>
  defineField({
    name,
    title,
    type: "text",
    rows: 3,
    validation: (r) => r.required(),
  });
const object = (
  name: string,
  title: string,
  fields: FieldDefinition[],
): FieldDefinition =>
  defineField({
    name,
    title,
    type: "object",
    fields,
    options: { collapsible: true, collapsed: false },
  });
const stringList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }] });
const list = (
  name: string,
  title: string,
  member: string,
  fields: FieldDefinition[],
  previewField = "title",
): FieldDefinition =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
        name: member,
        type: "object",
        fields,
        preview: { select: { title: previewField } },
      },
    ],
  });
const inclusion = (name: string) =>
  object(name, name[0].toUpperCase() + name.slice(1), [
    defineField({
      name: "included",
      title: "Included",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "detail",
      title: "Detail / annual total",
      type: "string",
      initialValue: "",
      description:
        "For inspections use the total, e.g. 2 per year. Leave blank for ordinary included services.",
    }),
  ]);
const priceFields: FieldDefinition[] = [
  list(
    "plans",
    "Management plans",
    "managementPlan",
    [
      defineField({
        name: "id",
        title: "Plan ID",
        type: "string",
        readOnly: true,
      }),
      string("name", "Name"),
      prose("description", "Description"),
      defineField({
        name: "monthlyFee",
        title: "Flat fee (CAD)",
        type: "number",
        description: "Core only. Use 0 for percentage plans.",
        validation: (r) => r.required().min(0),
      }),
      defineField({
        name: "rate",
        title: "Monthly rent rate",
        type: "number",
        description: "Use 0.055 for 5.5%, 0.075 for 7.5%, and 0 for Core.",
        validation: (r) => r.required().min(0).max(1),
      }),
      defineField({
        name: "minimum",
        title: "Monthly minimum (CAD)",
        type: "number",
        description: "Use 0 for Core.",
        validation: (r) => r.required().min(0),
      }),
      string("label", "Plan label"),
      stringList("previewFeatures", "Preview feature IDs"),
    ],
    "name",
  ),
  list(
    "features",
    "Feature comparison",
    "planFeature",
    [
      defineField({
        name: "id",
        title: "Feature ID",
        type: "string",
        readOnly: true,
      }),
      string("label", "Service name"),
      inclusion("core"),
      inclusion("signature"),
      inclusion("prestige"),
    ],
    "label",
  ),
  list(
    "addons",
    "Additional services",
    "addon",
    [string("name", "Service"), string("price", "Price / basis")],
    "name",
  ),
  prose("disclaimer", "Separate-cost disclaimer"),
];
export const siteContent = defineType({
  name: "siteContent",
  title: "Valore website",
  type: "document",
  initialValue: defaults,
  groups: [
    { name: "brand", title: "Contact & area" },
    { name: "home", title: "Home" },
    { name: "about", title: "About" },
    { name: "services", title: "Services" },
    { name: "pricing", title: "Pricing" },
    { name: "faqs", title: "FAQs" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    {
      ...object("business", "Business details", [
        string("name", "Business name"),
        string("email", "Enquiry email"),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({
          name: "previewContacts",
          title: "These are preview contact details",
          type: "boolean",
          description:
            "Keep enabled until verified public contacts have been added.",
        }),
        string("area", "Service area"),
        prose("coverage", "Coverage conditions"),
      ]),
      group: "brand",
    },
    {
      ...object("home", "Homepage", [
        prose("heroTitle", "Hero heading (new line between phrases)"),
        prose("heroDescription", "Hero description"),
        string("heroImage", "Fallback hero image path"),
        string("heroImageAlt", "Hero image alternative text"),
        defineField({
          name: "heroAsset",
          title: "Hero image upload",
          type: "image",
          options: { hotspot: true },
          description:
            "Optional. Overrides fallback image. Use legally reusable Toronto photography.",
        }),
        prose("introTitle", "Introduction heading"),
        prose("introDescription", "Introduction description"),
        string("introImage", "Fallback introduction image path"),
        defineField({
          name: "introAsset",
          title: "Introduction image upload",
          type: "image",
          options: { hotspot: true },
        }),
        string("introImageAlt", "Introduction image alternative text"),
      ]),
      group: "home",
    },
    {
      ...object("about", "About content", [
        prose("title", "Page heading"),
        prose("description", "Introduction"),
        prose("mission", "Mission"),
        prose("story", "Owner perspective"),
        prose("commitment", "Commitment"),
      ]),
      group: "about",
    },
    {
      ...list("services", "Services", "service", [
        defineField({
          name: "id",
          title: "Service ID",
          type: "string",
          readOnly: true,
        }),
        string("title", "Service name"),
        string("short", "Short benefit"),
        prose("description", "Description"),
        string("image", "Fallback image path"),
        defineField({
          name: "imageAsset",
          title: "Image upload",
          type: "image",
          options: { hotspot: true },
        }),
        string("imageAlt", "Image alternative text"),
        stringList("details", "Service details"),
        string("cta", "Action label"),
        string("href", "Action path"),
      ]),
      group: "services",
    },
    {
      ...list("principles", "Management principles", "principle", [
        string("title", "Title"),
        prose("description", "Description"),
      ]),
      group: "home",
    },
    {
      ...list("process", "Owner journey", "processStep", [
        string("title", "Step title"),
        prose("description", "Description"),
      ]),
      group: "home",
    },
    { ...object("pricing", "Pricing", priceFields), group: "pricing" },
    {
      ...list(
        "faqs",
        "Frequently asked questions",
        "faq",
        [string("question", "Question"), prose("answer", "Answer")],
        "question",
      ),
      group: "faqs",
    },
    {
      ...list(
        "seo",
        "Page search metadata",
        "pageSeo",
        [
          defineField({
            name: "path",
            title: "Page path",
            type: "string",
            readOnly: true,
          }),
          string("title", "Page title"),
          prose("description", "Meta description"),
        ],
        "path",
      ),
      group: "seo",
    },
  ],
  validation: (r) =>
    r.custom((value) => {
      const result = siteSchema.safeParse(value);
      return result.success
        ? true
        : `Content needs attention: ${result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .slice(0, 4)
            .join("; ")}`;
    }),
  preview: {
    prepare: () => ({
      title: "Valore Property Group",
      subtitle: "Website content, services and pricing",
    }),
  },
});
