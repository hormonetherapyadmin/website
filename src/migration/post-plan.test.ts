import { describe, expect, it } from "vitest";
import { planPost } from "./post-plan";

const post = { sourceId: "wix-1", uid: "oestra-vs-winona", problems: [] };
const none = new Map<string, string>();

describe("planPost", () => {
  it("creates a post Prismic has never seen", () => {
    expect(planPost(post, none, {}, new Set())).toEqual({ action: "create" });
  });

  it("skips a published post", () => {
    const published = new Map([["oestra-vs-winona", "P1"]]);
    expect(planPost(post, published, {}, new Set())).toEqual({
      action: "skip",
      reason: "already published in Prismic",
    });
  });

  it("overwrites a published post only when asked", () => {
    const published = new Map([["oestra-vs-winona", "P1"]]);
    expect(
      planPost(post, published, {}, new Set(["oestra-vs-winona"])),
    ).toEqual({ action: "update", prismicId: "P1", reason: "replace" });
  });

  it("leaves a post an earlier run put in the migration release", () => {
    const state = { "wix-1": { uid: "oestra-vs-winona", prismicId: "M1" } };
    expect(planPost(post, none, state, new Set())).toEqual({
      action: "skip",
      reason:
        "already in the migration release. Name it with --only to re-import",
    });
  });

  it("re-imports a post from an earlier run when it is named", () => {
    const state = { "wix-1": { uid: "oestra-vs-winona", prismicId: "M1" } };
    expect(
      planPost(post, none, state, new Set(), new Set(["oestra-vs-winona"])),
    ).toEqual({ action: "update", prismicId: "M1", reason: "earlier run" });
  });

  it("prefers the published document over an earlier run", () => {
    const published = new Map([["oestra-vs-winona", "P1"]]);
    const state = { "wix-1": { uid: "oestra-vs-winona", prismicId: "M1" } };
    expect(planPost(post, published, state, new Set())).toMatchObject({
      action: "skip",
    });
  });

  it("skips a post the mapper cannot handle", () => {
    expect(
      planPost(
        { ...post, problems: ["link that is not a web address: see notes"] },
        none,
        {},
        new Set(),
      ),
    ).toEqual({
      action: "skip",
      reason: "link that is not a web address: see notes",
    });
  });
});
