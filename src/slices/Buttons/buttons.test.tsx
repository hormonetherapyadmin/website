import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { buttonLinks, Buttons } from "./index";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  };
}

const link = (text: string, variant: "Solid" | "Ghost" = "Solid"): LinkField =>
  ({
    link_type: "Web",
    url: "https://www.hormonetherapyhub.com/trusted-providers",
    text,
    variant,
  }) as LinkField;

describe("buttonLinks", () => {
  it("drops a button with no words", () => {
    const links = buttonLinks([
      link(""),
      link("   "),
      { link_type: "Any" } as LinkField,
      link("Trusted providers"),
    ]);

    expect(links.map((button) => button.text)).toEqual(["Trusted providers"]);
  });
});

describe("Buttons", () => {
  it("centers a solid button and draws no box", () => {
    const markup = renderToStaticMarkup(
      <Buttons
        primary={{
          ...section(),
          layout: "Centered",
          button: [link("Trusted HRT Docs/Clinics - Start my Journey")],
        }}
      />,
    );

    expect(markup).toContain('data-layout="centered"');
    expect(markup).toContain("Trusted HRT Docs/Clinics - Start my Journey");
    expect(markup).toContain(
      'href="https://www.hormonetherapyhub.com/trusted-providers"',
    );
    expect(markup).not.toContain("<svg");
    expect(markup).not.toContain("data-box");
  });

  it("lines buttons up on the left and gives a ghost an arrow", () => {
    const markup = renderToStaticMarkup(
      <Buttons
        primary={{
          ...section(),
          button: [link("Read the guide", "Ghost"), link("Trusted providers")],
        }}
      />,
    );

    expect(markup).toContain('data-layout="left"');
    expect(markup).toContain("<svg");
    expect(markup).toContain("Read the guide");
    expect(markup).toContain("Trusted providers");
  });

  it("shows a heading when there are no buttons", () => {
    const markup = renderToStaticMarkup(
      <Buttons
        primary={{
          ...section(),
          heading: rich("Where to start"),
          button: [],
        }}
      />,
    );

    expect(markup).toContain("Where to start");
    expect(markup).not.toContain("data-layout");
  });

  it("renders nothing when the slice is empty", () => {
    const markup = renderToStaticMarkup(
      <Buttons primary={{ ...section(), button: [link("")] }} />,
    );

    expect(markup).toBe("");
  });
});
