import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  Ribbon,
  ribbonBoxBackground,
  ribbonShowsWave,
  ribbonTone,
} from "./index";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: emptyLink,
    background: "Transparent",
    space_above: "None",
    space_below: "None",
    ...overrides,
  };
}

const button = (
  text: string,
  url: string,
  variant: "Solid" | "Ghost" = "Solid",
): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    variant,
  }) as LinkField;

function render(primary: Parameters<typeof Ribbon>[0]["primary"]) {
  return renderToStaticMarkup(createElement(Ribbon, { primary }));
}

describe("ribbonBoxBackground", () => {
  it("uses Pink when the choice is empty, and drops a retired name", () => {
    expect(ribbonBoxBackground(null)).toBe("Pink");
    expect(ribbonBoxBackground("")).toBe("Pink");
    expect(ribbonBoxBackground("Blue")).toBe("Blue");
    expect(ribbonBoxBackground("Mauve")).toBe("Transparent");
  });
});

describe("ribbonTone", () => {
  it("follows the box, or the band when the box is transparent", () => {
    expect(ribbonTone("Pink", "Transparent")).toBe("light");
    expect(ribbonTone("Navy", "Cream")).toBe("dark");
    expect(ribbonTone("Transparent", "Raspberry")).toBe("dark");
    expect(ribbonTone("Transparent", "Cream")).toBe("light");
  });
});

describe("ribbonShowsWave", () => {
  it("draws the wave only when the box paints a different color", () => {
    expect(ribbonShowsWave("Pink", "Transparent")).toBe(true);
    expect(ribbonShowsWave("Pink", "Cream")).toBe(true);
    expect(ribbonShowsWave("Pink", "Pink")).toBe(false);
    expect(ribbonShowsWave("Cream", "Transparent")).toBe(false);
    expect(ribbonShowsWave("Transparent", "Navy")).toBe(false);
  });
});

describe("Ribbon", () => {
  it("lays out the template title, content, and both button styles", () => {
    const html = render({
      ...section(),
      title: rich("Still lining the prices up?"),
      content: rich(
        "The comparison chart includes Midi Health too. Midi doesn’t pay me a commission, and I was a patient there as well.",
      ),
      box_background: "Pink",
      button: [
        button("Open the price chart", "/hrt-price-comparison-chart"),
        button("Tips for choosing", "/tipstofindprovider", "Ghost"),
        button("", "/hidden", "Ghost"),
      ],
    });

    expect(html).toContain("Still lining the prices up?");
    expect(html).toContain("<h2");
    expect(html).toContain("Midi doesn’t pay me a commission");
    expect(html).toContain('href="/hrt-price-comparison-chart"');
    expect(html).toContain("Open the price chart");
    expect(html).toContain('href="/tipstofindprovider"');
    expect(html).toContain("Tips for choosing");
    expect(html).not.toContain('href="/hidden"');
    expect(html).toContain('data-box="Pink"');
    expect(html).toContain('data-behind="Transparent"');
    expect(html).toContain('data-tone="light"');
    expect(html).toContain('data-layout="right"');
    expect(html).toContain('data-wave="true"');
    expect(html).toContain('id="still-lining-the-prices-up"');
  });

  it("uses light text on a dark box and hides the wave on a matching band", () => {
    const html = render({
      ...section({ background: "Navy" }),
      title: rich("A navy ribbon"),
      box_background: "Navy",
      button: [button("Visit Winona", "https://winona.pxf.io/XYkMZ3", "Solid")],
    });

    expect(html).toContain('data-box="Navy"');
    expect(html).toContain('data-behind="Navy"');
    expect(html).toContain('data-tone="dark"');
    expect(html).not.toContain("data-wave");
    expect(html).toContain('rel="sponsored nofollow noopener noreferrer"');
  });

  it("centers the words and stacks the buttons under them", () => {
    const html = render({
      ...section({
        heading: rich("Before you go"),
      }),
      layout: "Centered",
      title: rich("Still lining the prices up?"),
      content: rich("The comparison chart includes Midi Health too."),
      button: [button("Open the price chart", "/hrt-price-comparison-chart")],
    });

    const heading = html.indexOf("Before you go");
    const title = html.indexOf("Still lining the prices up?");
    const chart = html.indexOf("Open the price chart");

    expect(html).toContain('data-layout="centered"');
    expect(html).toContain("text-center");
    expect(html).not.toContain("justify-between");
    expect(heading).toBeGreaterThan(-1);
    expect(title).toBeGreaterThan(heading);
    expect(chart).toBeGreaterThan(title);
  });

  it("drops the box title to a card heading under a section heading", () => {
    const html = render({
      ...section({ heading: rich("Before you go") }),
      title: rich("Still lining the prices up?"),
      box_background: "Blue",
    });

    expect(html).toContain("<h2");
    expect(html).toContain("Before you go");
    expect(html).toContain("<h3");
    expect(html).toContain("Still lining the prices up?");
    expect(html).toContain('id="before-you-go"');
    expect(html).not.toContain('id="still-lining-the-prices-up"');
  });

  it("hides an empty box", () => {
    const html = render({
      ...section({ heading: rich("Just a heading") }),
      title: emptyRich,
      content: emptyRich,
      button: [emptyLink],
    });

    expect(html).toContain("Just a heading");
    expect(html).not.toContain("data-box");
  });
});

describe("Ribbon tip", () => {
  function renderTip(primary: Parameters<typeof Ribbon>[0]["primary"]) {
    return renderToStaticMarkup(
      createElement(Ribbon, { variation: "tip", primary }),
    );
  }

  it("shows Peggy’s portrait, the fixed title, and the tip she typed", () => {
    const html = renderTip({
      ...section(),
      content: rich("Ask what the first month actually costs."),
      box_background: "Pink",
    });

    expect(html).toContain("Peggy’s tip");
    expect(html).toContain("Ask what the first month actually costs.");
    expect(html).toContain("XYNQOFoQwb5OYLsz");
    expect(html).toContain('data-layout="tip"');
    expect(html).toContain('data-box="Pink"');
    expect(html).toContain('data-wave="true"');
    expect(html).toContain("<h2");
    expect(html).toContain('id="peggys-tip"');
    expect(html).not.toContain("data-place");
  });

  it("uses a card heading under a section heading", () => {
    const html = renderTip({
      ...section({ heading: rich("Before you book") }),
      content: rich(
        "If they will not tell you the price, that is your answer.",
      ),
      box_background: "Lavender",
    });

    expect(html).toContain("<h2");
    expect(html).toContain("Before you book");
    expect(html).toContain("<h3");
    expect(html).toContain("Peggy’s tip");
    expect(html).toContain('id="before-you-book"');
  });

  it("hides an empty tip and keeps the section heading", () => {
    const html = renderTip({
      ...section({ heading: rich("Just a heading") }),
      content: emptyRich,
    });

    expect(html).toContain("Just a heading");
    expect(html).not.toContain("data-layout");
    expect(html).not.toContain("Peggy’s tip");
  });
});
