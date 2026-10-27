import { z } from "zod";
const text = z.string().min(1);
const imagePath = text.refine(
  (v) =>
    v.startsWith("/images/") || /^https:\/\/cdn\.sanity\.io\/images\//.test(v),
  "Use a local image or a Sanity image URL.",
);
const feature = z.object({
  included: z.boolean().default(false),
  detail: z.string().default(""),
});
export const planSchema = z.object({
  id: z.enum(["core", "signature", "prestige"]),
  name: text,
  description: text,
  monthlyFee: z.number().min(0),
  rate: z.number().min(0).max(1),
  minimum: z.number().min(0),
  label: text,
  previewFeatures: z.array(text),
});
export const siteSchema = z
  .object({
    business: z.object({
      name: text,
      email: z.email(),
      phone: z.string().default(""),
      previewContacts: z.boolean(),
      area: text,
      coverage: text,
    }),
    home: z.object({
      heroTitle: text,
      heroDescription: text,
      heroImage: imagePath,
      heroImageAlt: text,
      introTitle: text,
      introDescription: text,
      introImage: imagePath,
      introImageAlt: text,
    }),
    about: z.object({
      title: text,
      description: text,
      mission: text,
      story: text,
      commitment: text,
    }),
    services: z
      .array(
        z.object({
          id: z.enum([
            "property-management",
            "leasing",
            "maintenance",
            "investment",
          ]),
          title: text,
          short: text,
          description: text,
          image: imagePath,
          imageAlt: text,
          details: z.array(text),
          cta: text,
          href: text.refine((v) => v.startsWith("/")),
        }),
      )
      .length(4),
    principles: z.array(z.object({ title: text, description: text })),
    process: z.array(z.object({ title: text, description: text })),
    pricing: z.object({
      plans: z.array(planSchema).length(3),
      features: z.array(
        z.object({
          id: text,
          label: text,
          core: feature,
          signature: feature,
          prestige: feature,
        }),
      ),
      addons: z.array(z.object({ name: text, price: text })),
      disclaimer: text,
    }),
    faqs: z.array(z.object({ question: text, answer: text })),
    seo: z.array(z.object({ path: text, title: text, description: text })),
  })
  .superRefine((site, ctx) => {
    if (
      site.pricing.plans.map((p) => p.id).join(",") !==
      "core,signature,prestige"
    )
      ctx.addIssue({
        code: "custom",
        message: "Keep plans ordered Core, Signature, Prestige.",
      });
    const ids = new Set(site.pricing.features.map((f) => f.id));
    for (const plan of site.pricing.plans) {
      if (plan.previewFeatures.some((id) => !ids.has(id)))
        ctx.addIssue({
          code: "custom",
          message:
            "Every preview feature must reference an existing feature ID.",
        });
      if (
        plan.id === "core"
          ? plan.monthlyFee <= 0 || plan.rate !== 0
          : plan.monthlyFee !== 0 || plan.rate <= 0 || plan.minimum <= 0
      )
        ctx.addIssue({
          code: "custom",
          message:
            "Core requires a flat fee; percentage plans require a rate and minimum.",
        });
    }
    for (const f of site.pricing.features) {
      if (
        (f.core.included && !f.signature.included) ||
        (f.signature.included && !f.prestige.included)
      )
        ctx.addIssue({
          code: "custom",
          message: `${f.label}: higher plans must include the lower plan's services.`,
        });
    }
  });
export type SiteContent = z.infer<typeof siteSchema>;
export type Plan = z.infer<typeof planSchema>;
export type PlanId = Plan["id"];
