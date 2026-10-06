import { revalidateTag } from "next/cache";
import { getPrismicWebhookSecret } from "@/lib/env";

// Called by the Prismic webhook on publish/unpublish. Prismic retries any
// non-200 response and disables the webhook after five consecutive failures.
export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const secret =
    payload && typeof payload === "object" && "secret" in payload
      ? payload.secret
      : null;

  if (secret !== getPrismicWebhookSecret()) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag("prismic", { expire: 0 });
  return Response.json({ revalidated: true });
}
