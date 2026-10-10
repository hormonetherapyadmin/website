import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  Posts,
  formatPostDate,
  pageSize,
  pageWindow,
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
  category = "Review",
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
  post("Older review", "2026-01-01", "Review"),
  post("Newest story", "2026-09-29", "My experience"),
  post("Middle comparison", "2026-06-01", "Comparison"),
  post("Spring guide", "2026-03-01", "HRT 101"),
  post("Summer review", "2026-07-01", "Review"),
  post("August story", "2026-08-01", "My experience"),
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
      category: "Review",
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
    expect(html).toContain("My experience");
  });

  it("features a picked post", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="featured"
        primary={{ ...section(""), category: "All" }}
        posts={POSTS}
        featured={post("Pinned comparison", "2020-01-01", "Comparison")}
      />,
    );

    expect(html).toContain("Pinned comparison");
    expect(html).not.toContain("Newest story");
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
    expect(html).toContain("Reviews");
    expect(html).toContain('aria-current="true"');
    expect(html).toContain("Older posts");
    expect(html).toContain("Newest story");
    expect(html).not.toContain("Summer review");
  });

  it("hides the tabs when a category is chosen", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="grid"
        primary={{ ...section("Reviews"), category: "Review" }}
        posts={POSTS}
        activeCategory="Comparison"
      />,
    );

    expect(html).not.toContain("All posts");
    expect(html).toContain("Summer review");
    expect(html).not.toContain("Newest story");
  });

  it("says when a category is empty", () => {
    const html = renderToStaticMarkup(
      <Posts
        variation="row"
        primary={{ ...section("Keep reading"), category: "HRT 101" }}
        posts={POSTS.filter((item) => item.category !== "HRT 101")}
      />,
    );

    expect(html).toContain("No posts in this category yet.");
  });
});
