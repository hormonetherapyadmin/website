import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import { POSTS, type Post } from "@/app/mockup/_shared/posts";
import { Posts, type PostCardData } from "@/slices/posts";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";

export const metadata: Metadata = {
  title: "Hand-picked posts",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

function card(post: Post): PostCardData {
  const minutes = Number.parseInt(post.read, 10);

  return {
    title: post.title,
    href: post.href,
    image: { src: post.image, alt: "" },
    excerpt: post.excerpt,
    published: post.published,
    readTime: Number.isNaN(minutes) ? undefined : minutes,
    category: post.kind,
  };
}

const PICKED: PostCardData[] = [
  {
    title:
      "My Experience with Joi Women’s Wellness Menopause Hormone Testing: What’s Included & Is It Worth It?",
    href: "/post/my-experience-with-joi-women-s-wellness-menopause-hormone-testing-what-s-included-is-it-worth-it",
    image: {
      src: "/mockup/proposed/joi-testing.jpg",
      alt: "",
    },
    excerpt:
      "Joi Women's Wellness is one of the few online HRT platforms that not only offers labs and bloodwork, but they require it before your first one-on-one consultation.",
    published: "2026-10-16",
    readTime: 5,
    category: "My experience & results",
  },
  {
    title: "How Does Online HRT Work? Doctors, Costs, and Insurance Explained",
    href: "/post/how-does-online-hrt-work-doctors-costs-and-insurance-explained",
    image: {
      src: "https://images.prismic.io/1shr96di/68vn4FDWOfG2XiC8_eb9223_86cb01526b4e4b34977bb40293dbf81f~mv2.jpg?auto=format,compress",
      alt: "Graphic of HSA Credit Card.",
    },
    excerpt:
      "Many of the online Bioidentical HRT Providers accept HSA Credit Cards for products, consultations and testing.",
    published: "2026-10-12",
    readTime: 5,
    category: "Cost, insurance & access",
  },
  {
    title:
      "Joi vs. Midi Health: Which Offers 1-on-1 Consults & the Most Thorough Testing?",
    href: "/post/joi-vs-midi-health-which-offers-1-on-1-consults-testing",
    image: {
      src: "https://images.prismic.io/1shr96di/o82vT7Pm8oDVU1Ld_eb9223_766c2da1f3c74b6abc47b8f801ed8479~mv2.webp?auto=format,compress",
      alt: "Image of Joi Women's Wellness lab test on a computer",
    },
    excerpt:
      "Joi Women's Wellness is known for their comphrehensive Labs. Use Code BRONSON for 50% off Labs.",
    published: "2026-10-09",
    readTime: 6,
    category: "My experience & results",
  },
];

export default async function PickedPostsMockup(
  props: PageProps<"/mockup/picked-posts">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason title="Hand-picked posts">
        <p>
          Row is already the three-across variation. It shows the three newest
          in a category, so a new review would replace one of these. Picked is
          that same card: the photo, the category, the date, the read time, the
          title, and the excerpt. The only difference is she chooses the three,
          and the order is the order she picks them. Category is not a field on
          that variation. The first row below is Row. The second is Picked, the
          three posts on the price page, in that order. The testing post is not
          in Prismic yet. Its photo, category, date, and read time are from the
          live page on October 16, 2026.
        </p>
      </Reason>
      <Posts
        variation="row"
        posts={POSTS.slice(0, 3).map(card)}
        primary={{
          small_heading: rich("Row, already built"),
          heading: rich("Three newest in a category"),
          background: "Transparent",
          space_above: "Large",
          space_below: "Medium",
          category: "All",
        }}
      />
      <Posts
        variation="picked"
        posts={PICKED}
        primary={{
          small_heading: rich("Picked, new variation"),
          heading: rich("Price Comparison Chart"),
          background: "Transparent",
          space_above: "Medium",
          space_below: "Large",
          category: "All",
        }}
      />
    </MockupShell>
  );
}
