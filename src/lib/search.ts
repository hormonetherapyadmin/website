/**
 * Site search over published Pages and Posts.
 * The browser filters this catalog as you type. See docs/CONTENT_MODEL.md.
 */

import { heroTitle } from "@/lib/page-title";
import { APP_ROUTE_UIDS } from "@/lib/site";

const TEXT_LIMIT = 2000;

const SKIP_KEYS = new Set([
  "url",
  "id",
  "link_type",
  "key",
  "width",
  "height",
  "dimensions",
  "edit",
  "copyright",
  "kind",
  "variation",
  "slice_type",
  "slice_label",
  "version",
  "target",
  "lang",
  "spans",
  "direction",
  "type",
  "side",
  "background",
  "box_background",
  "space_above",
  "space_below",
]);

export type SearchKind = "page" | "post";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  href: string;
  excerpt?: string;
  image?: string;
  /** Shown on the card. "Page", or a post category when one is set. */
  label: string;
  /** `YYYY-MM-DD`. Newest posts in a tie come first. */
  published?: string;
  date?: string;
  /** Plain text the query is matched against. Not shown. */
  text: string;
};

export type SearchGroup = {
  kind: SearchKind;
  label: "Pages" | "Blog";
  hits: SearchHit[];
};

type SearchSource = {
  id: string;
  uid?: string | null;
  url?: string | null;
};

export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function searchQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").slice(0, 200);
}

export function resultLead(count: number) {
  if (count === 0) return "No results for";
  if (count === 1) return "Found 1 result for";
  return `Found ${count} results for`;
}

export function groupResults(
  hits: readonly SearchHit[],
  query: string,
): SearchGroup[] {
  const term = query.trim();
  const words = normalizeSearch(term).split(" ").filter(Boolean);
  if (!term || words.length === 0) return [];

  const matched = hits.filter((hit) => {
    const haystack = normalizeSearch(hit.text);
    return words.every((word) => haystack.includes(word));
  });

  const groups: SearchGroup[] = [];
  for (const kind of ["page", "post"] as const) {
    const inKind = matched
      .filter((hit) => hit.kind === kind)
      .sort(byRelevance(words));
    if (inKind.length === 0) continue;
    groups.push({
      kind,
      label: kind === "page" ? "Pages" : "Blog",
      hits: inKind,
    });
  }
  return groups;
}

/**
 * A Page's search entry, also its sitemap entry. The title is the page's
 * `h1`. A provider Hero's `h1` is the clinic name, so pass the name of the
 * clinic that Hero points at.
 */
export function pageSearchHit(
  page: SearchSource & {
    data: {
      meta_title?: string | null;
      meta_description?: string | null;
      meta_image?: unknown;
      indexing?: boolean | null;
      slices?: unknown;
    };
  },
  heroClinicName?: string | null,
): SearchHit | null {
  if (page.data.indexing === false) return null;

  const title =
    heroTitle(page.data.slices, heroClinicName) ||
    page.data.meta_title?.trim() ||
    sliceHeading(page.data.slices) ||
    "";
  const href = publicPath(page.url, page.uid ? `/${page.uid}` : "");
  if (!title || !href) return null;

  const description = page.data.meta_description?.trim() || "";
  return {
    id: page.id,
    kind: "page",
    title,
    href,
    excerpt: excerpt(title, description),
    image: firstImage(page.data.slices, page.data.meta_image),
    label: "Page",
    text: haystack(
      [title, page.data.meta_title, description],
      page.data.slices,
    ),
  };
}

export function postSearchHit(
  post: SearchSource & {
    data: {
      title?: unknown;
      sub_title?: unknown;
      image?: unknown;
      meta_title?: string | null;
      meta_description?: string | null;
      meta_image?: unknown;
      category?: string | null;
      published_date?: string | null;
      indexing?: boolean | null;
      body?: unknown;
    };
  },
): SearchHit | null {
  if (post.data.indexing === false) return null;

  const title = richText(post.data.title) || post.data.meta_title?.trim() || "";
  const href = publicPath(post.url, post.uid ? `/post/${post.uid}` : "");
  if (!title || !href) return null;

  const subtitle = richText(post.data.sub_title);
  const description = post.data.meta_description?.trim() || "";
  const published = post.data.published_date?.trim() || undefined;

  return {
    id: post.id,
    kind: "post",
    title,
    href,
    excerpt: excerpt(title, subtitle, description),
    image: imageUrl(post.data.image) ?? imageUrl(post.data.meta_image),
    label: post.data.category?.trim() || "",
    published,
    date: formatSearchDate(published),
    text: haystack(
      [title, subtitle, post.data.meta_title, description, post.data.category],
      post.data.body,
    ),
  };
}

