import { describe, expect, it } from "vitest";
import {
  blogPosting,
  breadcrumbList,
  graph,
  ORGANIZATION_ID,
  person,
  serializeStructuredData,
  WEBSITE_ID,
  website,
} from "./structured-data";

const SITE = "https://www.hormonetherapyhub.com";

describe("blogPosting", () => {
  it("describes the post the page shows", () => {
    const node = blogPosting({
      path: "/post/oestra-review",
      headline: "Oestra: my 1-year review",
      description: "What changed in a year.",
      datePublished: "2026-09-08",
      image: {
        url: "https://images.prismic.io/1shr96di/cover.jpg?auto=format",
        width: 1265,
        height: 1316,
      },
      author: person({
        name: "Peggy B.",
        description: "Experienced HRT Patient Reviewer",
        path: "/about",
      }),
      category: "Review",
      tags: ["Inner Balance", " "],
    });

    expect(node).toEqual({
      "@type": "BlogPosting",
      "@id": `${SITE}/post/oestra-review#article`,
      url: `${SITE}/post/oestra-review`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE}/post/oestra-review`,
      },
      headline: "Oestra: my 1-year review",
      description: "What changed in a year.",
      datePublished: "2026-09-08",
      image: {
        "@type": "ImageObject",
        url: "https://images.prismic.io/1shr96di/cover.jpg?auto=format",
        width: 1265,
        height: 1316,
      },
      author: {
        "@type": "Person",
        name: "Peggy B.",
        description: "Experienced HRT Patient Reviewer",
        url: `${SITE}/about`,
      },
      publisher: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Hormone Therapy Hub",
        url: SITE,
      },
      isPartOf: { "@id": WEBSITE_ID },
      articleSection: "Review",
      keywords: ["Inner Balance"],
      inLanguage: "en",
    });
  });

  it("leaves out what the post does not have", () => {
    const node = blogPosting({
      path: "/post/bare",
      headline: "Bare",
      description: "",
      datePublished: null,
      image: null,
      author: person({ name: "Guest", description: "", image: null }),
      category: null,
      tags: [],
    });

    expect(node).not.toHaveProperty("description");
    expect(node).not.toHaveProperty("datePublished");
    expect(node).not.toHaveProperty("dateModified");
    expect(node).not.toHaveProperty("image");
    expect(node).not.toHaveProperty("articleSection");
    expect(node).not.toHaveProperty("keywords");
    expect(node.author).toEqual({ "@type": "Person", name: "Guest" });
  });
});

describe("breadcrumbList", () => {
  it("numbers the crumbs and leaves the current page without a link", () => {
    expect(
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: "Oestra" },
      ]),
    ).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE}/blog`,
        },
        { "@type": "ListItem", position: 3, name: "Oestra" },
      ],
    });
  });
});

describe("serializeStructuredData", () => {
  it("cannot close the script tag it is written into", () => {
    const json = serializeStructuredData(
      graph(
        breadcrumbList([{ name: "</script><script>alert(1)</script>" }]),
        website(),
      ),
    );

    expect(json).not.toContain("<");
    expect(JSON.parse(json)["@graph"][0].itemListElement[0].name).toBe(
      "</script><script>alert(1)</script>",
    );
  });
});
