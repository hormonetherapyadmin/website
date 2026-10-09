import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { POSTS } from "@/app/mockup/_shared/posts";
import {
  POST_CATEGORY_OPTIONS,
  Posts,
  type PostCardData,
  type PostCategoryOption,
} from "@/slices/posts";

export const metadata: Metadata = {
  title: "Post cards",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

const CARDS: PostCardData[] = POSTS.map((post) => ({
  title: post.title,
  href: post.href,
  image: { src: post.image, alt: "" },
  excerpt: post.excerpt,
  published: post.published,
  readTime: Number.parseInt(post.read, 10),
  category: post.kind,
}));

const PINNED = CARDS.find((post) => post.href.includes("oestra")) ?? CARDS[3];

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function categoryFrom(value: string | undefined): PostCategoryOption {
  for (const option of POST_CATEGORY_OPTIONS) {
    if (option === value) return option;
  }
  return "All";
}

function section(heading: string, linkText?: string): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: heading ? rich(heading) : emptyRich,
    intro: emptyRich,
    link: linkText
      ? ({ link_type: "Web", url: "/blog", text: linkText } as LinkField)
      : emptyLink,
    background: "Transparent",
    space_above: "Medium",
    space_below: "None",
  };
}

function gridHeading(category: PostCategoryOption) {
  if (category === "All") return "More posts";
  if (category === "Review") return "Reviews";
  if (category === "Comparison") return "Comparisons";
  return category;
}

export default async function PostsPreview(props: {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const category = categoryFrom(one(searchParams.category));
  const page = Number.parseInt(one(searchParams.page) ?? "1", 10);

  return (
    <>
      <p className="mx-auto w-full max-w-wrap px-gutter pt-10 text-sm font-semibold text-text-muted">
        Homepage
      </p>
      <Posts
        variation="home"
        primary={{
          ...section("Latest reviews and posts", "All posts"),
          category: "All",
        }}
        posts={CARDS}
      />

      <p className="mx-auto w-full max-w-wrap px-gutter pt-10 text-sm font-semibold text-text-muted">
        Blog page
      </p>
      {category === "All" ? (
        <Posts
          variation="featured"
          primary={{ ...section(""), category: "All" }}
          posts={CARDS}
        />
      ) : null}
      <Posts
        variation="grid"
        primary={{
          ...section(gridHeading(category)),
          category: "All",
          count: 6,
        }}
        posts={CARDS}
        page={Number.isFinite(page) ? page : 1}
        activeCategory={category}
        skipHref={category === "All" ? CARDS[0]?.href : undefined}
      />

      <p className="mx-auto w-full max-w-wrap px-gutter pt-10 text-sm font-semibold text-text-muted">
        Featured, one post in particular
      </p>
      <Posts
        variation="featured"
        primary={{ ...section(""), category: "All" }}
        posts={CARDS}
        featured={PINNED}
      />

      <p className="mx-auto w-full max-w-wrap px-gutter pt-10 text-sm font-semibold text-text-muted">
        Keep reading
      </p>
      <Posts
        variation="row"
        primary={{
          ...section("Keep reading", "All posts"),
          category: "All",
        }}
        posts={CARDS}
      />
    </>
  );
}
