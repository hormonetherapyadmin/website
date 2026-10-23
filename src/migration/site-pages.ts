// Site pages for the Prismic migration release.
// Copy is the October 2026 mockup, word for word. Links use the public
// addresses, not the /mockup paths the design files use.
//
// About is included so a dry run reports it. It is already published,
// and the importer skips a published page unless --replace names it.
// The order and the pages already in Prismic are in
// docs/MIGRATION_RUNBOOK.md.

const SITE = "https://www.hormonetherapyhub.com";

type Span = {
  start: number;
  end: number;
  type: "strong" | "em" | "hyperlink" | "label";
  data?:
    { link_type: "Web"; url: string; target?: "_blank" } | { label: string };
};

type Block = {
  type: "paragraph" | "heading2" | "heading3" | "heading4" | "list-item";
  text: string;
  spans: Span[];
};

export type LocalImage = {
  localImage: true;
  path: string;
  filename: string;
  alt: string;
};

type Slice = {
  slice_type: string;
  variation: string;
  primary: Record<string, unknown>;
  items: [];
};

export type SitePage = {
  sourceId: string;
  uid: string;
  title: string;
  /** Decisions to check in the migration release. */
  review: string[];
  /** Links pointed at the public address instead of a mockup path. */
  changes: string[];
  slices: Slice[];
};

function paragraph(text: string, spans: Span[] = []): Block {
  return { type: "paragraph", text, spans };
}

function rich(text: string): Block[] {
  return text ? [paragraph(text)] : [];
}

function heading(
  level: "heading2" | "heading3" | "heading4",
  text: string,
): Block {
  return { type: level, text, spans: [] };
}

function site(path: string) {
  return `${SITE}${path}`;
}

function linkSpan(
  text: string,
  phrase: string,
  url: string,
  blank = false,
): Span {
  const start = text.indexOf(phrase);
  if (start < 0) throw new Error(`"${phrase}" is not in "${text}"`);
  return {
    start,
    end: start + phrase.length,
    type: "hyperlink",
    data: {
      link_type: "Web",
      url,
      ...(blank ? { target: "_blank" as const } : {}),
    },
  };
}

function linked(
  text: string,
  phrase: string,
  url: string,
  blank = false,
): Block {
  return paragraph(text, [linkSpan(text, phrase, url, blank)]);
}

function signoff(text: string): Block {
  return paragraph(text, [
    { start: 0, end: text.length, type: "label", data: { label: "signoff" } },
  ]);
}

function bullets(...items: string[]): Block[] {
  return items.map((text) => ({ type: "list-item", text, spans: [] }));
}

function button(text: string, path: string) {
  return {
    link_type: "Web" as const,
    url: site(path),
    text,
    variant: "Solid" as const,
  };
}

function photo(path: string, alt: string): LocalImage {
  const filename = path.split("/").at(-1);
  if (!filename) throw new Error(`Photo path has no filename: ${path}`);
  return { localImage: true, path, filename, alt };
}

function section(
  fields: {
    small_heading?: string;
    heading?: string;
    intro?: string;
    background?: string;
    space_above?: "None" | "Small" | "Medium" | "Large";
    space_below?: "None" | "Small" | "Medium" | "Large";
  } = {},
) {
  return {
    ...(fields.small_heading
      ? { small_heading: rich(fields.small_heading) }
      : {}),
    ...(fields.heading ? { heading: rich(fields.heading) } : {}),
    ...(fields.intro ? { intro: rich(fields.intro) } : {}),
    background: fields.background ?? "Transparent",
    space_above: fields.space_above ?? "Large",
    space_below: fields.space_below ?? "None",
  };
}

function slice(
  slice_type: string,
  variation: string,
  primary: Record<string, unknown>,
): Slice {
  return { slice_type, variation, primary, items: [] };
}

const journey = button(
  "Trusted HRT Docs/Clinics - Start my Journey",
  "/trusted-providers",
);

const reviewsLine =
  "I hope you find useful informative articles in the bog pages and be sure to check out the trusted HRT Doctor/Clinic Reviews. I spill the beans on what they offer, their process, their pricing and what they offer in the way of payment plans.";

