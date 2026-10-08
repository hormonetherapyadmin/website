import type { LinkField, SelectField } from "@prismicio/client";
import Image from "next/image";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./posts.module.css";

export const POST_CATEGORIES = [
  "Review",
  "Comparison",
  "My experience",
  "HRT 101",
] as const;

export const POST_CATEGORY_OPTIONS = ["All", ...POST_CATEGORIES] as const;

export type PostCategoryOption = (typeof POST_CATEGORY_OPTIONS)[number];

const TAB_LABEL: Record<PostCategoryOption, string> = {
  All: "All posts",
  Review: "Reviews",
  Comparison: "Comparisons",
  "My experience": "My experience",
  "HRT 101": "HRT 101",
};

export const POST_VARIATIONS = ["home", "featured", "grid", "row"] as const;

export type PostVariation = (typeof POST_VARIATIONS)[number];

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

type PostsPrimary = {
  section?: readonly SliceSectionFields[] | null;
  category?: SelectField<PostCategoryOption> | string | null;
  /** Featured only. The page resolves this link and passes `featured`. */
  post?: LinkField | null;
  /** Grid only. Empty means 12. */
  count?: number | null;
};

export type PostsProps = {
  variation: PostVariation | string;
  primary: PostsPrimary;
  /** The page loads these. Newest-first selection happens here. */
  posts?: readonly PostCardData[];
  /** Featured variation. A picked post. Empty means the newest. */
  featured?: PostCardData | null;
  /** Grid variation. 1-based. */
  page?: number;
  /**
   * The visitor's tab. Used when Category is All.
   * A chosen Category hides the tabs and ignores this.
   */
  activeCategory?: string | null;
  /** Left out of the list. The blog page passes the featured post. */
  skipHref?: string;
  /**
   * Keep the given order and category mix. Keep reading passes its
   * computed posts in this order.
   */
  keepOrder?: boolean;
  categoryHref?: (category: PostCategoryOption) => string;
  pageHref?: (page: number) => string;
};

function choice<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  for (const option of allowed) {
    if (option === value) return option;
  }
  return fallback;
}

/** Empty or invalid becomes 12, the blog page size. */
export function pageSize(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    return 12;
  }
  return Math.floor(value);
}

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

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14V10.5M9 3h6M12 3v3" />
    </svg>
  );
}

function Meta({ post }: { post: PostCardData }) {
  const date = formatPostDate(post.published);
  const minutes =
    typeof post.readTime === "number" && post.readTime > 0
      ? post.readTime
      : null;

  return (
    <p className={styles.meta}>
      {post.category ? (
        <span className={styles.kind}>{post.category}</span>
      ) : null}
      {date ? (
        <time dateTime={post.published}>
          <CalendarIcon />
          {date}
        </time>
      ) : null}
      {minutes ? (
        <span>
          <TimerIcon />
          {minutes} min read
        </span>
      ) : null}
    </p>
  );
}

