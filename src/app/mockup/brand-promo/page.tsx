import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { BrandPromo, type BrandPromoClinic } from "@/slices/BrandPromo";

export const metadata: Metadata = {
  title: "Brand promo slice",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function image(url: string, alt: string): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width: 800, height: 800 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: rich("Voted best for"),
    heading: emptyRich,
    intro: emptyRich,
    link: emptyLink,
    background: "Transparent",
    space_above: "None",
    space_below: "None",
    ...overrides,
  };
}

const link = (text: string, url: string, blank = false): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    target: blank ? "_blank" : undefined,
  }) as LinkField;

/*
  Trusted-providers cards. Each card is one slice. Prices, codes, and
  sentences are the ones on that mockup. Visit links are placeholders.
*/
const innerBalance: BrandPromoClinic = {
  uid: "inner-balance",
  name: "Inner Balance",
  logo: { src: "/mockup/logos/inner-balance.png" },
  visitHref: "#affiliate-link",
  visitText: "Visit Inner Balance",
  monthlyPrice: 199,
  priceNote: "First six months, then $99.",
  insurance: false,
  formulation: "Oestra vaginal cream",
  gettingStarted: "Free consults as needed.",
  offerCode: "PEGGY10",
  offerCopy: "10% off your first order",
  topChoice: "My 2026 top choice",
  pageHref: "/mockup/inner-balance",
  reviewHref: "/post/inner-balance-hrt-review",
  reviewVideoHref: "https://youtu.be/_OlA4wXOHdQ",
  product: image("/mockup/products/oestra_rnieuz.webp", "Oestra cream jar"),
  quote:
    "Finding a product that treats my symptoms of menopause and helps with sleep was a clear winner for me.",
};

const winona: BrandPromoClinic = {
  uid: "winona",
  name: "Winona",
  logo: { src: "/mockup/logos/winona.png" },
  visitHref: "#affiliate-link",
  visitText: "Visit Winona",
  monthlyPrice: 89,
  insurance: false,
  formulation: "Topical cream",
  gettingStarted: "No consult required.",
  offerCopy: "15% off your first order",
  pageHref: "/winona-review-page",
  reviewHref: "/post/winona-bioidentical-hormone-therapy-review",
  comparisons: [
    {
      href: "/post/musely-estrogen-cream-vs-winona-which-hrt-cream-wins",
      text: "Musely vs Winona cream",
    },
    {
      href: "/post/winona-vs-alloy-hormone-replacement-side-by-side-comparison",
      text: "Winona vs Alloy",
    },
  ],
  reviewVideoHref: "https://youtu.be/XZD4yvTKScA",
  product: image("/mockup/products/image.png", "Winona treatment jar"),
  quote:
    "I received my first order within 5 days of placing order for the HRT products my clinician recommended.",
};

const longWriting = [
  "The supporting card can line up with the first line, the middle of the writing, or stay on screen while this column scrolls.",
  "Center is the usual place. Top lines the card up with the heading. Sticky keeps the price, or her words, in view on a long section.",
  "On a phone the card stacks under the writing, and it does not stay stuck.",
  "The clinic facts on these examples are Inner Balance. The sentences are only here so the three positions are easy to compare.",
].flatMap((sentence) => rich(sentence)) as RichTextField;

const joi: BrandPromoClinic = {
  uid: "joi",
  name: "Joi Women’s Wellness",
  logo: { src: "/mockup/logos/joi.png" },
  visitHref: "#affiliate-link",
  visitText: "Visit Joi Women’s Wellness",
  monthlyPrice: 233,
  insurance: false,
  formulation: "Patch + pills",
  gettingStarted: "$150 labs required up front, includes a 30-minute consult.",
  offerCode: "BRONSON",
  offerCopy: "50% off labs and 15% off HRT treatments",
  pageHref: "/joiwommenswellness",
  reviewHref: "/post/joi-womens-hormone-replacement-review",
  reviewVideoHref: "https://youtu.be/2sQ2-kh1F10",
  product: image(
    "/mockup/products/image%20copy.png",
    "Joi HRT injectable vial",
  ),
  quote:
    "My 1:1’s were very thorough and I learned something new each time I met with a Joi Clinician.",
};

export default function BrandPromoPreview() {
  return (
    <>
      <BrandPromo
        primary={{
          ...section({
            heading: rich("Improved sleep"),
            background: "Navy",
          }),
          first: true,
          place: "My 2026 top choice",
          overwrite: [
            {
              quote: rich(innerBalance.quote ?? ""),
              links: [
                link(
                  "Oestra vs Winona",
                  "/post/musely-estrogen-cream-vs-winona-which-hrt-cream-wins",
                ),
              ],
            },
          ],
        }}
        clinic={innerBalance}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("No pre-testing") }),
          first: false,
          overwrite: [
            {
              product: image(
                "/mockup/products/image%20copy%202.png",
                "Musely estrogen cream bottle",
              ),
            },
          ],
        }}
        clinic={winona}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("Most comprehensive testing") }),
          first: false,
        }}
        clinic={joi}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("Card at the top") }),
          card_position: "Top",
          overwrite: [
            {
              text: longWriting,
              quote: rich(innerBalance.quote ?? ""),
            },
          ],
        }}
        clinic={innerBalance}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("Card in the center") }),
          card_position: "Center",
          overwrite: [
            {
              text: longWriting,
              quote: rich(innerBalance.quote ?? ""),
            },
          ],
        }}
        clinic={innerBalance}
      />
      <BrandPromo
        primary={{
          ...section({
            heading: rich("Card stays on screen"),
            background: "Cream",
          }),
          card_position: "Sticky",
          overwrite: [
            {
              style: "Quote",
              text: longWriting,
              quote: rich(innerBalance.quote ?? ""),
            },
          ],
        }}
        clinic={innerBalance}
        last
      />
    </>
  );
}
