import type { Metadata } from "next";
import {
  Clock01Icon,
  Location01Icon,
  Medicine02Icon,
  SquareLock01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import shared from "../_shared/mockup.module.css";
import { MockupShell } from "../_shared/mockup-shell";
import { POSTS, POST_KINDS, PostCard, TOPICS } from "../_shared/posts";
import styles from "./blog.module.css";

/*
  All-posts design mockup. Posts are the 13 most recent from the live Wix
  blog feed (October 2026); the live blog has 142. Pagination links use the
  live /blog/page/N URLs. The ?type= filter is mockup-only: production
  filter URLs need an indexing decision (see docs/SEO_AEO_GEO.md).
*/

export const metadata: Metadata = {
  title: "Blog mockup",
  robots: { index: false, follow: false },
};

const TOTAL_PAGES = 12;

const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px";

// Existing copy from the bottom of the live /blog page.
const TELEHEALTH_REASONS = [
  {
    label: "Convenience",
    icon: Clock01Icon,
    text: "Purchasing HRT online can be more convenient than visiting a physical pharmacy or clinic, especially for individuals with busy schedules or limited mobility.",
  },
  {
    label: "Privacy",
    icon: SquareLock01Icon,
    text: "Some people prefer the privacy and anonymity of purchasing HRT online, especially if they are uncomfortable discussing their medical needs in person.",
  },
  {
    label: "Access",
    icon: Medicine02Icon,
    text: "Online pharmacies may offer a wider selection of HRT options than local pharmacies, allowing individuals to find the specific medication that works best for them.",
  },
  {
    label: "Cost savings",
    icon: Wallet01Icon,
    text: "Online pharmacies may offer lower prices for HRT medications compared to traditional brick-and-mortar pharmacies, especially if they operate with lower overhead costs.",
  },
  {
    label: "Accessibility",
    icon: Location01Icon,
    text: "For individuals who live in remote areas or areas without easy access to healthcare facilities, buying HRT online can be a way to obtain necessary medications without traveling long distances.",
  },
];

export default async function BlogMockup(props: PageProps<"/mockup/blog">) {
  const searchParams = await props.searchParams;
  const kind = POST_KINDS.find((item) => item.slug === searchParams.type);
  const lead = kind ? undefined : POSTS[0];
  const posts = kind
    ? POSTS.filter((post) => post.kind === kind.label)
    : POSTS.slice(1);

  return (
    <MockupShell searchParams={searchParams}>
      <header className={styles.indexHead}>
        <h1 className={styles.indexTitle}>Blog</h1>
        <p className={styles.indexDek}>
          Clinic reviews, pricing, and what I’ve learned using hormone therapy.
        </p>
        <nav aria-label="Filter posts" className={styles.filters}>
          <ul>
            <li>
              <a href="?" aria-current={kind ? undefined : "page"}>
                All posts
              </a>
            </li>
            {POST_KINDS.map((item) => (
              <li key={item.slug}>
                <a
                  href={`?type=${item.slug}`}
                  aria-current={item === kind ? "page" : undefined}
                >
                  {item.plural}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className={styles.index}>
        {lead && (
          <PostCard
            post={lead}
            className={styles.featuredCard}
            sizes="(max-width: 960px) 100vw, 720px"
            preload
          />
        )}

        <section aria-labelledby="list-title">
          <h2 id="list-title" className={styles.listHeading}>
            {kind ? kind.plural : "More posts"}
          </h2>
          <div className={styles.cardGrid}>
            {posts.map((post) => (
              <PostCard
                key={post.href}
                post={post}
                className={styles.card}
                sizes={CARD_SIZES}
              />
            ))}
          </div>
        </section>

        <nav aria-label="Pagination" className={styles.pagination}>
          <ul>
            {[1, 2, 3].map((page) => (
              <li key={page}>
                <a
                  href={page === 1 ? "/blog" : `/blog/page/${page}`}
                  aria-current={page === 1 ? "page" : undefined}
                >
                  <span className={shared.srOnly}>Page </span>
                  {page}
                </a>
              </li>
            ))}
            <li aria-hidden="true">…</li>
            <li>
              <a href={`/blog/page/${TOTAL_PAGES}`}>
                <span className={shared.srOnly}>Page </span>
                {TOTAL_PAGES}
              </a>
            </li>
            <li>
              <a href="/blog/page/2" className={styles.nextPage}>
                Older posts
              </a>
            </li>
          </ul>
        </nav>

        <nav className={shared.topics} aria-label="Browse by topic">
          <span>Browse by topic:</span>
          {TOPICS.map((topic) => (
            <a key={topic.href} href={topic.href}>
              {topic.label}
            </a>
          ))}
        </nav>

        <section className={styles.why} aria-labelledby="why-title">
          <h2 id="why-title">
            Why would I want to consider starting my HRT Journey with an on-line
            or telehealth provider?
          </h2>
          <p>
            There are several reasons why someone might consider buying Hormone
            Replacement Therapy (HRT) online:
          </p>
          <ul className={styles.whyGrid}>
            {TELEHEALTH_REASONS.map((reason) => (
              <li key={reason.label}>
                <span className={styles.whyIcon} aria-hidden="true">
                  <HugeiconsIcon
                    icon={reason.icon}
                    size={22}
                    strokeWidth={1.6}
                  />
                </span>
                <h3>{reason.label}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MockupShell>
  );
}
