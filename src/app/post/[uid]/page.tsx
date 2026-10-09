import {
  asText,
  isFilled,
  NotFoundError,
  type ImageField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { Calendar01Icon, Timer01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { storyClinicUids } from "@/components/content-blocks";
import {
  PostSources,
  PostStory,
  SourceReference,
} from "@/components/post-story";
import { storyLinkRel } from "@/lib/affiliate-link";
import { resolveAuthorId } from "@/lib/author";
import { isIndexingAllowed } from "@/lib/env";
import { headingAnchors } from "@/lib/post-headings";
import { minutesToRead, relatedPosts } from "@/lib/post-derived";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { tokenClinic } from "@/lib/token-clinic";
import { createClient } from "@/prismicio";
import type {
  AuthorDocument,
  PostDocument,
  ProviderDocument,
} from "../../../../prismicio-types";
import {
  DISCLOSURE_HREF,
  MockupShell,
} from "../../mockup/_shared/mockup-shell";
import shared from "../../mockup/_shared/mockup.module.css";
import { POSTS, formatDate } from "../../mockup/_shared/posts";
import styles from "../../mockup/blog/blog.module.css";
import { InThisPost } from "../../mockup/blog/in-this-post";
import { Share } from "../../mockup/blog/share";

const PEGGY_PORTRAIT = "/mockup/peggy-portrait.jpg";
const PEGGY_NAME = "Peggy B.";

/** The mockup post's Keep reading row. Used until another post is published. */
const MOCK_KEEP_READING = [
  "/post/musely-eye-serum-review-can-it-fix-menopausal-dark-circles-wrinkles",
  "/post/oestra-by-inner-balance-my-honest-1-year-review",
  "/post/ivim-review-hrt-glp-1-menopause-weight-gain",
];

type KeepReadingCard = {
  id: string;
  uid: string;
  category: string | null;
  published: string;
  title: string;
  excerpt: string;
  read: number;
  image: string;
};

function mockKeepReading(currentUid: string): KeepReadingCard[] {
  const current = `/post/${currentUid}`;
  const byHref = new Map(POSTS.map((item) => [item.href, item]));

  return MOCK_KEEP_READING.flatMap((href) => {
    const item = byHref.get(href);
    if (!item || item.href === current) return [];
    return [
      {
        id: item.href,
        uid: item.href.slice("/post/".length),
        category: item.kind,
        published: item.published,
        title: item.title,
        excerpt: item.excerpt ?? "",
        read: Number.parseInt(item.read, 10) || 0,
        image: item.image,
      },
    ];
  });
}

async function loadPost(uid: string) {
  const client = createClient();
  try {
    return await client.getByUID("post", uid, {
      fetchLinks: [
        "author.name",
        "author.name_title",
        "author.about",
        "author.profile",
      ],
    });
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

function textOf(field: RichTextField | null | undefined) {
  if (!field) return "";
  return asText(field).trim();
}

function metaTitle(post: PostDocument) {
  return post.data.meta_title?.trim() || textOf(post.data.title);
}

function metaDescription(post: PostDocument) {
  return post.data.meta_description?.trim() || textOf(post.data.sub_title);
}

function canonicalOf(post: PostDocument) {
  const link = post.data.canonical;
  if (isFilled.link(link) && link.link_type === "Web") return link.url;
  return `/post/${post.uid}`;
}

function socialImage(post: PostDocument) {
  if (isFilled.image(post.data.meta_image)) return post.data.meta_image;
  if (isFilled.image(post.data.image)) return post.data.image;
  return null;
}

function sourceLabel(link: LinkField, detail: string | null) {
  if ("text" in link && typeof link.text === "string" && link.text.trim()) {
    return link.text.trim();
  }
  if (link.link_type === "Web" && "url" in link && link.url) {
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return detail || "Source";
    }
  }
  return detail || "Source";
}

async function loadAuthor(post: PostDocument) {
  const author = post.data.author;
  if (
    isFilled.contentRelationship(author) &&
    "data" in author &&
    author.data &&
    typeof author.data === "object"
  ) {
    return author.data as AuthorDocument["data"];
  }

  try {
    const doc = await createClient().getByID<AuthorDocument>(
      resolveAuthorId(author),
    );
    return doc.data;
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

function authorName(data: AuthorDocument["data"] | null) {
  const name = data?.name?.trim();
  return name || PEGGY_NAME;
}

function authorTitle(data: AuthorDocument["data"] | null) {
  return data?.name_title?.trim() || "";
}

export async function generateMetadata(
  props: PageProps<"/post/[uid]">,
): Promise<Metadata> {
  const { uid } = await props.params;
  const post = await loadPost(uid);
  if (!post) return {};

  const title = metaTitle(post);
  const description = metaDescription(post);
  const image = socialImage(post);
  const index = isIndexingAllowed() && post.data.indexing !== false;

  return {
    title,
    description: description || undefined,
    alternates: { canonical: canonicalOf(post) },
    robots: { index, follow: index },
    openGraph: {
      title,
      description: description || undefined,
      url: `/post/${post.uid}`,
      siteName: SITE_NAME,
      images: image?.url
        ? [{ url: image.url, alt: image.alt ?? "" }]
        : undefined,
    },
  };
}

export default async function PostPage(props: PageProps<"/post/[uid]">) {
  const { uid } = await props.params;
  const searchParams = await props.searchParams;
  const post = await loadPost(uid);
  if (!post) notFound();

  const client = createClient();
  const clinicUids = storyClinicUids(post.data.body);
  const [draft, author, catalog, providers] = await Promise.all([
    draftMode(),
    loadAuthor(post),
    client.getAllByType("post"),
    clinicUids.length
      ? client.getAllByUIDs("provider", clinicUids)
      : Promise.resolve([] as ProviderDocument[]),
  ]);
  const clinics = providers.flatMap((document) => {
    const clinic = tokenClinic(document);
    return clinic ? [clinic] : [];
  });
  const railClinics = clinicUids
    .flatMap((uid) => {
      const clinic = clinics.find((item) => item.uid === uid);
      return clinic ? [clinic] : [];
    })
    .slice(0, 4);

  const title = textOf(post.data.title);
  const dek = textOf(post.data.sub_title);
  const name = authorName(author);
  const nameTitle = authorTitle(author);
  const published = post.data.published_date;
  const minutes = minutesToRead(post.data.body);
  const sections = headingAnchors(post.data.body).filter(
    (section) => section.label,
  );
  const sources = post.data.sources.filter(
    (source) => isFilled.link(source.link) || source.detail?.trim(),
  );
  const tags = post.tags.filter((tag) => tag.trim());
  const profile =
    author && isFilled.image(author.profile) ? author.profile : null;

  const fromCatalog = relatedPosts(
    {
      id: post.id,
      uid: post.uid,
      category: post.data.category,
      published: published ?? "",
      title,
      excerpt: dek,
      read: minutes,
      image: isFilled.image(post.data.image) ? post.data.image.url : "",
    },
    catalog.flatMap((item) => {
      if (!item.uid) return [];
      return [
        {
          id: item.id,
          uid: item.uid,
          category: item.data.category,
          published: item.data.published_date ?? "",
          title: textOf(item.data.title),
          excerpt: textOf(item.data.sub_title),
          read: minutesToRead(item.data.body),
          image: isFilled.image(item.data.image) ? item.data.image.url : "",
        },
      ];
    }),
  );
  const related =
    fromCatalog.length > 0 ? fromCatalog : mockKeepReading(post.uid);

  return (
    <MockupShell searchParams={searchParams}>
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <article>
        <header
          className={
            isFilled.image(post.data.image)
              ? styles.articleHead
              : `${styles.articleHead} ${styles.articleHeadText}`
          }
        >
          <div>
            <p className={styles.kicker}>
              {post.data.category ? <span>{post.data.category}</span> : null}
              <span className={styles.kickerMeta}>
                {published ? (
                  <time dateTime={published}>
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {formatDate(published)}
                  </time>
                ) : null}
                {minutes > 0 ? (
                  <span>
                    <HugeiconsIcon
                      icon={Timer01Icon}
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {minutes} min read
                  </span>
                ) : null}
              </span>
            </p>
            <h1 className={styles.title}>{title}</h1>
            {dek ? <p className={styles.dek}>{dek}</p> : null}
            <div className={styles.byline}>
              <Link href="/about" className={styles.bylineAuthor}>
                <AuthorPhoto
                  profile={profile}
                  className={styles.avatar}
                  size={56}
                />
                <span className={styles.bylineText}>
                  <span className={styles.bylineName}>{name}</span>
                  {nameTitle ? (
                    <span className={styles.bylineTitle}>{nameTitle}</span>
                  ) : null}
                </span>
              </Link>
            </div>
          </div>
          {isFilled.image(post.data.image) ? (
            <figure className={styles.heroFigure}>
              <div className={`${styles.heroImage} ${styles.heroCover}`}>
                <PrismicNextImage
                  field={post.data.image}
                  fill
                  fallbackAlt=""
                  sizes="(max-width: 960px) 100vw, 560px"
                  preload
                />
              </div>
              {isFilled.richText(post.data.caption) ? (
                <figcaption>
                  <PrismicRichText field={post.data.caption} />
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </header>

        <div className={shared.divider} aria-hidden="true" />

        <div className={styles.articleGrid}>
          <div className={styles.body}>
            {isFilled.richText(post.data.note) ? (
              <aside className={styles.note} aria-label="Personal review note">
                <p>
                  <strong>Personal review note:</strong>{" "}
                  <PrismicRichText
                    field={post.data.note}
                    components={{
                      paragraph: ({ children }) => <>{children}</>,
                      hyperlink: ({ node, children }) => (
                        <PrismicNextLink field={node.data} rel={storyLinkRel}>
                          {children}
                        </PrismicNextLink>
                      ),
                    }}
                  />
                </p>
              </aside>
            ) : null}

            <PostStory
              field={post.data.body}
              tables={post.data.tables}
              promoteResources={sources.length === 0}
              clinics={clinics}
              tokens={draft.isEnabled ? "preview" : "public"}
            />

            {sources.length > 0 ? (
              <PostSources>
                {sources.map((source, index) => (
                  <SourceReference
                    key={`${source.detail ?? "source"}-${index}`}
                    number={index + 1}
                  >
                    {isFilled.link(source.link) ? (
                      <PrismicNextLink field={source.link}>
                        {sourceLabel(source.link, source.detail)}
                      </PrismicNextLink>
                    ) : (
                      source.detail
                    )}
                    {isFilled.link(source.link) && source.detail?.trim()
                      ? ` (${source.detail.trim()})`
                      : null}
                  </SourceReference>
                ))}
              </PostSources>
            ) : null}

            {tags.length > 0 ? (
              <nav aria-label="Tags" className={styles.tags}>
                <span>Filed under:</span>
                <ul>
                  {tags.map((tag) => (
                    <li key={tag}>
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <section className={styles.author} aria-labelledby="author-title">
              <AuthorPhoto
                profile={profile}
                className={styles.authorPhoto}
                size={96}
              />
              <div>
                <h2 id="author-title" className={styles.authorName}>
                  {name}
                </h2>
                {nameTitle ? (
                  <p className={styles.authorTitle}>{nameTitle}</p>
                ) : null}
                {author && isFilled.richText(author.about) ? (
                  <PrismicRichText field={author.about} />
                ) : null}
                <p className={styles.authorLinks}>
                  <Link href="/about">Read my whole story</Link>
                  <a href="#">How I review</a>
                </p>
              </div>
            </section>
            <p className={styles.disclosure}>
              Some links in this post are affiliate links.{" "}
              <Link href={DISCLOSURE_HREF}>Affiliate disclosure</Link>
            </p>
          </div>

          <aside className={styles.rail}>
            <Share url={`${SITE_URL}/post/${post.uid}`} title={title} />
            {sections.length > 0 ? <InThisPost sections={sections} /> : null}
            {railClinics.length > 0 ? (
              <section aria-labelledby="rail-clinics">
                <div className={styles.railClinicsHead}>
                  <p id="rail-clinics" className={styles.railHeading}>
                    Clinics
                  </p>
                  <Link
                    href="/hrt-price-comparison-chart"
                    className={styles.railLink}
                  >
                    Compare all clinics
                  </Link>
                </div>
                <ul className={styles.mentioned}>
                  {railClinics.map((clinic) => (
                    <li key={clinic.uid}>
                      {clinic.logo?.src ? (
                        <span className={styles.railLogo}>
                          <Image
                            src={clinic.logo.src}
                            alt=""
                            width={36}
                            height={36}
                          />
                        </span>
                      ) : null}
                      {clinic.pageHref ? (
                        <Link
                          href={clinic.pageHref}
                          className={styles.railName}
                        >
                          {clinic.name}
                        </Link>
                      ) : (
                        <span className={styles.railName}>{clinic.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <>
          <div className={shared.divider} aria-hidden="true" />
          <section className={styles.related} aria-labelledby="related-title">
            <div className={shared.sectionHead}>
              <h2 id="related-title">Keep reading</h2>
              <Link href="/blog" className={shared.headLink}>
                All posts
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className={styles.cardGrid}>
              {related.map((item) => (
                <article key={item.id} className={styles.card}>
                  <div className={shared.postImage}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px"
                      />
                    ) : null}
                  </div>
                  <p className={shared.postMeta}>
                    {item.category ? (
                      <span className={shared.postKind}>{item.category}</span>
                    ) : null}
                    {item.published ? (
                      <time dateTime={item.published}>
                        <HugeiconsIcon
                          icon={Calendar01Icon}
                          size={14}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {formatDate(item.published)}
                      </time>
                    ) : null}
                    {item.read > 0 ? (
                      <span>
                        <HugeiconsIcon
                          icon={Timer01Icon}
                          size={14}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {item.read} min read
                      </span>
                    ) : null}
                  </p>
                  <h3>
                    <Link href={`/post/${item.uid}`}>{item.title}</Link>
                  </h3>
                  {item.excerpt ? (
                    <p className={shared.postExcerpt}>{item.excerpt}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </MockupShell>
  );
}

function AuthorPhoto({
  profile,
  className,
  size,
}: {
  profile: ImageField | null;
  className: string;
  size: number;
}) {
  if (profile && isFilled.image(profile)) {
    return (
      <PrismicNextImage
        field={profile}
        fallbackAlt=""
        width={size}
        height={size}
        className={className}
      />
    );
  }

  return (
    <Image
      src={PEGGY_PORTRAIT}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
