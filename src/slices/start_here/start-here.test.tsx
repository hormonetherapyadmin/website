import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { StartHere, cardRows } from "./index";
import type { SliceSectionFields } from "@/components/slice-section";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(): SliceSectionFields[] {
  return [
    {
      small_heading: emptyRich,
      heading: rich("Where should I start?"),
      intro: emptyRich,
      link: emptyLink,
      background: null,
      space_above: "None",
      space_below: null,
    },
  ];
}

function card(title: string, href = `/${title}`) {
  return {
    small_heading: rich("For you"),
    heading: rich(title),
    text: rich("A short line."),
    link: { link_type: "Web", url: href } as LinkField,
    icon: "Question" as const,
  };
}

describe("cardRows", () => {
  it("keeps one through four cards on a single row", () => {
    expect(cardRows([1]).map((row) => row.length)).toEqual([1]);
    expect(cardRows([1, 2]).map((row) => row.length)).toEqual([2]);
    expect(cardRows([1, 2, 3]).map((row) => row.length)).toEqual([3]);
    expect(cardRows([1, 2, 3, 4]).map((row) => row.length)).toEqual([4]);
  });

  it("fills rows of four and repeats the short-row rule", () => {
    expect(cardRows([1, 2, 3, 4, 5]).map((row) => row.length)).toEqual([4, 1]);
    expect(cardRows([1, 2, 3, 4, 5, 6]).map((row) => row.length)).toEqual([
      4, 2,
    ]);
    expect(cardRows([1, 2, 3, 4, 5, 6, 7]).map((row) => row.length)).toEqual([
      4, 3,
    ]);
    expect(
      cardRows([1, 2, 3, 4, 5, 6, 7, 8, 9]).map((row) => row.length),
    ).toEqual([4, 4, 1]);
  });
});

describe("StartHere", () => {
  it("renders the section title and one centered card", () => {
    const html = renderToStaticMarkup(
      <StartHere
        primary={{
          section: section(),
          cards: [card("Is HRT for me?", "/ishrtforme")],
        }}
      />,
    );

    expect(html).toContain('id="where-should-i-start"');
    expect(html).toContain("<h2");
    expect(html).toContain("<h3");
    expect(html).toContain("Is HRT for me?");
    expect(html).toContain('href="/ishrtforme"');
    expect(html).toContain('data-count="1"');
    expect(html).toContain("Start here");
  });

  it("splits five cards into a row of four and a row of one", () => {
    const html = renderToStaticMarkup(
      <StartHere
        primary={{
          section: section(),
          cards: [
            card("One"),
            card("Two"),
            card("Three"),
            card("Four"),
            card("Five"),
            { ...card("Skip"), link: emptyLink },
          ],
        }}
      />,
    );

    expect(html).toContain('data-count="4"');
    expect(html).toContain('data-count="1"');
    expect(html).not.toContain("Skip");
  });
});
