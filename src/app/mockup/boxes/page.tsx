import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { Boxes, type BoxClinic } from "@/slices/boxes";
import type { SliceSectionFields } from "@/components/slice-section";

export const metadata: Metadata = {
  title: "Boxes slice",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;
const emptyImage = {} as ImageField;
const jump = (href: string) => ({ link_type: "Web", url: href }) as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: emptyLink,
    background: null,
    space_above: "Medium",
    space_below: "Medium",
    ...overrides,
  };
}

/* The trusted-providers jump band. Codes and labels are from that mockup. */
type Sample = {
  id: string;
  name: string;
  heading: string;
  code?: string;
  bottomLine?: string;
};

const CLINIC_BOXES: Sample[] = [
  {
    id: "inner-balance",
    name: "Inner Balance",
    heading: "Improved sleep",
    code: "PEGGY10",
  },
  {
    id: "winona",
    name: "Winona",
    heading: "No pre-testing",
    bottomLine: "15% off",
  },
  {
    id: "joi",
    name: "Joi Women’s Wellness",
    heading: "Most comprehensive testing",
    code: "BRONSON",
  },
  { id: "musely", name: "Musely", heading: "Most gentle HRT", code: "HTH20" },
  {
    id: "alloy",
    name: "Alloy",
    heading: "No appointment required",
    code: "HORMONEHUB10",
  },
  { id: "effecty", name: "Effecty", heading: "You get a say", code: "PEGGY50" },
  {
    id: "mymenopauserx",
    name: "MyMenopauseRx",
    heading: "Most insurance-friendly",
    bottomLine: "No code",
  },
];

const clinics: BoxClinic[] = CLINIC_BOXES.map((sample) => ({
  name: sample.name,
  logo: { src: `/mockup/logos/${sample.id}.png` },
  offerCode: sample.code,
}));

const clinicBoxes = CLINIC_BOXES.map((sample) => ({
  clinic: emptyLink,
  image: emptyImage,
  heading: rich(sample.heading),
  text: emptyRich,
  bottom_line: sample.bottomLine ?? null,
  link: jump(`#${sample.id}`),
}));

const customBoxes = [
  ["Brand new to this", "Is HRT for me?", "/ishrtforme"],
  ["Ready to pick a clinic", "Providers", "/tipstofindprovider"],
  ["Weighing your options", "Formulations", "/formuations"],
  ["Watching the budget", "Cost & insurance", "/hrt-price-comparison-chart"],
  ["Sleep", "Why I wake up hot", "/post/why-do-i-wake-up-hot-and-sweaty"],
  ["Weight", "Weight gain and HRT", "/copy-of-weight-gain"],
].map(([heading, text, href]) => ({
  clinic: emptyLink,
  image: emptyImage,
  heading: rich(heading),
  text: rich(text),
  bottom_line: "Read more",
  link: jump(href),
}));

export default function BoxesPreview() {
  return (
    <>
      <Boxes
        primary={{ ...section(), across: "7", boxes: clinicBoxes }}
        clinics={clinics}
      />
      <Boxes
        primary={{
          ...section({
            heading: rich("Default: five across, written by hand"),
            background: "Blue",
          }),
          across: null,
          boxes: customBoxes,
        }}
      />
      <Boxes
        primary={{
          ...section({ heading: rich("Three boxes, seven across") }),
          across: "7",
          boxes: clinicBoxes.slice(0, 3),
        }}
        clinics={clinics}
      />
    </>
  );
}
