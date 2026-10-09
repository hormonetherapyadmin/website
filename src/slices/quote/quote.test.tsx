import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import { Quote, quoteName, type QuoteClinic } from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: rich("Peggy's take: what I'm using now"),
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Dark",
    space_above: "None",
    space_below: "None",
  };
}

const clinic: QuoteClinic = {
  name: "Inner Balance",
  logo: { src: "/mockup/logos/inner-balance.png" },
  visitHref: "https://example.com/inner-balance",
  visitText: "Visit Inner Balance",
  newTab: true,
};

describe("quoteName", () => {
  it("uses the written name, then the clinic name", () => {
    expect(quoteName("Oestra by Inner Balance", clinic)).toBe(
      "Oestra by Inner Balance",
    );
    expect(quoteName("  ", clinic)).toBe("Inner Balance");
    expect(quoteName(null, undefined)).toBe("");
  });
});

describe("Quote", () => {
  function html(name?: string) {
    return renderToStaticMarkup(
      <Quote
        primary={{
          ...section(),
          quote: rich("I go to sleep faster and stay asleep longer."),
          name,
          text: rich("It’s $199 a month for the first six months."),
          reminder: rich("This is my personal experience, not medical advice."),
          review_button: {
            link_type: "Web",
            url: "/post/oestra-by-inner-balance-my-honest-1-year-review",
            text: "Read my 1-year Oestra review",
          } as LinkField,
        }}
        clinic={clinic}
      />,
    );
  }

  it("lays out the quote, the product name, and both actions", () => {
    const markup = html("Oestra by Inner Balance");
    expect(markup).toContain('id="peggys-take-what-im-using-now"');
    expect(markup).toContain("Peggy&#x27;s take: what I&#x27;m using now");
    expect(markup).toContain("I go to sleep faster and stay asleep longer.");
    expect(markup).toContain("Oestra by Inner Balance");
    expect(markup).toContain("It’s $199 a month for the first six months.");
    expect(markup).toContain(
      "This is my personal experience, not medical advice.",
    );
    expect(markup).toContain("Read my 1-year Oestra review");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain('data-provider="Inner Balance"');
    expect(markup).toContain('data-placement="quote"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("/mockup/logos/inner-balance.png");
  });

  it("uses the clinic name when Name is empty", () => {
    expect(html().includes("Inner Balance")).toBe(true);
    expect(html()).not.toContain("Oestra by Inner Balance");
  });
});
