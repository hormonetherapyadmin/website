import type { Metadata } from "next";
import type { ImageField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { ClinicFacts, type FactsClinic } from "@/slices/ClinicFacts";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Clinic facts mockup. The Inner Balance facts, steps, and specialties
  are the ones on the Inner Balance mockup, from the live /inner-balance
  page (October 2026). On the site they come from the Brand.
*/

export const metadata: Metadata = {
  title: "Clinic facts slice",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

const rich = (text: string) =>
  [{ type: "paragraph", text, spans: [] }] as unknown as RichTextField;

const INNER_BALANCE: FactsClinic = {
  name: "Inner Balance",
  kind: "Clinic",
  availability: "All 50 states",
  formulation: "Oestra vaginal cream",
  labs: "None",
  insurance: false,
  hsaFsa: true,
  gettingStarted: "No visit",
  steps: [
    {
      title: "Health quiz",
      text: "Complete Inner Balance’s 5-minute health quiz.",
    },
    {
      title: "Your treatment",
      text: "Receive the prescribed treatment. No visit required.",
    },
    {
      title: "Ongoing support",
      text: "Start treatment, with ongoing support.",
    },
  ],
  specialties: [
    "General HRT",
    "Perimenopause",
    "Menopause",
    "Endometriosis",
    "PCOS",
    "Postpartum",
  ],
  logo: { src: "/mockup/logos/inner-balance.png" },
  visitHref: "#affiliate-link",
  visitText: "Visit Inner Balance",
  offerCode: "PEGGY10",
  offerCopy: "10% off your first order.",
  shortDescription: "Better sleep",
};

function image(
  url: string,
  alt: string,
  width: number,
  height: number,
): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

const primary: SliceSectionFields & { image: ImageField } = {
  small_heading: emptyRich,
  heading: rich("The facts"),
  intro: rich(
    "What I confirmed on their page. This is my experience as a patient, not a medical review.",
  ),
  link: { link_type: "Any" },
  background: "Transparent",
  space_above: "Large",
  space_below: "Large",
  image: image(
    "/mockup/posts/oestra-vs-winona.jpg",
    "Oestra and Winona boxes side by side",
    800,
    500,
  ),
};

export default async function ClinicFactsMockup(
  props: PageProps<"/mockup/clinic-facts">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <ClinicFacts primary={primary} clinic={INNER_BALANCE} />
    </MockupShell>
  );
}
