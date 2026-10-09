import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Boxes, boxesAcross, resolveBox, type BoxClinic } from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;
const jump = (href: string) => ({ link_type: "Web", url: href }) as LinkField;

function section(heading = emptyRich): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading,
    intro: emptyRich,
    link: emptyLink,
    background: null,
    space_above: "None",
    space_below: null,
  };
}

const innerBalance: BoxClinic = {
  name: "Inner Balance",
  logo: { src: "https://images.prismic.io/inner-balance.png" },
  offerCode: "PEGGY10",
  shortDescription: "Better sleep",
};

function box(heading: string, overrides = {}) {
  return {
    clinic: emptyLink,
    image: {} as ImageField,
    heading: rich(heading),
    text: emptyRich,
    bottom_line: null,
    link: emptyLink,
    ...overrides,
  };
}

describe("boxesAcross", () => {
  it("reads the choice and uses 5 when it is empty or unknown", () => {
    expect(boxesAcross("7")).toBe(7);
    expect(boxesAcross("2")).toBe(2);
    expect(boxesAcross(null)).toBe(5);
    expect(boxesAcross("9")).toBe(5);
  });
});

describe("resolveBox", () => {
  it("fills empty fields from the clinic", () => {
    expect(resolveBox(box("Improved sleep"), innerBalance)).toMatchObject({
      logo: { src: innerBalance.logo!.src, alt: "" },
      name: "Inner Balance",
      bottomLine: "PEGGY10",
    });
  });

  it("uses the clinic short description when Heading is empty", () => {
    expect(resolveBox(box(""), innerBalance)).toMatchObject({
      heading: undefined,
      shortDescription: "Better sleep",
      name: "Inner Balance",
    });
    expect(resolveBox(box("Improved sleep"), innerBalance)).toMatchObject({
      shortDescription: undefined,
    });
  });

  it("lets written fields replace the clinic's", () => {
    const resolved = resolveBox(
      box("No pre-testing", {
        text: rich("Winona, by mail"),
        bottom_line: "15% off",
        image: {
          url: "/custom.png",
          alt: "Winona logo",
          dimensions: { width: 64, height: 64 },
        } as ImageField,
      }),
      innerBalance,
    );

    expect(resolved).toMatchObject({
      logo: { src: "/custom.png", alt: "Winona logo" },
      name: undefined,
      bottomLine: "15% off",
    });
  });

  it("leaves out a box with nothing to show", () => {
    expect(resolveBox(box(""), null)).toBeNull();
    expect(resolveBox({ ...box(""), heading: emptyRich }, null)).toBeNull();
  });
});

describe("Boxes", () => {
  it("renders clinic and custom boxes as jump links", () => {
    const html = renderToStaticMarkup(
      <Boxes
        primary={{
          ...section(),
          across: "7",
          boxes: [
            box("Improved sleep", { link: jump("#inner-balance") }),
            box("Most insurance-friendly", {
              text: rich("MyMenopauseRx"),
              bottom_line: "No code",
            }),
          ],
        }}
        clinics={[innerBalance, null]}
      />,
    );

    expect(html).toContain('href="#inner-balance"');
    expect(html).toContain("PEGGY10");
    expect(html).toContain("No code");
    expect(html).toContain("MyMenopauseRx");
    expect(html).not.toContain("<h3");
  });

  it("shows the clinic short description as the box heading", () => {
    const html = renderToStaticMarkup(
      <Boxes
        primary={{ ...section(rich("Jump to a clinic")), boxes: [box("")] }}
        clinics={[innerBalance]}
      />,
    );

    expect(html).toMatch(/<h3[^>]*>Better sleep<\/h3>/);
  });

  it("never sets more columns than there are boxes", () => {
    const html = renderToStaticMarkup(
      <Boxes
        primary={{
          ...section(),
          across: "7",
          boxes: [box("One"), box("Two"), box("Three")],
        }}
      />,
    );

    expect(html).toContain('data-cols="3"');
  });

  it("uses 5 across by default and h3 box titles under a section heading", () => {
    const html = renderToStaticMarkup(
      <Boxes
        primary={{
          ...section(rich("Jump to a clinic")),
          across: null,
          boxes: ["A", "B", "C", "D", "E", "F", "G"].map((title) => box(title)),
        }}
      />,
    );

    expect(html).toContain('data-cols="5"');
    expect(html).toContain("<h3");
  });
});
