import { describe, expect, it } from "vitest";
import {
  BLOG_FEED_LIMIT,
  blogFeedEntries,
  blogFeedXml,
  rssDate,
  type BlogFeedSource,
} from "./blog-feed";

const rich = (text: string) => [
  { type: "paragraph" as const, text, spans: [] },
];

function post(
  uid: string,
  title: string,
  published: string | null,
  extra: Partial<BlogFeedSource["data"]> = {},
): BlogFeedSource {
  return {
    uid,
    url: `/post/${uid}`,
    data: {
      title: rich(title),
      sub_title: rich(`${title} subtitle`),
      published_date: published,
      indexing: true,
      ...extra,
    },
  };
}

describe("blogFeedEntries", () => {
  it("keeps the newest indexable posts and drops the rest", () => {
    const posts = Array.from({ length: BLOG_FEED_LIMIT + 1 }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return post(`post-${index}`, `Post ${index}`, `2026-01-${day}`);
    });
    posts.push(
      post("hidden", "Hidden", "2026-12-01", { indexing: false }),
      post("untitled", "", "2026-12-02"),
    );

    const entries = blogFeedEntries(posts);
    expect(entries).toHaveLength(BLOG_FEED_LIMIT);
    expect(entries[0]?.path).toBe(`/post/post-${BLOG_FEED_LIMIT}`);
    expect(entries.some((entry) => entry.path === "/post/hidden")).toBe(false);
    expect(entries.some((entry) => entry.path === "/post/post-0")).toBe(false);
  });

  it("uses the subtitle when it differs from the title", () => {
    expect(
      blogFeedEntries([
        post("winona", "Winona review", "2026-03-01", {
          sub_title: rich("What I paid"),
          meta_description: "Meta sentence",
        }),
      ]),
    ).toEqual([
      {
        title: "Winona review",
        path: "/post/winona",
        description: "What I paid",
        published: "Sun, 01 Mar 2026 00:00:00 GMT",
      },
    ]);
  });
});

describe("blogFeedXml", () => {
  it("writes an RSS channel of absolute post links", () => {
    const xml = blogFeedXml([
      {
        title: "Winona & Alloy",
        path: "/post/winona",
        description: "A <note>",
        published: "Sun, 01 Mar 2026 00:00:00 GMT",
      },
    ]);

    expect(xml).toContain(`<rss version="2.0"`);
    expect(xml).toContain(
      "<link>https://www.hormonetherapyhub.com/blog</link>",
    );
    expect(xml).toContain(
      "<link>https://www.hormonetherapyhub.com/post/winona</link>",
    );
    expect(xml).toContain("<title>Winona &amp; Alloy</title>");
    expect(xml).toContain("<description>A &lt;note&gt;</description>");
    expect(xml).not.toContain("<description>A <note></description>");
  });

  it("stays valid with no posts", () => {
    const xml = blogFeedXml([]);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});

describe("rssDate", () => {
  it("reads a published day and ignores a blank", () => {
    expect(rssDate("2026-03-01")).toBe("Sun, 01 Mar 2026 00:00:00 GMT");
    expect(rssDate(" ")).toBeUndefined();
    expect(rssDate("March")).toBeUndefined();
  });
});
