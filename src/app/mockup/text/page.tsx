import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Hero } from "@/slices/hero";
import { Text } from "@/slices/Text";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Text slice mockup, with copy from the live /costandinsurance page
  (October 2026), word for word. Wix shows the sub-topics as bold
  paragraphs. Here they are Heading 3, the way she would set them.
*/

export const metadata: Metadata = {
  title: "Text slice",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

const block = (type: string, text: string) => ({ type, text, spans: [] });

const rich = (text: string) =>
  [block("paragraph", text)] as unknown as RichTextField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "Medium",
    space_below: "None",
    ...overrides,
  };
}

const cost = [
  block("heading3", "Bioidentical Hormone Replacement Therapy"),
  block(
    "paragraph",
    "BHRT may involve compounded medications that are customized for individual patients. The cost can vary based on the pharmacy, the specific hormones used, and the formulation. Compounded medications may be more expensive than mass-produced, standardized medications.",
  ),
  block("heading3", "Conventional Hormone Replacement Therapy"),
  block(
    "paragraph",
    "The cost of traditional HRT can vary depending on the type of hormones prescribed, the formulation (pills, patches, injections, etc) and whether generic or brand-name medications are used.",
  ),
  block("heading3", "Consultation and Monitoring Fees"),
  block(
    "paragraph",
    "In addition to the cost of medications, healthcare providers may charge consultation fees for initial assessments, follow-up appointments and monitoring.",
  ),
] as unknown as RichTextField;

const insurance = [
  block("heading3", "Private Insurance"),
  block(
    "paragraph",
    "Some private insurance plans may cover the cost of hormone replacement therapy, but coverage varies widely. Insurance providers may have specific criteria for coverage, and they may require documentation of medical necessity.",
  ),
  block("heading3", "Verification of Coverage"),
  block(
    "paragraph",
    "Before starting hormone replacement therapy. it is advisable to contact your insurance provider to verify coverage and understand any out-of-pocket costs. Your healthcare provider's office may also assist in verifying insurance coverage.",
  ),
  block("heading3", "Prior Authorization"),
  block(
    "paragraph",
    "In some cases, insurance companies may require prior authorization before covering certain medications or treatments. This involves obtaining approval from the insurance company based on medical necessity.",
  ),
  block("heading3", "Prescription Drug Coverage"),
  block(
    "paragraph",
    "Insurance coverage of medications is typically outlined in your prescription drug benefits. Check your plan's formulary to see which hormones are covered at what cost.",
  ),
  block("heading3", "Out-of-Pocket Costs"),
  block(
    "paragraph",
    "Even with insurance coverage, individuals may have out-of-pocket costs such as copayments, deductibles, or coinsurance.",
  ),
  block("heading3", "HSA Cards"),
  block(
    "paragraph",
    "Some Hormone Replacement Therapy clinics and providers accept HSA credit cards. Be sure to check their website, our review pages or with the practice directly to confirm they'll accept your HSA Card for payment.",
  ),
] as unknown as RichTextField;

export default async function TextMockup(props: PageProps<"/mockup/text">) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Hero
        variation="centered"
        primary={section({
          heading: rich("Will my Hormone Replacement be covered by insurance?"),
          intro: rich(
            "It's crucial to have open communication with both your healthcare provider and your insurance company to understand the financial aspects of bioidentical hormone replacement therapy. Additionally, it's important to keep in mind that insurance coverage policies may change, so it's advisable to check with your insurance provider for the most up-to-date informtion.",
          ),
        })}
      />

      <Text
        primary={{
          ...section({
            heading: rich("Cost of Hormone Replacement Therapy"),
            space_above: "Large",
          }),
          text: cost,
        }}
      />

      <Text
        primary={{
          ...section({
            heading: rich("Insurance Coverage"),
            background: "Blue",
            space_above: "Large",
            space_below: "Large",
          }),
          text: insurance,
        }}
      />
    </MockupShell>
  );
}
