import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Faq, faqItems } from "./index";

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

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

describe("faqItems", () => {
  it("drops a question with no words", () => {
    const items = faqItems([
      { question: emptyRich, answer: rich("Hidden") },
      { question: rich("  "), answer: rich("Also hidden") },
      { question: rich("Is BHRT safe?"), answer: rich("Yes.") },
    ]);
    expect(items.map((item) => item.answer?.[0])).toMatchObject([
      { text: "Yes." },
    ]);
  });
});

describe("Faq", () => {
  it("starts every question closed unless Start opened is on", () => {
    const markup = renderToStaticMarkup(
      <Faq
        primary={{
          ...section(),
          questions: [
            { question: rich("Is BHRT safe?"), answer: rich("Generally.") },
            {
              question: rich("Is BHRT covered lby insurance?"),
              answer: rich("Coverage varies."),
              open: false,
            },
            {
              question: rich("Can I stop BHRT once I start?"),
              answer: rich("Ask your clinician."),
              open: true,
            },
          ],
        }}
      />,
    );

    const opened = markup.match(/<details[^>]*>/g) ?? [];
    expect(opened).toHaveLength(3);
    expect(opened.filter((tag) => tag.includes("open"))).toHaveLength(1);
    expect(markup).toMatch(/<h2[^>]*>Is BHRT safe\?<\/h2>/);
    expect(markup).toContain("Generally.");
    expect(markup).toContain("Ask your clinician.");
  });

  it("lets more than one question start opened, under a section heading", () => {
    const markup = renderToStaticMarkup(
      <Faq
        primary={{
          ...section("Common questions"),
          questions: [
            { question: rich("First"), answer: rich("One"), open: true },
            { question: rich("Second"), answer: rich("Two"), open: true },
          ],
        }}
      />,
    );

    const opened = markup.match(/<details[^>]*>/g) ?? [];
    expect(opened.filter((tag) => tag.includes("open"))).toHaveLength(2);
    expect(markup).toMatch(/<h2[^>]*>Common questions<\/h2>/);
    expect(markup).toMatch(/<h3[^>]*>First<\/h3>/);
    expect(markup).toMatch(/<h3[^>]*>Second<\/h3>/);
  });
});
