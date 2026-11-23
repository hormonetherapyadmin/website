/**
 * Clinic match quiz. Questions and weights stay here. Result cards are
 * published Brand documents, loaded by UID in quiz-brands.ts.
 *
 * Two rules are stronger than points:
 * - Skipping labs removes Joi. That clinic requires baseline bloodwork.
 * - Skipping labs and asking for a video visit leaves Midi Health and
 *   MyMenopauseRx as the only results.
 *
 * Wanting labs adds points to Joi. It does not hide the other clinics.
 * A budget under $50 penalizes Inner Balance. It does not remove it.
 */

import { QUIZ_PATH } from "@/lib/site";

/** Same order as the homepage comparison chart. Ties break in this order. */
export const QUIZ_BRANDS = [
  "inner-balance",
  "winona",
  "musely",
  "alloy",
  "joi",
  "effecty",
  "menorx",
  "midi",
] as const;

export type QuizBrand = (typeof QUIZ_BRANDS)[number];

export const QUIZ_RESULT_COUNT = 3;
/** Insurance through extras, including the carrier question. */
export const QUIZ_STEP_COUNT = 9;

export type QuizQuestionId =
  | "insurance"
  | "carrier"
  | "budget"
  | "labs"
  | "testosterone"
  | "prescriptions"
  | "visit"
  | "formulation"
  | "extras";

export type QuizAnswers = {
  insurance?: "yes" | "no";
  carrier?: "major" | "united" | "tricare" | "other";
  budget?: "under-50" | "mid" | "high";
  labs?: "before" | "skip";
  testosterone?: "yes" | "maybe" | "no";
  prescriptions?: "one" | "separate";
  visit?: "video" | "async";
  formulation?: "fda" | "compounded";
  extras?: "glp1" | "peptides" | "both" | "hrt";
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: QuizQuestionId;
  /** 1–9. The carrier question is 2. A path that skips it renumbers in quizProgress. */
  step: number;
  prompt: string;
  note?: string;
  options: readonly QuizOption[];
};

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "insurance",
    step: 1,
    prompt: "Do you want to use your medical insurance to cover your visits?",
    options: [
      {
        id: "yes",
        label: "Yes, using my insurance is a top priority.",
      },
      {
        id: "no",
        label:
          "No, I prefer transparent cash-pay pricing or don’t have coverage.",
      },
    ],
  },
  {
    id: "carrier",
    step: 2,
    prompt: "Which insurance carrier do you have?",
    note: "Good to know: If your plan isn’t in-network, Midi Health charges $250 for an out-of-pocket consultation, while MyMenopauseRx charges $99.",
    options: [
      { id: "major", label: "Aetna, Blue Cross Blue Shield, or Cigna" },
      { id: "united", label: "UnitedHealthcare or Health Net" },
      { id: "tricare", label: "TRICARE, Sana, or Humana" },
      { id: "other", label: "Another carrier (out of network)" },
    ],
  },
  {
    id: "budget",
    step: 3,
    prompt: "What is your monthly budget for HRT products and consultations?",
    options: [
      { id: "under-50", label: "Less than $50" },
      { id: "mid", label: "$50 – $100" },
      { id: "high", label: "$100 plus" },
    ],
  },
  {
    id: "labs",
    step: 4,
    prompt:
      "Would you like hormone level lab testing done before you speak with a doctor, or do you prefer to save some money, skip the testing, and rely on your symptoms?",
    options: [
      {
        id: "before",
        label:
          "I want comprehensive hormone lab testing done before I speak with a doctor.",
      },
      {
        id: "skip",
        label:
          "I prefer to save money, skip the upfront lab testing, and be treated based on my symptoms.",
      },
    ],
  },
  {
    id: "testosterone",
    step: 5,
    prompt:
      "Do you have interest in learning about testosterone for women, and is that something you might want to consider?",
    options: [
      {
        id: "yes",
        label:
          "Yes. I’m experiencing low libido, fatigue, or muscle loss and want a provider who prescribes testosterone for women.",
      },
      {
        id: "maybe",
        label:
          "Maybe. I’m curious to learn about it, though estrogen and progesterone are my main focus.",
      },
      {
        id: "no",
        label: "No. I only want standard estrogen and/or progesterone support.",
      },
    ],
  },
  {
    id: "prescriptions",
    step: 6,
    prompt:
      "Are you okay with multiple prescriptions, or would you prefer just one product?",
    options: [
      {
        id: "one",
        label:
          "Keep it simple. I want just one all-in-one product (a single cream or capsule) rather than multiple prescriptions.",
      },
      {
        id: "separate",
        label:
          "I’m completely fine using separate prescriptions (such as an estrogen patch paired with a progesterone pill or testosterone cream).",
      },
    ],
  },
  {
    id: "visit",
    step: 7,
    prompt: "Do you want to meet 1:1 via video with a provider?",
    options: [
      {
        id: "video",
        label:
          "Yes. Having a live 1:1 consultation with a doctor or nurse practitioner is a must.",
      },
      {
        id: "async",
        label:
          "No. I prefer an online medical intake form and asynchronous doctor messaging without scheduling video calls.",
      },
    ],
  },
  {
    id: "formulation",
    step: 8,
    prompt: "What type of formulation makes you feel most comfortable?",
    options: [
      {
        id: "fda",
        label:
          "Established, FDA-approved products (patches, gels, oral pills) that have been around for a while.",
      },
      {
        id: "compounded",
        label:
          "New-to-market, trending compounded products (custom-blended creams, vaginal systemic formulas, or personalized hormone combinations) that are very popular right now.",
      },
    ],
  },
  {
    id: "extras",
    step: 9,
    prompt:
      "Do you have interest in peptides (such as Sermorelin or NAD+) or medical weight-loss medications like a GLP-1?",
    options: [
      {
        id: "glp1",
        label:
          "Yes. I want a clinic that can prescribe GLP-1 weight-loss medications alongside my hormone therapy.",
      },
      {
        id: "peptides",
        label:
          "Yes. I’m specifically interested in peptide therapy (like Sermorelin or NAD+) for energy, sleep, recovery, or longevity.",
      },
      {
        id: "both",
        label:
          "Both. I want access to GLP-1 weight-loss options and peptides under one roof.",
      },
      {
        id: "hrt",
        label:
          "No. I only want standard menopause hormone therapy (estrogen, progesterone, and/or testosterone).",
      },
    ],
  },
];

