import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { POST } from "./route";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

function webhookRequest(body: string) {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    body,
  });
}

beforeEach(() => {
  vi.stubEnv("PRISMIC_WEBHOOK_SECRET", "test-secret");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.mocked(revalidateTag).mockClear();
});

describe("POST /api/revalidate", () => {
  it("expires the prismic cache tag when the secret matches", async () => {
    const response = await POST(
      webhookRequest(
        JSON.stringify({ type: "api-update", secret: "test-secret" }),
      ),
    );

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("prismic", { expire: 0 });
  });

  it("rejects a wrong secret", async () => {
    const response = await POST(
      webhookRequest(JSON.stringify({ type: "api-update", secret: "wrong" })),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a payload without a secret", async () => {
    const response = await POST(
      webhookRequest(JSON.stringify({ type: "api-update", secret: null })),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(webhookRequest("not json"));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("fails loudly when the server has no secret configured", async () => {
    vi.stubEnv("PRISMIC_WEBHOOK_SECRET", undefined);

    await expect(
      POST(webhookRequest(JSON.stringify({ secret: "anything" }))),
    ).rejects.toThrow("PRISMIC_WEBHOOK_SECRET is not set");
  });
});
