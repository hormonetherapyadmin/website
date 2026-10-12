import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  BrandPromo,
  brandPromoExtraLinks,
  brandPromoLinks,
  brandPromoProduct,
  brandPromoQuote,
  brandPromoTone,
  type BrandPromoClinic,
  type BrandPromoOverwrite,
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

function written(fields: BrandPromoOverwrite) {
  return { overwrite: [fields] };
}

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
    const html = render({
      ...section(),
      first: true,
      place: "My 2026 top choice",
    });

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
    expect(html).toContain('target="_blank"');
    expect(html).toContain('data-placement="brand_promo"');
    expect(html).not.toContain("data-layout");
    expect(html).not.toMatch(
      /<a [^>]*href="https:\/\/example[^>]*rel="noreferrer"/,
    );
  });

  it("defaults a blank small heading and keeps the heading off the badge line", () => {
    const html = render(
      {
        ...section({ small_heading: emptyRich }),
        first: true,
        place: "My 2026 top choice",
      },
      { ...clinic, topChoice: "Improved sleep" },
    );

    expect(html).toContain("Voted best for");
    expect(html).toContain("My 2026 top choice");
    expect(html).toContain("Improved sleep");
    expect(html).not.toMatch(/1st[^<]*Improved sleep/);
  });

  it("lets the slice quote replace the clinic's words and hides the badge when it is not 1st", () => {
    const html = render({
      ...section({ background: "Navy" }),
      ...written({ quote: rich("A sentence just for this card.") }),
      first: false,
    });

    expect(html).toContain('data-tone="dark"');
    expect(html).toContain("A sentence just for this card.");
    expect(html).not.toContain(clinic.quote!);
    expect(html).not.toContain("1st");
    expect(html).not.toContain("My 2026 top choice");
  });

  it("shows the offer line alone when the clinic has no code", () => {
    const html = render(
      { ...section({ heading: rich("No pre-testing") }) },
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

  it("drops /mo for a one-time price and the insurance line for a product", () => {
    const html = render(
      {
        ...section({ heading: rich("Mira Hormone Monitor") }),
        ...written({
          text: rich("The kit is measuring four critical hormones."),
          layout: "Stacked",
        }),
      },
      {
        uid: "mira",
        name: "Mira",
        kind: "Product",
        monthlyPrice: 179,
        priceUnit: "One time",
        insurance: false,
        formulation: "Perimenopause kit",
      },
    );

    expect(html).toContain("$179");
    expect(html).toContain('data-layout="stacked"');
    expect(html).not.toContain("/mo");
    expect(html).toContain("measuring four critical hormones");
    expect(html).toContain("Perimenopause kit");
    expect(html).not.toContain("insurance");
  });

  it("renders the written heading when the clinic is missing", () => {
    const html = render(
      {
        ...section(),
        ...written({
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
        }),
      },
      null,
    );

    expect(html).toContain('id="improved-sleep"');
    expect(html).toContain("Still here.");
    expect(html).toContain("Watch my review");
    expect(html).toContain('alt="Oestra cream jar"');
    expect(html).not.toContain("Visit");
  });

  it("puts brand buttons first and slice links on the next row", () => {
    const html = render(
      {
        ...section(),
        ...written({
          links: [
            {
              link_type: "Web",
              url: "/post/musely-vs-winona",
              text: "Musely vs Winona",
            },
          ],
        }),
      },
      {
        ...clinic,
        pageHref: "/inner-balance",
        reviewHref: "/post/inner-balance-hrt-review",
        reviewVideoHref: "https://youtu.be/_OlA4wXOHdQ",
      },
    );

    expect(html).toContain('href="/inner-balance"');
    expect(html).toContain("Products &amp; pricing");
    expect(html).toContain('href="/post/inner-balance-hrt-review"');
    expect(html).toContain("My review");
    expect(html).toContain('href="https://youtu.be/_OlA4wXOHdQ"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("Watch my review");
    expect(html).toContain("Musely vs Winona");
    expect(html.indexOf("Products")).toBeLessThan(html.indexOf("My review"));
    expect(html.indexOf("My review")).toBeLessThan(
      html.indexOf("Watch my review"),
    );
    expect(html.indexOf("Watch my review")).toBeLessThan(
      html.indexOf("Musely vs Winona"),
    );
  });

  it("shows each of the brand's comparisons as a button after My review", () => {
    const html = render(
      { ...section() },
      {
        ...clinic,
        reviewHref: "/post/musely-estrogen-boost-review",
        comparisons: [
          { href: "/post/musely-vs-winona", text: "Musely vs Winona cream" },
          { href: "/post/alloy-vs-musely", text: "Alloy vs Musely" },
        ],
        reviewVideoHref: "https://youtu.be/_OlA4wXOHdQ",
      },
    );

    expect(html).toContain('href="/post/musely-vs-winona"');
    expect(html).toContain('href="/post/alloy-vs-musely"');
    expect(html.indexOf("My review")).toBeLessThan(
      html.indexOf("Musely vs Winona cream"),
    );
    expect(html.indexOf("Musely vs Winona cream")).toBeLessThan(
      html.indexOf("Alloy vs Musely"),
    );
    expect(html.indexOf("Alloy vs Musely")).toBeLessThan(
      html.indexOf("Watch my review"),
    );
    expect(
      brandPromoLinks({
        comparisons: [{ href: "/post/musely-vs-winona" }, { href: " " }],
      }),
    ).toEqual([
      {
        href: "/post/musely-vs-winona",
        text: "My comparison",
        external: false,
        icon: "comparison",
      },
    ]);
    expect(render({ ...section() }, clinic)).not.toContain("My comparison");
  });

  it("keeps a slice link when the brand has no page or video", () => {
    expect(
      brandPromoExtraLinks([
        {
          link_type: "Web",
          url: "/post/inner-balance-hrt-review",
          text: "My review",
        },
      ]),
    ).toEqual([
      {
        href: "/post/inner-balance-hrt-review",
        text: "My review",
        external: false,
      },
    ]);
  });

  it("uses the brand product photo unless the slice has one", () => {
    const brand = {
      url: "/mockup/products/image.png",
      alt: "Winona treatment jar",
    } as ImageField;
    const placed = {
      url: "/mockup/products/oestra_rnieuz.webp",
      alt: "Oestra cream jar",
    } as ImageField;

    const fallback = render(
      { ...section(), ...written({ product: {} as ImageField }) },
      {
        ...clinic,
        product: brand,
      },
    );
    expect(fallback).toContain('alt="Winona treatment jar"');

    const override = render(
      { ...section(), ...written({ product: placed }) },
      {
        ...clinic,
        product: brand,
      },
    );
    expect(override).toContain('alt="Oestra cream jar"');
    expect(override).not.toContain("Winona treatment jar");
    expect(brandPromoProduct(placed, brand)?.alt).toBe("Oestra cream jar");
    expect(brandPromoProduct({} as ImageField, brand)?.alt).toBe(
      "Winona treatment jar",
    );
  });
});
