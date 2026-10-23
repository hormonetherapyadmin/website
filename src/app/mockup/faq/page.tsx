import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Faq } from "@/slices/Faq";
import { Hero } from "@/slices/hero";
import { Ribbon } from "@/slices/Ribbon";
import { MockupShell } from "../_shared/mockup-shell";

/*
  FAQ mockup for the live URL /faq, built only from page slices. Copy is
  from that Wix page (October 2026), word for word, including "lby",
  "yur", and "professsionals". On the live page the safety answer sits
  under "Is BHRT covered lby insurance?" and the insurance answer sits
  under "Is BHRT safe?" Each answer is paired here with the question it
  actually answers. The words are unchanged.
*/

export const metadata: Metadata = {
  title: "FAQ mockup",
  robots: { index: false, follow: false },
};

const emptyRich = [] as RichTextField;

function paragraph(text: string) {
  return { type: "paragraph" as const, text, spans: [] };
}

function rich(text: string) {
  return [paragraph(text)] as unknown as RichTextField;
}

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "Large",
    space_below: "None",
    ...overrides,
  };
}

const button = (text: string, url: string): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    variant: "Solid",
  }) as LinkField;

const questions = [
  [
    "Are BHRT formulations customized for each individual?",
    "Yes, BHRT is often customized based on individual hormone levels and needs. Compounded formulations may be tailored to address specific deficiencies...",
  ],
  [
    "Is BHRT safe?",
    "When prescribed and monitored by qualified healthcare professsionals, BHRT is generally considered safe. However, individual responses and risks may vary.",
  ],
  [
    "Are there potential side effects of BHRT?",
    "As with any medical treatment, there can be potential side effects. Common side effects may include skin irritation (with topical formulations) or adjustments in hormone levels.",
  ],
  [
    "How long does it take to see results with BHRT?",
    "Individual responses vary, but some individuals may experience symptom relief within a few weeks to months. Regular monitoring helps assess progress.",
  ],
  [
    "Is BHRT covered lby insurance?",
    "Insurance coverage for BHRT varies. Some components, such as consultations and testing, may be covered, but the specific BHRT medications may not be covered. Check with yur insurance provider for details.",
  ],
  [
    "Can BHRT be used for anti-aging purposes?",
    "BHRT is sometimes used for its potential anti-aging effects, but its efficacy for this purpose is a topic of ongoing research and discussion.",
  ],
  [
    "Can I stop BHRT once I start?",
    "Decisions about discontinuing BHRT should be made in consultation with a healthcare professional. Abruptly stopping hormone therapy may lead to a return of symptoms.",
  ],
  [
    "Are there alternatives to BHRT for managing hormonal imbalances?",
    "Lifestyle modifications, such as regular exercise, a balanced diet, and stress management , can contribute to hormonal balance. However, these may not replace the need for hormone therapy in some cases.",
  ],
  [
    "Are there any contraindications for BHRT?",
    "Individuals with a history of certain cancers, blood clots, or certain medical conditions may have contraindications for BHRT. A thorough medical evaluation is necessary.",
  ],
].map(([question, answer]) => ({
  question: rich(question),
  answer: rich(answer),
}));

export default async function FaqMockup(props: PageProps<"/mockup/faq">) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Hero
        variation="centered"
        primary={section({
          small_heading: rich("FAQ"),
          heading: rich("Bioidentical Hormone Replacement Therapy"),
          space_above: "Medium",
        })}
      />

      <Faq
        primary={{
          ...section(),
          questions,
        }}
      />

      <Ribbon
        primary={{
          ...section({ space_below: "Large" }),
          layout: "Centered",
          box_background: "Pink",
          button: [
            button(
              "Trusted HRT Docs/Clinics - Start my Journey",
              "/mockup/trusted-providers",
            ),
          ],
        }}
      />
    </MockupShell>
  );
}
