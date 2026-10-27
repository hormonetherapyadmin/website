import { isFilled, type LinkField, type SelectField } from "@prismicio/client";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import { CardList, Empty, FeaturedCard, HomeList, Pagination } from "./cards";
import { FilterableGrid } from "./filterable-grid";
import {
  postPageHref,
  selectPosts,
  POST_CATEGORY_OPTIONS,
  type PostCardData,
  type PostCategoryOption,
} from "./select";
import styles from "./posts.module.css";

export {
  categoryAddress,
  formatPostDate,
  pageWindow,
  postCategoryHref,
  postPageHref,
  selectPosts,
  POST_CATEGORIES,
  POST_CATEGORY_OPTIONS,
  type PostCardData,
  type PostCategoryOption,
} from "./select";

export const POST_VARIATIONS = [
  "home",
  "featured",
  "grid",
  "row",
  "picked",
] as const;

export type PostVariation = (typeof POST_VARIATIONS)[number];

type PostsPrimary = Partial<SliceSectionFields> & {
  category?: SelectField<PostCategoryOption> | string | null;
  /** Featured only. The page resolves this link and passes `featured`. */
  post?: LinkField | null;
  /** Picked only. Up to three posts, in the order she added them. */
  posts?: readonly { post?: LinkField | null }[] | null;
  /** Grid only. Empty means 12. */
  count?: number | null;
  /**
   * Grid only. Yes leaves the featured post out of the list. No repeats
   * it. Empty leaves it out when this page has a Featured slice.
   */
  hide_featured?: boolean | null;
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
   * The post a Featured slice on this page is showing. The grid uses it
   * when Hide the featured post is on, or still empty.
   */
  pageFeaturedHref?: string | null;
  /**
   * Keep the given order and category mix. Keep reading passes its
   * computed posts in this order.
   */
  keepOrder?: boolean;
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

/**
 * Which post the grid leaves out, and whether this grid draws the
 * feature itself. A category tab keeps that post out of the list too.
 */
export function gridFeature(options: {
  hideFeatured: boolean | null | undefined;
  pageFeaturedHref?: string | null;
  newestHref?: string;
}) {
  if (options.hideFeatured === false) {
    return { showInline: false as const };
  }

  if (options.hideFeatured === true) {
    if (options.pageFeaturedHref) {
      return {
        skipHref: options.pageFeaturedHref,
        showInline: false as const,
      };
    }
    return {
      skipHref: options.newestHref,
      showInline: Boolean(options.newestHref),
    };
  }

  if (options.pageFeaturedHref) {
    return { skipHref: options.pageFeaturedHref, showInline: false as const };
  }

  return { showInline: false as const };
}

/** The post a Featured slice shows. An empty Post is the newest. */
export function featuredPostHref(
  slice:
    | {
        variation: string;
        primary: {
          category?: string | null;
          post?: LinkField | null;
        };
      }
    | undefined,
  posts: readonly PostCardData[],
) {
  if (!slice || slice.variation !== "featured") return undefined;
  const picked = slice.primary.post;
  if (isFilled.link(picked) && picked.url) return picked.url;

  return selectPosts(posts, {
    category: slice.primary.category,
    limit: 1,
  }).items[0]?.href;
}

function limitFor(variation: PostVariation, count: number | null | undefined) {
  if (variation === "home") return 5;
  if (variation === "featured") return 1;
  if (variation === "row" || variation === "picked") return 3;
  return pageSize(count);
}

/**
 * The posts on a Picked slice, in field order. A link the page did not
 * load is left out. Three is the row.
 */
export function pickedPostCards(
  rows: readonly { post?: LinkField | null }[] | null | undefined,
  posts: readonly PostCardData[],
) {
  return (rows ?? [])
    .flatMap((row) => {
      const link = row.post;
      if (!link || !isFilled.link(link) || !link.url) return [];
      const card = posts.find((post) => post.href === link.url);
      return card ? [card] : [];
    })
    .slice(0, 3);
}

/**
 * Recent posts. Homepage is five, with the newest as the large card.
 * Featured is one post. Grid is a paged list with category tabs.
 * Row is three across, the newest in a category. Picked is that same
 * row, in the order she chose.
 */
export function Posts({
  variation,
  primary,
  posts = [],
  featured,
  page,
  activeCategory,
  skipHref,
  pageFeaturedHref,
  keepOrder = false,
  pageHref,
}: PostsProps) {
  const layout = choice(variation, POST_VARIATIONS, "home");
  const locked = choice(primary.category, POST_CATEGORY_OPTIONS, "All");
  const viewing =
    locked === "All"
      ? choice(activeCategory, POST_CATEGORY_OPTIONS, "All")
      : locked;

  const newest =
    layout === "grid"
      ? selectPosts(posts, {
          category: locked === "All" ? null : locked,
          limit: 1,
        }).items[0]
      : undefined;
  const feature =
    layout === "grid"
      ? gridFeature({
          hideFeatured: primary.hide_featured,
          pageFeaturedHref,
          newestHref: newest?.href,
        })
      : { showInline: false as const };
  const pinned = layout === "featured" && featured ? featured : null;
  const handPicked = layout === "picked";
  const selected = pinned
    ? { items: [pinned], total: 1, page: 1, pages: 1 }
    : selectPosts(posts, {
        category: layout === "featured" || handPicked ? null : viewing,
        limit: limitFor(layout, primary.count),
        page: layout === "grid" ? page : 1,
        skipHref:
          ("skipHref" in feature ? feature.skipHref : undefined) ??
          (viewing === "All" && !handPicked ? skipHref : undefined),
        keepOrder: keepOrder || handPicked,
      });

  const hrefForPage =
    pageHref ?? ((next: number) => postPageHref(next, viewing));

  const inlineFeature = feature.showInline ? newest : undefined;
  const tabs = layout === "grid" && locked === "All";

  return (
    <SliceSection section={primary}>
      {inlineFeature ? (
        <div className={styles.featureLead}>
          <FeaturedCard post={inlineFeature} />
        </div>
      ) : null}
      {tabs ? (
        <FilterableGrid
          posts={posts}
          category={viewing}
          page={page ?? 1}
          limit={limitFor(layout, primary.count)}
          pinnedSkip={"skipHref" in feature ? feature.skipHref : undefined}
          allSkip={skipHref}
          hideEmpty={Boolean(inlineFeature)}
        />
      ) : selected.items.length === 0 ? (
        inlineFeature ? null : (
          <Empty category={viewing} />
        )
      ) : layout === "featured" ? (
        <FeaturedCard post={selected.items[0]} />
      ) : layout === "home" ? (
        <HomeList posts={selected.items} />
      ) : (
        <CardList posts={selected.items} />
      )}
      {layout === "grid" && !tabs ? (
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
