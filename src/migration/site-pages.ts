// Site pages for the Prismic migration release.
// Copy is the October 2026 mockup, word for word. Links to this site
// are relative paths, such as /trusted-providers. Links to other sites
// keep their full address. Design files use /mockup paths; these do not.
//
// About is already published. The importer skips it unless --replace
// names it. The order and the pages already in Prismic are in
// docs/MIGRATION_RUNBOOK.md.

import { GUIDE_PAGES } from "./guide-pages.ts";

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
  width?: number;
  height?: number;
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
  /** The Wix document title, when it is not the hero heading. */
  meta_title?: string;
  /** The Wix meta description. Empty on Wix stays unset. */
  meta_description?: string;
  /** Decisions to check in the migration release. */
  review: string[];
  /** Links pointed at the public address instead of a mockup path. */
  changes: string[];
  /** Off means the page stays up and is left out of search and the sitemap. */
  indexing?: boolean;
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
    url: path,
    text,
    variant: "Solid" as const,
  };
}

function web(
  text: string,
  path: string,
  variant?: "Solid" | "Ghost",
  blank = false,
) {
  const url = path.startsWith("#") ? `/${path}` : path;
  return {
    link_type: "Web" as const,
    url,
    ...(text ? { text } : {}),
    ...(variant ? { variant } : {}),
    ...(blank ? { target: "_blank" as const } : {}),
  };
}

function documentLink(
  id: string,
  type: "provider" | "post" | "page",
  uid: string,
  text?: string,
) {
  const url =
    type === "post" ? `/post/${uid}` : type === "page" ? `/${uid}` : undefined;
  return {
    link_type: "Document" as const,
    id,
    type,
    uid,
    ...(url ? { url } : {}),
    ...(text ? { text } : {}),
  };
}

function marked(text: string, phrase: string, type: "strong" | "em"): Span {
  const start = text.indexOf(phrase);
  if (start < 0) throw new Error(`"${phrase}" is not in "${text}"`);
  return { start, end: start + phrase.length, type };
}

