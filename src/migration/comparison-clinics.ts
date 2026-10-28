// The homepage chart and /hrt-price-comparison-chart list the same
// clinics, in the same order. Prices, codes, and quotes stay on the
// Provider. This file only stores which clinic and which review.

export const INNER_BALANCE_ID = "asf4zhEAAC4AYFel";
export const INNER_BALANCE_HRT_REVIEW_ID = "askCgRcAADEAcqjO";

export const COMPARISON_CLINICS: {
  id: string;
  uid: string;
  review: string;
}[] = [
  {
    id: INNER_BALANCE_ID,
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

export const COMPARISON_REVIEW_IDS: Record<string, string> = {
  "inner-balance-hrt-review": INNER_BALANCE_HRT_REVIEW_ID,
  "winona-bioidentical-hormone-therapy-review": "asjxrxcAADIAcou2",
  "musely-estrogen-cream-review-a-safer-gentler-hrt-alternative":
    "asfWCxEAACwAYBu0",
  "my-alloy-an-overview-of-products-process-and-pricing": "askCEBcAAC8Acqdk",
  "joi-womens-hormone-replacement-review": "askCGBcAAC0Acqd9",
  "effecty-hormone-replacement-therapy-review": "askClRcAADIAcqkU",
  "mymenopauserx-review": "askCSRcAAC4AcqgW",
  "will-midi-health-help-me-lose-weight": "askCRRcAACwAcqgJ",
};

function documentLink(
  id: string,
  type: "provider" | "post",
  uid: string,
  text?: string,
) {
  const url = type === "post" ? `/post/${uid}` : undefined;
  return {
    link_type: "Document" as const,
    id,
    type,
    uid,
    ...(url ? { url } : {}),
    ...(text ? { text } : {}),
  };
}

export function comparisonClinicRows() {
  return COMPARISON_CLINICS.map((clinic) => {
    const reviewId = COMPARISON_REVIEW_IDS[clinic.review];
    if (!reviewId) throw new Error(`No review id for ${clinic.review}`);
    return {
      clinic: documentLink(clinic.id, "provider", clinic.uid),
      review: documentLink(reviewId, "post", clinic.review, "Read review"),
    };
  });
}
