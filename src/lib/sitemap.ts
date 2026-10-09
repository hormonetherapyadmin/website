/**
 * Canonical URLs for sitemap.xml and the /sitemap page.
 * Same published Pages and Posts as search. See docs/SEO_AEO_GEO.md.
 */

import type { MetadataRoute } from "next";
import { createClient } from "@/prismicio";
import { heroClinicId } from "@/lib/page-title";
import { pageSearchHit, postSearchHit } from "@/lib/search";
import { loadHeroClinicNames } from "@/lib/search-catalog";
import { SITE_URL } from "@/lib/site";

export const SITEMAP_PATH = "/sitemap";

export type SitemapLink = {
  group: "page" | "post";
  title: string;
  path: string;
  /** Prismic last publication time, when the document has one. */
  lastModified?: string;
  /** Reader-facing post date. */
  date?: string;
  /** `YYYY-MM-DD`, used to order posts. */
  published?: string;
};

type PageDoc = Parameters<typeof pageSearchHit>[0] & {
  last_publication_date?: string | null;
};

type PostDoc = Parameters<typeof postSearchHit>[0] & {
  last_publication_date?: string | null;
};

export function pageSitemapLink(
  page: PageDoc,
  heroClinicName?: string | null,
): SitemapLink | null {
  const hit = pageSearchHit(page, heroClinicName);
  if (!hit) return null;
  return {
    group: "page",
    title: hit.title,
    path: hit.href,
    lastModified: publishedTime(page.last_publication_date),
  };
}

export function postSitemapLink(post: PostDoc): SitemapLink | null {
  const hit = postSearchHit(post);
  if (!hit) return null;
  return {
    group: "post",
    title: hit.title,
    path: hit.href,
    lastModified: publishedTime(post.last_publication_date),
    date: hit.date,
    published: hit.published,
  };
}

export function organizeSitemap(links: readonly SitemapLink[]) {
  return {
    pages: links.filter((link) => link.group === "page").sort(byTitle),
    posts: links.filter((link) => link.group === "post").sort(byNewest),
  };
}

/** Absolute URLs for sitemap.xml. Home stays off while `/` is the placeholder. */
export function xmlSitemap(
  links: readonly SitemapLink[],
): MetadataRoute.Sitemap {
  const { pages, posts } = organizeSitemap(links);
  const sitemapPage: SitemapLink = {
    group: "page",
    title: "Sitemap",
    path: SITEMAP_PATH,
  };
  return [...pages, ...posts, sitemapPage].map((link) => ({
    url: sitemapUrl(link.path),
    ...(link.lastModified ? { lastModified: link.lastModified } : {}),
  }));
}

export function sitemapUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

export async function loadSitemapLinks(): Promise<SitemapLink[]> {
  const client = createClient();
  const [pages, posts] = await Promise.all([
    client.getAllByType("page"),
    client.getAllByType("post"),
  ]);
  const clinicNames = await loadHeroClinicNames(client, pages);

  return [
    ...pages.flatMap((page) => {
      const id = heroClinicId(page.data.slices);
      const link = pageSitemapLink(page, id && clinicNames.get(id));
      return link ? [link] : [];
    }),
    ...posts.flatMap((post) => {
      const link = postSitemapLink(post);
      return link ? [link] : [];
    }),
  ];
}

function publishedTime(value: string | null | undefined) {
  if (!value) return undefined;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return undefined;
  return new Date(time).toISOString();
}

function byTitle(a: SitemapLink, b: SitemapLink) {
  return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
}

function byNewest(a: SitemapLink, b: SitemapLink) {
  const left = a.published ?? "";
  const right = b.published ?? "";
  if (left !== right) return right.localeCompare(left);
  return byTitle(a, b);
}
