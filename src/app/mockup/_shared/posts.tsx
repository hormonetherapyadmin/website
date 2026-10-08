import { Calendar01Icon, Timer01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import styles from "./mockup.module.css";

// Stand-in for Article and Provider Review documents. Titles, dates, read
// times, excerpts, and images come from the live Wix blog (October 2026).
// The kind labels are a proposed taxonomy; Wix posts have no categories.

export const POST_KINDS = [
  { slug: "reviews", label: "Review", plural: "Reviews" },
  { slug: "comparisons", label: "Comparison", plural: "Comparisons" },
  { slug: "my-experience", label: "My experience", plural: "My experience" },
  { slug: "hrt-101", label: "HRT 101", plural: "HRT 101" },
] as const;

export type PostKind = (typeof POST_KINDS)[number]["label"];

export type Post = {
  title: string;
  excerpt?: string;
  published: string;
  read: string;
  href: string;
  image: string;
  kind: PostKind;
};

export const POSTS: Post[] = [
  {
    title: "HRT & Skin Before and After: My Experience",
    excerpt:
      "HRT wasn’t the only major change I made during this period, but it was definitely the catalyst.",
    published: "2026-09-29",
    read: "5 min",
    href: "/post/hrt-skin-before-and-after-my-12-month-results-and-experience",
    image: "/mockup/posts/skin.jpg",
    kind: "My experience",
  },
  {
    title:
      "Alloy vs. Musely (2026): Estrogen Creams, Patches & Tablets Compared",
    excerpt:
      "Finding the right approach comes down to balancing your personal health history, baseline risk factors, and everyday lifestyle.",
    published: "2026-09-22",
    read: "6 min",
    href: "/post/alloy-vs-musely-estrogen-creams-patches-tablets-compared",
    image: "/mockup/posts/alloy-vs-musely.jpg",
    kind: "Comparison",
  },
  {
    title: "Musely Sleep Well Cream Review & Ingredients",
    excerpt:
      "We all have different bodies, medical needs, and comfort levels when it comes to sleep aids.",
    published: "2026-09-12",
    read: "8 min",
    href: "/post/musely-sleep-well-cream-review-ingredients-fix-menopause-sleep",
    image: "/mockup/posts/sleep-well.jpg",
    kind: "Review",
  },
  {
    title: "Oestra by Inner Balance: My 1-Year Results & What to Expect",
    excerpt:
      "On the 2nd night of using Oestra, I felt myself getting very sleepy 30 minutes after applying my dose.",
    published: "2026-09-08",
    read: "6 min",
    href: "/post/oestra-by-inner-balance-my-honest-1-year-review",
    image: "/mockup/posts/oestra.jpg",
    kind: "Review",
  },
  {
    title: "Musely Estrogen Cream Review: A Gentle HRT Option",
    excerpt:
      "As I creep up on turning 60 in less than six months, I’ve found myself taking a closer look at my daily wellness routine.",
    published: "2026-09-04",
    read: "6 min",
    href: "/post/musely-estrogen-cream-review-a-safer-gentler-hrt-alternative",
    image: "/mockup/posts/musely-cream.jpg",
    kind: "Review",
  },
  {
    title: "FDA-Approved vs. Compounded BHRT: What’s the Real Difference?",
    excerpt:
      "Are you confused around the difference between FDA-approved HRT and Compounded HRT?",
    published: "2026-08-30",
    read: "6 min",
    href: "/post/fda-approved-vs-compounded-bhrt-what-s-the-real-difference",
    image: "/mockup/posts/fda-vs-compounded.jpg",
    kind: "HRT 101",
  },
  {
    title: "Winona vs. Musely: Which HRT Cream Wins?",
    excerpt:
      "Any Hormone Therapy that’s made up of Estrogen (E1, E2 or E3) and Progesterone is Bioidentical.",
    published: "2026-08-29",
    read: "6 min",
    href: "/post/musely-estrogen-cream-vs-winona-which-hrt-cream-wins",
    image: "/mockup/posts/winona-vs-musely.jpg",
    kind: "Comparison",
  },
  {
    title: "Compounded Testosterone Cream for Women",
    excerpt: "If you suspect that your Testosterone is low, there are options.",
    published: "2026-08-25",
    read: "6 min",
    href: "/post/compounded-testosterone-cream-for-women",
    image: "/mockup/posts/testosterone-cream.jpg",
    kind: "HRT 101",
  },
  {
    title:
      "Oestra by Inner Balance vs Winona: Which Telehealth BHRT Platform Is Right for You?",
    excerpt:
      "Learn the differences between these two power house BHRT Telehealth providers.",
    published: "2026-08-16",
    read: "5 min",
    href: "/post/oestra-by-inner-balance-vs-winona-which-telehealth-bhrt-platform-is-right-for-you",
    image: "/mockup/posts/oestra-vs-winona.jpg",
    kind: "Comparison",
  },
  {
    title:
      "Musely Eye Serum Review: Can It Fix Menopausal Dark Circles & Wrinkles?",
    published: "2026-08-03",
    read: "7 min",
    href: "/post/musely-eye-serum-review-can-it-fix-menopausal-dark-circles-wrinkles",
    image: "/mockup/posts/eye-serum.jpg",
    kind: "Review",
  },
  {
    title:
      "Ivim Health Review: Does Combining HRT & a GLP-1 Actually Work for Menopause Weight Gain?",
    excerpt: "Does HRT and GLP-1 work when combined?",
    published: "2026-07-22",
    read: "5 min",
    href: "/post/ivim-review-hrt-glp-1-menopause-weight-gain",
    image: "/mockup/posts/ivim.jpg",
    kind: "Review",
  },
  {
    title:
      "Inner Balance BodyMatched Review: Does Finasteride Reduce Facial Hair?",
    excerpt:
      "In this review, I share my 6-month experience using Inner Balance BodyMatched™ cream with topical finasteride.",
    published: "2026-07-18",
    read: "5 min",
    href: "/post/inner-balance-bodymatched-review-does-finasteride-reduce-facial-hair",
    image: "/mockup/posts/bodymatched.jpg",
    kind: "Review",
  },
  {
    title: "Why Do I Wake Up Hot and Sweaty?",
    excerpt:
      "There is nothing quite like the frustration of waking up at 3:00 AM, tossing off the blankets, and asking yourself, “Why do I wake up hot and sweaty?”",
    published: "2026-05-22",
    read: "5 min",
    href: "/post/why-do-i-wake-up-hot-and-sweaty",
    image: "/mockup/posts/hot-sweaty.jpg",
    kind: "HRT 101",
  },
];

export function postAt(href: string): Post {
  const post = POSTS.find((item) => item.href === href);
  if (!post) throw new Error(`Unknown post: ${href}`);
  return post;
}

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PostCard({
  post,
  className,
  sizes,
  preload = false,
}: {
  post: Post;
  className: string;
  sizes: string;
  preload?: boolean;
}) {
  return (
    <article className={className}>
      <div className={styles.postImage}>
        <Image src={post.image} alt="" fill sizes={sizes} preload={preload} />
      </div>
      <p className={styles.postMeta}>
        <span className={styles.postKind}>{post.kind}</span>
        <time dateTime={post.published}>
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={14}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {formatDate(post.published)}
        </time>
        <span>
          <HugeiconsIcon
            icon={Timer01Icon}
            size={14}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {post.read} read
        </span>
      </p>
      <h3>
        <a href={post.href}>{post.title}</a>
      </h3>
      {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
    </article>
  );
}
