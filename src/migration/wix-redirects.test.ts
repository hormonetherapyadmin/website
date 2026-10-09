import { describe, expect, it } from "vitest";
import { WIX_REDIRECTS } from "./wix-redirects";

describe("WIX_REDIRECTS", () => {
  const froms = WIX_REDIRECTS.map(({ from }) => from);

  it("lists each old path once, in lowercase", () => {
    expect(new Set(froms).size).toBe(froms.length);
    for (const from of froms) expect(from).toBe(from.toLowerCase());
  });

  it("goes to the destination in one hop", () => {
    for (const { to } of WIX_REDIRECTS) expect(froms).not.toContain(to);
  });
});