function CardImage({
  post,
  sizes,
  preload = false,
  className,
}: {
  post: PostCardData;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (!post.image?.src) return null;

  return (
    <div className={className ?? styles.image}>
      <Image
        src={post.image.src}
        alt=""
        fill
        sizes={sizes}
        preload={preload}
        className={styles.photo}
      />
    </div>
  );
}

function CardBody({
  post,
  lead = false,
}: {
  post: PostCardData;
  lead?: boolean;
}) {
  return (
    <>
      <Meta post={post} />
      <h3 className={lead ? styles.leadTitle : styles.title}>
        <a href={post.href}>{post.title}</a>
      </h3>
      {post.excerpt ? (
        <p className={lead ? styles.leadExcerpt : styles.excerpt}>
          {post.excerpt}
        </p>
      ) : null}
    </>
  );
}

function FeaturedCard({ post }: { post: PostCardData }) {
  return (
    <article className={styles.featured}>
      <CardImage
        post={post}
        sizes="(max-width: 960px) 100vw, 720px"
        preload
        className={styles.featuredImage}
      />
      <div className={styles.featuredBody}>
        <CardBody post={post} lead />
      </div>
    </article>
  );
}

function Empty({ category }: { category: PostCategoryOption }) {
  return (
    <p className={styles.empty}>
      {category === "All" ? "No posts yet." : "No posts in this category yet."}
    </p>
  );
}

function Tabs({
  active,
  hrefFor,
}: {
  active: PostCategoryOption;
  hrefFor: (category: PostCategoryOption) => string;
}) {
  return (
    <nav aria-label="Categories">
      <ul className={styles.tabs}>
        {POST_CATEGORY_OPTIONS.map((category) => (
          <li key={category}>
            <a
              href={hrefFor(category)}
              aria-current={category === active ? "true" : undefined}
            >
              {TAB_LABEL[category]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Pagination({
  page,
  pages,
  hrefFor,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
}) {
  if (pages < 2) return null;

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      <ul>
        {pageWindow(page, pages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <a
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
              >
                <span className="sr-only">Page </span>
                {item}
              </a>
            </li>
          ),
        )}
        {page < pages ? (
          <li>
            <a href={hrefFor(page + 1)} className={styles.older}>
              Older posts
            </a>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

function limitFor(variation: PostVariation, count: number | null | undefined) {
  if (variation === "home") return 5;
  if (variation === "featured") return 1;
  if (variation === "row") return 3;
  return pageSize(count);
}

/**
 * Recent posts. Homepage is five, with the newest as the large card.
 * Featured is one post. Grid is a paged list with category tabs.
 * Row is three across.
 */
export function Posts({
  variation,
  primary,
  posts = [],
  featured,
  page,
  activeCategory,
  skipHref,
  keepOrder = false,
  categoryHref = postCategoryHref,
  pageHref,
}: PostsProps) {
  const layout = choice(variation, POST_VARIATIONS, "home");
  const locked = choice(primary.category, POST_CATEGORY_OPTIONS, "All");
  const viewing =
    locked === "All"
      ? choice(activeCategory, POST_CATEGORY_OPTIONS, "All")
      : locked;

  const pinned = layout === "featured" && featured ? featured : null;
  const selected = pinned
    ? { items: [pinned], total: 1, page: 1, pages: 1 }
    : selectPosts(posts, {
        category: viewing,
        limit: limitFor(layout, primary.count),
        page: layout === "grid" ? page : 1,
        skipHref: viewing === "All" ? skipHref : undefined,
        keepOrder,
      });

  const hrefForPage =
    pageHref ?? ((next: number) => postPageHref(next, viewing));

  return (
    <SliceSection section={primary.section}>
      {layout === "grid" && locked === "All" ? (
        <Tabs active={viewing} hrefFor={categoryHref} />
      ) : null}
      {selected.items.length === 0 ? (
        <Empty category={viewing} />
      ) : layout === "featured" ? (
        <FeaturedCard post={selected.items[0]} />
      ) : layout === "home" ? (
        <ul className={styles.home}>
          {selected.items.map((post, index) => (
            <li
              key={post.href}
              className={index === 0 ? styles.lead : undefined}
            >
              <article className={styles.card}>
                <CardImage
                  post={post}
                  sizes={
                    index === 0
                      ? "(max-width: 960px) 100vw, 50vw"
                      : "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 30vw"
                  }
                  preload={index === 0}
                />
                <CardBody post={post} lead={index === 0} />
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.cards}>
          {selected.items.map((post) => (
            <li key={post.href}>
              <article className={styles.card}>
                <CardImage
                  post={post}
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px"
                />
                <CardBody post={post} />
              </article>
            </li>
          ))}
        </ul>
      )}
      {layout === "grid" ? (
        <Pagination
          page={selected.page}
          pages={selected.pages}
          hrefFor={hrefForPage}
        />
      ) : null}
    </SliceSection>
  );
}

export default Posts;
