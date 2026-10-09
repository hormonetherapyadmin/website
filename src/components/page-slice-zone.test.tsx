import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import type { PageClinic } from "@/lib/page-slices";
import type { PageDocumentDataSlicesSlice } from "../../prismicio-types";
import { PageSliceZone, type PageSliceContext } from "./page-slice-zone";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(heading: string): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: rich(heading),
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  };
}

const clinicLink = {
  link_type: "Document",
  id: "P1",
  type: "provider",
  tags: [],
  lang: "en-us",
  uid: "inner-balance",
};

const clinic: PageClinic = {
  id: "P1",
  uid: "inner-balance",
  name: "Inner Balance",
  visitHref: "https://example.com/inner-balance?ref=peggy",
  visitText: "Visit Inner Balance",
  monthlyPrice: 199,
  formulation: "Oestra vaginal cream",
  quote: "The one I stayed with.",
};

function context(overrides: Partial<PageSliceContext> = {}): PageSliceContext {
  return {
    providers: new Map(),
    clinics: new Map([["P1", clinic]]),
    tokenClinics: [],
    posts: [],
    page: 1,
    category: null,
    tokens: "public",
    ...overrides,
  };
}

function render(slices: unknown[], ctx = context()) {
  return renderToStaticMarkup(
    createElement(PageSliceZone, {
      slices: slices as PageDocumentDataSlicesSlice[],
      context: ctx,
    }),
  );
}

function slice(
  slice_type: string,
  primary: Record<string, unknown>,
  variation = "default",
) {
  return {
    id: `${slice_type}$${variation}`,
    slice_type,
    slice_label: null,
    variation,
    version: "1",
    primary,
    items: [],
  };
}

describe("PageSliceZone", () => {
  it("fills a comparison row and a quote from the clinic", () => {
    const html = render([
      slice("clinic_comparison", {
        ...section("Clinics side by side"),
        prices_checked: null,
        button: { link_type: "Any" },
        disclosure: { link_type: "Any" },
        clinics: [{ clinic: clinicLink, review: { link_type: "Any" } }],
      }),
      slice("quote", {
        ...section("Peggy's take"),
        quote: rich("I would pick it again."),
        name: null,
        clinic: clinicLink,
        text: emptyRich,
        reminder: emptyRich,
        review_button: { link_type: "Any" },
      }),
    ]);

    expect(html).toContain("Inner Balance");
    expect(html).toContain("$199");
    expect(html).toContain("The one I stayed with.");
    expect(html).toContain(
      'href="https://example.com/inner-balance?ref=peggy"',
    );
    expect(html).toContain('data-placement="quote"');
  });

  it("skips a clinic that is not published", () => {
    const html = render(
      [
        slice("quote", {
          ...section("Peggy's take"),
          quote: rich("I would pick it again."),
          name: null,
          clinic: clinicLink,
          text: emptyRich,
          reminder: emptyRich,
          review_button: { link_type: "Any" },
        }),
      ],
      context({ clinics: new Map() }),
    );

    expect(html).toContain("I would pick it again.");
    expect(html).not.toContain("Visit Inner Balance");
  });

  it("fills a brand promo from the clinic and lets the slice quote replace it", () => {
    const html = render([
      slice("brand_promo", {
        ...section("Improved sleep"),
        small_heading: rich("Voted best for"),
        clinic: clinicLink,
        quote: emptyRich,
        place: "1st",
        product: {},
        links: [
          {
            link_type: "Web",
            url: "/post/inner-balance-hrt-review",
            text: "My review",
          },
        ],
      }),
    ]);

    expect(html).toContain('id="inner-balance"');
    expect(html).toContain("Improved sleep");
    expect(html).toContain("The one I stayed with.");
    expect(html).toContain("$199");
    expect(html).toContain("1st");
    expect(html).toContain('data-placement="brand_promo"');
    expect(html).toContain("My review");
  });

  it("shows the posts the page loaded", () => {
    const html = render(
      [slice("posts", { ...section("Keep reading"), category: "All" }, "row")],
      context({
        posts: [
          {
            title: "Oestra vs Winona",
            href: "/post/oestra-vs-winona",
            published: "2026-09-01",
          },
        ],
      }),
    );

    expect(html).toContain("Oestra vs Winona");
    expect(html).toContain('href="/post/oestra-vs-winona"');
  });

  it("renders a Ribbon from the title, content, and buttons", () => {
    const html = render([
      slice("ribbon", {
        ...section(""),
        heading: emptyRich,
        title: rich("Still lining the prices up?"),
        content: rich("The comparison chart includes Midi Health too."),
        box_background: "Pink",
        button: [
          {
            link_type: "Web",
            url: "/hrt-price-comparison-chart",
            text: "Open the price chart",
            variant: "Solid",
          },
        ],
      }),
    ]);

    expect(html).toContain("Still lining the prices up?");
    expect(html).toContain("Midi Health too");
    expect(html).toContain("Open the price chart");
    expect(html).toContain('data-box="Pink"');
  });

  it("renders the Divider and Start here as written", () => {
    const html = render([
      slice("divider", {
        line: "Straight",
        color: "Accent",
        background: "Transparent",
        space_above: "None",
        space_below: "None",
      }),
      slice("start_here", {
        ...section("Where should I start?"),
        cards: [
          {
            small_heading: emptyRich,
            heading: rich("New to HRT"),
            text: emptyRich,
            link: { link_type: "Web", url: "/ishrtforme" },
            icon: "Question",
          },
        ],
      }),
    ]);

    expect(html).toContain("Where should I start?");
    expect(html).toContain("New to HRT");
  });
});
