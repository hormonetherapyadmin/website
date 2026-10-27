export const POST_CATEGORIES = [
  "Telehealth brand reviews",
  "Formulations & dosages",
  "My experience & results",
  "Testing, labs & tracking",
  "Cost, insurance & access",
] as const;

export const POST_CATEGORY_OPTIONS = ["All", ...POST_CATEGORIES] as const;

export type PostCategoryOption = (typeof POST_CATEGORY_OPTIONS)[number];

/** A blog post, provider review, or comparison, reduced to the card. */
export type PostCardData = {
  title: string;
  href: string;
  image?: { src: string; alt?: string };
  excerpt?: string;
  /** `YYYY-MM-DD` or a full timestamp. Newest published date comes first. */
  published?: string;
  readTime?: number;
  category?: string;
};

export function formatPostDate(iso: string | undefined) {
  if (!iso) return "";
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function postCategoryHref(category: PostCategoryOption) {
  if (category === "All") return "?";
  return `?category=${encodeURIComponent(category)}`;
}

/** The address a category tab writes. All drops the query and keeps the hash. */
export function categoryAddress(
  pathname: string,
  category: PostCategoryOption,
  hash = "",
) {
  const query = postCategoryHref(category);
  return `${pathname}${query === "?" ? "" : query}${hash}`;
}

export function postPageHref(page: number, category: PostCategoryOption) {
  const params = new URLSearchParams();
  if (category !== "All") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "?";
}

export function selectPosts(
  posts: readonly PostCardData[],
  options: {
    category?: string | null;
    limit: number;
    page?: number;
    skipHref?: string;
    keepOrder?: boolean;
  },
) {
  const skip = options.skipHref;
  const available = posts.filter(
    (post) => post.title && post.href && post.href !== skip,
  );

  if (options.keepOrder) {
    return {
      items: available.slice(0, options.limit),
      total: available.length,
      page: 1,
      pages: 1,
    };
  }

  const category =
    options.category && options.category !== "All" ? options.category : null;
  const filtered = available
    .filter((post) => !category || post.category === category)
    .slice()
    .sort((a, b) => {
      const byDate = (b.published ?? "").localeCompare(a.published ?? "");
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title);
    });

  const pages = Math.max(1, Math.ceil(filtered.length / options.limit));
  const page = Math.min(Math.max(1, options.page ?? 1), pages);
  const start = (page - 1) * options.limit;

  return {
    items: filtered.slice(start, start + options.limit),
    total: filtered.length,
    page,
    pages,
  };
}

/** Page numbers for the grid. A gap stands in for a skipped run. */
export function pageWindow(current: number, pages: number) {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  const items: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(pages - 1, current + 1);
  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < pages - 1) items.push("gap");
  items.push(pages);
  return items;
}
