import { isFilled, type ImageField, type LinkField } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { QUIZ_BRANDS, type QuizBrand } from "@/lib/quiz";

/**
 * Fields a quiz result shows. Prismic's graph query needs a newline
 * after the opening brace.
 */
export const QUIZ_BRAND_GRAPH_QUERY = `{
  provider {
    name
    short_description
    logo
    monthly_price
    price_unit
    price_note
    formulation
    code
    code_note
    visit
    page
    review
  }
}`;

export type QuizBrandCard = {
  uid: QuizBrand;
  name: string;
  description?: string;
  logo?: { src: string; alt: string; width: number; height: number };
  /** Dollar amount, without the unit. `$103`. */
  priceAmount?: string;
  perMonth?: boolean;
  priceNote?: string;
  formulation?: string;
  pageHref?: string;
  reviewHref?: string;
  visitHref?: string;
  visitText?: string;
  offerCode?: string;
  /** The sentence beside the code. */
  offerNote?: string;
};

type QuizBrandSource = {
  uid: string | null;
  data: {
    name: string | null;
    short_description: string | null;
    logo: ImageField;
    monthly_price: number | null;
    price_unit?: string | null;
    price_note: string | null;
    formulation: string | null;
    code: string | null;
    code_note?: string | null;
    visit: LinkField;
    page?: LinkField | null;
    review?: LinkField | null;
  };
};

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** A leading "Code " is the label. Extra words are the code line. */
function coupon(value: string | null | undefined) {
  const trimmed = text(value)?.replace(/^code\s+/i, "");
  if (!trimmed) return {};
  const split = trimmed.match(
    /^([A-Za-z0-9][A-Za-z0-9-]*)(?:\s*[:\-–—]?\s+([\s\S]+))?$/,
  );
  if (!split?.[2]) return { offerCode: trimmed };
  return { offerCode: split[1], offerNote: split[2].trim() };
}

function priceParts(amount: number | null, unit: string | null | undefined) {
  if (typeof amount !== "number") return {};
  const priceAmount = Number.isInteger(amount)
    ? `$${amount}`
    : `$${amount.toFixed(2)}`;
  return { priceAmount, perMonth: unit !== "One time" };
}

function linkHref(link: LinkField | null | undefined) {
  if (!link || !isFilled.link(link)) return undefined;
  return link.url || undefined;
}

function isQuizBrand(uid: string): uid is QuizBrand {
  return (QUIZ_BRANDS as readonly string[]).includes(uid);
}

/** A published brand, reduced to the quiz card. Unknown UIDs are dropped. */
export function quizBrandCard(document: QuizBrandSource): QuizBrandCard | null {
  const uid = document.uid?.trim() ?? "";
  const name = text(document.data.name);
  if (!isQuizBrand(uid) || !name) return null;

  const logo = document.data.logo;
  const visit = document.data.visit;
  const visitHref = linkHref(visit);

  const offer = coupon(document.data.code);
  const offerNote = text(document.data.code_note) ?? offer.offerNote;

  return {
    uid,
    name,
    description: text(document.data.short_description),
    logo:
      isFilled.image(logo) && logo.url && logo.dimensions
        ? {
            src: logo.url,
            alt: logo.alt ?? "",
            width: logo.dimensions.width,
            height: logo.dimensions.height,
          }
        : undefined,
    ...priceParts(document.data.monthly_price, document.data.price_unit),
    priceNote: text(document.data.price_note),
    formulation: text(document.data.formulation),
    pageHref: linkHref(document.data.page),
    reviewHref: linkHref(document.data.review),
    visitHref,
    visitText: visitHref && isFilled.link(visit) ? text(visit.text) : undefined,
    offerCode: offer.offerCode,
    offerNote,
  };
}

/**
 * Published brands for the quiz. A Prismic miss leaves the quiz usable
 * and simply omits cards that did not load.
 */
export async function loadQuizBrands(): Promise<QuizBrandCard[]> {
  try {
    const documents = await createClient().getAllByUIDs(
      "provider",
      [...QUIZ_BRANDS],
      {
        graphQuery: QUIZ_BRAND_GRAPH_QUERY,
      },
    );
    return documents.flatMap((document) => {
      const card = quizBrandCard(document);
      return card ? [card] : [];
    });
  } catch {
    return [];
  }
}
