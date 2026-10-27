import { createHmac } from "node:crypto";
const memory = new Map<string, { count: number; reset: number }>();
export async function rateLimit(ip: string): Promise<boolean> {
  const localTesting = process.env.ALLOW_LOCAL_TEST_FORMS === "true";
  if (
    process.env.NODE_ENV === "production" &&
    !localTesting &&
    (!process.env.RATE_LIMIT_SALT || process.env.RATE_LIMIT_SALT.length < 32)
  )
    throw new Error("Production rate limit salt is not configured");
  const salt = process.env.RATE_LIMIT_SALT || "local-development-only";
  const key = `valore:enquiry:${createHmac("sha256", salt).update(ip).digest("hex")}`;
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const script =
      "local c=redis.call('INCR',KEYS[1]); if c==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return c";
    const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, 1, key, 3600]),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) throw new Error("Rate limit provider unavailable");
    const body = await r.json();
    if (body.error || typeof body.result !== "number")
      throw new Error("Invalid rate limit response");
    return body.result <= 5;
  }
  if (process.env.NODE_ENV === "production" && !localTesting)
    throw new Error("Production rate limit is not configured");
  const now = Date.now();
  for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
  let entry = memory.get(key);
  if (!entry || entry.reset < now) {
    entry = { count: 0, reset: now + 3600000 };
    memory.set(key, entry);
  }
  entry.count++;
  return entry.count <= 5;
}