const MAIN_QUESTIONS: readonly QuizQuestionId[] = [
  "insurance",
  "budget",
  "labs",
  "testosterone",
  "prescriptions",
  "visit",
  "formulation",
  "extras",
];

type ScoreMap = Record<QuizBrand, number>;

function blankScores(): ScoreMap {
  return {
    "inner-balance": 0,
    winona: 0,
    musely: 0,
    alloy: 0,
    joi: 0,
    effecty: 0,
    menorx: 0,
    midi: 0,
  };
}

function add(scores: ScoreMap, points: Partial<ScoreMap>) {
  for (const brand of QUIZ_BRANDS) {
    scores[brand] += points[brand] ?? 0;
  }
}

function isOneOf<T extends string>(
  value: string,
  options: readonly T[],
): value is T {
  return options.some((option) => option === value);
}

export function quizQuestion(id: QuizQuestionId): QuizQuestion {
  const question = QUIZ_QUESTIONS.find((item) => item.id === id);
  if (!question) throw new Error(`Unknown quiz question: ${id}`);
  return question;
}

/** Records one choice. Switching off insurance drops the carrier answer. */
export function applyAnswer(
  answers: QuizAnswers,
  question: QuizQuestionId,
  optionId: string,
): QuizAnswers {
  if (question === "insurance") {
    if (!isOneOf(optionId, ["yes", "no"] as const)) return answers;
    const next: QuizAnswers = { ...answers, insurance: optionId };
    delete next.carrier;
    return next;
  }
  if (question === "carrier") {
    if (!isOneOf(optionId, ["major", "united", "tricare", "other"] as const)) {
      return answers;
    }
    return { ...answers, carrier: optionId };
  }
  if (question === "budget") {
    if (!isOneOf(optionId, ["under-50", "mid", "high"] as const))
      return answers;
    return { ...answers, budget: optionId };
  }
  if (question === "labs") {
    if (!isOneOf(optionId, ["before", "skip"] as const)) return answers;
    return { ...answers, labs: optionId };
  }
  if (question === "testosterone") {
    if (!isOneOf(optionId, ["yes", "maybe", "no"] as const)) return answers;
    return { ...answers, testosterone: optionId };
  }
  if (question === "prescriptions") {
    if (!isOneOf(optionId, ["one", "separate"] as const)) return answers;
    return { ...answers, prescriptions: optionId };
  }
  if (question === "visit") {
    if (!isOneOf(optionId, ["video", "async"] as const)) return answers;
    return { ...answers, visit: optionId };
  }
  if (question === "formulation") {
    if (!isOneOf(optionId, ["fda", "compounded"] as const)) return answers;
    return { ...answers, formulation: optionId };
  }
  if (!isOneOf(optionId, ["glp1", "peptides", "both", "hrt"] as const)) {
    return answers;
  }
  return { ...answers, extras: optionId };
}

