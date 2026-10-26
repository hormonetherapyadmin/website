import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import { Content } from "@/components/content";
import type { TokenClinic } from "@/components/content-blocks";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";
import styles from "../proposed/proposed.module.css";

export const metadata: Metadata = {
  title: "Two columns",
  robots: { index: false, follow: false },
};

const COLUMNS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Bioidentical Therapy Formulations",
    rows: [
      [
        "Compounded Creams",
        "Bioidentical hormones can be compounded into customized creams. These are applied to the skin, allowing for absorption.",
      ],
      [
        "Sublingual Tablets",
        "Some BHRT medications come in sublingual (under the tongue) tablet form, allowing for absorption through the mucous membranes.",
      ],
      [
        "Pellets",
        "Small pellets containing bioidentical hormones can be implanted under the skin. These pellets release a steady and controlled dose of hormones over a extended period. (on-line providers don't normally offer this to telehealth patients)",
      ],
      [
        "Troches/Lozenges",
        "These are small, dissolvable tablets placed under the tongue. Theu can contain various bioidentical hormones.",
      ],
      [
        "Capsules",
        "BHRT may also be available in capsule form, which is taken orally.",
      ],
      [
        "Nasal Spray",
        "In some cases, BHRT formulations can be administered as nasal sprays, allowing for absorption through the nasal mucosa.",
      ],
      [
        "Comprehensive Evaluation",
        "A healthcare provider conducts a detailed evaluation of your health history, symptoms, and overall well-being.",
      ],
      [
        "Hormone Testing",
        "Blood tests may be performed to measure your hormone levels, providing a baseline for treatment.",
      ],
      [
        "Individualized Compounding:",
        "BHRT involves the use of bioidentical hormones thatr are structurally identical to those naturally produced in the body. These hormones can be compounded into customized formulations to match your specific hormonal needs.",
      ],
      [
        "Symptom Assessment",
        "Discussion with your healthcare provider about specific symptoms and helps determine the areas that need targeted hormone support.",
      ],
      [
        "Customized Treatment Plan",
        "Based on the evaluation, hormone testing, and symptoms assessment, the healthcare provider creates a personalized treatment plan. This may involve adjusting the type, dosage, and delivery method of hormones.",
      ],
      [
        "Monitoring and Adjustments",
        "Regular follow-up appointments are crucial for monitoring your response to treatment. Adjustments to the treatment plan may be made as needed to optimize the effectiveness and mange any potential side effects.",
      ],
    ],
  },
  {
    title: "Conventional Therapy Formulations",
    rows: [
      [
        "Oral Tablets",
        "Many HRT medications are available in oral tablet form, providing a convenient and familiar method of administration.",
      ],
      [
        "Transdermal Patches",
        "Patches are applied to the skin, delivering hormones directly into the bloodstream. They are commonly used for estrogen and in some cases, testosterone replacement.",
      ],
      [
        "Topical Creams and Gels",
        "Creams and gels containing hormones are applied to the skin, allowing for absorption. This method is often used for testosterone replacement.",
      ],
      [
        "Intramuscular Injections",
        "Injections, typically administered into the muscle, are another form of delivering hormones. Testosterone replacement therapy often uses intramuscular injections.",
      ],
      [
        "Vaginal Products",
        "For women experiencing symptoms related to vaginal atrophy, estrogen-based vaginal creams, rings or tablets may be prescribed.",
      ],
      [
        "Comprehensive Evaluation",
        "Similar to BHRT, HRT begins with a comprehensive evaluation of your health status, medical history, and symptoms.",
      ],
      [
        "Hormone Testing",
        "Hormone levels may be assessed through blood tests to establish a baseline for treatment.",
      ],
      [
        "Standardized Formulations",
        "While HRT often uses standardized doses of hormones, adjustments can still be made based on individual needs. For example, the type of estrogen or progestin, as well as the dosage, can be personalized.",
      ],
      [
        "Customized Treatment Plan",
        "The healthcare provider tailors the treatment plan by adjusting the type, dosage, ad administration method of hormones to address your unique needs.",
      ],
      [
        "Monitoring and Adjustments",
        "Regular follow-up appointments are essential for ongoing assessment, allowing for adjustments to the treatment plan as needed.",
      ],
    ],
  },
];

type Block = {
  type: "heading2" | "heading3" | "paragraph" | "list-item";
  text: string;
  spans: object[];
};

function block(type: Block["type"], text: string, spans: object[] = []): Block {
  return { type, text, spans };
}

function note(text: string): Block {
  return block("paragraph", text, [
    { start: 0, end: text.length, type: "label", data: { label: "note" } },
  ]);
}

function linked(text: string, phrase: string, url: string): Block {
  const start = text.indexOf(phrase);
  return block("paragraph", text, [
    {
      start,
      end: start + phrase.length,
      type: "hyperlink",
      data: { link_type: "Web", url },
    },
  ]);
}

function columnField(title: string, rows: [string, string][], extra: Block[]) {
  return [
    block("heading2", title),
    ...rows.flatMap(([heading, body]) => [
      block("heading3", heading),
      block("paragraph", body),
    ]),
    ...extra,
  ] as unknown as RichTextField;
}

const clinics: TokenClinic[] = [
  {
    uid: "inner-balance",
    name: "Inner Balance",
    logo: { src: "/mockup/logos/inner-balance.png" },
    offerCode: "PEGGY10",
  },
  {
    uid: "winona",
    name: "Winona",
    logo: { src: "/mockup/logos/winona.png" },
    monthlyPrice: 89,
    insurance: false,
    formulation: "Topical cream",
  },
];

const SAMPLES: Block[][] = [
  [
    block("heading3", "Field samples"),
    linked(
      "A link inside the writing, such as formulations.",
      "formulations",
      "/formuations",
    ),
    note("A note. The tint box."),
    block("list-item", "A bullet in this field."),
    block("list-item", "Another bullet."),
    block("paragraph", "{{provider:inner-balance:offer}}"),
  ],
  [
    block("heading3", "Field samples"),
    block("paragraph", "{{provider:winona:facts}}"),
  ],
];

export default async function TwoColumnsMockup(
  props: PageProps<"/mockup/two-columns">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason title="Two columns">
        <p>
          Each column is the same writing field as Text and Side by side.
          Headings, paragraphs, links, lists, a note, and a clinic shortcode all
          render here. The formulation lines are the October page, typos
          included. “Field samples” is not on that page. It is here so the link,
          the tint box, the bullets, and the shortcodes are visible.
          {"{{provider:inner-balance:offer}}"} pulls the code off the brand.
          {"{{provider:winona:facts}}"} pulls the price, insurance, and
          formulation off the brand. On a phone the columns stack, with
          bioidentical first. The live page stays one column, and the page
          already in the release keeps that order.
        </p>
      </Reason>
      <div className={styles.demo}>
        <div className={styles.columns}>
          {COLUMNS.map((column, index) => (
            <div key={column.title}>
              <Content
                field={columnField(column.title, column.rows, SAMPLES[index])}
                clinics={clinics}
              />
            </div>
          ))}
        </div>
      </div>
    </MockupShell>
  );
}
