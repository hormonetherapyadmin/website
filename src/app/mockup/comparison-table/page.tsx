import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import Link from "next/link";
import type { SliceSectionFields } from "@/components/slice-section";
import { ClinicComparison } from "@/slices/clinic_comparison";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";

export const metadata: Metadata = {
  title: "Comparison table",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const empty = [] as RichTextField;

const section: SliceSectionFields = {
  small_heading: empty,
  heading: rich(
    "Which Telehealth Platform offers the Best Value for GLP-1 Medications?",
  ),
  intro: empty,
  background: "Transparent",
  space_above: "Large",
  space_below: "None",
};

export default async function ComparisonTableMockup(
  props: PageProps<"/mockup/comparison-table">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason title="Comparison table">
        <p>
          This is the Chart variation of Clinic comparison. It uses that table:
          the same frame, the clinic cell, and the sideways scroll. The columns
          are Clinic, What I paid, What’s included, and My code. The homepage
          chart keeps Clinic, Description, What I paid per month, Insurance,
          Typically prescribed, and In my words. The live GLP chart is a Common
          Ninja embed, so this row is empty.{" "}
          <Link href="/mockup/clinic-comparison">The clinic chart</Link> is the
          one already built.
        </p>
      </Reason>
      <ClinicComparison
        primary={section}
        rows={[
          {
            name: "From the embed",
            monogram: "GLP",
            paid: "Not on the page yet",
            included: "Not on the page yet",
            code: "Not on the page yet",
          },
        ]}
      />
    </MockupShell>
  );
}
