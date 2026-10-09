import { describe, expect, it } from "vitest";
import {
  groupResults,
  normalizeSearch,
  pageSearchHit,
  postSearchHit,
  resultLead,
  searchQuery,
  type SearchHit,
} from "./search";

const rich = (text: string) => [{ type: "paragraph", text, spans: [] }];

const image = (url: string) => ({
  url,
  alt: "Cover",
  dimensions: { width: 1200, height: 800 },
});

function hit(
  partial: Partial<SearchHit> & Pick<SearchHit, "id" | "kind" | "title">,
): SearchHit {
  return {
    href: partial.kind === "post" ? `/post/${partial.id}` : `/${partial.id}`,
    label: partial.kind === "post" ? "Blog" : "Page",
    text: partial.title,
    ...partial,
  };
}

describe("normalizeSearch", () => {
  it("folds case, punctuation, and hyphens into words", () => {
    expect(normalizeSearch("Winona's HRT-cream")).toBe("winonas hrt cream");
  });
});

describe("searchQuery", () => {
  it("reads the first query and caps the length", () => {
    expect(searchQuery(["winona", "alloy"])).toBe("winona");
    expect(searchQuery(undefined)).toBe("");
    expect(searchQuery("a".repeat(250))).toHaveLength(200);
  });
});

describe("resultLead", () => {
  it("counts results", () => {
    expect(resultLead(0)).toBe("No results for");
    expect(resultLead(1)).toBe("Found 1 result for");
    expect(resultLead(4)).toBe("Found 4 results for");
  });
});

describe("pageSearchHit and postSearchHit", () => {
  it("keeps an indexed page and prefers the slice photo", () => {
    expect(
      pageSearchHit({
        id: "page-1",
        uid: "alloy-review-page",
        url: "/alloy-review-page",
        data: {
          meta_title: "Alloy review",
          meta_description: "What I paid, and what I stayed for.",
          meta_image: image("https://images.prismic.io/social.jpg"),
          indexing: true,
          slices: [
            {
              slice_type: "side_by_side",
              primary: { image: image("https://images.prismic.io/hero.jpg") },
            },
          ],
        },
      }),
    ).toMatchObject({
      kind: "page",
      title: "Alloy review",
      href: "/alloy-review-page",
      excerpt: "What I paid, and what I stayed for.",
      image: "https://images.prismic.io/hero.jpg",
      label: "Page",
    });
  });

  it("uses the hero heading when the page title is empty", () => {
    expect(
      pageSearchHit({
        id: "tp",
        uid: "trusted-providers",
        url: "/trusted-providers",
        data: {
          meta_title: null,
          indexing: true,
          slices: [
            {
              slice_type: "hero",
              variation: "brands",
              primary: { heading: rich("Trusted providers") },
            },
          ],
        },
      }),
    ).toMatchObject({
      title: "Trusted providers",
      href: "/trusted-providers",
      label: "Page",
    });
  });

  it("titles a provider hero page with the clinic name, not the kicker", () => {
    const page = {
      id: "ib",
      uid: "inner-balance",
      url: "/inner-balance",
      data: {
        meta_title: "",
        indexing: true,
        slices: [
          {
            slice_type: "hero",
            variation: "provider",
            primary: {
              small_heading: rich("Voted best for"),
              heading: [],
              clinic: { link_type: "Document", id: "clinic-ib" },
            },
          },
        ],
      },
    };

    expect(pageSearchHit(page, "Inner Balance")).toMatchObject({
      title: "Inner Balance",
      href: "/inner-balance",
    });
    expect(pageSearchHit(page)).toBeNull();
  });

  it("lists a Page at /blog, which no app route owns yet", () => {
    expect(
      pageSearchHit({
        id: "blog",
        uid: "blog",
        url: "/blog",
        data: { meta_title: "Blog", indexing: true },
      }),
    ).toMatchObject({ href: "/blog" });
  });

  it("drops a page that is not indexed, has no title, or uses a reserved path", () => {
    const data = {
      meta_title: "Search",
      meta_description: null,
      indexing: true,
    };
    expect(
      pageSearchHit({
        id: "hidden",
        uid: "private",
        url: "/private",
        data: { ...data, indexing: false },
      }),
    ).toBeNull();
    expect(
      pageSearchHit({
        id: "blank",
        uid: "blank",
        url: "/blank",
        data: { ...data, meta_title: "" },
      }),
    ).toBeNull();
    expect(
      pageSearchHit({ id: "search", uid: "search", url: "/search", data }),
    ).toBeNull();
    expect(
      pageSearchHit({ id: "post", uid: "post", url: "/post", data }),
    ).toBeNull();
  });

  it("reads a post card, including the category and date", () => {
    expect(
      postSearchHit({
        id: "post-1",
        uid: "winona-review",
        url: "/post/winona-review",
        data: {
          title: rich("Winona review"),
          sub_title: rich("A cream I used for a year."),
          image: image("https://images.prismic.io/winona.jpg"),
          category: "Review",
          published_date: "2026-03-02",
          indexing: true,
          body: rich("Night sweats eased in the second month."),
        },
      }),
    ).toMatchObject({
      kind: "post",
      href: "/post/winona-review",
      excerpt: "A cream I used for a year.",
      label: "Review",
      published: "2026-03-02",
      date: "Mar 2, 2026",
    });
  });

  it("does not match a word that sits past the opening of the story", () => {
    const hit = postSearchHit({
      id: "post-2",
      uid: "long",
      url: null,
      data: {
        title: rich("A long review"),
        sub_title: [],
        indexing: true,
        body: rich(`${"word ".repeat(800)}zebracake`),
      },
    });
    expect(hit?.href).toBe("/post/long");
    expect(groupResults(hit ? [hit] : [], "zebracake")).toEqual([]);
    expect(groupResults(hit ? [hit] : [], "long review")).toHaveLength(1);
  });
});

