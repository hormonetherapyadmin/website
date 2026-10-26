import type { Metadata } from "next";
import type { ImageField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { ClinicFacts, type FactsClinic } from "@/slices/ClinicFacts";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Clinic facts mockup. The Inner Balance facts, steps, and specialties
  are the ones on the Inner Balance mockup, from the live /inner-balance
  page (October 2026). On the site they come from the Brand.

  The wide photo is a free Pexels lifestyle picture, cropped to 3:1,
  one scene per brand. Pexels lets us use these commercially. The files
  live in public/mockup/clinic-life. Photo ids:
  inner-balance 6787913, winona 6539970, musely 7658809, alloy 4936359,
  joi 8437014, effecty 7787502, menorx 6540137, midi 12086684.
  The woman in the hat is in both the Winona photo and the
  MyMenopauseRx group.
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
  product: image(
    "https://images.prismic.io/1shr96di/jGM0ZnhURMHOb_JN_oestra-cream.webp?auto=format,compress",
    "Oestra vaginal cream",
    640,
    677,
  ),
};

const SCENES: { name: string; file: string; alt: string }[] = [
  {
    name: "Winona",
    file: "winona.jpg",
    alt: "A woman in a sun hat smiling at the beach",
  },
  {
    name: "Musely",
    file: "musely.jpg",
    alt: "A woman watering flowers in a garden",
  },
  {
    name: "Alloy",
    file: "alloy.jpg",
    alt: "A woman sitting on a park bench",
  },
  {
    name: "Joi Women’s Wellness",
    file: "joi.jpg",
    alt: "A woman holding a yoga mat in a bright studio",
  },
  {
    name: "Effecty",
    file: "effecty.jpg",
    alt: "A woman smiling on a hiking trail",
  },
  {
    name: "MyMenopauseRx",
    file: "menorx.jpg",
    alt: "Three women laughing together by the water",
  },
  {
    name: "Midi Health",
    file: "midi.jpg",
    alt: "A woman laughing with friends in an exercise class",
  },
];

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

const scene = (file: string, alt: string) =>
  image(`/mockup/clinic-life/${file}`, alt, 1500, 500);

const primary: SliceSectionFields & { image: ImageField } = {
  small_heading: emptyRich,
  heading: rich("The facts"),
  intro: rich(
    "What I confirmed on their page. This is my experience as a patient, not a medical review.",
  ),
  link: { link_type: "Any" },
  background: "Transparent",
  space_above: "Large",
  space_below: "None",
  image: scene(
    "inner-balance-morning.jpg",
    "A woman smiling over coffee among plants",
  ),
};

export default async function ClinicFactsMockup(
  props: PageProps<"/mockup/clinic-facts">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <ClinicFacts primary={primary} clinic={INNER_BALANCE} />
      {SCENES.map((item) => (
        <ClinicFacts
          key={item.name}
          primary={{
            ...primary,
            heading: rich(item.name),
            intro: emptyRich,
            space_above: "Medium",
            image: scene(item.file, item.alt),
          }}
          clinic={{ name: item.name }}
        />
      ))}
    </MockupShell>
  );
}
