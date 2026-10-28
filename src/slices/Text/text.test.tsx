import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Text } from "./index";
import { isLead, writingRuns } from "./writing";

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

  it("sets a heading and paragraph list as numbered cards", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section("Bioidentical Therapy Formulations"),
          text: [
            { type: "heading3", text: "Compounded Creams", spans: [] },
            {
              type: "paragraph",
              text: "Applied to the skin.",
              spans: [],
            },
            { type: "heading3", text: "Pellets", spans: [] },
            {
              type: "paragraph",
              text: "Implanted under the skin.",
              spans: [],
            },
          ] as unknown as RichTextField,
        }}
      />,
    );

    expect(markup).toContain("<ol");
    expect(markup).toContain(">01<");
    expect(markup).toContain(">02<");
    expect(markup).toMatch(/<h3[^>]*>Compounded Creams<\/h3>/);
    expect(markup).toContain("Applied to the skin.");
    expect(markup).toContain("Implanted under the skin.");
  });

  it("keeps a heading with no paragraph, then cards the pairs under it", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section("Hormone Replacement Online"),
          text: [
            {
              type: "heading3",
              text: "What to look for when shopping for an online Doctor and Clinic?",
              spans: [],
            },
            { type: "heading3", text: "Medical Credentials", spans: [] },
            { type: "paragraph", text: "Check the license.", spans: [] },
            { type: "paragraph", text: "Check the experience.", spans: [] },
            { type: "heading3", text: "Privacy and Security", spans: [] },
            {
              type: "paragraph",
              text: "Ask how records are stored.",
              spans: [],
            },
          ] as unknown as RichTextField,
        }}
      />,
    );

    expect(markup).toContain(
      "What to look for when shopping for an online Doctor and Clinic?",
    );
    expect(markup).toContain("<ol");
    expect(markup).toContain("Check the license.");
    expect(markup).toContain("Check the experience.");
    expect(markup).toContain("Ask how records are stored.");
  });

  it("keeps one paragraph with no heading on the left", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section(),
          layout: "On the right",
          text: rich(
            "It's important to note that conventional HRT is mass-produced.",
          ),
        }}
      />,
    );

    expect(markup).not.toContain("data-lead");
    expect(markup).not.toContain('data-align="center"');
    expect(markup).toContain("mass-produced");
  });

  it("centers one paragraph with no heading when the layout is Centered", () => {
    const markup = renderToStaticMarkup(
      <Text
        primary={{
          ...section(),
          layout: "Centered",
          text: rich(
            "It's important to note that conventional HRT is mass-produced.",
          ),
        }}
      />,
    );

    expect(markup).toContain("data-lead");
    expect(markup).toContain("mass-produced");
    expect(markup).not.toContain("<h3");
  });
});

describe("writingRuns", () => {
  it("leaves a single heading and paragraph as ordinary writing", () => {
    const field = [
      { type: "heading3", text: "Prior Authorization", spans: [] },
      { type: "paragraph", text: "Check your plan.", spans: [] },
    ] as unknown as RichTextField;

    expect(writingRuns(field)).toEqual([{ kind: "rich", field }]);
    expect(isLead(writingRuns(field))).toBe(false);
  });

  it("does not treat a tip token as a lead", () => {
    const field = [
      {
        type: "paragraph",
        text: "{{tip}} Ask about the first month.",
        spans: [],
      },
    ] as unknown as RichTextField;

    expect(isLead(writingRuns(field))).toBe(false);
  });

  it("does not treat a clinic token as a lead", () => {
    const field = [
      {
        type: "paragraph",
        text: "{{provider:winona:offer}} My pick.",
        spans: [],
      },
    ] as unknown as RichTextField;

    expect(isLead(writingRuns(field))).toBe(false);
  });
});
