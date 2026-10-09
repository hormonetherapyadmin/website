import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { SearchHit } from "@/lib/search";
import { SearchExperience } from "./search-experience";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const hits: SearchHit[] = [
  {
    id: "page",
    kind: "page",
    title: "Inner Balance",
    href: "/inner-balance",
    excerpt: "The clinic page.",
    image: "https://images.prismic.io/page.jpg",
    label: "Page",
    text: "inner balance clinic page",
  },
  {
    id: "post",
    kind: "post",
    title: "My Inner Balance review",
    href: "/post/inner-balance-review",
    label: "Review",
    date: "Mar 2, 2026",
    published: "2026-03-02",
    text: "my inner balance review",
  },
];

describe("SearchExperience", () => {
  it("asks for a search term before listing anything", () => {
    const html = renderToStaticMarkup(
      createElement(SearchExperience, { hits, initialQuery: "" }),
    );
    expect(html).toContain(
      "Enter a search term above to find pages and blog posts.",
    );
    expect(html).not.toContain("Inner Balance");
    expect(html).toContain('placeholder="Search Hormone Therapy Hub"');
  });

  it("groups matching pages and blog posts into cards", () => {
    const html = renderToStaticMarkup(
      createElement(SearchExperience, { hits, initialQuery: "inner balance" }),
    );
    expect(html).toContain("Found 2 results for");
    expect(html).toContain("Pages");
    expect(html).toContain("Blog");
    expect(html).toContain('href="/inner-balance"');
    expect(html).toContain('href="/post/inner-balance-review"');
    expect(html).toContain("Review");
    expect(html).toContain("Mar 2, 2026");
    expect(html.indexOf("Pages")).toBeLessThan(html.indexOf("Blog"));
  });
});
