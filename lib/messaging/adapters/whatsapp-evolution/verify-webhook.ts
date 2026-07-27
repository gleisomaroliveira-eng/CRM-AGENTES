import crypto from "node:crypto";

export function verifyQuerySecret(
  query: Record<string, string | undefined> | undefined,
  secret: string,
): boolean {
  if (!secret || secret.length === 0) return false;
  if (!query) return false;
  const presented = query.secret;
  if (typeof presented !== "string") return false;
  if (presented.length !== secret.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(presented), Buffer.from(secret));
  } catch {
    return false;
  }
}
