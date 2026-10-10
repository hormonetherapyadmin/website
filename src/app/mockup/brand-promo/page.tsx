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
  quote:
    "I received my first order within 5 days of placing order for the HRT products my clinician recommended.",
};

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
          quote: rich(innerBalance.quote ?? ""),
          place: "1st",
          product: image(
            "/mockup/products/oestra_rnieuz.webp",
            "Oestra cream jar",
          ),
          links: [
            link("Products & pricing", "/mockup/inner-balance"),
            link("My review", "/post/inner-balance-hrt-review"),
            link("Watch my review", "https://youtu.be/_OlA4wXOHdQ", true),
          ],
        }}
        clinic={innerBalance}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("No pre-testing") }),
          quote: emptyRich,
          place: null,
          product: image("/mockup/products/image.png", "Winona treatment jar"),
          links: [
            link("Products & pricing", "/winona-review-page"),
            link(
              "My review",
              "/post/winona-bioidentical-hormone-therapy-review",
            ),
            link("Watch my review", "https://youtu.be/XZD4yvTKScA", true),
          ],
        }}
        clinic={winona}
      />
      <BrandPromo
        primary={{
          ...section({ heading: rich("Most comprehensive testing") }),
          quote: emptyRich,
          place: null,
          product: image(
            "/mockup/products/image%20copy.png",
            "Joi HRT injectable vial",
          ),
          links: [
            link("Products & pricing", "/joiwommenswellness"),
            link("My review", "/post/joi-womens-hormone-replacement-review"),
            link("Watch my review", "https://youtu.be/2sQ2-kh1F10", true),
          ],
        }}
        clinic={joi}
      />
    </>
  );
}