const aboutStory = [
  paragraph(
    "Back in 2019, I was miserable, bitchy and desperate to find something to help. I was at my heaviest weight and would have done anything to for someone to point me in a direction that could kick-start my moodiness & weight loss to get me on track to being happy and feeling like myself again.",
  ),
  paragraph(
    'A friend of my sister\'s posted on Facebook that she had been seeing what she called, "her diet doctor." She looked genuinely happy and I was extremely intrigued! I messaged her to get the name of this diet doc and the rest is history',
  ),
  paragraph(
    "I started on Bioidentical Hormone Replacement Therapy in December of 2019 and never looked back. In the early days of COVID-19 I was able to lose about 28 pounds thanks to the HRT and intermittent fasting. While everyone else was complaining about gaining the Covid 19, I had lost that and then some!",
  ),
  paragraph(
    "I got to a point where I wanted to continue my Hormone Therapy Journey, but wanted to find something more convenient than driving to a physical doctor's office only to wait in lobby and then wait some more for him to show up in the exam room. I began a quest to find the same Bioidentical Hormone Replacement meds and an HRT specialist online. The result of that search is this website.",
  ),
  paragraph(
    "It's full of information on menopause, symptoms, how to age better and where to find, telehealth online Hormone Replacement Therapy Docs and Clinics .",
  ),
  paragraph(reviewsLine, [
    linkSpan(reviewsLine, "bog pages", site("/blog")),
    linkSpan(
      reviewsLine,
      "trusted HRT Doctor/Clinic Reviews",
      site("/trusted-providers"),
    ),
  ]),
  signoff(
    "We all experience menopause differently, but none of us need to suffer alone, there is help!",
  ),
];

const faqQuestions = [
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

const AACE =
  "https://www.endocrinepractice.org/article/S1530-891X(20)35793-1/fulltext";
const ACOG =
  "https://www.acog.org/clinical/clinical-guidance/practice-bulletin";
const WHI = "https://www.nhlbi.nih.gov/science/womens-health-initiative-whi";
const NIA = "https://www.nia.nih.gov/health/menopause";

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
];

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
];

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
    true,
  ),
  paragraph(
    "American College of Obstetricians and Gynecologists (ACCOG) Practice Bulletin on Hormone Therapy:",
  ),
  linked("ACOG Practice Bulletin", "ACOG Practice Bulletin", ACOG, true),
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
    true,
  ),
  linked(
    "National Institute of Aging (NIA) - Hormone Replacement Therapy and Menopause : NIA information",
    "Hormone Replacement Therapy and Menopause : NIA information",
    NIA,
    true,
  ),
];

