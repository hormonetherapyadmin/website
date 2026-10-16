import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Text } from "./index";

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

describe("Text", () => {
  it("puts the heading and the writing in the story column", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section("Cost of Hormone Replacement Therapy"),
          text: [
            { type: "heading3", text: "Prior Authorization", spans: [] },
            { type: "paragraph", text: "Check your plan.", spans: [] },
          ] as unknown as RichTextField,
        }}
      />,
    );

    expect(markup).toContain('id="cost-of-hormone-replacement-therapy"');
    expect(markup).toContain("max-w-story-wrap");
    expect(markup).not.toContain("max-w-wrap");
    expect(markup).toMatch(/<h2[^>]*>Cost of Hormone Replacement Therapy/);
    expect(markup).toMatch(/<h3[^>]*>Prior Authorization<\/h3>/);
    expect(markup).toContain("Check your plan.");
  });

  it("keeps the link beside the heading", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section("Cost of Hormone Replacement Therapy"),
          link: {
            link_type: "Web",
            url: "/chart",
            text: "See the chart",
          } as LinkField,
          text: rich("Check your plan."),
        }}
      />,
    );
    const heading = markup.indexOf("Cost of Hormone Replacement Therapy");
    const link = markup.indexOf("See the chart");
    const body = markup.indexOf("Check your plan.");

    expect(markup).toContain("justify-between");
    expect(markup).not.toContain('data-align="center"');
    expect(link).toBeGreaterThan(heading);
    expect(link).toBeLessThan(body);
  });

  it("centers the writing and stacks the link under it", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section("Cost of Hormone Replacement Therapy"),
          link: {
            link_type: "Web",
            url: "/chart",
            text: "See the chart",
          } as LinkField,
          layout: "Centered",
          text: rich("Check your plan."),
        }}
      />,
    );
    const body = markup.indexOf("Check your plan.");
    const link = markup.indexOf("See the chart");

    expect(markup).toContain("text-center");
    expect(markup).toContain('data-align="center"');
    expect(markup).not.toContain("justify-between");
    expect(link).toBeGreaterThan(body);
  });

  it("shows a clinic token from the writing", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section(),
          text: rich("{{provider:winona:offer}} My pick for patches."),
        }}
        clinics={[{ uid: "winona", name: "Winona", offerCode: "PEGGY10" }]}
      />,
    );

    expect(markup).toContain("Winona");
    expect(markup).toContain("My pick for patches.");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).not.toContain("{{provider");
  });
});
