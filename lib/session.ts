import crypto from "crypto";

const secret = process.env.SESSION_SECRET || "tanbopp-admin-session-secret";

/** Create a signed, expiring admin session token. */
export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 * 24 }),
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Verify an admin session token; returns true when valid and unexpired. */
export function verifySessionToken(token: string): boolean {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