export const SITE_PAGES: SitePage[] = [
  {
    sourceId: "page:about",
    uid: "about",
    title: "My Hormone Replacement Story",
    review: ["The washed-out stock doctor banner on the Wix page is left off."],
    changes: [
      "bog pages links to /blog",
      "trusted HRT Doctor/Clinic Reviews links to /trusted-providers",
      "Is HRT for Me? links to /ishrtforme",
    ],
    slices: [
      slice("hero", "subpage", {
        ...section({
          small_heading: "About",
          heading: "My Hormone Replacement Story",
          intro:
            "I'm your typical late-50's woman. I love Jesus! I'm married, I have three grown children, three grandchildren, a Bernedoodle named Winston and my full-time gig is in the banking industry.",
          space_above: "Medium",
        }),
        image: photo(
          "public/mockup/peggy-portrait.jpg",
          "Peggy, smiling, in a dark sweater",
        ),
      }),
      slice("side_by_side", "image", {
        ...section({ space_below: "Large" }),
        side: "Media right",
        media_position: "Sticky",
        text: aboutStory,
        button: [button("Is HRT for Me?", "/ishrtforme")],
        image: photo(
          "public/mockup/peggy-winston.jpg",
          "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        ),
      }),
    ],
  },
  {
    sourceId: "page:faq",
    uid: "faq",
    title: "Bioidentical Hormone Replacement Therapy",
    review: [
      "Each answer is paired with the question it actually answers. On Wix the safety answer sits under the insurance question, and the insurance answer sits under the safety question. The words are unchanged, including lby, yur, and professsionals.",
    ],
    changes: [
      "Trusted HRT Docs/Clinics - Start my Journey links to /trusted-providers",
    ],
    slices: [
      slice(
        "hero",
        "centered",
        section({
          small_heading: "FAQ",
          heading: "Bioidentical Hormone Replacement Therapy",
          space_above: "Medium",
        }),
      ),
      slice("faq", "default", {
        ...section(),
        questions: faqQuestions,
      }),
      slice("ribbon", "default", {
        ...section({ space_below: "Large" }),
        layout: "Centered",
        box_background: "Pink",
        button: [journey],
      }),
    ],
  },
  {
    sourceId: "page:ishrtforme",
    uid: "ishrtforme",
    title: "Is Hormone Replacement Therapy Safe?",
    review: [
      "Peggy's portrait opens the page. The Winston photo sits on the left of Is it Safe?, so it does not stack under the portrait.",
      "The live page's two stock photos, a beach reader and a doctor weighing her hands, stay off.",
      "Wix shows the sub-topics as bold paragraphs. Here they are Heading 3 and Heading 4.",
      "The words are unchanged, including the important of, ACCOG, Regulatory Oversign, and the unfinished make any necessary.",
    ],
    changes: [
      "Trusted HRT Docs/Clinics - Start my Journey links to /trusted-providers",
    ],
    slices: [
      slice("hero", "subpage", {
        ...section({
          small_heading: "HRT 101",
          heading: "Is Hormone Replacement Therapy Safe?",
          intro:
            "Always consult with a qualified healthcare professional to discuss your specific health situation and determine whether hormone replacement therapy is suitable for you. Individualized care and a thorough evaluation are key factors in making informed decisions about BHRT or HRT.",
          space_above: "Medium",
        }),
        image: photo(
          "public/mockup/peggy-portrait.jpg",
          "Peggy, smiling, in a dark sweater",
        ),
      }),
      slice("text", "default", {
        ...section({
          heading: "Am I a Candidate for Hormone Replacement Therapy?",
        }),
        layout: "On the right",
        text: candidate,
      }),
      slice("text", "default", {
        ...section({
          heading: "Hormone Replacement Therapy, Other Considerations",
          background: "Blue",
          space_below: "Large",
        }),
        layout: "On the right",
        text: considerations,
      }),
      slice("side_by_side", "image", {
        ...section({ heading: "Is it Safe?", space_below: "Large" }),
        side: "Media left",
        media_position: "Sticky",
        text: safety,
        image: photo(
          "public/mockup/peggy-winston.jpg",
          "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        ),
      }),
      slice("pros_cons", "default", {
        ...section({ heading: "Pros and Cons" }),
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
      }),
      slice("ribbon", "default", {
        ...section({ space_below: "Large" }),
        layout: "On the right",
        box_background: "Blue",
        content: rich(
          "The landscape of hormone therapy is dynamic and research findings may evolve over time. Always consult with a qualified healthcare professional to discuss your specific health situation to make informed decisions regarding your health.",
        ),
        button: [journey],
      }),
    ],
  },
];

export function isLocalImage(value: unknown): value is LocalImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "localImage" in value &&
    value.localImage === true
  );
}

export function pageImages(page: SitePage): LocalImage[] {
  const images: LocalImage[] = [];
  const walk = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (isLocalImage(value)) {
      images.push(value);
      return;
    }
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) child.forEach(walk);
      else walk(child);
    }
  };
  walk(page.slices);
  return images;
}

export function replaceImages<T>(
  value: T,
  imageFor: (image: LocalImage) => unknown,
): T {
  if (!value || typeof value !== "object") return value;
  if (isLocalImage(value)) return imageFor(value) as T;
  if (Array.isArray(value)) {
    return value.map((item) => replaceImages(item, imageFor)) as T;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      replaceImages(child, imageFor),
    ]),
  ) as T;
}
