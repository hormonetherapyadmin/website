import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { SliceSectionFields } from "@/components/slice-section";
import {
  ClinicComparison,
  formatCheckedDate,
  formatMonthly,
  maxMonthly,
  priceBarWidth,
  type ComparisonClinic,
} from "./index";

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
    heading: rich("Eight online HRT clinics, side by side"),
    intro: rich("These are my real costs, not list prices."),
    link: { link_type: "Any" },
    background: "Blue",
    space_above: "None",
    space_below: "None",
  };
}

const button = {
  link_type: "Web",
  url: "/trusted-providers",
  text: "Trusted providers",
} as LinkField;

const disclosure = {
  link_type: "Web",
  url: "/affiliate-disclosures",
  text: "Affiliate disclosure",
} as LinkField;

function clinic(overrides: Partial<ComparisonClinic> = {}): ComparisonClinic {
  return {
    name: "Winona",
    href: "https://example.com/winona",
    logo: { src: "/mockup/logos/winona.png" },
    shortDescription: "Creams, no appointment",
    monthlyPrice: 89,
    insurance: false,
    formulation: "Topical cream",
    quote: "A pleasant straight-forward experience.",
    reviewHref: "/winona-review-page",
    ...overrides,
  };
}

describe("price helpers", () => {
  it("formats the checked date and the monthly price", () => {
    expect(formatCheckedDate("2026-09-09")).toBe("Sep 9, 2026");
    expect(formatMonthly(150)).toBe("$150");
    expect(formatMonthly(39.5)).toBe("$39.50");
  });

  it("sizes each bar against the highest price", () => {
    const clinics = [
      clinic({ monthlyPrice: 46 }),
      clinic({ name: "Joi", monthlyPrice: 233 }),
    ];
    expect(maxMonthly(clinics)).toBe(233);
    expect(priceBarWidth(233, 233)).toBe(100);
    expect(priceBarWidth(46, 233)).toBeCloseTo(19.7, 1);
  });
});

describe("ClinicComparison", () => {
  const clinics = [
    clinic({
      name: "Inner Balance",
      monthlyPrice: 150,
      priceNote: "Average over the first year",
      topChoice: "My 2026 top choice",
      insurance: false,
    }),
    clinic({
      name: "Joi Women’s Wellness",
      href: "https://example.com/joi",
      monthlyPrice: 233,
      offerCode: "BRONSON: 50% off labs",
      topChoice: undefined,
    }),
    clinic({
      name: "Midi Health",
      href: undefined,
      monthlyPrice: 39,
      insurance: true,
      offerCode: undefined,
    }),
  ];

  function html() {
    return renderToStaticMarkup(
      <ClinicComparison
        primary={{
          ...section(),
          prices_checked: "2026-09-09",
          button,
          disclosure,
        }}
        clinics={clinics}
      />,
    );
  }

  it("names the section from the heading and lists the columns", () => {
    const markup = html();
    expect(markup).toContain('id="eight-online-hrt-clinics-side-by-side"');
    expect(markup).toContain("These are my real costs, not list prices.");
    expect(markup).toContain("Trusted providers");
    expect(markup).toContain("Affiliate disclosure");
    expect(markup).toContain("Checked Sep 9, 2026");
    expect(markup).toContain("What I paid per month");
    expect(markup).toContain("Typically prescribed");
  });

  it("reads the price, the badge, the coupon, and the review from the clinic", () => {
    const markup = html();
    expect(markup).toContain("$150");
    expect(markup).toContain("Average over the first year");
    expect(markup).toContain("★ My 2026 top choice");
    expect(markup).toContain("Code BRONSON: 50% off labs");
    expect(markup).toContain('href="/winona-review-page"');
    expect(markup).toContain("Read review");
    expect(markup).toContain("Takes insurance");
    expect(markup).toContain("Doesn’t take insurance");
    expect(markup).toContain("Creams, no appointment");
    expect(markup).not.toContain("Tested by Peggy");
  });

  it("links an affiliate visit and leaves a clinic with no visit as text", () => {
    const markup = html();
    expect(markup).toContain('data-provider="Inner Balance"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("affiliate link, opens in a new tab");
    expect(markup).not.toContain('data-provider="Midi Health"');
    expect(markup).toContain("Midi Health");
  });

  it("renders no table when there are no clinics", () => {
    const markup = renderToStaticMarkup(
      <ClinicComparison primary={{ ...section() }} clinics={[]} />,
    );
    expect(markup).toContain("Eight online HRT clinics, side by side");
    expect(markup).not.toContain("<table");
  });
});
