import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string; className?: string }) =>
    createElement("img", {
      alt: props.alt ?? "",
      src: props.src,
      className: props.className,
    }),
}));
import type { SliceSectionFields } from "@/components/slice-section";
import { ClinicFacts, clinicFacts, type FactsClinic } from "./index";

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

const innerBalance: FactsClinic = {
  name: "Inner Balance",
  kind: "Clinic",
  availability: "All 50 states",
  formulation: "Oestra vaginal cream",
  labs: "None",
  insurance: false,
  hsaFsa: true,
  gettingStarted: "No visit",
  steps: [
    { title: "Health quiz", text: "Complete their 5-minute health quiz." },
    { text: "Start treatment, with ongoing support." },
  ],
  specialties: ["Menopause", "PCOS"],
};

function photo(alt: string): ImageField {
  return {
    id: "photo",
    url: "/mockup/posts/oestra-vs-winona.jpg",
    alt,
    copyright: null,
    dimensions: { width: 800, height: 500 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

describe("clinicFacts", () => {
  it("lists the filled facts in order", () => {
    expect(clinicFacts(innerBalance).map((fact) => fact.label)).toEqual([
      "Availability",
      "Typically prescribed",
      "Pre-testing",
      "Insurance",
      "HSA / FSA",
      "To get started",
    ]);
  });

  it("leaves out insurance on a product and HSA / FSA when it is off", () => {
    const labels = clinicFacts({
      name: "Mira",
      kind: "Product",
      insurance: false,
      hsaFsa: false,
    }).map((fact) => fact.label);
    expect(labels).toEqual([]);
  });
});

describe("ClinicFacts", () => {
  it("shows the facts, the steps, and the specialties", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts primary={section("The facts")} clinic={innerBalance} />,
    );

    expect(markup).toContain('id="the-facts"');
    expect(markup).toContain("<dd>All 50 states</dd>");
    expect(markup).toContain("<dd>Not accepted</dd>");
    expect(markup).toMatch(/<h3[^>]*>How it works<\/h3>/);
    expect(markup).toContain("<ol");
    expect(markup).toContain("Health quiz");
    expect(markup).toContain("Start treatment, with ongoing support.");
    expect(markup).toMatch(/<h3[^>]*>Specialties they list<\/h3>/);
    expect(markup).toContain("<li>PCOS</li>");
  });

  it("uses h2 for the parts when the slice has no heading", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts primary={section()} clinic={innerBalance} />,
    );
    expect(markup).toMatch(/<h2[^>]*>How it works<\/h2>/);
  });

  it("shows only the header without a published clinic", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts primary={section("The facts")} clinic={null} />,
    );
    expect(markup).toContain("The facts");
    expect(markup).not.toContain("<dl");
  });

  it("puts the photo between the facts and How it works", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts
        primary={{ ...section("The facts"), image: photo("Oestra and Winona") }}
        clinic={innerBalance}
      />,
    );
    const facts = markup.indexOf("<dl");
    const image = markup.indexOf('alt="Oestra and Winona"');
    const steps = markup.indexOf("How it works");

    expect(facts).toBeGreaterThan(-1);
    expect(image).toBeGreaterThan(facts);
    expect(steps).toBeGreaterThan(image);
    expect(markup).toContain('src="/mockup/posts/oestra-vs-winona.jpg"');
  });

  it("leaves an empty photo out", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts primary={section("The facts")} clinic={innerBalance} />,
    );
    expect(markup).not.toContain("<img");
  });

  it("puts the offer box between How it works and the specialties", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts
        primary={section("The facts")}
        clinic={{
          ...innerBalance,
          logo: { src: "/mockup/logos/inner-balance.png" },
          visitHref: "https://example.com/inner-balance?ref=peggy",
          visitText: "Visit Inner Balance",
          offerCode: "PEGGY10",
          offerCopy: "10% off your first order.",
        }}
      />,
    );
    const steps = markup.indexOf("How it works");
    const offer = markup.indexOf('aria-label="Inner Balance offer"');
    const specialties = markup.indexOf("Specialties they list");

    expect(offer).toBeGreaterThan(steps);
    expect(specialties).toBeGreaterThan(offer);
    const line = markup.indexOf("10% off your first order.");
    const insurance = markup.indexOf("Doesn’t take insurance");
    const visit = markup.indexOf("Visit Inner Balance");

    expect(line).toBeGreaterThan(offer);
    expect(insurance).toBeGreaterThan(line);
    expect(visit).toBeGreaterThan(insurance);
    expect(markup).toContain("Oestra vaginal cream");
    expect(markup).toContain("No visit");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).toContain('data-placement="clinic_facts"');
    expect(markup).toContain("https://example.com/inner-balance?ref=peggy");
  });

  it("leaves insurance off the offer box for a product", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts
        primary={section("The facts")}
        clinic={{
          ...innerBalance,
          kind: "Product",
          offerCopy: "10% off your first order.",
          offerCode: "PEGGY10",
        }}
      />,
    );
    expect(markup).not.toContain("take insurance");
    expect(markup).toContain("Oestra vaginal cream");
  });

  it("uses the short description when the code line is blank", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts
        primary={section("The facts")}
        clinic={{
          ...innerBalance,
          visitHref: "https://example.com/inner-balance?ref=peggy",
          offerCode: "PEGGY10",
          shortDescription: "Better sleep",
        }}
      />,
    );
    expect(markup).toContain("Better sleep");
    expect(markup).not.toContain("10% off");
    expect(markup).toContain("Code PEGGY10");
  });

  it("does not open the offer box from a short description alone", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts
        primary={section("The facts")}
        clinic={{ ...innerBalance, shortDescription: "Better sleep" }}
      />,
    );
    expect(markup).not.toContain("Better sleep");
    expect(markup).not.toContain("offer");
  });

  it("leaves the offer box out when the clinic has no code, line, or visit", () => {
    const markup = renderToStaticMarkup(
      <ClinicFacts primary={section("The facts")} clinic={innerBalance} />,
    );
    expect(markup).not.toContain("offer");
  });
});
