import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { minutesToRead, relatedPosts, storyWordCount } from "./post-derived";

const paragraph = (text: string) => ({
  type: "paragraph" as const,
  text,
  spans: [],
});

const words = (count: number) =>
  Array.from({ length: count }, () => "word").join(" ");

describe("minutesToRead", () => {
  it("counts story words and drops a clinic token", () => {
    const field = [
      paragraph("One two three"),
      paragraph("{{provider:inner-balance:offer}} four five"),
    ] as RichTextField;

    expect(storyWordCount(field)).toBe(5);
  });

  it("rounds to the nearest minute and stays at least one", () => {
    expect(minutesToRead([paragraph(words(250))] as RichTextField)).toBe(1);
    expect(minutesToRead([paragraph(words(375))] as RichTextField)).toBe(2);
    expect(minutesToRead([paragraph(words(124))] as RichTextField)).toBe(1);
    expect(minutesToRead([])).toBe(0);
    expect(minutesToRead(null)).toBe(0);
  });
});

describe("relatedPosts", () => {
  const posts = [
    { id: "current", category: "Review", published: "2026-03-01" },
    { id: "older-review", category: "Review", published: "2026-01-01" },
    { id: "newer-review", category: "Review", published: "2026-04-01" },
    { id: "recent", category: "HRT 101", published: "2026-05-01" },
    { id: "older", category: null, published: "2025-12-01" },
  ];

  it("uses the same category, newest first, then the newest other posts", () => {
    expect(relatedPosts(posts[0], posts).map((post) => post.id)).toEqual([
      "newer-review",
      "older-review",
      "recent",
    ]);
  });

  it("uses the newest posts when this post has no category", () => {
    expect(
      relatedPosts(
        { id: "plain", category: null, published: "2026-06-01" },
        posts,
      ).map((post) => post.id),
    ).toEqual(["recent", "newer-review", "current"]);
  });
});
