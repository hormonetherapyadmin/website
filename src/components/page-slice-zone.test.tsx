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
  pageHref: "/inner-balance",
  reviewHref: "/post/inner-balance-hrt-review",
  reviewVideoHref: "https://youtu.be/_OlA4wXOHdQ",
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
        clinic: clinicLink,
        first: true,
        overwrite: [
          {
            small_heading: rich("Voted best for"),
            quote: emptyRich,
            product: {},
            links: [
              {
                link_type: "Web",
                url: "/post/oestra-vs-winona",
                text: "Oestra vs Winona",
              },
            ],
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
    expect(html).toContain('href="/post/inner-balance-hrt-review"');
    expect(html).toContain("My review");
    expect(html).toContain("Oestra vs Winona");
    expect(html).toContain('href="/inner-balance"');
    expect(html).toContain("Products &amp; pricing");
    expect(html).toContain('href="https://youtu.be/_OlA4wXOHdQ"');
    expect(html).toContain("Watch my review");
  });

  it("drops the bottom rule on the last brand promo in a run", () => {
    const promo = (id: string, heading: string) => ({
      ...slice("brand_promo", {
        ...section(heading),
        clinic: clinicLink,
        first: false,
        overwrite: [],
      }),
      id,
    });
    const html = render([
      promo("promo-1", "No pre-testing"),
      promo("promo-2", "Most comprehensive testing"),
      slice("divider", {
        line: "Squiggly",
        color: "Accent",
        background: "Transparent",
        space_above: "None",
        space_below: "None",
      }),
    ]);
    const layouts = html.match(/<div class="[^"]*layout[^"]*"[^>]*>/g) ?? [];

    expect(layouts).toHaveLength(2);
    expect(layouts[0]).not.toContain("data-last");
    expect(layouts[1]).toContain("data-last");
  });

  it("features the newest post and leaves it out of the grid", () => {
    const posts = [
      {
        title: "Newest story",
        href: "/post/newest-story",
        published: "2026-09-29",
        category: "My experience & results",
      },
      {
        title: "August story",
        href: "/post/august-story",
        published: "2026-08-01",
        category: "My experience & results",
      },
    ];
    const slices = [
      slice(
        "posts",
        { ...section(""), category: "All", post: { link_type: "Any" } },
        "featured",
      ),
      slice(
        "posts",
        { ...section("Latest articles"), category: "All" },
        "grid",
      ),
    ];

    const html = render(slices, context({ posts }));
    expect(html.split("Newest story").length - 1).toBe(1);
    expect(html).toContain("August story");

    const repeated = render(
      slices,
      context({ posts, category: "My experience & results" }),
    );
    expect(repeated.indexOf("Newest story")).toBeLessThan(
      repeated.indexOf("Latest articles"),
    );
    expect(repeated.indexOf("Latest articles")).toBeLessThan(
      repeated.indexOf("August story"),
    );
    expect(repeated.split("Newest story").length - 1).toBe(1);

    const other = render(
      slices,
      context({
        posts: [
          ...posts,
          {
            title: "Dosage note",
            href: "/post/dosage-note",
            published: "2026-07-01",
            category: "Formulations & dosages",
          },
        ],
        category: "Formulations & dosages",
      }),
    );
    expect(other.indexOf("Newest story")).toBeLessThan(
      other.indexOf("Latest articles"),
    );
    expect(other.split("Newest story").length - 1).toBe(1);
    expect(other).toContain("Dosage note");
    expect(other).not.toContain("August story");
  });

  it("keeps the featured post in the grid when the switch is off", () => {
    const posts = [
      {
        title: "Newest story",
        href: "/post/newest-story",
        published: "2026-09-29",
      },
      {
        title: "August story",
        href: "/post/august-story",
        published: "2026-08-01",
      },
    ];
    const html = render(
      [
        slice(
          "posts",
          { ...section(""), category: "All", post: { link_type: "Any" } },
          "featured",
        ),
        slice(
          "posts",
          {
            ...section("Latest articles"),
            category: "All",
            hide_featured: false,
          },
          "grid",
        ),
      ],
      context({ posts }),
    );

    expect(html.split("Newest story").length - 1).toBe(2);
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