function byRelevance(words: string[]) {
  return (a: SearchHit, b: SearchHit) => {
    const rank = titleRank(a.title, words) - titleRank(b.title, words);
    if (rank !== 0) return rank;
    if (a.kind === "post" && b.kind === "post") {
      const left = a.published ?? "";
      const right = b.published ?? "";
      if (left !== right) {
        if (!left) return 1;
        if (!right) return -1;
        return right.localeCompare(left);
      }
    }
    return a.title.localeCompare(b.title, "en");
  };
}

function titleRank(title: string, words: string[]) {
  const haystack = normalizeSearch(title);
  const found = words.filter((word) => haystack.includes(word)).length;
  if (found === words.length) return 0;
  if (found > 0) return 1;
  return 2;
}

function publicPath(url: string | null | undefined, fallback: string) {
  const path = (url || fallback).split(/[?#]/)[0];
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (APP_ROUTE_UIDS.has(path.slice(1))) return null;
  return path;
}

function excerpt(title: string, ...candidates: (string | undefined)[]) {
  const same = normalizeSearch(title);
  for (const candidate of candidates) {
    const clean = candidate?.replace(/\s+/g, " ").trim();
    if (!clean || normalizeSearch(clean) === same) continue;
    if (clean.length <= 160) return clean;
    const cut = clean.slice(0, 157);
    const last = cut.lastIndexOf(" ");
    const shortened = (last > 80 ? cut.slice(0, last) : cut).trimEnd();
    return `${shortened}…`;
  }
  return undefined;
}

function haystack(lead: (string | null | undefined)[], rest: unknown) {
  const parts: string[] = [];
  for (const item of lead) {
    if (item) pushText(parts, item);
  }
  walk(rest, parts, 0);
  return parts.join(" ").slice(0, TEXT_LIMIT);
}

function walk(value: unknown, parts: string[], depth: number) {
  if (depth > 8 || parts.join(" ").length >= TEXT_LIMIT) return;

  if (typeof value === "string") {
    pushText(parts, value);
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isRichBlock)) {
      pushText(parts, value.map((block) => block.text).join(" "));
      return;
    }
    for (const item of value) walk(item, parts, depth + 1);
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (SKIP_KEYS.has(key)) continue;
    walk(child, parts, depth + 1);
  }
}

function isRichBlock(value: unknown): value is { text: string } {
  return (
    !!value &&
    typeof value === "object" &&
    "text" in value &&
    typeof value.text === "string" &&
    "type" in value
  );
}

/** The first section heading, for a page with no Hero and no Meta title. */
function sliceHeading(slices: unknown) {
  if (!Array.isArray(slices)) return "";
  for (const slice of slices) {
    if (!slice || typeof slice !== "object" || !("primary" in slice)) continue;
    const primary = slice.primary;
    if (!primary || typeof primary !== "object") continue;
    const fields = primary as Record<string, unknown>;
    for (const key of ["heading", "title"]) {
      const text = richText(fields[key]);
      if (text) return text;
    }
  }
  return "";
}

function richText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .filter(isRichBlock)
    .map((block) => block.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function pushText(parts: string[], value: string) {
  const clean = value
    .replace(/\{\{provider:([^:}]+):[^}]+\}\}/gi, " $1 ")
    .replace(/\{\{[^}]+\}\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean) parts.push(clean);
}

function firstImage(slices: unknown, metaImage: unknown) {
  if (Array.isArray(slices)) {
    for (const slice of slices) {
      if (!slice || typeof slice !== "object" || !("primary" in slice))
        continue;
      const primary = slice.primary;
      if (!primary || typeof primary !== "object") continue;
      const fields = primary as Record<string, unknown>;
      const found = imageUrl(fields.image) ?? imageUrl(fields.product);
      if (found) return found;
    }
  }
  return imageUrl(metaImage);
}

function imageUrl(value: unknown) {
  if (!value || typeof value !== "object") return;
  const image = value as { url?: unknown; dimensions?: unknown };
  if (typeof image.url !== "string" || !image.url) return;
  if (!image.dimensions || typeof image.dimensions !== "object") return;
  return image.url;
}

function formatSearchDate(iso: string | undefined) {
  if (!iso) return;
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
