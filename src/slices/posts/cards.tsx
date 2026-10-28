import Image from "next/image";
import type { MouseEvent } from "react";
import {
  formatPostDate,
  pageWindow,
  POST_CATEGORY_OPTIONS,
  type PostCardData,
  type PostCategoryOption,
} from "./select";
import styles from "./posts.module.css";

function tabLabel(category: PostCategoryOption) {
  return category === "All" ? "All posts" : category;
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

export function FeaturedCard({ post }: { post: PostCardData }) {
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

export function Empty({ category }: { category: PostCategoryOption }) {
  return (
    <p className={styles.empty}>
      {category === "All" ? "No posts yet." : "No posts in this category yet."}
    </p>
  );
}

export function Tabs({
  active,
  hrefFor,
  onSelect,
}: {
  active: PostCategoryOption;
  hrefFor: (category: PostCategoryOption) => string;
  onSelect?: (
    category: PostCategoryOption,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
}) {
  return (
    <nav aria-label="Categories">
      <ul className={styles.tabs}>
        {POST_CATEGORY_OPTIONS.map((category) => (
          <li key={category}>
            <a
              href={hrefFor(category)}
              aria-current={category === active ? "true" : undefined}
              onClick={
                onSelect
                  ? (event) => {
                      onSelect(category, event);
                    }
                  : undefined
              }
            >
              {tabLabel(category)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Pagination({
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

export function HomeList({ posts }: { posts: readonly PostCardData[] }) {
  return (
    <ul className={styles.home}>
      {posts.map((post, index) => (
        <li key={post.href} className={index === 0 ? styles.lead : undefined}>
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
  );
}

export function CardList({ posts }: { posts: readonly PostCardData[] }) {
  return (
    <ul className={styles.cards}>
      {posts.map((post) => (
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
  );
}
