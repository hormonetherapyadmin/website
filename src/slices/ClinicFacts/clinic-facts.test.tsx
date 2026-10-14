import { renderToStaticMarkup } from "react-dom/server";
import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
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
});
