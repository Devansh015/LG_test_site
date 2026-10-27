import { test, expect } from "@playwright/test";
test("isolated delivery accepts, retries, recovers from provider failure and rate limits", async ({
  request,
}) => {
  const data = {
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
    message: "Provider integration fixture only.",
    consent: true,
    website: "",
    startedAt: Date.now() - 5000,
  };
  const send = (
    message = data.message,
    key = "12345678-1234-1234-1234-123456789012",
  ) =>
    request.post("http://localhost:3001/api/enquiries", {
      data: { ...data, message },
      headers: { Origin: "http://localhost:3001", "Idempotency-Key": key },
    });
  expect((await send()).status()).toBe(200);
  expect((await send()).status()).toBe(200);
  expect(
    (
      await send(
        "fixture-provider-failure",
        "22345678-1234-1234-1234-123456789012",
      )
    ).status(),
  ).toBe(502);
  expect(
    (
      await send(
        "fixture-provider-timeout",
        "32345678-1234-1234-1234-123456789012",
      )
    ).status(),
  ).toBe(503);
  expect(
    (await send(data.message, "42345678-1234-1234-1234-123456789012")).status(),
  ).toBe(200);
  const limited = await send(
    data.message,
    "52345678-1234-1234-1234-123456789012",
  );
  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBe("3600");
});
