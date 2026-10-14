import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { ProsAndCons, listItems } from "./index";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const bullets = (...items: string[]) =>
  items.map((text) => ({
    type: "list-item",
    text,
    spans: [],
  })) as unknown as RichTextField;

const emptyRich = [] as RichTextField;

function section(heading = ""): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: heading ? rich(heading) : emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  };
}

describe("listItems", () => {
  it("makes one item per line and drops blank lines", () => {
    const items = listItems([
      { type: "list-item", text: "FDA Approval", spans: [] },
      { type: "paragraph", text: " ", spans: [] },
      { type: "paragraph", text: "Widely Studied", spans: [] },
    ] as unknown as RichTextField);
    expect(items.map((item) => item[0])).toMatchObject([
      { type: "paragraph", text: "FDA Approval" },
      { type: "paragraph", text: "Widely Studied" },
    ]);
  });
});

describe("ProsAndCons", () => {
  it("puts each titled row under the section heading", () => {
    const markup = renderToStaticMarkup(
      <ProsAndCons
        primary={{
          ...section("Pros and Cons"),
          rows: [
            {
              title: "HRT",
              pros: bullets("FDA Approval"),
              cons: bullets("Potential Side Effects"),
            },
            { title: "Empty", pros: emptyRich, cons: emptyRich },
          ],
        }}
      />,
    );

    expect(markup).toMatch(/<h3[^>]*>HRT<\/h3>/);
    expect(markup).toMatch(/<h4[^>]*>.*Pros<\/h4>/);
    expect(markup).toMatch(/<h4[^>]*>.*Cons<\/h4>/);
    expect(markup).toContain("FDA Approval");
    expect(markup).toContain("Potential Side Effects");
    expect(markup).not.toContain("Empty");
  });

  it("uses written labels, and h2 sides with no heading and no title", () => {
    const markup = renderToStaticMarkup(
      <ProsAndCons
        primary={{
          ...section(),
          pros_label: "What I liked",
          cons_label: "What I didn’t like",
          rows: [{ pros: bullets("No visit"), cons: emptyRich }],
        }}
      />,
    );

    expect(markup).toMatch(/<h2[^>]*>.*What I liked<\/h2>/);
    expect(markup).not.toContain("What I didn’t like");
  });
});
