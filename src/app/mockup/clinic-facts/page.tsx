import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
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
};

const primary: SliceSectionFields = {
  small_heading: emptyRich,
  heading: rich("The facts"),
  intro: rich(
    "What I confirmed on their page. This is my experience as a patient, not a medical review.",
  ),
  link: { link_type: "Any" },
  background: "Transparent",
  space_above: "Large",
  space_below: "Large",
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
