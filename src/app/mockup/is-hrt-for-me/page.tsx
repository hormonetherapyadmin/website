import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Hero } from "@/slices/hero";
import { ProsAndCons } from "@/slices/ProsAndCons";
import { Ribbon } from "@/slices/Ribbon";
import { SideBySide } from "@/slices/side_by_side";
import { Text } from "@/slices/Text";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Is HRT for me mockup for the live URL /ishrtforme, built only from
  page slices. Copy is from that Wix page (October 2026), word for word,
  including "the important of", "ACCOG", "Regulatory Oversign", and the
  unfinished "make any necessary." Wix shows the sub-topics as bold
  paragraphs. Here they are Heading 3 and Heading 4, the way she would
  set them. The live page's two photos are stock: a beach reader and a
  doctor weighing her hands. Both stay off. This site is not a clinic,
  and neither photo is Peggy. Her portrait opens the page, and the
  Winston photo sits on the left of "Is it Safe?" so the two photos
  don't stack on the same side.
*/

export const metadata: Metadata = {
  title: "Is HRT for me mockup",
  robots: { index: false, follow: false },
};

const AACE =
  "https://www.endocrinepractice.org/article/S1530-891X(20)35793-1/fulltext";
const ACOG =
  "https://www.acog.org/clinical/clinical-guidance/practice-bulletin";
const WHI = "https://www.nhlbi.nih.gov/science/womens-health-initiative-whi";
const NIA = "https://www.nia.nih.gov/health/menopause";

const emptyRich = [] as RichTextField;

function paragraph(text: string, spans: object[] = []) {
  return { type: "paragraph" as const, text, spans };
}

function heading(level: "heading3" | "heading4", text: string) {
  return { type: level, text, spans: [] };
}

function rich(text: string) {
  return [paragraph(text)] as unknown as RichTextField;
}

function image(url: string, alt: string, width: number, height: number) {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  } as ImageField;
}