export function nextQuestion(
  id: QuizQuestionId,
  answers: QuizAnswers,
): QuizQuestionId | "results" {
  if (id === "insurance") {
    return answers.insurance === "yes" ? "carrier" : "budget";
  }
  if (id === "carrier") return "budget";
  const following = MAIN_QUESTIONS[MAIN_QUESTIONS.indexOf(id) + 1];
  return following ?? "results";
}

export function previousQuestion(
  id: QuizQuestionId,
  answers: QuizAnswers,
): QuizQuestionId | "intro" {
  if (id === "insurance") return "intro";
  if (id === "carrier") return "insurance";
  if (id === "budget") {
    return answers.insurance === "yes" ? "carrier" : "insurance";
  }
  return MAIN_QUESTIONS[MAIN_QUESTIONS.indexOf(id) - 1] ?? "intro";
}

/** One mark per question on this path. No half steps. */
export type ProgressMark = "done" | "current" | "upcoming";

export type QuizProgress = {
  step: number;
  total: number;
  marks: readonly ProgressMark[];
};

/** The carrier question is its own step. Skipping it shortens the quiz to 8. */
function showsCarrier(id: QuizQuestionId, answers: QuizAnswers) {
  if (id === "carrier" || answers.insurance === "yes") return true;
  return id === "insurance" && answers.insurance !== "no";
}

export function quizProgress(
  id: QuizQuestionId,
  answers: QuizAnswers = {},
): QuizProgress {
  const full = quizQuestion(id).step;
  const withCarrier = showsCarrier(id, answers);
  const step = withCarrier ? full : Math.max(1, full - 1);
  const total = withCarrier ? QUIZ_STEP_COUNT : QUIZ_STEP_COUNT - 1;
  const marks = Array.from({ length: total }, (_, index): ProgressMark => {
    const number = index + 1;
    if (number < step) return "done";
    if (number > step) return "upcoming";
    return "current";
  });
  return { step, total, marks };
}

