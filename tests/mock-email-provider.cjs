// Loaded ONLY by the isolated test server on port 3001. No network email is sent.
if (process.env.VALORE_TEST_PROVIDER !== "1")
  throw new Error(
    "The email test fixture must not be preloaded outside isolated tests.",
  );
const originalFetch = globalThis.fetch;
const accepted = new Map();
globalThis.fetch = async function (input, init) {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (url === "https://api.resend.com/emails") {
    const data = JSON.parse(init.body);
    if (data.text.includes("fixture-provider-failure"))
      return Response.json(
        { message: "Test provider rejected the message" },
        { status: 500 },
      );
    if (data.text.includes("fixture-provider-timeout"))
      throw new Error("Test provider connection interrupted");
    const key = new Headers(init.headers).get("Idempotency-Key");
    if (!accepted.has(key))
      accepted.set(key, `test-message-${accepted.size + 1}`);
    return Response.json({ id: accepted.get(key) });
  }
  return originalFetch(input, init);
};
