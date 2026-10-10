import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { TokenClinic } from "@/components/content-blocks";
import type { SliceSectionFields } from "@/components/slice-section";
import { CLINICS } from "@/app/mockup/_shared/clinics";
import { SideBySide } from "@/slices/side_by_side";

export const metadata: Metadata = {
  title: "Side by side",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

function paragraph(text: string, spans: object[] = []) {
  return { type: "paragraph" as const, text, spans };
}

function rich(text: string) {
  return [paragraph(text)] as unknown as RichTextField;
}

function strong(text: string, phrase: string) {
  const start = text.indexOf(phrase);
  return paragraph(text, [
    { start, end: start + phrase.length, type: "strong" },
  ]);
}

function linked(text: string, phrase: string, url: string) {
  const start = text.indexOf(phrase);
  return paragraph(text, [
    {
      start,
      end: start + phrase.length,
      type: "hyperlink",
      data: { link_type: "Web", url },
    },
  ]);
}

function block(text: string, label: "signoff" | "note") {
  return paragraph(text, [
    { start: 0, end: text.length, type: "label", data: { label } },
  ]);
}

function section(
  small: string,
  heading: string,
  intro = "",
): SliceSectionFields {
  return {
    small_heading: small ? rich(small) : emptyRich,
    heading: rich(heading),
    intro: intro ? rich(intro) : emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "Medium",
    space_below: "None",
  };
}

const inner = CLINICS.find((clinic) => clinic.name === "Inner Balance");

const clinics: TokenClinic[] = inner
  ? [
      {
        uid: "inner-balance",
        name: inner.name,
        logo: inner.logo ? { src: inner.logo } : undefined,
        monthlyPrice: inner.monthly,
        priceNote: inner.priceNote,
        insurance: inner.insurance,
        formulation: inner.formulation,
      },
    ]
  : [];

const story = [
  paragraph(
    "I’m your typical late-50’s woman. I love Jesus! I’m married, I have three grown children, three grandchildren, and my full-time gig is in the banking industry.",
  ),
  strong(
    "Since beginning my personal hormone replacement therapy journey under the care of a medical provider in 2019, I’ve experienced firsthand how overwhelming it can be to navigate menopause care, changing symptoms, and treatment options. To find what worked for my body, I’ve personally tested and evaluated more than 9 different HRT telehealth providers, including platforms like Winona, Midi Health, Alloy, Inner Balance, Musely, MyMenopauseRx, Effecty, a traditional OB/GYN and Joi Women’s Wellness.",
    "personally tested",
  ),
  linked(
    "Over years of patient experience, I’ve tracked everything from virtual consultation quality and out-of-pocket pricing, insurance coverage and shipping reliability across patches, topical creams, troches, injections and oral options. See my HRT Reviews.",
    "See my HRT Reviews.",
    "/blog",
  ),
  block(
    "I created HormoneTherapyHub to offer transparent, real-world consumer telemetry from a fellow patient’s perspective.",
    "signoff",
  ),
  block(
    "I am not a medical professional, and this site does not provide medical advice or treatment plans.",
    "note",
  ),
] as unknown as RichTextField;

export default function SideBySidePreview() {
  return (
    <>
      <SideBySide
        variation="image"
        primary={{
          ...section(
            "My hormone replacement story",
            "Menopause isn’t a dirty word.",
            "I’ll say that again: menopause isn’t something to be ashamed of, or a subject you should feel embarrassed to talk about.",
          ),
          side: "Media left",
          text: story,
          button: [
            {
              link_type: "Web",
              url: "/about",
              text: "Read my whole story",
              variant: "Solid",
            } as LinkField,
          ],
          caption: rich("Me and Winston, my Bernedoodle."),
        }}
        image={{
          src: "/mockup/peggy-winston.jpg",
          alt: "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        }}
      />
      <SideBySide
        variation="image"
        primary={{
          ...section(
            "Same slice, other side",
            "The photo can sit on the right.",
            "Media right keeps the writing first on a wide screen. On a phone the photo still comes first.",
          ),
          side: "Media right",
          text: rich(
            "I’m your typical late-50’s woman. I love Jesus! I’m married, I have three grown children, three grandchildren, and my full-time gig is in the banking industry.",
          ),
          caption: rich("Peggy"),
        }}
        image={{
          src: "/mockup/peggy-portrait.jpg",
          alt: "Peggy, smiling, in a dark sweater",
        }}
      />
      <SideBySide
        variation="quote"
        tokens="preview"
        clinics={clinics}
        primary={{
          ...section(
            "A pull quote",
            "The media can be a line she wants remembered.",
          ),
          side: "Media left",
          quote: rich(
            "Menopause isn’t something to be ashamed of, or a subject you should feel embarrassed to talk about.",
          ),
          attribution: "Peggy",
          text: rich(
            "{{provider:inner-balance:facts}} These are the numbers from my own year with them.",
          ),
          button: [
            {
              link_type: "Web",
              url: "/blog",
              text: "See my HRT Reviews",
              variant: "Ghost",
            } as LinkField,
          ],
        }}
      />
      <SideBySide
        variation="clinic"
        primary={{
          ...section(
            "A clinic card",
            "Or the media can be the clinic itself.",
            "The logo, the quote, and the visit link come from the clinic. This page does not invent a destination, so the visit link is a stand-in.",
          ),
          side: "Media right",
          text: rich(
            "Finding a product that treats my symptoms of menopause and helps with sleep was a clear winner for me.",
          ),
        }}
        clinic={
          inner
            ? {
                name: inner.name,
                logo: inner.logo ? { src: inner.logo } : undefined,
                quote: inner.quote,
                visitHref: "#affiliate-link",
              }
            : null
        }
      />
    </>
  );
}
