import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { ProsAndCons } from "@/slices/ProsAndCons";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Pros and cons mockup, with the HRT and BHRT lists from the live
  /ishrtforme page (October 2026), word for word.
*/

export const metadata: Metadata = {
  title: "Pros and cons slice",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

const rich = (text: string) =>
  [{ type: "paragraph", text, spans: [] }] as unknown as RichTextField;

const bullets = (...items: string[]) =>
  items.map((text) => ({
    type: "list-item",
    text,
    spans: [],
  })) as unknown as RichTextField;

const primary: SliceSectionFields = {
  small_heading: emptyRich,
  heading: rich("Pros and Cons"),
  intro: emptyRich,
  link: { link_type: "Any" },
  background: "Transparent",
  space_above: "Large",
  space_below: "Large",
};

export default async function ProsAndConsMockup(
  props: PageProps<"/mockup/pros-and-cons">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <ProsAndCons
        primary={{
          ...primary,
          rows: [
            {
              title: "HRT",
              pros: bullets(
                "FDA Approval",
                "Standardized Dosages",
                "Widely Studied",
                "Insurance Coverage",
              ),
              cons: bullets(
                "Potential Side Effects",
                "Non-Bioidentical Structure",
                "One-Size-Fits All Approach",
                "Concerns about Long-Term Use",
              ),
            },
            {
              title: "BHRT",
              pros: bullets(
                "Customized Dosages",
                "Structural Similarity",
                "Diverse Formulations",
                "Fewer side effects",
              ),
              cons: bullets(
                "Regulatory Oversign",
                "Limited Research",
                "Cost",
                "Lack of Standardization",
              ),
            },
          ],
        }}
      />
      <ProsAndCons
        primary={{
          ...primary,
          heading: rich("One row, with her own labels"),
          background: "Blue",
          space_above: "None",
          pros_label: "What I liked",
          cons_label: "What I didn’t like",
          rows: [
            {
              pros: bullets("Customized Dosages", "Diverse Formulations"),
              cons: bullets("Cost"),
            },
          ],
        }}
      />
    </MockupShell>
  );
}