export function scoreQuiz(answers: QuizAnswers): ScoreMap {
  const scores = blankScores();

  if (answers.insurance === "no") {
    add(scores, {
      alloy: 2,
      winona: 2,
      musely: 2,
      "inner-balance": 2,
      effecty: 2,
      joi: 2,
    });
  }

  if (answers.insurance === "yes") {
    if (answers.carrier === "major") add(scores, { midi: 5, menorx: 5 });
    if (answers.carrier === "united") add(scores, { midi: 5, menorx: 1 });
    if (answers.carrier === "tricare") add(scores, { menorx: 5 });
    if (answers.carrier === "other") {
      add(scores, { menorx: 3, alloy: 3, winona: 3, musely: 3 });
    }
  }

  if (answers.budget === "under-50") {
    add(scores, {
      musely: 7,
      winona: -3,
      alloy: -3,
      joi: -3,
      effecty: -3,
      midi: -3,
      "inner-balance": -6,
    });
  }
  if (answers.budget === "mid") {
    add(scores, { winona: 5, alloy: 5, joi: 5, musely: 1 });
    if (answers.insurance === "yes") add(scores, { menorx: 5 });
  }
  if (answers.budget === "high") {
    add(scores, { "inner-balance": 6, midi: 2, effecty: 2, joi: 2 });
  }

  if (answers.labs === "before") add(scores, { joi: 10 });
  if (answers.labs === "skip") {
    add(scores, {
      midi: 3,
      menorx: 3,
      alloy: 3,
      winona: 3,
      musely: 3,
      "inner-balance": 3,
      effecty: 3,
      joi: -10,
    });
  }

  if (answers.testosterone === "yes") {
    add(scores, {
      joi: 5,
      effecty: 5,
      midi: 5,
      winona: -5,
      musely: -5,
      "inner-balance": -5,
      alloy: -5,
      menorx: -5,
    });
  }
  if (answers.testosterone === "maybe") {
    add(scores, { joi: 2, effecty: 2, midi: 2, menorx: 1, alloy: 1 });
  }
  if (answers.testosterone === "no") {
    add(scores, {
      winona: 2,
      musely: 2,
      "inner-balance": 2,
      alloy: 2,
      menorx: 2,
      midi: 2,
    });
  }

  if (answers.prescriptions === "one") {
    add(scores, {
      winona: 6,
      musely: 6,
      "inner-balance": 6,
      midi: -3,
      menorx: -3,
      alloy: -3,
      joi: -3,
      effecty: -3,
    });
  }
  if (answers.prescriptions === "separate") {
    add(scores, { midi: 3, menorx: 3, alloy: 3, joi: 3, effecty: 3 });
  }

  if (answers.visit === "video") {
    add(scores, {
      midi: 6,
      menorx: 6,
      joi: 6,
      winona: -6,
      musely: -6,
      "inner-balance": -6,
      alloy: -6,
      effecty: -6,
    });
  }
  if (answers.visit === "async") {
    add(scores, {
      alloy: 4,
      winona: 4,
      musely: 4,
      "inner-balance": 4,
      effecty: 4,
    });
  }

  if (answers.formulation === "fda") {
    add(scores, { midi: 5, menorx: 5, alloy: 5, effecty: 5 });
  }
  if (answers.formulation === "compounded") {
    add(scores, {
      "inner-balance": 5,
      musely: 5,
      winona: 5,
      joi: 5,
      effecty: 3,
    });
  }

  if (answers.extras === "glp1") {
    add(scores, {
      midi: 6,
      joi: 6,
      effecty: 6,
      alloy: 3,
      winona: -4,
      musely: -4,
      "inner-balance": -4,
      menorx: -4,
    });
  }
  if (answers.extras === "peptides") {
    add(scores, {
      joi: 7,
      effecty: 7,
      midi: -5,
      menorx: -5,
      alloy: -5,
      winona: -5,
      musely: -5,
      "inner-balance": -5,
    });
  }
  if (answers.extras === "both") {
    add(scores, {
      joi: 8,
      effecty: 8,
      midi: -5,
      menorx: -5,
      alloy: -5,
      winona: -5,
      musely: -5,
      "inner-balance": -5,
    });
  }
  if (answers.extras === "hrt") {
    add(scores, {
      menorx: 2,
      winona: 2,
      musely: 2,
      "inner-balance": 2,
      alloy: 2,
      midi: 2,
      effecty: 2,
    });
  }

  return scores;
}

/** Brands that can be shown. Order is the tie-break order, not the rank. */
export function eligibleBrands(answers: QuizAnswers): QuizBrand[] {
  if (answers.labs === "skip" && answers.visit === "video") {
    return ["midi", "menorx"];
  }
  if (answers.labs === "skip") {
    return QUIZ_BRANDS.filter((brand) => brand !== "joi");
  }
  return [...QUIZ_BRANDS];
}

export function rankBrands(
  answers: QuizAnswers,
): { brand: QuizBrand; score: number }[] {
  const scores = scoreQuiz(answers);
  return eligibleBrands(answers)
    .map((brand) => ({ brand, score: scores[brand] }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        QUIZ_BRANDS.indexOf(a.brand) - QUIZ_BRANDS.indexOf(b.brand),
    );
}

export function affiliateClickParams(input: {
  provider: string;
  href: string;
  offer?: string;
}) {
  let linkDomain = "";
  try {
    linkDomain = new URL(input.href).hostname.replace(/^www\./, "");
  } catch {
    linkDomain = "";
  }
  return {
    provider: input.provider,
    offer: input.offer ?? "",
    placement: "quiz_result",
    page_type: "quiz",
    page_path: QUIZ_PATH,
    link_domain: linkDomain,
  };
}

type Gtag = (
  command: "event",
  name: string,
  params: Record<string, string | number>,
) => void;

/** `insurance_1`, `yes_1`, `joi_2`. The number is the question or result place. */
export function numberedId(id: string, number: number) {
  if (!id) return "";
  return `${id}_${number}`;
}

/** Sends a GA4 event when the production tag is on the page. */
export function trackEvent(
  name: string,
  params: Record<string, string | number>,
) {
  const gtag = (globalThis as typeof globalThis & { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}
