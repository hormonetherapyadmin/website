import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  BrandPromo,
  brandPromoQuote,
  brandPromoTone,
  type BrandPromoClinic,
} from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: rich("Voted best for"),
    heading: rich("Improved sleep"),
    intro: emptyRich,
    link: emptyLink,
    background: "Transparent",
    space_above: "None",
    space_below: "None",
    ...overrides,
  };
}

const clinic: BrandPromoClinic = {
  uid: "inner-balance",
  name: "Inner Balance",
  logo: { src: "/mockup/logos/inner-balance.png" },
  visitHref: "https://example.com/inner-balance?ref=peggy",
  visitText: "Visit Inner Balance",
  newTab: true,
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

function render(
  primary: Parameters<typeof BrandPromo>[0]["primary"],
  item: BrandPromoClinic | null = clinic,
) {
  return renderToStaticMarkup(
    createElement(BrandPromo, { primary, clinic: item }),
  );
}

describe("brandPromoQuote", () => {
  it("uses a written quote, then the clinic's words", () => {
    expect(brandPromoQuote(rich("This card only."), clinic.quote)).toEqual({
      field: rich("This card only."),
    });
    expect(brandPromoQuote(emptyRich, clinic.quote)).toEqual({
      text: clinic.quote,
    });
    expect(brandPromoQuote(emptyRich, "  ")).toEqual({});
  });
});

describe("brandPromoTone", () => {
  it("treats Navy and Raspberry as the dark card", () => {
    expect(brandPromoTone("Navy")).toBe("dark");
    expect(brandPromoTone("Raspberry")).toBe("dark");
    expect(brandPromoTone("Transparent")).toBe("light");
    expect(brandPromoTone(null)).toBe("light");
  });
});

describe("BrandPromo", () => {
  it("reads the price, the coupon, and the visit link from the clinic", () => {
    const html = render({ ...section(), quote: emptyRich, place: "1st" });

    expect(html).toContain('id="inner-balance"');
    expect(html).toContain("Voted best for");
    expect(html).toContain("Improved sleep");
    expect(html).toContain("1st");
    expect(html).toContain("My 2026 top choice");
    expect(html).toContain(clinic.quote!);
    expect(html).toContain("$199");
    expect(html).toContain("First six months, then $99.");
    expect(html).toContain("Oestra vaginal cream");
    expect(html).toContain("Doesn&#x27;t take insurance");
    expect(html).toContain("Free consults as needed.");
    expect(html).toContain("Code PEGGY10");
    expect(html).toContain("10% off your first order");
    expect(html).toContain(
      'href="https://example.com/inner-balance?ref=peggy"',
    );
    expect(html).toContain('rel="sponsored nofollow noopener noreferrer"');
  });

  it("lets the slice quote replace the clinic's words and hides an empty place", () => {
    const html = render({
      ...section({ background: "Navy" }),
      quote: rich("A sentence just for this card."),
      place: "  ",
    });

    expect(html).toContain('data-tone="dark"');
    expect(html).toContain("A sentence just for this card.");
    expect(html).not.toContain(clinic.quote!);
    expect(html).not.toContain("My 2026 top choice");
  });

  it("shows the offer line alone when the clinic has no code", () => {
    const html = render(
      { ...section({ heading: rich("No pre-testing") }), quote: emptyRich },
      {
        ...clinic,
        uid: "winona",
        name: "Winona",
        offerCode: undefined,
        offerCopy: "15% off your first order",
        topChoice: undefined,
      },
    );

    expect(html).toContain('id="winona"');
    expect(html).toContain("15% off your first order");
    expect(html).not.toContain("Code ");
  });

  it("renders the written heading when the clinic is missing", () => {
    const html = render(
      {
        ...section(),
        quote: rich("Still here."),
        links: [
          {
            link_type: "Web",
            url: "https://youtu.be/abc",
            text: "Watch my review",
          },
        ],
        product: {
          url: "/mockup/products/oestra_rnieuz.webp",
          alt: "Oestra cream jar",
        } as ImageField,
      },
      null,
    );

    expect(html).toContain('id="improved-sleep"');
    expect(html).toContain("Still here.");
    expect(html).toContain("Watch my review");
    expect(html).toContain('alt="Oestra cream jar"');
    expect(html).not.toContain("Visit");
  });
});
