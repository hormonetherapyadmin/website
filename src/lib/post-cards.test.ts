import { describe, expect, it } from "vitest";
import {
  POST_BODY_GRAPH_QUERY,
  POST_CARD_GRAPH_QUERY,
  listedPosts,
} from "./post-cards";
import type { RichTextField } from "@prismicio/client";

function rich(text: string): RichTextField {
  return [
    {
      type: "paragraph",
      text,
      spans: [],
    },
  ] as RichTextField;
}

const source = {
  id: "post-1",
  uid: "oestra-vs-winona",
  url: "/post/oestra-vs-winona",
  data: {
    title: rich("Oestra vs Winona"),
    sub_title: rich("Two creams, one year."),
    image: { url: "https://images.prismic.io/cover.jpg", alt: "Jars" },
    published_date: "2026-09-01",
    category: "Telehealth brand reviews",
    body: rich("This story is not on the card query."),
  },
};

describe("listedPosts", () => {
  it("uses the counted minutes and ignores the story on the document", () => {
    expect(listedPosts([source], { "post-1": 8 })).toEqual([
      {
        id: "post-1",
        uid: "oestra-vs-winona",
        title: "Oestra vs Winona",
        href: "/post/oestra-vs-winona",
        image: { src: "https://images.prismic.io/cover.jpg", alt: "Jars" },
        excerpt: "Two creams, one year.",
        published: "2026-09-01",
        readTime: 8,
        category: "Telehealth brand reviews",
      },
    ]);
  });

  it("drops a post with no address", () => {
    expect(listedPosts([{ ...source, uid: null, url: null }], {})).toEqual([]);
  });
});

describe("post list queries", () => {
  it("keeps the story out of the card query", () => {
    expect(POST_CARD_GRAPH_QUERY).not.toContain("body");
    expect(POST_BODY_GRAPH_QUERY).toContain("body");
    expect(POST_BODY_GRAPH_QUERY).not.toContain("title");
  });
});
