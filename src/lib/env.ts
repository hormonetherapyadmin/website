// Server-only environment access. Never import from client components.

export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING === "true";
}

export function getPrismicWebhookSecret(): string {
  const secret = process.env.PRISMIC_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("PRISMIC_WEBHOOK_SECRET is not set");
  }
  return secret;
}