describe("groupResults", () => {
  const pages = hit({
    id: "alloy",
    kind: "page",
    title: "Alloy review page",
    text: "Alloy review page pricing",
  });
  const titled = hit({
    id: "winona",
    kind: "post",
    title: "Winona cost",
    text: "Winona cost cream",
    published: "2026-01-01",
  });
  const older = hit({
    id: "older",
    kind: "post",
    title: "Winona, one year in",
    text: "Winona one year",
    published: "2025-01-01",
  });
  const mentioned = hit({
    id: "creams",
    kind: "post",
    title: "Creams I tried",
    text: "Creams I tried, including Winona",
    published: "2026-06-01",
  });

  it("lists pages, then blog posts, with title matches before mentions", () => {
    const groups = groupResults([mentioned, pages, older, titled], "winona");
    expect(groups.map((group) => group.label)).toEqual(["Blog"]);
    expect(groups[0].hits.map((item) => item.id)).toEqual([
      "winona",
      "older",
      "creams",
    ]);

    const both = groupResults([mentioned, pages, titled], "alloy");
    expect(
      both.map((group) => [group.label, group.hits.map((item) => item.id)]),
    ).toEqual([["Pages", ["alloy"]]]);
  });

  it("puts pages ahead of blog posts when both match", () => {
    const groups = groupResults(
      [
        hit({
          id: "post",
          kind: "post",
          title: "Inner Balance review",
          text: "inner balance",
        }),
        hit({
          id: "page",
          kind: "page",
          title: "Inner Balance",
          text: "inner balance clinic",
        }),
      ],
      "inner balance",
    );
    expect(groups.map((group) => group.kind)).toEqual(["page", "post"]);
  });

  it("returns nothing until there is a search term", () => {
    expect(groupResults([pages], "   ")).toEqual([]);
    expect(groupResults([pages], "???")).toEqual([]);
  });
});
