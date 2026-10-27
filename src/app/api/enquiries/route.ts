import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
const reply = (
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
) =>
  NextResponse.json(
    { message, ...extra },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "3600" } : {}),
      },
    },
  );
export async function POST(request: NextRequest) {
  const allowed = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : `${request.nextUrl.protocol}//${request.headers.get("host")}`;
  if (request.headers.get("origin") !== allowed)
    return reply(
      "This request could not be verified. Reload the page and try again.",
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply(
      "Enable JavaScript to validate and securely send this form.",
      415,
    );
  let raw: unknown;
  try {
    if (Number(request.headers.get("content-length")) > 20000)
      return reply(
        "Your enquiry is too long. Please shorten your message.",
        413,
      );
    const reader = request.body?.getReader();
    if (!reader) return reply("Add your enquiry details and try again.", 400);
    const parts: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 20000) {
        await reader.cancel();
        return reply(
          "Your enquiry is too long. Please shorten your message.",
          413,
        );
      }
      parts.push(value);
    }
    raw = JSON.parse(Buffer.concat(parts).toString());
  } catch {
    return reply(
      "We could not read the enquiry. Please reload and try again.",
      400,
    );
  }
  const result = enquirySchema.safeParse(raw);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const e of result.error.issues) {
      const k = String(e.path[0]);
      if (!fields[k]) fields[k] = e.message;
    }
    return reply("Please check the highlighted fields.", 422, { fields });
  }
  const data = result.data;
  if (
    data.website ||
    Date.now() - data.startedAt < 2000 ||
    Date.now() - data.startedAt > 86400000
  )
    return reply("Please reload the form and try again.", 400);
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_TO ||
    !process.env.EMAIL_FROM
  )
    return reply(
      "Enquiry delivery is not connected in this local preview. Your details have not been sent. Please try again once delivery is enabled.",
      503,
    );
  try {
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "shared"
      : process.env.TRUST_PROXY === "true"
        ? request.headers.get("x-real-ip") || "shared"
        : "local";
    if (!(await rateLimit(ip)))
      return reply(
        "Too many enquiries have been attempted. Please wait an hour and try again.",
        429,
      );
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[0-9a-f-]{36}$/i.test(key))
      return reply("Please reload the form and try again.", 400);
    const fields = [
      ["Enquiry type", data.kind],
      ["Name", data.fullName],
      ["Email", data.email],
      ["Phone", data.phone || "Not supplied"],
      ["Preferred contact", data.contactMethod || "No preference"],
      ...(data.kind === "quote"
        ? [
            ["Location", data.city],
            ["Property type", data.propertyType],
            ["Rental units", data.units],
            ["Monthly rental income (CAD)", data.monthlyRent || "Not supplied"],
            ["Occupancy", data.occupancy || "Not supplied"],
            ["Services", data.services.join(", ")],
            ["Package", data.package],
          ]
        : []),
      ["Message", data.message || "Not supplied"],
      ["Consent", "Consent to assess and respond to this enquiry was given."],
    ];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `valore-${key}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO.split(",").map((v) => v.trim()),
        reply_to: data.email,
        subject: `Valore — ${data.kind === "quote" ? "property quote request" : "general enquiry"}`,
        text: fields.map(([k, v]) => `${k}: ${v}`).join("\n\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return reply(
        "Your enquiry could not be delivered. Please try again; your details are still in the form.",
        502,
      );
    const sent = await response.json();
    if (!sent.id)
      return reply("Delivery could not be confirmed. Please try again.", 502);
    return reply("Your enquiry has been received.", 200);
  } catch {
    return reply(
      "Enquiry delivery is temporarily unavailable. Please try again; your details are still in the form.",
      503,
    );
  }
}
