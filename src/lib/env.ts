// Server-only environment access. Never import from client components.

export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING === "true";
}

// Preview deployments are production builds, so NODE_ENV is not the gate.
// Vercel sets VERCEL_ENV to "production" only for the production deployment.
export function isGoogleAnalyticsEnabled(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function getPrismicWebhookSecret(): string {
  const secret = process.env.PRISMIC_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("PRISMIC_WEBHOOK_SECRET is not set");
  }
  return secret;
}

// Optional while the repository API is public. Required once API access is private.
export function getPrismicAccessToken(): string | undefined {
  const token = process.env.PRISMIC_ACCESS_TOKEN;
  if (!token) return undefined;
  return token;
}
