import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it("disallows all crawling when ALLOW_INDEXING is unset", () => {
    vi.stubEnv("ALLOW_INDEXING", undefined);
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("disallows all crawling for values other than exactly 'true'", () => {
    vi.stubEnv("ALLOW_INDEXING", "1");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows all crawlers, including AI crawlers, when ALLOW_INDEXING is 'true'", () => {
    vi.stubEnv("ALLOW_INDEXING", "true");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://www.hormonetherapyhub.com/sitemap.xml",
    });
  });
});
