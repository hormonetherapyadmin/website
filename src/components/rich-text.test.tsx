import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { RichText } from "./rich-text";

function paragraph(text: string): RichTextField {
  return [{ type: "paragraph", text, spans: [] }];
}

describe("RichText", () => {
  it("renders nothing for an empty field", () => {
    expect(renderToStaticMarkup(<RichText field={[]} />)).toBe("");
  });

  it("renders a heading field as the tag the slice chooses", () => {
    const html = renderToStaticMarkup(
      <RichText
        field={paragraph("Where should I start?")}
        as="h2"
        id="start"
      />,
    );

    expect(html).toContain("<h2");
    expect(html).toContain('id="start"');
    expect(html).toContain("Where should I start?");
    expect(html).not.toContain("<p");
  });

  it("renders content headings, highlight, and superscript", () => {
    const field = [
      {
        type: "heading2",
        text: "My results",
        spans: [],
      },
      {
        type: "paragraph",
        text: "A clear winner, source 1",
        spans: [
          {
            type: "label",
            start: 2,
            end: 7,
            data: { label: "highlight" },
          },
          {
            type: "label",
            start: 23,
            end: 24,
            data: { label: "superscript" },
          },
          {
            type: "label",
            start: 9,
            end: 15,
            data: { label: "not-a-class" },
          },
        ],
      },
    ] as RichTextField;

    const html = renderToStaticMarkup(<RichText field={field} />);

    expect(html).toContain("<h2");
    expect(html).toContain("My results");
    expect(html).toContain("<mark");
    expect(html).toContain("clear");
    expect(html).toContain("<sup>1</sup>");
    expect(html).not.toContain("not-a-class");
  });
});
