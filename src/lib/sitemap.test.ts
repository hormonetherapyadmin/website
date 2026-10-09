import { describe, expect, it } from "vitest";
import {
  organizeSitemap,
  pageSitemapLink,
  postSitemapLink,
  sitemapUrl,
  xmlSitemap,
  type SitemapLink,
} from "./sitemap";

const rich = (text: string) => [{ type: "paragraph", text, spans: [] }];

describe("page and post links", () => {
  it("keeps an indexed page and records the last publication time", () => {
    expect(
      pageSitemapLink({
        id: "page-1",
        uid: "trusted-providers",
        url: "/trusted-providers",
        last_publication_date: "2026-10-01T12:00:00.000Z",
        data: {
          title: rich("Trusted providers"),
          indexing: true,
        },
      }),
    ).toEqual({
      group: "page",
      title: "Trusted providers",
      path: "/trusted-providers",
      lastModified: "2026-10-01T12:00:00.000Z",
    });
  });

  it("drops a page set to noindex and a page on a reserved route", () => {
    expect(
      pageSitemapLink({
        id: "hidden",
        uid: "private",
        url: "/private",
        data: { title: rich("Private"), indexing: false },
      }),
    ).toBeNull();
    expect(
      pageSitemapLink({
        id: "search",
        uid: "search",
        url: "/search",
        data: { title: rich("Search"), indexing: true },
      }),
    ).toBeNull();
    expect(
      pageSitemapLink({
        id: "sitemap",
        uid: "sitemap",
        url: "/sitemap",
        data: { title: rich("Sitemap"), indexing: true },
      }),
    ).toBeNull();
  });

  it("keeps a post date for readers and for ordering", () => {
    expect(
      postSitemapLink({
        id: "post-1",
        uid: "alloy-review",
        url: "/post/alloy-review",
        last_publication_date: "not-a-date",
        data: {
          title: rich("Alloy review"),
          published_date: "2026-09-04",
          indexing: true,
        },
      }),
    ).toMatchObject({
      group: "post",
      title: "Alloy review",
      path: "/post/alloy-review",
      published: "2026-09-04",
      lastModified: undefined,
    });
  });
});

describe("organizeSitemap", () => {
  const links: SitemapLink[] = [
    { group: "page", title: "Trusted providers", path: "/trusted-providers" },
    { group: "page", title: "About", path: "/about" },
    {
      group: "post",
      title: "Older",
      path: "/post/older",
      published: "2026-09-04",
    },
    {
      group: "post",
      title: "Newer",
      path: "/post/newer",
      published: "2026-09-29",
    },
    { group: "post", title: "Undated", path: "/post/undated" },
  ];

  it("sorts pages by title and posts newest first", () => {
    const organized = organizeSitemap(links);
    expect(organized.pages.map((link) => link.title)).toEqual([
      "About",
      "Trusted providers",
    ]);
    expect(organized.posts.map((link) => link.title)).toEqual([
      "Newer",
      "Older",
      "Undated",
    ]);
  });
});

describe("xmlSitemap", () => {
  it("lists canonical page and post URLs plus the sitemap page, and leaves home out", () => {
    const xml = xmlSitemap([
      {
        group: "page",
        title: "Trusted providers",
        path: "/trusted-providers",
        lastModified: "2026-10-01T12:00:00.000Z",
      },
      {
        group: "post",
        title: "Alloy review",
        path: "/post/alloy-review",
      },
    ]);

    expect(xml).toEqual([
      {
        url: "https://www.hormonetherapyhub.com/trusted-providers",
        lastModified: "2026-10-01T12:00:00.000Z",
      },
      { url: "https://www.hormonetherapyhub.com/post/alloy-review" },
      { url: "https://www.hormonetherapyhub.com/sitemap" },
    ]);
    expect(xml.map((entry) => entry.url)).not.toContain(sitemapUrl("/"));
    expect(xml.map((entry) => entry.url)).not.toContain(sitemapUrl("/search"));
  });
});
