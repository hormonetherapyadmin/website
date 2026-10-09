// Stand-in for Provider and Offer documents. Copy, prices, and links are
// taken from the live Wix site (October 2026).

export type Clinic = {
  name: string;
  monthly: number;
  priceNote?: string;
  shortDescription: string;
  quote: string;
  insurance: boolean;
  formulation: string;
  note?: string;
  reviewHref: string;
  logo?: string;
  monogram: string;
  isAffiliate: boolean;
  topPick?: boolean;
  offer?: string;
};

export const CLINICS: Clinic[] = [
  {
    name: "Inner Balance",
    monthly: 150,
    priceNote: "Average over the first year",
    shortDescription: "Better sleep",
    quote:
      "Finding a product that treats my symptoms of menopause and helps with sleep was a clear winner for me.",
    insurance: false,
    formulation: "Oestra vaginal cream",
    note: "Free consults as needed.",
    // Design mockup. The live public URL remains /inner-balance.
    reviewHref: "/mockup/inner-balance",
    logo: "/mockup/logos/inner-balance.png",
    monogram: "IB",
    isAffiliate: true,
    topPick: true,
  },
  {
    name: "Winona",
    monthly: 89,
    shortDescription: "Creams, no appointment",
    quote:
      "I received my first order within 5 days of placing order for the HRT products my clinician recommended.",
    insurance: false,
    formulation: "Topical cream",
    note: "No consult required.",
    reviewHref: "/winona-review-page",
    logo: "/mockup/logos/winona.png",
    monogram: "W",
    isAffiliate: true,
  },
  {
    name: "Musely",
    monthly: 46,
    shortDescription: "First-timers",
    quote:
      "Bi-Est is considered a gentler form of HRT & a good product for newbies or those who have reservations about HRT.",
    insurance: false,
    formulation: "Topical Bi-Est cream",
    reviewHref: "/musely",
    logo: "/mockup/logos/musely.png",
    monogram: "M",
    isAffiliate: true,
  },
  {
    name: "Alloy",
    monthly: 75,
    shortDescription: "A simple patch + pill start",
    quote:
      "I would describe my experience with Alloy as a pleasant straight-forward experience.",
    insurance: false,
    formulation: "Patch + pills",
    note: "No consult required.",
    reviewHref: "/alloy-review-page",
    logo: "/mockup/logos/alloy.png",
    monogram: "A",
    isAffiliate: true,
  },
  {
    name: "Joi Women’s Wellness",
    monthly: 233,
    shortDescription: "Labs and real 1:1 time",
    quote:
      "My 1:1’s were very thorough and I learned something new each time I met with a Joi Clinician.",
    insurance: false,
    formulation: "Patch + pills",
    note: "$150 labs required up front, includes a 30-minute consult.",
    reviewHref: "/joiwommenswellness",
    logo: "/mockup/logos/joi.png",
    monogram: "J+",
    isAffiliate: true,
    offer: "BRONSON: 50% off labs",
  },
  {
    name: "Effecty",
    monthly: 140,
    shortDescription: "No hidden fees",
    quote:
      "I can share with you first hand, they are not kidding when they say no hidden fees.",
    insurance: false,
    formulation: "Patch + pills",
    note: "Consult optional, at no cost.",
    reviewHref: "/post/effecty-hormone-replacement-therapy-review",
    logo: "/mockup/logos/effecty.png",
    monogram: "E",
    isAffiliate: true,
  },
  {
    name: "MyMenopauseRx",
    monthly: 39,
    priceNote: "+ $99 one-time consult",
    shortDescription: "Using your insurance",
    quote:
      "If you are one who knows you want to use your medical and prescription insurance to start or start-over on HRT, then I highly recommend [MyMenopauseRx].",
    insurance: true,
    formulation: "Patch + pills",
    note: "20-minute consultation included.",
    reviewHref: "/mymenopauserx",
    logo: "/mockup/logos/mymenopauserx.png",
    monogram: "MR",
    isAffiliate: true,
  },
  {
    name: "Midi Health",
    monthly: 39,
    priceNote: "+ $250 one-time consult",
    shortDescription: "A next-day appointment",
    quote:
      "When I was a new client of Midi Health, I was able to get an appointment the very next business day.",
    insurance: true,
    formulation: "Patch + pills",
    note: "30-minute consultation included.",
    reviewHref: "/midi-health-review-page",
    logo: "/mockup/logos/midi.png",
    monogram: "M",
    isAffiliate: false,
  },
];

export function clinicNamed(name: string): Clinic {
  const clinic = CLINICS.find((item) => item.name === name);
  if (!clinic) throw new Error(`Unknown clinic: ${name}`);
  return clinic;
}