function linked(text: string, phrase: string, url: string) {
  const start = text.indexOf(phrase);
  return paragraph(text, [
    {
      start,
      end: start + phrase.length,
      type: "hyperlink",
      data: { link_type: "Web", url, target: "_blank" },
    },
  ]);
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

const bullets = (...items: string[]) =>
  items.map((text) => ({
    type: "list-item",
    text,
    spans: [],
  })) as unknown as RichTextField;

const candidate = [
  heading("heading3", "Menopausal Symptoms"),
  paragraph(
    "If you are experiencing symptoms of menopause, such as hot flashes, night sweats, mood swings, vaginal dryness, or sleep disturbances, you may be a candidate for hormone replacement therapy.",
  ),
  heading("heading3", "Postmenopausal Status"),
  paragraph(
    "Women who are postmenopausal and are at risk for osteoporosis or cardiovascular disease may consider hormone therapy for symptom relief and potential health benefits.",
  ),
  heading("heading3", "Low Hormone levels"),
  paragraph(
    "Blood tests showing hormone imbalances, such as low estrogen or progesterone levels, may indicate a need for hormone replacement therapy.",
  ),
  heading("heading3", "Induced Menopause (from surgery or illness)"),
  paragraph(
    "Women who have undergone surgical removal of the ovaries (oophorectomy) may experience abrupt hormonal changes and could be candidates for hormone replacement.",
  ),
] as unknown as RichTextField;

const considerations = [
  heading("heading3", "Personal Health Assessment"),
  paragraph(
    "Your overall health, medical history, and risk factors will be assessed by a healthcare provider to determine if hormone replacement therapy is appropriate.",
  ),
  heading("heading3", "Discussion with Healthcare Provider"),
  paragraph(
    "Open communication with a healthcare provider is essential. Discuss your symptoms, concerns, and treatment goals to help guide decisions about hormone therapy.",
  ),
  heading("heading3", "Pros and Cons"),
  paragraph(
    "The potential benefits of hormone replacement therapy should be weighed against potential risks. This includes considerations for increased risks of certain conditions, such as breast cancer in women or cardiovascular issues.",
  ),
  heading("heading3", "Ongoing Care"),
  paragraph(
    "If you decide to pursue hormone replacement therapy, regular monitoring and follow-up with your healthcare provider are crucial to assess the effectiveness of the treatment and make any necessary.",
  ),
] as unknown as RichTextField;

const safety = [
  paragraph(
    "Both HRT (Conventional Hormone Replacement Therapy) and BHRT (Bioidentical Hormone Replacement Therapy) can be considered safe when prescribed and monitored by qualified healthcare professionals. However, the safety of these therapies depends on various factors, including the individual's health status, medical history and specific hormones and dosages used. Below is an overview of safety considerations along with references to reputable medical sources.",
  ),
  heading("heading3", "BHRT (Bioidentical Hormone Replacement Therapy)"),
  heading("heading4", "Safety Considerations"),
  paragraph(
    "BHRT is generally considered safe when prescribed by qualified healthcare professionals and customized based on individual needs.",
  ),
  heading("heading4", "Reputable Sources"),
  paragraph(
    "The American Association of Clinical Endocrinologists (AACE) and The American College of Obstetricians and Gynecologists (ACOG) emphasize the important of individualized treatment plans and close monitoring when using hormones, including bioidentical hormones.",
  ),
  heading("heading4", "References"),
  linked(
    "American Association of Clinical Endocrinologists (AACE) Position Statement on Menopause Management: AACE Position Statement",
    "AACE Position Statement",
    AACE,
  ),
  paragraph(
    "American College of Obstetricians and Gynecologists (ACCOG) Practice Bulletin on Hormone Therapy:",
  ),
  linked("ACOG Practice Bulletin", "ACOG Practice Bulletin", ACOG),
  heading("heading3", "HRT (Conventional Hormone Replacement Therapy)"),
  heading("heading4", "Safety Considerations"),
  paragraph(
    "HRT has been extensively studied, and many formulations have received FDA approval for specific indications",
  ),
  paragraph(
    "Risks and Benefits should be carefully considered, especially in the context of individual health profiles and conditions.",
  ),
  heading("heading4", "Reputable Sources"),
  paragraph(
    "The Women's Health Initiative (WHI) a large-scale study, has provided important insights into the risks and benefits of HRT. The WHI Found both benefits and risks associated with HRT, leading to a reassessment of its use.",
  ),
  heading("heading4", "References"),
  linked(
    "Women's Health Initiative (WHI)- Overview of Findings: WHI Overview",
    "Overview of Findings: WHI Overview",
    WHI,
  ),
  linked(
    "National Institute of Aging (NIA) - Hormone Replacement Therapy and Menopause : NIA information",
    "Hormone Replacement Therapy and Menopause : NIA information",
    NIA,
  ),
] as unknown as RichTextField;

export default async function IsHrtForMeMockup(
  props: PageProps<"/mockup/is-hrt-for-me">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Hero
        variation="subpage"
        primary={{
          ...section({
            small_heading: rich("HRT 101"),
            heading: rich("Is Hormone Replacement Therapy Safe?"),
            intro: rich(
              "Always consult with a qualified healthcare professional to discuss your specific health situation and determine whether hormone replacement therapy is suitable for you. Individualized care and a thorough evaluation are key factors in making informed decisions about BHRT or HRT.",
            ),
            space_above: "Medium",
          }),
          image: image(
            "/mockup/peggy-portrait.jpg",
            "Peggy, smiling, in a dark sweater",
            1389,
            1600,
          ),
        }}
      />

      <Text
        primary={{
          ...section({
            heading: rich("Am I a Candidate for Hormone Replacement Therapy?"),
          }),
          text: candidate,
        }}
      />

      <Text
        primary={{
          ...section({
            heading: rich("Hormone Replacement Therapy, Other Considerations"),
            background: "Blue",
            space_below: "Large",
          }),
          text: considerations,
        }}
      />

      <SideBySide
        variation="image"
        image={{
          src: "/mockup/peggy-winston.jpg",
          alt: "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        }}
        primary={{
          ...section({ heading: rich("Is it Safe?"), space_below: "Large" }),
          side: "Media left",
          media_position: "Sticky",
          text: safety,
        }}
      />

      <ProsAndCons
        primary={{
          ...section({ heading: rich("Pros and Cons") }),
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

      <Ribbon
        primary={{
          ...section({ space_below: "Large" }),
          content: rich(
            "The landscape of hormone therapy is dynamic and research findings may evolve over time. Always consult with a qualified healthcare professional to discuss your specific health situation to make informed decisions regarding your health.",
          ),
          box_background: "Blue",
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
