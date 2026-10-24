import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { postCard } from "@/lib/page-slices";
import { createClient } from "@/prismicio";
import { Divider } from "@/slices/divider";
import { Hero } from "@/slices/hero";
import { Posts } from "@/slices/posts";
import { SideBySide } from "@/slices/side_by_side";
import { MockupShell } from "../_shared/mockup-shell";

/*
  About mockup for the live URL /about, built only from page slices.
  Copy is from that Wix page (October 2026), word for word, including
  "to for someone" and "bog pages". The hero uses the portrait already
  published on that page. Winston sits on the left of the story so the
  two photos do not stack. The washed-out stock doctor banner is left
  off: it is a clinic portrait, and this site is not a clinic. The
  divider under the hero and the posts row stay.
*/

export const metadata: Metadata = {
  title: "About mockup",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

function paragraph(text: string, spans: object[] = []) {
  return { type: "paragraph" as const, text, spans };
}

function rich(text: string) {
  return [paragraph(text)] as unknown as RichTextField;
}

function linked(text: string, items: { phrase: string; url: string }[]) {
  return paragraph(
    text,
    items.map(({ phrase, url }) => {
      const start = text.indexOf(phrase);
      return {
        start,
        end: start + phrase.length,
        type: "hyperlink",
        data: { link_type: "Web", url },
      };
    }),
  );
}

function signoff(text: string) {
  return paragraph(text, [
    { start: 0, end: text.length, type: "label", data: { label: "signoff" } },
  ]);
}

function image(url: string, alt: string, width: number, height: number) {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  } as ImageField;
}

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "Large",
    space_below: "None",
    ...overrides,
  };
}

const button = (text: string, url: string): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    variant: "Solid",
  }) as LinkField;

const story = [
  paragraph(
    "Back in 2019, I was miserable, bitchy and desperate to find something to help. I was at my heaviest weight and would have done anything to for someone to point me in a direction that could kick-start my moodiness & weight loss to get me on track to being happy and feeling like myself again.",
  ),
  paragraph(
    'A friend of my sister\'s posted on Facebook that she had been seeing what she called, "her diet doctor." She looked genuinely happy and I was extremely intrigued! I messaged her to get the name of this diet doc and the rest is history',
  ),
  paragraph(
    "I started on Bioidentical Hormone Replacement Therapy in December of 2019 and never looked back. In the early days of COVID-19 I was able to lose about 28 pounds thanks to the HRT and intermittent fasting. While everyone else was complaining about gaining the Covid 19, I had lost that and then some!",
  ),
  paragraph(
    "I got to a point where I wanted to continue my Hormone Therapy Journey, but wanted to find something more convenient than driving to a physical doctor's office only to wait in lobby and then wait some more for him to show up in the exam room. I began a quest to find the same Bioidentical Hormone Replacement meds and an HRT specialist online. The result of that search is this website.",
  ),
  paragraph(
    "It's full of information on menopause, symptoms, how to age better and where to find, telehealth online Hormone Replacement Therapy Docs and Clinics .",
  ),
  linked(
    "I hope you find useful informative articles in the bog pages and be sure to check out the trusted HRT Doctor/Clinic Reviews. I spill the beans on what they offer, their process, their pricing and what they offer in the way of payment plans.",
    [
      { phrase: "bog pages", url: "/mockup/blog" },
      {
        phrase: "trusted HRT Doctor/Clinic Reviews",
        url: "/mockup/trusted-providers",
      },
    ],
  ),
  signoff(
    "We all experience menopause differently, but none of us need to suffer alone, there is help!",
  ),
] as unknown as RichTextField;

export default async function AboutMockup(props: PageProps<"/mockup/about">) {
  const searchParams = await props.searchParams;
  const documents = await createClient().getAllByType("post");
  const posts = documents.flatMap((document) => {
    const card = postCard(document);
    return card ? [card] : [];
  });

  return (
    <MockupShell searchParams={searchParams}>
      <Hero
        variation="subpage"
        primary={{
          ...section({
            small_heading: rich("About Peggy"),
            heading: rich("My Hormone Replacement Story"),
            intro: rich(
              "I'm your typical late-50's woman. I love Jesus! I'm married, I have three grown children, three grandchildren, a Bernedoodle named Winston and my full-time gig is in the banking industry.",
            ),
            space_above: "Medium",
            space_below: "Medium",
          }),
          image: image(
            "https://images.prismic.io/1shr96di/XYNQOFoQwb5OYLsz_eb9223_eb8a2908d66c45d8b805ae5191010342~mv2.jpg?auto=format,compress",
            "Image of Peggy B patient reviewer and owner of HormoneTherapyhub.com",
            2250,
            2590,
          ),
        }}
      />

      <Divider
        primary={{
          line: "Squiggly",
          color: "Accent",
          background: "Transparent",
          space_above: "Medium",
          space_below: "None",
        }}
      />

      <SideBySide
        variation="image"
        image={{
          src: "/mockup/peggy-winston.jpg",
          alt: "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        }}
        primary={{
          ...section({ space_above: "None", space_below: "Medium" }),
          side: "Media left",
          media_position: "Sticky",
          text: story,
          button: [button("Is HRT for Me?", "/mockup/is-hrt-for-me")],
        }}
      />

      <Posts
        variation="row"
        primary={{
          ...section({ space_above: "None", space_below: "Medium" }),
          category: "All",
        }}
        posts={posts}
      />
    </MockupShell>
  );
}
