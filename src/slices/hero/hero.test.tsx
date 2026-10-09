import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { Hero, type HeroClinic } from "./index";
import type { SliceSectionFields } from "@/components/slice-section";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;
const emptyImage = {} as ImageField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields[] {
  return [
    {
      small_heading: emptyRich,
      heading: emptyRich,
      intro: emptyRich,
      link: emptyLink,
      background: null,
      space_above: "None",
      space_below: null,
      ...overrides,
    },
  ];
}

function image(url: string, alt: string): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width: 800, height: 1000 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

describe("Hero", () => {
  it("renders the homepage title, tagline, and benefit, and hides a blank greeting", () => {
    const html = renderToStaticMarkup(
      <Hero
        variation="home"
        primary={{
          section: section({
            heading: rich("Hormone Therapy Replacement"),
            intro: rich("My goal is to share honest platform reviews."),
          }),
          tagline: rich("Feel like you again."),
          benefits: [
            { link_type: "Web", url: "/sleep", text: "Improve sleep" },
          ],
          button: [
            {
              link_type: "Web",
              url: "#compare",
              text: "See what each clinic cost me",
              variant: "Solid",
            },
            {
              link_type: "Web",
              url: "/ishrtforme",
              text: "New to HRT? Start here",
              variant: "Ghost",
            },
          ],
          trust_lines: [{ text: "Patient since 2019" }],
          image: image("/mockup/peggy-portrait.jpg", "Peggy, smiling"),
          photo_greeting: "",
          caption: rich("An experienced HRT patient reviewer. Not a doctor."),
        }}
      />,
    );

    expect(html).toContain("<h1");
    expect(html).toContain('id="feel-like-you-again"');
    expect(html).toContain("Hormone Therapy Replacement");
    expect(html).toContain("Feel like you again.");
    expect(html).toContain("Improve sleep");
    expect(html).toContain("See what each clinic cost me");
    expect(html).toContain("New to HRT? Start here");
    expect(html).toMatch(/New to HRT\? Start here<svg/);
    expect(html).toContain("Patient since 2019");
    expect(html).not.toContain("Hi, I");
  });

  it("renders a subpage title beside its photo and hides an empty photo", () => {
    const filled = renderToStaticMarkup(
      <Hero
        variation="subpage"
        primary={{
          section: section({
            small_heading: rich("Learn"),
            heading: rich("New to hormone therapy"),
            link: {
              link_type: "Web",
              url: "/ishrtforme",
              text: "Start here",
            },
          }),
          image: image("/mockup/peggy-portrait.jpg", "Peggy, smiling"),
        }}
      />,
    );
    const empty = renderToStaticMarkup(
      <Hero
        variation="subpage"
        primary={{
          section: section({ heading: rich("Blog") }),
          image: emptyImage,
        }}
      />,
    );

    expect(filled).toContain('id="new-to-hormone-therapy"');
    expect(filled).toContain("Start here");
    expect(filled).toContain('alt="Peggy, smiling"');
    expect(empty).toContain("Blog");
    expect(empty).not.toContain("<img");
  });

  it("renders the brands title and a clinic logo link", () => {
    const html = renderToStaticMarkup(
      <Hero
        variation="brands"
        primary={{
          section: section({
            small_heading: rich("Providers"),
            heading: rich("Trusted providers"),
            link: {
              link_type: "Web",
              url: "/hrt-price-comparison-chart",
              text: "Full price chart",
            },
          }),
          clinics: [
            {
              clinic: {
                data: {
                  name: "Inner Balance",
                  logo: image("/mockup/logos/inner-balance.png", ""),
                },
              },
              link: { link_type: "Web", url: "#inner-balance" },
            },
          ],
        }}
      />,
    );

    expect(html).toContain('id="trusted-providers"');
    expect(html).toContain("Trusted providers");
    expect(html).toContain('href="#inner-balance"');
    expect(html).toContain('aria-label="Inner Balance"');
  });

  it("uses the clinic name as the provider title and the offer code from the clinic", () => {
    const clinic: HeroClinic = {
      name: "Inner Balance",
      formulation: "Oestra",
      top_choice_label: "My 2026 top choice",
      monthly_price: 199,
      price_note: "First six months, then $99.",
      code: "PEGGY10",
      code_note: "10% off your first order",
      visit: {
        link_type: "Web",
        url: "https://example.com",
        text: "Visit Inner Balance",
        target: "_blank",
      },
    };

    const html = renderToStaticMarkup(
      <Hero
        variation="provider"
        primary={{
          section: section(),
          clinic: { data: clinic },
          voted: rich("Voted best for sleep"),
          quote: rich("I stay asleep longer on this HRT."),
          links: [
            {
              link_type: "Web",
              url: "/post/oestra",
              text: "My 1-year review",
            },
          ],
          product: emptyImage,
        }}
      />,
    );

    expect(html).toContain("<h1");
    expect(html).toContain('id="inner-balance"');
    expect(html).toContain("Inner Balance");
    expect(html).toContain("Oestra");
    expect(html).toContain("My 2026 top choice");
    expect(html).toContain("$199");
    expect(html).toContain("Code PEGGY10");
    expect(html).toContain("Visit Inner Balance");
    expect(html).not.toContain("<img");
  });
});
