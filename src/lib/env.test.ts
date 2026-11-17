import { afterEach, describe, expect, it, vi } from "vitest";
import { isGoogleAnalyticsEnabled } from "./env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isGoogleAnalyticsEnabled", () => {
  it("is off unless Vercel marks the deployment production", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(isGoogleAnalyticsEnabled()).toBe(false);
  });

  it.each(["preview", "development", "Production", ""])(
    "is off when VERCEL_ENV is %j",
    (value) => {
      vi.stubEnv("VERCEL_ENV", value);
      expect(isGoogleAnalyticsEnabled()).toBe(false);
    },
  );

  it("is on for the Vercel production deployment", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isGoogleAnalyticsEnabled()).toBe(true);
  });
});