function photo(
  path: string,
  alt: string,
  width?: number,
  height?: number,
): LocalImage {
  const filename = path.split("/").at(-1);
  if (!filename) throw new Error(`Photo path has no filename: ${path}`);
  return {
    localImage: true,
    path,
    filename,
    alt,
    ...(width && height ? { width, height } : {}),
  };
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

/** The usual line under a Hero. Squiggly and accent, as on the published pages. */
function divider(
  space_below: "None" | "Medium" | "Large" = "None",
  space_above: "None" | "Small" | "Medium" | "Large" = "Medium",
): Slice {
  return slice("divider", "default", {
    line: "Squiggly",
    color: "Accent",
    background: "Transparent",
    space_above,
    space_below,
  });
}

/** The portrait already published on /about. A replace must not upload a new one. */
const aboutPortrait = {
  id: "XYNQOFoQwb5OYLsz",
  url: "https://images.prismic.io/1shr96di/XYNQOFoQwb5OYLsz_eb9223_eb8a2908d66c45d8b805ae5191010342~mv2.jpg?auto=format,compress",
  dimensions: { width: 2250, height: 2590 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  alt: "Image of Peggy B patient reviewer and owner of HormoneTherapyhub.com",
  copyright: null,
};

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
    linkSpan(reviewsLine, "bog pages", "/blog"),
    linkSpan(
      reviewsLine,
      "trusted HRT Doctor/Clinic Reviews",
      "/trusted-providers",
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

const INNER_BALANCE = "asf4zhEAAC4AYFel";
const ONE_YEAR_REVIEW = "askC8xcAAC0AcqpI";
const HRT_REVIEW = "askCgRcAADEAcqjO";
const COMPARE = "#eight-online-hrt-clinics-side-by-side";

const oestraJar = {
  id: "jGM0ZnhURMHOb_JN",
  url: "https://images.prismic.io/1shr96di/jGM0ZnhURMHOb_JN_oestra-cream.webp?auto=format,compress",
  dimensions: { width: 640, height: 677 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  alt: "Oestra Vaginal cream",
  copyright: null,
};

const comparisonClinics: { id: string; uid: string; review: string }[] = [
  {
    id: INNER_BALANCE,
    uid: "inner-balance",
    review: "inner-balance-hrt-review",
  },
  {
    id: "asvI_BcAADMAeME-",
    uid: "winona",
    review: "winona-bioidentical-hormone-therapy-review",
  },
  {
    id: "asz2AxcAADAAeqH0",
    uid: "musely",
    review: "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative",
  },
  {
    id: "asz9cxcAADEAer1m",
    uid: "alloy",
    review: "my-alloy-an-overview-of-products-process-and-pricing",
  },
  {
    id: "asvUERcAAC0AeNI_",
    uid: "joi",
    review: "joi-womens-hormone-replacement-review",
  },
  {
    id: "asz-gRcAADMAesHD",
    uid: "effecty",
    review: "effecty-hormone-replacement-therapy-review",
  },
  { id: "as0AwRcAADMAeslp", uid: "menorx", review: "mymenopauserx-review" },
  {
    id: "as0CfhcAADIAes6P",
    uid: "midi",
    review: "will-midi-health-help-me-lose-weight",
  },
];

const reviewIds: Record<string, string> = {
  "inner-balance-hrt-review": HRT_REVIEW,
  "winona-bioidentical-hormone-therapy-review": "asjxrxcAADIAcou2",
  "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative":
    "asfWCxEAACwAYBu0",
  "my-alloy-an-overview-of-products-process-and-pricing": "askCEBcAAC8Acqdk",
  "joi-womens-hormone-replacement-review": "askCGBcAAC0Acqd9",
  "effecty-hormone-replacement-therapy-review": "askClRcAADIAcqkU",
  "mymenopauserx-review": "askCSRcAAC4AcqgW",
  "will-midi-health-help-me-lose-weight": "askCRRcAACwAcqgJ",
};

const FACTS_INTRO =
  "What I confirmed on their page. This is my experience as a patient, not a medical review.";

/**
 * A wide lifestyle photo for the Clinic facts band. Free Pexels photos,
 * already cropped to 1500 by 500. The filename is what the media library
 * stores.
 */
function life(file: string, alt: string) {
  return photo(`public/mockup/clinic-life/${file}`, alt, 1500, 500);
}

function storedImage(
  id: string,
  file: string,
  alt: string,
  width: number,
  height: number,
) {
  return {
    id,
    url: `https://images.prismic.io/1shr96di/${id}_${file}?auto=format,compress`,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
    alt,
    copyright: null,
  };
}

function clinicRibbon(name: string) {
  return slice("ribbon", "default", {
    ...section({ space_below: "Large" }),
    layout: "On the right",
    box_background: "Pink",
    title: rich("Comparing a few clinics?"),
    content: rich(
      `${name} is one of seven I’ve been a patient at. The short list has the code I use at each.`,
    ),
    button: [button("Trusted providers", "/trusted-providers")],
  });
}

type ClinicLink = {
  id: string;
  uid: string;
  text: string;
};

/**
 * A clinic page. The price, visit link, steps, and specialties stay on
 * the brand. The quote is the brand's In my words field. The page uid is
 * the live Wix address, which is not always the brand uid.
 */
function clinicPage(input: {
  uid: string;
  providerId: string;
  providerUid: string;
  title: string;
  quote: string;
  review: ClinicLink;
  comparisons?: ClinicLink[];
  youtube?: string;
  product: ReturnType<typeof storedImage>;
  image: LocalImage;
  ribbonName: string;
  reviewNotes?: string[];
}): SitePage {
  const links = [
    documentLink(input.review.id, "post", input.review.uid, input.review.text),
    ...(input.comparisons ?? []).map((link) =>
      documentLink(link.id, "post", link.uid, link.text),
    ),
    ...(input.youtube
      ? [web("Watch my review", input.youtube, undefined, true)]
      : []),
  ];
  return {
    sourceId: `page:${input.uid}`,
    uid: input.uid,
    title: input.title,
    review: [
      "The visit button reads the brand’s affiliate link. This page does not store a destination.",
      "Facts, steps, specialties, price, and the coupon stay on the brand.",
      "There is no What it cost me section. The price stays in the hero.",
      "The eyebrow is the brand’s Top choice label. The quote is the brand’s In my words field.",
      ...(input.reviewNotes ?? []),
    ],
    changes: [
      `${input.review.text} links to /post/${input.review.uid}`,
      ...(input.youtube
        ? ["Watch my review links to the YouTube video stored on the brand"]
        : []),
      "Trusted providers links to /trusted-providers",
    ],
    slices: [
      slice("hero", "provider", {
        ...section({ space_above: "Medium", space_below: "None" }),
        clinic: documentLink(input.providerId, "provider", input.providerUid),
        quote: rich(input.quote),
        links,
        product: input.product,
      }),
      divider("Large", "Large"),
      slice("clinic_facts", "default", {
        ...section({
          heading: "The facts",
          intro: FACTS_INTRO,
          space_above: "None",
          space_below: "None",
        }),
        clinic: documentLink(input.providerId, "provider", input.providerUid),
        image: input.image,
      }),
      divider("None", "Large"),
      clinicRibbon(input.ribbonName),
    ],
  };
}

function innerBalancePage(): SitePage {
  return {
    sourceId: "page:inner-balance",
    uid: "inner-balance",
    title: "Inner Balance",
    review: [
      "The visit button reads the brand’s affiliate link. This page does not store a destination.",
      "Facts, steps, specialties, price, and the coupon stay on the brand.",
      "There is no What it cost me section. The price stays in the hero. The other clinic pages do not get that section.",
      "The wide photo replaces the close crop. The dividers match the published page.",
    ],
    changes: [
      "My 1-year review links to the Oestra review",
      "HRT review links to the Inner Balance review",
      "Watch my review links to the published YouTube video",
      "Trusted providers links to /trusted-providers",
    ],
    slices: [
      slice("hero", "provider", {
        ...section({
          small_heading: "My 2026 top choice",
          space_above: "Medium",
          space_below: "None",
        }),
        clinic: documentLink(INNER_BALANCE, "provider", "inner-balance"),
        voted: rich("Voted best for sleep"),
        quote: rich(
          "No night sweats, hot flashes or brain fog, and the one big difference I notice with Oestra is my sleep. I go to sleep faster and stay asleep longer on this HRT, more so than any of the others.",
        ),
        links: [
          documentLink(
            ONE_YEAR_REVIEW,
            "post",
            "oestra-by-inner-balance-my-honest-1-year-review",
            "My 1-year review",
          ),
          documentLink(
            HRT_REVIEW,
            "post",
            "inner-balance-hrt-review",
            "HRT review",
          ),
          web(
            "Watch my review",
            "https://youtu.be/PuAekNT9ZvA",
            undefined,
            true,
          ),
        ],
        product: oestraJar,
      }),
      divider("Large", "Large"),
      slice("clinic_facts", "default", {
        ...section({
          heading: "The facts",
          intro: FACTS_INTRO,
          space_above: "None",
          space_below: "None",
        }),
        clinic: documentLink(INNER_BALANCE, "provider", "inner-balance"),
        image: life(
          "inner-balance-morning.jpg",
          "A woman smiling over coffee among plants",
        ),
      }),
      divider("None", "Large"),
      clinicRibbon("Inner Balance"),
    ],
  };
}

const WINONA = "asvI_BcAADMAeME-";
const MUSELY = "asz2AxcAADAAeqH0";
const ALLOY = "asz9cxcAADEAer1m";
const JOI = "asvUERcAAC0AeNI_";
const EFFECTY = "asz-gRcAADMAesHD";
const MENORX = "as0AwRcAADMAeslp";
const MIDI = "as0CfhcAADIAes6P";

/**
 * The brand each clinic page should point at. The importer sets the
 * brand's Page field when that page is sent. visitText is used only
 * when the published visit link has no display text.
 */
export const CLINIC_BRANDS: {
  pageUid: string;
  providerId: string;
  visitText?: string;
  /** Correct the published name when it is still wrong. */
  name?: string;
}[] = [
  {
    pageUid: "inner-balance",
    providerId: INNER_BALANCE,
    visitText: "Visit Inner Balance",
  },
  {
    pageUid: "winona-review-page",
    providerId: WINONA,
    visitText: "Visit Winona",
  },
  { pageUid: "musely", providerId: MUSELY, visitText: "Visit Musely" },
  {
    pageUid: "alloy-review-page",
    providerId: ALLOY,
    visitText: "Visit Alloy",
    name: "Alloy",
  },
  {
    pageUid: "joiwommenswellness",
    providerId: JOI,
    visitText: "Visit Joi Women’s Wellness",
  },
  { pageUid: "effecty", providerId: EFFECTY, visitText: "Visit Effecty" },
  {
    pageUid: "mymenopauserx",
    providerId: MENORX,
    visitText: "Visit MyMenopauseRx",
  },
  { pageUid: "midi-health-review-page", providerId: MIDI },
];

const tested =
  "Since beginning my personal hormone replacement therapy journey under the care of a medical provider in 2019, I’ve experienced firsthand how overwhelming it can be to navigate menopause care, changing symptoms, and treatment options. To find what worked for my body, I’ve personally tested and evaluated more than 9 different HRT telehealth providers, including platforms like Winona, Midi Health, Alloy, Inner Balance, Musely, MyMenopauseRx, Effecty, a traditional OB/GYN and Joi Women’s Wellness.";
const tracked =
  "Over years of patient experience, I’ve tracked everything from virtual consultation quality and out-of-pocket pricing, insurance coverage and shipping reliability across patches, topical creams, troches, injections and oral options. See my HRT Reviews.";

export const HOMEPAGE = {
  sourceId: "homepage",
  id: "asWb3hIAACsA34Wx",
  uid: "homepage",
  title: "Homepage",
  changes: [
    "Benefit and button links, which were empty, now use the public addresses",
    "See what each clinic cost me scrolls to the comparison on this page",
    "All posts links to /blog",
    "Read my whole story links to /about",
    "See my HRT Reviews links to /blog",
    "Improve sleep is gone. /sleep is archived.",
  ],
  meta_title: "Feel like you again.",
  meta_description:
    "My goal is to share honest platform reviews, pricing breakdowns, and practical patient insights so you can have more informed, confident conversations with your own prescribing doctor.",
  footer_copyright_text: "Prismic © 2015–2026",
  footer_cookies_link: web("Manage cookies", "https://prismic.io"),
  footer_social_links: [
    { ...web("X", "https://x.com/prismicio"), variant: "X" },
    {
      ...web("YouTube", "https://www.youtube.com/@prismic"),
      variant: "YouTube",
    },
    { ...web("GitHub", "https://github.com/prismicio"), variant: "GitHub" },
    {
      ...web("LinkedIn", "https://www.linkedin.com/company/prismic-io/"),
      variant: "LinkedIn",
    },
  ],
  review: [
    "The published hero photo, eyebrow, heading, benefits, and trust lines stay. The benefit and button links, which were empty, are filled.",
    "The Alloy brand name is corrected from Musely to Alloy before the comparison reads it.",
    "Each comparison row uses the review already stored on that brand.",
    "Midi’s stored review is the weight-loss post, not a clinic review.",
  ],
  slices: [
    slice("hero", "home", {
      ...section({
        small_heading: "Hormone Therapy Replacement",
        heading: "Feel like you again.",
        intro:
          "My goal is to share honest platform reviews, pricing breakdowns, and practical patient insights so you can have more informed, confident conversations with your own prescribing doctor.",
        space_above: "Small",
        space_below: "Small",
      }),
      benefits: [
        web("Lose weight", "/weight-gain"),
        web("Enhance mood and mental clarity", "/ishrtforme"),
        web(
          "Diminish hot flashes/night sweats",
          "/post/why-do-i-wake-up-hot-and-sweaty",
        ),
        web("Boost energy", "/ishrtforme"),
      ],
      button: [
        web("See what each clinic cost me", COMPARE, "Solid"),
        web("New to HRT? Start here", "/ishrtforme", "Ghost"),
      ],
      trust_lines: [
        { text: "Patient since 2019" },
        { text: "9+ telehealth platforms tested" },
        { text: "Independent & self-funded" },
      ],
      image: aboutPortrait,
      photo_greeting: "Hi, I'm Peggy!",
      caption: rich("An experienced HRT patient reviewer. Not a doctor."),
    }),
    divider("Medium"),
    slice("start_here", "default", {
      ...section({ heading: "Where should I start?", space_above: "None" }),
      cards: [
        {
          small_heading: rich("Brand new to this"),
          heading: rich("Is HRT for me?"),
          text: rich(
            "Perimenopause, menopause, and whether hormone therapy is worth asking about.",
          ),
          link: web("", "/ishrtforme"),
          icon: "Question",
        },
        {
          small_heading: rich("Ready to pick a clinic"),
          heading: rich("Providers"),
          text: rich(
            "What are the important features when looking for an online provider?",
          ),
          link: web("", "/tipstofindprovider"),
          icon: "Lightbulb",
        },
        {
          small_heading: rich("Weighing your options"),
          heading: rich("Formulations"),
          text: rich(
            "What formulations are available, and how will my doctor personalize my meds for me?",
          ),
          link: web("", "/formuations"),
          icon: "Medicine",
        },
        {
          small_heading: rich("Watching the budget"),
          heading: rich("Cost & insurance"),
          text: rich(
            "Will my therapy be covered by my insurance, and can I use my HSA card?",
          ),
          link: web("", "/costandinsurance"),
          icon: "Wallet",
        },
      ],
    }),
    slice("posts", "home", {
      ...section({ heading: "Latest reviews and posts" }),
      link: web("All posts", "/blog"),
      category: "All",
    }),
    slice("clinic_comparison", "default", {
      ...section({
        heading: "Eight online HRT clinics, side by side",
        intro:
          "I paid out of pocket with my HSA card, or through my prescription insurance when I could. These are my real costs, not list prices. Yours may differ.",
      }),
      prices_checked: "2026-09-09",
      button: web("Trusted providers", "/trusted-providers"),
      disclosure: web("Affiliate disclosure", "/affiliate-disclosures"),
      clinics: comparisonClinics.map((clinic) => ({
        clinic: documentLink(clinic.id, "provider", clinic.uid),
        review: documentLink(
          reviewIds[clinic.review],
          "post",
          clinic.review,
          "Read review",
        ),
      })),
    }),
    slice("quote", "default", {
      ...section({
        heading: "Peggy’s take: what I’m using now",
        background: "Navy",
      }),
      quote: rich(
        "No night sweats, hot flashes or brain fog, and the one big difference I notice with Oestra is my sleep. I go to sleep faster and stay asleep longer on this HRT, more so than any of the others.",
      ),
      name: "Oestra by Inner Balance",
      clinic: documentLink(INNER_BALANCE, "provider", "inner-balance"),
      text: rich(
        "I only need the one product, where with other HRT regimens I was prescribed two or three. It’s $199 a month for the first six months, then $99 a month from month seven.",
      ),
      reminder: rich("This is my personal experience, not medical advice."),
      review_button: documentLink(
        ONE_YEAR_REVIEW,
        "post",
        "oestra-by-inner-balance-my-honest-1-year-review",
        "Read my 1-year Oestra review",
      ),
    }),
    slice("side_by_side", "image", {
      ...section({
        small_heading: "My hormone replacement story",
        heading: "Menopause isn’t a dirty word.",
        space_below: "Large",
      }),
      side: "Media left",
      media_position: "Sticky",
      text: [
        paragraph(
          "I’ll say that again: menopause isn’t something to be ashamed of, or a subject you should feel embarrassed to talk about.",
        ),
        paragraph(
          "I’m your typical late-50’s woman. I love Jesus! I’m married, I have three grown children, three grandchildren, and my full-time gig is in the banking industry.",
        ),
        paragraph(tested, [marked(tested, "personally tested", "strong")]),
        paragraph(tracked, [linkSpan(tracked, "See my HRT Reviews.", "/blog")]),
        signoff(
          "I created HormoneTherapyHub to offer transparent, real-world consumer telemetry from a fellow patient’s perspective.",
        ),
        paragraph(
          "I am not a medical professional, and this site does not provide medical advice or treatment plans.",
          [
            {
              start: 0,
              end: "I am not a medical professional, and this site does not provide medical advice or treatment plans."
                .length,
              type: "label",
              data: { label: "note" },
            },
          ],
        ),
      ],
      button: [button("Read my whole story", "/about")],
      image: photo(
        "public/mockup/peggy-winston.jpg",
        "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
      ),
      caption: rich("Me and Winston, my Bernedoodle."),
      caption_on_photo: true,
    }),
  ],
};

export const SITE_PAGES: SitePage[] = [
  {
    sourceId: "page:about",
    uid: "about",
    title: "My Hormone Replacement Story",
    review: [
      "The washed-out stock doctor banner on the Wix page is left off.",
      "The published hero photo and the eyebrow About Peggy stay. Winston sits on the left of the story, so the two photos do not stack.",
    ],
    changes: [
      "bog pages links to /blog",
      "trusted HRT Doctor/Clinic Reviews links to /trusted-providers",
      "Is HRT for Me? links to /ishrtforme",
      "The divider under the hero and the posts row stay.",
    ],
    slices: [
      slice("hero", "subpage", {
        ...section({
          small_heading: "About Peggy",
          heading: "My Hormone Replacement Story",
          intro:
            "I'm your typical late-50's woman. I love Jesus! I'm married, I have three grown children, three grandchildren, a Bernedoodle named Winston and my full-time gig is in the banking industry.",
          space_above: "Medium",
          space_below: "Medium",
        }),
        image: aboutPortrait,
      }),
      divider(),
      slice("side_by_side", "image", {
        ...section({ space_above: "None", space_below: "Medium" }),
        side: "Media left",
        media_position: "Sticky",
        text: aboutStory,
        button: [button("Is HRT for Me?", "/ishrtforme")],
        image: photo(
          "public/mockup/peggy-winston.jpg",
          "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        ),
      }),
      slice("posts", "row", {
        ...section({ space_above: "None", space_below: "Medium" }),
        category: "All",
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
      divider(),
      slice("faq", "default", {
        ...section(),
        questions: faqQuestions,
      }),
      slice("buttons", "default", {
        ...section({ space_below: "Large" }),
        layout: "Centered",
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
      divider("Medium"),
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
  innerBalancePage(),
  clinicPage({
    uid: "winona-review-page",
    providerId: WINONA,
    providerUid: "winona",
    title: "Winona",
    quote:
      "I received my first order within 5 days of placing order for the HRT products my clinician recommended.",
    review: {
      id: reviewIds["winona-bioidentical-hormone-therapy-review"],
      uid: "winona-bioidentical-hormone-therapy-review",
      text: "My review",
    },
    youtube: "https://youtu.be/XZD4yvTKScA",
    product: storedImage(
      "ZJ3So0oFxyB6wWqP",
      "winona-cream.webp",
      "Winona cream",
      256,
      253,
    ),
    image: life("winona.jpg", "A woman in a sun hat smiling at the beach"),
    ribbonName: "Winona",
  }),
  clinicPage({
    uid: "musely",
    providerId: MUSELY,
    providerUid: "musely",
    title: "Musely",
    quote:
      "Bi-Est is considered a gentler form of HRT & a good product for newbies or those who have reservations about HRT.",
    review: {
      id: reviewIds[
        "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative"
      ],
      uid: "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative",
      text: "My review",
    },
    comparisons: [
      {
        id: "askC7xcAADMAcqo6",
        uid: "musely-estrogen-cream-vs-winona-which-hrt-cream-wins",
        text: "Winona vs Musely",
      },
    ],
    product: storedImage(
      "EqU9Y3mOgjKWz6Ej",
      "musely-product.webp",
      "Musely product",
      256,
      256,
    ),
    image: life("musely.jpg", "A woman watering flowers in a garden"),
    ribbonName: "Musely",
  }),
  clinicPage({
    uid: "alloy-review-page",
    providerId: ALLOY,
    providerUid: "alloy",
    title: "Alloy",
    quote:
      "I would describe my experience with Alloy as a pleasant straight-forward experience.",
    review: {
      id: reviewIds["my-alloy-an-overview-of-products-process-and-pricing"],
      uid: "my-alloy-an-overview-of-products-process-and-pricing",
      text: "My review",
    },
    comparisons: [
      {
        id: "askCFBcAADAAcqdx",
        uid: "winona-vs-alloy-hormone-replacement-side-by-side-comparison",
        text: "Alloy Vs. Wiona",
      },
    ],
    youtube: "https://youtu.be/KznU_Qx24XQ",
    product: storedImage(
      "5ek_8ZGN28nl-2eg",
      "alloy-product.webp",
      "Alloy product",
      256,
      256,
    ),
    image: life("alloy.jpg", "A woman sitting on a park bench"),
    ribbonName: "Alloy",
    reviewNotes: [
      "The comparison button keeps the stored label Alloy Vs. Wiona.",
      "The published brand name is still Musely. This run sets it to Alloy.",
    ],
  }),
  clinicPage({
    uid: "joiwommenswellness",
    providerId: JOI,
    providerUid: "joi",
    title: "Joi Women’s Wellness",
    quote:
      "My 1:1’s were very thorough and I learned something new each time I met with a Joi Clinician.",
    review: {
      id: reviewIds["joi-womens-hormone-replacement-review"],
      uid: "joi-womens-hormone-replacement-review",
      text: "My review",
    },
    youtube: "https://youtu.be/2sQ2-kh1F10",
    product: storedImage(
      "eF34zNG00JZlRw6T",
      "join-product.webp",
      "Joi HRT",
      256,
      256,
    ),
    image: life("joi.jpg", "A woman holding a yoga mat in a bright studio"),
    ribbonName: "Joi Women’s Wellness",
  }),
  clinicPage({
    uid: "effecty",
    providerId: EFFECTY,
    providerUid: "effecty",
    title: "Effecty",
    quote:
      "I can share with you first hand, they are not kidding when they say no hidden fees.",
    review: {
      id: reviewIds["effecty-hormone-replacement-therapy-review"],
      uid: "effecty-hormone-replacement-therapy-review",
      text: "My review",
    },
    youtube: "https://youtu.be/5671FQQHL8s",
    product: storedImage(
      "nIKTt1hWX4JFSOe9",
      "effecty-product.webp",
      "Effecty",
      256,
      256,
    ),
    image: life("effecty.jpg", "A woman smiling on a hiking trail"),
    ribbonName: "Effecty",
    reviewNotes: [
      "Effecty has no Wix overview page. /effecty is a new address.",
    ],
  }),
  clinicPage({
    uid: "mymenopauserx",
    providerId: MENORX,
    providerUid: "menorx",
    title: "MyMenopauseRx",
    quote:
      "If you are one who knows you want to use your medical and prescription insurance to start or start-over on HRT, then I highly recommend MyMenopauseRx.",
    review: {
      id: reviewIds["mymenopauserx-review"],
      uid: "mymenopauserx-review",
      text: "My review",
    },
    comparisons: [
      {
        id: "askCVRcAADMAcqg9",
        uid: "midi-health-vs-mymenopauserx",
        text: "MyMenoRX Vs. Midi",
      },
    ],
    youtube: "https://youtu.be/4BBgI4gmvZE",
    product: storedImage(
      "j8J4U6XFdqPQxpI-",
      "mymeno-product.webp",
      "MyMenopauseRX product",
      256,
      256,
    ),
    image: life("menorx.jpg", "Three women laughing together by the water"),
    ribbonName: "MyMenopauseRx",
    reviewNotes: [
      "The page uid is the Wix address mymenopauserx. The brand uid stays menorx.",
      "The brand has no coupon code.",
    ],
  }),
  clinicPage({
    uid: "midi-health-review-page",
    providerId: MIDI,
    providerUid: "midi",
    title: "Midi Health",
    quote:
      "When I was a new client of Midi Health, I was able to get an appointment the very next business day.",
    review: {
      id: reviewIds["will-midi-health-help-me-lose-weight"],
      uid: "will-midi-health-help-me-lose-weight",
      text: "My review",
    },
    comparisons: [
      {
        id: "askCoBcAACwAcqk3",
        uid: "midi-health-vs-allara-health",
        text: "Midi Health vs. Allara Health",
      },
    ],
    youtube: "https://youtu.be/4BBgI4gmvZE",
    product: storedImage(
      "7SwP0xxy4KmG0oYy",
      "midi-prod.avif",
      "Mini product",
      964,
      822,
    ),
    image: life(
      "midi.jpg",
      "A woman laughing with friends in an exercise class",
    ),
    ribbonName: "Midi Health",
    reviewNotes: [
      "Midi has no visit link and no coupon code.",
      "The brand’s comparison button said MyMenoRX Vs. Midi and pointed at the Allara post. This page uses the post’s own title.",
      "The review video is the Midi and MyMenopauseRx comparison, the same video stored on both brands.",
    ],
  }),
  ...GUIDE_PAGES,
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
