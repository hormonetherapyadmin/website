"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CardList, Empty, Pagination, Tabs } from "./cards";
import {
  categoryAddress,
  postCategoryHref,
  postPageHref,
  POST_CATEGORY_OPTIONS,
  selectPosts,
  type PostCardData,
  type PostCategoryOption,
} from "./select";
import styles from "./posts.module.css";

const CATEGORY_EVENT = "posts-category";

function isCategory(value: string): value is PostCategoryOption {
  return POST_CATEGORY_OPTIONS.some((category) => category === value);
}

/**
 * Write the category into the address without a Next.js navigation.
 * The current history entry is already marked by Next, so passing it
 * skips the App Router's history patch. The page does not refetch or scroll.
 */
function writeCategory(category: PostCategoryOption) {
  const url = categoryAddress(
    window.location.pathname,
    category,
    window.location.hash,
  );
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: category }));
}

export function FilterableGrid({
  posts,
  category,
  page,
  limit,
  pinnedSkip,
  allSkip,
  hideEmpty = false,
}: {
  posts: readonly PostCardData[];
  category: PostCategoryOption;
  page: number;
  limit: number;
  /** Left out on every tab. The featured post. */
  pinnedSkip?: string;
  /** Left out only on All. */
  allSkip?: string;
  /** The feature above the grid is the only post, so no empty line. */
  hideEmpty?: boolean;
}) {
  const [active, setActive] = useState(category);
  const [currentPage, setCurrentPage] = useState(page);
  const [fade, setFade] = useState(0);
  const activeRef = useRef(category);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    function onCategory(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (!isCategory(next) || next === activeRef.current) return;
      activeRef.current = next;
      setActive(next);
      setCurrentPage(1);
      setFade((value) => value + 1);
    }

    window.addEventListener(CATEGORY_EVENT, onCategory);
    return () => window.removeEventListener(CATEGORY_EVENT, onCategory);
  }, []);

  function choose(
    next: PostCategoryOption,
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    if (next === active) return;
    writeCategory(next);
  }

  const selected = selectPosts(posts, {
    category: active,
    limit,
    page: currentPage,
    skipHref: pinnedSkip ?? (active === "All" ? allSkip : undefined),
  });
  const label = active === "All" ? "All posts" : active;
  const empty =
    selected.items.length === 0 && !hideEmpty
      ? active === "All"
        ? "No posts yet."
        : "No posts in this category yet."
      : "";

  return (
    <>
      <Tabs active={active} hrefFor={postCategoryHref} onSelect={choose} />
      <div key={fade} className={fade > 0 ? styles.fade : undefined}>
        {selected.items.length === 0 ? (
          hideEmpty ? null : (
            <Empty category={active} />
          )
        ) : (
          <CardList posts={selected.items} />
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {fade > 0 ? empty || label : ""}
      </p>
      <Pagination
        page={selected.page}
        pages={selected.pages}
        hrefFor={(next) => postPageHref(next, active)}
      />
    </>
  );
}
