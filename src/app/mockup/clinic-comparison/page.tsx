import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { CLINICS } from "@/app/mockup/_shared/clinics";
import {
  ClinicComparison,
  type ComparisonClinic,
} from "@/slices/clinic_comparison";

export const metadata: Metadata = {
  title: "Clinic comparison",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: rich("Eight online HRT clinics, side by side"),
    intro: rich(
      "I paid out of pocket with my HSA card, or through my prescription insurance when I could. These are my real costs, not list prices. Yours may differ.",
    ),
    link: { link_type: "Any" },
    background: "Soft",
    space_above: "None",
    space_below: "None",
  };
}

const ROWS: ComparisonClinic[] = CLINICS.map((clinic) => ({
  name: clinic.name,
  href: clinic.isAffiliate ? "#affiliate-link" : undefined,
  newTab: clinic.isAffiliate,
  logo: clinic.logo ? { src: clinic.logo } : undefined,
  monogram: clinic.monogram,
  topChoice: clinic.topPick ? "My 2026 top choice" : undefined,
  shortDescription: clinic.shortDescription,
  monthlyPrice: clinic.monthly,
  priceNote: clinic.priceNote,
  insurance: clinic.insurance,
  formulation: clinic.formulation,
  quote: clinic.quote,
  note: clinic.note,
  offerCode: clinic.offer,
  reviewHref: clinic.reviewHref,
}));

export default function ClinicComparisonPreview() {
  return (
    <ClinicComparison
      primary={{
        ...section(),
        prices_checked: "2026-09-09",
        button: {
          link_type: "Web",
          url: "/mockup/trusted-providers",
          text: "Trusted providers",
        } as LinkField,
        disclosure: {
          link_type: "Web",
          url: "/affiliate-disclosures",
          text: "Affiliate disclosure",
        } as LinkField,
      }}
      clinics={ROWS}
    />
  );
}
