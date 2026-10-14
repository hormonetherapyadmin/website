import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
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
