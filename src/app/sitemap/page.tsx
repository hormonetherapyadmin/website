import type { Metadata } from "next";
import { MockupShell } from "@/app/mockup/_shared/mockup-shell";
import { isIndexingAllowed } from "@/lib/env";
import { loadSitemapLinks, organizeSitemap, SITEMAP_PATH } from "@/lib/sitemap";
import styles from "./sitemap.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const index = isIndexingAllowed();
  return {
    title: "Sitemap",
    description: "Pages and blog posts on Hormone Therapy Hub.",
    alternates: { canonical: SITEMAP_PATH },
    robots: { index, follow: index },
  };
}

export default async function SitemapPage(props: PageProps<"/sitemap">) {
  const searchParams = await props.searchParams;
  const { pages, posts } = organizeSitemap(await loadSitemapLinks());
  const pageLinks = [
    { title: "Home", path: "/" },
    ...pages,
    { title: "Sitemap", path: SITEMAP_PATH, current: true },
  ];

  return (
    <MockupShell searchParams={searchParams}>
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Sitemap</h1>
        <p className={styles.lede}>
          {countLabel(pageLinks.length, "page", "pages")} and{" "}
          {countLabel(posts.length, "blog post", "blog posts")}.
        </p>
        <div className={styles.groups}>
          <section aria-labelledby="sitemap-pages">
            <h2 id="sitemap-pages" className={styles.groupTitle}>
              Pages
            </h2>
            <ul className={styles.list}>
              {pageLinks.map((link) => (
                <li key={link.path} className={styles.item}>
                  <a
                    href={link.path}
                    className={styles.link}
                    aria-current={
                      "current" in link && link.current ? "page" : undefined
                    }
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="sitemap-posts">
            <h2 id="sitemap-posts" className={styles.groupTitle}>
              Blog
            </h2>
            {posts.length === 0 ? (
              <p className={styles.empty}>
                Published posts will be listed here.
              </p>
            ) : (
              <ul className={styles.list}>
                {posts.map((post) => (
                  <li key={post.path} className={styles.item}>
                    <a href={post.path} className={styles.link}>
                      {post.title}
                    </a>
                    {post.date ? (
                      <time dateTime={post.published}>{post.date}</time>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </MockupShell>
  );
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
