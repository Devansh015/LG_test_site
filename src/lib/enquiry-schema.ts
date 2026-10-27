import { z } from "zod";
export const serviceOptions = [
  ["property-management", "Property management"],
  ["leasing", "Tenant placement"],
  ["maintenance", "Maintenance coordination"],
  ["investment", "Investment property services"],
  ["not-sure", "Not sure / need advice"],
] as const;
export const propertyTypes = [
  "Condominium",
  "Single-family home",
  "Townhouse",
  "Multi-unit residential",
  "Other",
] as const;
export const enquirySchema = z
  .object({
    kind: z.enum(["quote", "contact"]),
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(120, "Use 120 characters or fewer."),
    email: z.email("Enter a valid email address.").max(200),
    phone: z
      .string()
      .trim()
      .max(40)
      .refine(
        (v) =>
          v === "" ||
          (/^[+\d\s().-]+$/.test(v) &&
            v.replace(/\D/g, "").length >= 10 &&
            v.replace(/\D/g, "").length <= 15),
        "Enter a phone number with 10 to 15 digits.",
      ),
    contactMethod: z.enum(["", "email", "phone"]),
    city: z.string().trim().max(150),
    propertyType: z.enum(["", ...propertyTypes]),
    units: z.string().max(6),
    monthlyRent: z
      .string()
      .max(16)
      .refine(
        (v) =>
          !v ||
          (/^\d+(\.\d{1,2})?$/.test(v) &&
            Number(v) > 0 &&
            Number(v) <= 10000000),
        "Enter a positive amount up to $10,000,000, or leave this blank.",
      ),
    occupancy: z.enum([
      "",
      "occupied",
      "vacant",
      "partially-occupied",
      "not-sure",
    ]),
    services: z
      .array(
        z.enum([
          "property-management",
          "leasing",
          "maintenance",
          "investment",
          "not-sure",
        ]),
      )
      .max(5),
    package: z.enum(["core", "signature", "prestige", "not-sure"]),
    message: z.string().trim().max(4000, "Use 4,000 characters or fewer."),
    consent: z
      .boolean()
      .refine((v) => v, "Please consent so we can respond to your enquiry."),
    website: z.string().max(200),
    startedAt: z.number().finite().positive(),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "quote") {
      if (!value.phone)
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Enter your phone number.",
        });
      if (value.city.length < 2)
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "Enter your property’s city or location.",
        });
      if (!value.propertyType)
        ctx.addIssue({
          code: "custom",
          path: ["propertyType"],
          message: "Choose a property type.",
        });
      if (!/^[1-9]\d*$/.test(value.units) || Number(value.units) > 100000)
        ctx.addIssue({
          code: "custom",
          path: ["units"],
          message: "Enter a whole number from 1 to 100,000.",
        });
      if (!value.services.length)
        ctx.addIssue({
          code: "custom",
          path: ["services"],
          message: "Choose a service, or select “Not sure”.",
        });
    } else if (value.message.length < 10)
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Tell us a little more (at least 10 characters).",
      });
  });
export type Enquiry = z.infer<typeof enquirySchema>;
