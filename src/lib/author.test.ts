import { describe, expect, it } from "vitest";
import { DEFAULT_AUTHOR_ID, resolveAuthorId } from "./author";

describe("resolveAuthorId", () => {
  it("uses Peggy when the post has no author", () => {
    expect(resolveAuthorId(null)).toBe(DEFAULT_AUTHOR_ID);
    expect(resolveAuthorId({ link_type: "Any" })).toBe(DEFAULT_AUTHOR_ID);
  });

  it("uses the author chosen on the post", () => {
    expect(
      resolveAuthorId({
        link_type: "Document",
        id: "other-author",
      }),
    ).toBe("other-author");
  });
});
