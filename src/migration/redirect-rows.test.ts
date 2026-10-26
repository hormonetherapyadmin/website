import { describe, expect, it } from "vitest";
import { redirectRows, type RedirectTarget } from "./redirect-rows";
import { WIX_REDIRECTS } from "./wix-redirects";

const targets = new Map<string, RedirectTarget>(
  [...new Set(WIX_REDIRECTS.map((row) => row.to))].map((path) => {
    if (path === "/") return [path, { id: "home", type: "homepage" }];
    return [path, { id: path, type: "page", uid: path.slice(1) }];
  }),
);

describe("redirect rows", () => {
  it("links each destination document and keeps the reason", () => {
    const rows = redirectRows(WIX_REDIRECTS, targets, new Set());
    expect(rows).toHaveLength(WIX_REDIRECTS.length);
    expect(rows.every((row) => row.redirect_type === "301 permanent")).toBe(
      true,
    );
    expect(rows.every((row) => row.reason.length > 0)).toBe(true);
    const inner = rows.find((row) => row.from === "/copy-of-inner-balance");
    expect(inner?.to).toMatchObject({
      link_type: "Document",
      type: "page",
      uid: "inner-balance",
      url: "/inner-balance",
    });
    const home = rows.find((row) => row.from === "/home");
    expect(home?.to).toMatchObject({ type: "homepage", url: "/" });
    expect(home?.to).not.toHaveProperty("uid");
  });

  it("stops when a from path is already a page or the destination is missing", () => {
    expect(() =>
      redirectRows(WIX_REDIRECTS, targets, new Set(["/home"])),
    ).toThrow("/home is a live page");
    const missing = new Map(targets);
    missing.delete("/blog");
    expect(() => redirectRows(WIX_REDIRECTS, missing, new Set())).toThrow(
      "/blog, which is not a document",
    );
  });
});
