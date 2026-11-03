import { asText, type RichTextField } from "@prismicio/client";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { createClient } from "@/prismicio";

/** The live Wix feed listed the latest 20 posts. This feed does the same. */
export const BLOG_FEED_LIMIT = 20;

export const BLOG_FEED_PATH = "/blog-feed.xml";

/**
 * Card fields plus the indexing flag. The story stays out of the feed.
 * Prismic's graph query needs a newline after the opening brace.
 */
export const BLOG_FEED_GRAPH_QUERY = `{
  post {
    title
    sub_title
    meta_description
    published_date
    indexing
  }
}`;

const CHANNEL_DESCRIPTION =
  "Peggy's first-person guide to online hormone replacement therapy (HRT) and bioidentical hormone replacement therapy (BHRT).";

export type BlogFeedSource = {
  uid?: string | null;
  url?: string | null;
  data: {
    title?: RichTextField | null;
    sub_title?: RichTextField | null;
    meta_description?: string | null;
    published_date?: string | null;
    indexing?: boolean | null;
  };
};

export type BlogFeedEntry = {
  title: string;
  path: string;
  description?: string;
  /** RFC 1123, from the post's Published date. */
  published?: string;
};

/** Indexable posts, newest Published date first, capped at the feed length. */
export function blogFeedEntries(
  posts: readonly BlogFeedSource[],
  limit = BLOG_FEED_LIMIT,
): BlogFeedEntry[] {
  return posts
    .flatMap((post) => {
      if (post.data.indexing === false) return [];
      const title = asText(post.data.title ?? []).trim();
      const path = postPath(post);
      if (!title || !path) return [];
      const published = rssDate(post.data.published_date);
      const description = feedDescription(
        title,
        asText(post.data.sub_title ?? []),
        post.data.meta_description,
      );
      return [
        {
          title,
          path,
          sort: post.data.published_date?.trim() ?? "",
          ...(description ? { description } : {}),
          ...(published ? { published } : {}),
        },
      ];
    })
    .sort((a, b) => {
      const byDate = b.sort.localeCompare(a.sort);
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title, "en");
    })
    .slice(0, limit)
    .map((entry) => ({
      title: entry.title,
      path: entry.path,
      ...(entry.description ? { description: entry.description } : {}),
      ...(entry.published ? { published: entry.published } : {}),
    }));
}

export function blogFeedXml(entries: readonly BlogFeedEntry[]) {
  const self = absolute(BLOG_FEED_PATH);
  const items = entries
    .map((entry) => {
      const link = absolute(entry.path);
      const lines = [
        "    <item>",
        `      <title>${xml(entry.title)}</title>`,
        `      <link>${xml(link)}</link>`,
        `      <guid isPermaLink="true">${xml(link)}</guid>`,
      ];
      if (entry.published) {
        lines.push(`      <pubDate>${xml(entry.published)}</pubDate>`);
      }
      if (entry.description) {
        lines.push(
          `      <description>${xml(entry.description)}</description>`,
        );
      }
      lines.push("    </item>");
      return lines.join("\n");
    })
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${xml(SITE_NAME)}</title>`,
    `    <link>${xml(`${SITE_URL}/blog`)}</link>`,
    `    <description>${xml(CHANNEL_DESCRIPTION)}</description>`,
    `    <language>en</language>`,
    `    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>`,
    items,
    `  </channel>`,
    `</rss>`,
    ``,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

/** Published posts still set to Index. Draft preview is left out. */
export async function loadBlogFeedEntries() {
  const posts = await createClient({}, { preview: false }).getAllByType(
    "post",
    { graphQuery: BLOG_FEED_GRAPH_QUERY },
  );
  return blogFeedEntries(posts);
}

function postPath(post: BlogFeedSource) {
  const url = post.url?.split(/[?#]/)[0];
  if (url?.startsWith("/post/")) return url;
  if (post.uid) return `/post/${post.uid}`;
  return null;
}

function feedDescription(
  title: string,
  subtitle: string,
  metaDescription: string | null | undefined,
) {
  for (const candidate of [subtitle, metaDescription ?? ""]) {
    const clean = candidate.replace(/\s+/g, " ").trim();
    if (clean && clean.toLowerCase() !== title.trim().toLowerCase()) {
      return clean;
    }
  }
  return undefined;
}

/** A `YYYY-MM-DD` Published date, as an RSS date. Anything else is left off. */
export function rssDate(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T00:00:00.000Z`
    : trimmed;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return undefined;
  return new Date(time).toUTCString();
}

function absolute(path: string) {
  return new URL(path, SITE_URL).href;
}

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
