import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  Posts,
  featuredPostHref,
  formatPostDate,
  gridFeature,
  pageSize,
  pageWindow,
  pickedPostCards,
  selectPosts,
  type PostCardData,
} from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(heading: string): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: heading ? rich(heading) : emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: null,
    space_above: "None",
    space_below: null,
  };
}

function post(
  title: string,
  published: string,
  category = "Telehealth brand reviews",
): PostCardData {
  return {
    title,
    href: `/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    image: { src: "/mockup/posts/skin.jpg" },
    excerpt: `${title} excerpt`,
    published,
    readTime: 5,
    category,
  };
}

const POSTS = [
  post("Older review", "2026-01-01", "Telehealth brand reviews"),
  post("Newest story", "2026-09-29", "My experience & results"),
  post("Middle comparison", "2026-06-01", "Formulations & dosages"),
  post("Spring guide", "2026-03-01", "Testing, labs & tracking"),
  post("Summer review", "2026-07-01", "Telehealth brand reviews"),
  post("August story", "2026-08-01", "My experience & results"),
];

describe("selectPosts", () => {
  it("lists the newest first and pages them", () => {
    const first = selectPosts(POSTS, { limit: 2, page: 1 });
    expect(first.items.map((item) => item.title)).toEqual([
      "Newest story",
      "August story",
    ]);
    expect(first.pages).toBe(3);

    const second = selectPosts(POSTS, { limit: 2, page: 2 });
    expect(second.items.map((item) => item.title)).toEqual([
      "Summer review",
      "Middle comparison",
    ]);
  });

  it("keeps one category and leaves out the featured post", () => {
    const selected = selectPosts(POSTS, {
      category: "Telehealth brand reviews",
      limit: 12,
      skipHref: "/older-review",
    });
    expect(selected.items.map((item) => item.title)).toEqual(["Summer review"]);
  });

  it("keeps a hand-picked list in the order it was given", () => {
    const selected = selectPosts(POSTS, { limit: 3, keepOrder: true });
    expect(selected.items.map((item) => item.title)).toEqual([
      "Older review",
      "Newest story",
      "Middle comparison",
    ]);
    expect(selected.pages).toBe(1);
  });
});

describe("pickedPostCards", () => {
  it("keeps the chosen posts in field order and stops at three", () => {
    const cards = pickedPostCards(
      [
        { post: { link_type: "Web", url: "/newest-story" } as LinkField },
        {
          post: {
            link_type: "Web",
            url: "https://example.com/missing",
          } as LinkField,
        },
        { post: { link_type: "Any" } as LinkField },
        { post: { link_type: "Web", url: "/older-review" } as LinkField },
        { post: { link_type: "Web", url: "/spring-guide" } as LinkField },
      ],
      POSTS,
    );

    expect(cards.map((card) => card.title)).toEqual([
      "Newest story",
      "Older review",
      "Spring guide",
    ]);
    expect(cards[0]?.image?.src).toBe("/mockup/posts/skin.jpg");
    expect(cards[0]?.category).toBe("My experience & results");
  });
});

describe("gridFeature", () => {
  it("leaves the featured post out while the switch is empty", () => {
    expect(
      gridFeature({
        hideFeatured: null,
        pageFeaturedHref: "/newest-story",
        newestHref: "/newest-story",
      }),
    ).toEqual({ skipHref: "/newest-story", showInline: false });
  });

  it("shows the newest itself when the switch is on and nothing else features it", () => {
    expect(
      gridFeature({
        hideFeatured: true,
        newestHref: "/newest-story",
      }),
    ).toEqual({ skipHref: "/newest-story", showInline: true });
  });
});

describe("featuredPostHref", () => {
  it("uses the newest post when Featured has no post picked", () => {
    expect(
      featuredPostHref(
        { variation: "featured", primary: { category: "All", post: null } },
        POSTS,
      ),
    ).toBe("/newest-story");
  });
});

describe("page helpers", () => {
  it("uses 12 when the page size is empty", () => {
    expect(pageSize(undefined)).toBe(12);
    expect(pageSize(0)).toBe(12);
    expect(pageSize(6)).toBe(6);
  });

  it("formats a published date", () => {
    expect(formatPostDate("2026-09-29")).toBe("Sep 29, 2026");
  });

  it("collapses a long page list", () => {
    expect(pageWindow(5, 12)).toEqual([1, "gap", 4, 5, 6, "gap", 12]);
  });
});

describe("Posts", () => {
  it("renders the five newest, with the newest as the large card", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="home"
        primary={{ ...section("Latest") }}
        posts={POSTS}
      />,
    );

    expect(html).toContain("Latest");
    expect(html.indexOf("Newest story")).toBeLessThan(
      html.indexOf("August story"),
    );
    expect(html.match(/<article/g)).toHaveLength(5);
    expect(html).not.toContain("Older review");
    expect(html).toContain("Sep 29, 2026");
    expect(html).toContain("5 min read");
    expect(html).toContain("My experience &amp; results");
  });

  it("features a picked post", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="featured"
        primary={{ ...section(""), category: "All" }}
        posts={POSTS}
        featured={post(
          "Pinned comparison",
          "2020-01-01",
          "Formulations & dosages",
        )}
      />,
    );

    expect(html).toContain("Pinned comparison");
    expect(html).not.toContain("Newest story");
  });

  it("keeps the overall newest as the feature on a category tab", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="featured"
        primary={{ ...section(""), category: "All" }}
        posts={POSTS}
        activeCategory="Formulations & dosages"
      />,
    );

    expect(html).toContain("Newest story");
    expect(html).not.toContain("Middle comparison");
  });

  it("shows category tabs and a second page on the grid", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{ ...section("More posts"), category: "All", count: 2 }}
        posts={POSTS}
        page={1}
      />,
    );

    expect(html).toContain("All posts");
    expect(html).toContain("Telehealth brand reviews");
    expect(html).toContain('aria-current="true"');
    expect(html).toContain("Older posts");
    expect(html).toContain("Newest story");
    expect(html).not.toContain("Summer review");
  });

  it("shows the newest as the feature and leaves it out of the grid", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{
          ...section("Latest articles"),
          category: "All",
          count: 2,
          hide_featured: true,
        }}
        posts={POSTS}
      />,
    );

    expect(html.split('href="/newest-story"').length - 1).toBe(1);
    expect(html).toContain("August story");
    expect(html).toContain("Summer review");
    expect(html).not.toContain("No posts yet.");
  });

  it("repeats the featured post when the switch is off", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{
          ...section("Latest articles"),
          category: "All",
          hide_featured: false,
        }}
        posts={POSTS}
        pageFeaturedHref="/newest-story"
      />,
    );

    expect(html).toContain("Newest story");
    expect(html).not.toContain("featureLead");
  });

  it("keeps the newest out of the grid on its own category", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{
          ...section("Latest articles"),
          category: "All",
          hide_featured: true,
        }}
        posts={POSTS}
        activeCategory="My experience & results"
      />,
    );

    expect(html).toContain("featureLead");
    expect(html.split('href="/newest-story"').length - 1).toBe(1);
    expect(html).toContain("August story");
    expect(html).not.toContain("Summer review");
  });

  it("hides the tabs when a category is chosen", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{
          ...section("Reviews"),
          category: "Telehealth brand reviews",
        }}
        posts={POSTS}
        activeCategory="Formulations & dosages"
      />,
    );

    expect(html).not.toContain("All posts");
    expect(html).toContain("Summer review");
    expect(html).not.toContain("Newest story");
  });

  it("keeps a picked row in the chosen order, with the same card", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="picked"
        primary={section("Price Comparison Chart")}
        posts={[
          post("Older review", "2026-01-01", "Cost, insurance & access"),
          post("Newest story", "2026-09-29", "My experience & results"),
        ]}
      />,
    );

    const older = html.indexOf("Older review");
    const newer = html.indexOf("Newest story");
    expect(older).toBeGreaterThan(-1);
    expect(newer).toBeGreaterThan(older);
    expect(html).toContain("Cost, insurance &amp; access");
    expect(html).toContain('src="/mockup/posts/skin.jpg"');
    expect(html).not.toContain("All posts");
  });

  it("says when a category is empty", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="row"
        primary={{
          ...section("Keep reading"),
          category: "Testing, labs & tracking",
        }}
        posts={POSTS.filter(
          (item) => item.category !== "Testing, labs & tracking",
        )}
      />,
    );

    expect(html).toContain("No posts in this category yet.");
  });
});
