import { describe, expect, it } from "vitest";
import { redirectRules } from "./site-redirects";

describe("redirect rules", () => {
  it("keeps a permanent redirect and drops a row that points at itself", () => {
    expect(
      redirectRules([
        {
          from: "/copy-of-weight-gain",
          to: { link_type: "Document", url: "/weight-gain" },
          redirect_type: "301 permanent",
        },
        {
          from: "/home",
          to: { link_type: "Document", url: "/" },
          redirect_type: "302 temporary",
        },
        {
          from: "/copy-of-weight-gain",
          to: { link_type: "Document", url: "/copy-of-weight-gain" },
          redirect_type: "301 permanent",
        },
      ]),
    ).toEqual([
      {
        source: "/copy-of-weight-gain",
        destination: "/weight-gain",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: false },
    ]);
  });
});
